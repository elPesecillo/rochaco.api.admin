/* eslint-disable prefer-promise-reject-errors */
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const base64 = require("base-64");
const GuestSchema = require("./schemas/guestSchema");
const PushTokenSchema = require("./schemas/pushTokenSchema");
const RFIdSchema = require("./schemas/RFIdSchema");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Ingresa el nombre",
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
  },
  tempPassword: {
    type: String,
    default: null,
  },
  loginName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
  },
  cellphone: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
  street: {
    type: String,
  },
  streetNumber: {
    type: String,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  temporaryDisabled: {
    type: Boolean,
    default: false,
  },
  disabledSince: {
    type: Date,
  },
  lastAccess: {
    type: Date,
    default: moment.utc(),
  },
  /**
   * valid user types:
   *  guest -> a guest user
   *  guard -> a guard of the suburb
   *  admin -> an administrator of the suburb
   *  sudo  -> an administrator of the app
   */
  userType: {
    type: String,
    default: "guest",
  },
  userConfirmed: {
    type: Boolean,
  },
  facebookId: {
    type: String,
  },
  googleId: {
    type: String,
  },
  appleId: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  transtime: {
    type: Date,
    default: moment.utc(),
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  suburb: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb",
  },
  favorites: [GuestSchema],
  pushTokens: [PushTokenSchema],
  signedTerms: [Number],
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  limited: {
    type: Boolean,
    default: false,
  },
  limitedSince: {
    type: Date,
  },
  limitedReason: {
    type: String,
  },
  rfids: [RFIdSchema],
});

/**
 * Private attributes
 */
const _secretKey = process.env.JWT_SECRET;

const _getExpDate = () => {
  const expTimeByMin =
    process.env.EXP_TOKEN != null ? process.env.EXP_TOKEN : "10080";
  return moment().add(expTimeByMin, "minutes").unix();
};

/**
 * Method to validate exp from the user token.
 * @param {*} expDate
 */
const _validateExpDate = function (expDate) {
  const currentTime = moment().unix();
  return expDate > currentTime;
};

UserSchema.methods = {
  validatePassword(_password, isTemporary = false) {
    try {
      const _this = this;
      const pass = base64.decode(_password);

      const compareValue = isTemporary ? _this.tempPassword : _this.password;

      return new Promise(
        (resolve, reject) => {
          if (_this.temporaryDisabled) {
            const wait = 10 - this.getDisabledSince();
            if (wait > 0) {
              reject({
                success: false,
                message: `El usuario esta temporalmente desabilitado, por favor espere ${wait} minutos para volver a intentar.`,
              });
            } else {
              this.increaseLoginAttempts(true).then(() => {
                this.validatePassword(_password).then(
                  (result) => resolve(result),
                  (err) => reject(err)
                );
              });
            }
          } else {
            bcrypt.compare(pass, compareValue).then((valid) => {
              if (valid) {
                // reset logint attempts
                this.increaseLoginAttempts(true).then(
                  () => {
                    resolve({
                      success: true,
                      message: "La contraseña coincide.",
                    });
                  },
                  () => reject({ success: false, message: "Un error occurio." })
                );
              } else {
                // increase login attempts
                this.increaseLoginAttempts().then(
                  () => {
                    reject({
                      success: false,
                      message: "La contraseña no es valida.",
                    });
                  },
                  () =>
                    reject({
                      success: false,
                      message: "Un error occurio, la contraseña no es valida.",
                    })
                );
              }
            });
          }
        },
        () => {
          throw Error("Ocurrio un error al comparar la contraseña.");
        }
      );
    } catch (e) {
      return Promise.reject({
        success: false,
        message: e.message || "Ocurrio un error al comparar la contraseña.",
      });
    }
  },
  getDisabledSince() {
    const disabledSince = this.disabledSince
      ? this.disabledSince
      : moment.utc();
    const start = moment(disabledSince);
    const end = moment(moment.utc());
    return end.diff(start, "minutes");
  },
  increaseLoginAttempts(reset) {
    if (reset) {
      this.loginAttempts = 0;
      this.temporaryDisabled = false;
      this.disabledSince = null;
    } else {
      const loginAttempts = this.loginAttempts + 1;
      this.loginAttempts = loginAttempts;
      this.temporaryDisabled = loginAttempts > 10;
      this.disabledSince = loginAttempts > 10 ? moment.utc() : null;
    }
    return new Promise((resolve, reject) => {
      this.save()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  generateUserToken(_suburb) {
    const payload = {
      userId:
        this._id !== undefined ? JSON.parse(JSON.stringify(this._id)) : "",
      userName: `${this.name} ${this.lastName}`,
      loginName: this.loginName,
      suburb: this.suburb || _suburb,
      userType: this.userType,
      exp: _getExpDate(),
      validApis: [],
      pushTokens: this.pushTokens,
      street: this.street,
      streetNumber: this.streetNumber,
      addressId: this.addressId,
      limited: typeof this.limited === "undefined" ? false : this.limited,
    };
    const token = jwt.sign(payload, _secretKey);
    return token;
  },
  setUserRole(userId, userRoles) {
    let roles = userRoles;
    if (!Array.isArray(roles)) roles = [roles];
    return this.update(
      {
        _id: userId,
      },
      {
        $addToSet: {
          roles: {
            $each: roles,
          },
        },
      },
      {
        multi: true,
      }
    );
  },
  deleteUserRole(selectedUsers, userRoles) {
    let roles = userRoles;
    let users = selectedUsers;
    if (!Array.isArray(users)) users = [users];
    if (!Array.isArray(roles)) roles = [roles];

    return this.update(
      {
        _id: {
          $in: users,
        },
      },
      {
        $pullAll: {
          roles,
        },
      },
      {
        multi: true,
      }
    );
  },
  getUserRoles(userId) {
    return new Promise((resolve, reject) => {
      this.find({
        _id: userId,
      })
        .populate("roles")
        .exec((err, result) => {
          if (err) reject(err);
          resolve(result);
        });
    });
  },
};

const mergeArrayObjects = (currentFavs, newFavs) => {
  const firstMerge = currentFavs.map((item) => {
    let assign = {
      name: item.name,
      vehicle: item.vehicle,
      subject: item.subject,
      isService: item.isService,
      count: item.count || 0,
    };
    newFavs.forEach((a2) => {
      if (item.name === a2.name) {
        assign = {
          name: item.name,
          vehicle: item.vehicle,
          subject: item.subject,
          isService: item.isService,
          count: item.count || 0 + 1, // add 1 to calculate more used favs

          ...a2,
        };
      }
    });
    return { ...assign };
  });

  const all = [];
  newFavs.forEach((item) => {
    let add = true;
    firstMerge.forEach((fm) => {
      if (item.name.trim() === fm.name.trim()) add = false;
    });
    if (add) all.push(item);
  });

  const items = [...firstMerge, ...all].sort((a, b) => b.count - a.count);
  // solo mantendremos 30 favoritos para no sobrecargar la bd
  return items.slice(0, items.length <= 30 ? items.length : 30);
};

const mergePushTokens = (currentPushTokens, newPushToken) => {
  const tokens = currentPushTokens.map((t) =>
    t.token === newPushToken.token ? { ...newPushToken } : { ...t._doc }
  );

  const exists = tokens.filter((t) => t.token === newPushToken.token);
  return exists.length > 0 ? [...tokens] : [...tokens, newPushToken];
};

const extractUsersFromDoc = (mUsers) => {
  const users = mUsers.map((u) => {
    const { _id, name, lastName, street, streetNumber, active, pushTokens } =
      u._doc;
    return {
      _id,
      name,
      lastName,
      street,
      streetNumber,
      active,
      pushTokens,
    };
  });
  return users;
};

UserSchema.statics = {
  /**
   * Method to get a user by login name
   */
  getLogin(_loginName) {
    return new Promise((resolve, reject) => {
      this.findOne({
        $and: [
          {
            loginName: _loginName,
          },
          { active: true },
        ],
      }) /* .populate({
                path: 'roles',
                populate: {
                    path: 'menus',
                    model: 'Menu'
                }
            }) */
        .exec((err, result) => {
          if (err) reject(err);
          else {
            resolve(result);
          }
        });
    });
  },
  getUserByFacebookId(_facebookId) {
    return new Promise((resolve, reject) => {
      this.findOne({
        facebookId: _facebookId,
      }).exec((err, result) => {
        if (err) reject(err);
        else {
          resolve(result);
        }
      });
    });
  },
  getUserByGoogleId(_googleId) {
    return new Promise((resolve, reject) => {
      this.findOne({
        googleId: _googleId,
      }).exec((err, result) => {
        if (err) reject(err);
        else {
          resolve(result);
        }
      });
    });
  },
  getUserByAppleId(_appleId) {
    return new Promise((resolve, reject) => {
      this.findOne({
        appleId: _appleId,
      }).exec((err, result) => {
        if (err) reject(err);
        else {
          resolve(result);
        }
      });
    });
  },
  getUserFavs(userId) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId }).exec((err, result) => {
        if (err) reject(err);
        else {
          resolve(result.favorites);
        }
      });
    });
  },
  addUserFavs(userId, favs) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId }).exec((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result) {
          reject({ message: "user not found" });
          return;
        }
        const mergedFavs = mergeArrayObjects(result.favorites || [], favs);
        this.findOneAndUpdate(
          { _id: userId },
          { $set: { favorites: mergedFavs } },
          { new: true },
          (error) => {
            if (error) reject(error);
            else {
              resolve(mergedFavs);
            }
          }
        );
        resolve(result);
      });
    });
  },
  removeUserFavs(userId, favs) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId }).exec((err, result) => {
        if (err) reject(err);
        if (!result) reject({ message: "user not found" });
        const filterFavs = (result.favorites || []).filter((item) => {
          const exists = favs.filter((f) => f.name.trim() === item.name.trim());
          return exists.length === 0;
        });

        this.findOneAndUpdate(
          { _id: userId },
          { $set: { favorites: filterFavs } },
          { new: true },
          (error) => {
            if (error) reject(error);
            else {
              resolve(filterFavs);
            }
          }
        );
        resolve(result);
      });
    });
  },
  addUserPushToken(userId, pushToken) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId }).exec((err, result) => {
        if (err) reject(err);
        if (!result) reject({ message: "user not found" });
        const mergedPushTokens = mergePushTokens(result.pushTokens, {
          token: pushToken,
        });
        this.findOneAndUpdate(
          { _id: userId },
          { $set: { pushTokens: mergedPushTokens } },
          { new: true },
          (error) => {
            if (error) reject(error);
            else {
              resolve(mergedPushTokens);
            }
          }
        );
      });
    });
  },
  updateUser(objUser) {
    return this.updateOne(
      {
        _id: objUser._id,
      },
      {
        $set: {
          name: objUser.name,
          lastName: objUser.lastName,
          password: objUser.password,
          email: objUser.email,
          cellphone: objUser.cellphone,
          active: objUser.active,
          userType: objUser.userType,
          transtime: moment.utc(),
          addressId: objUser.addressId,
        },
      }
    );
  },
  deleteUserInfo(userId) {
    return this.deleteOne({ _id: userId });
  },
  saveUser(objUser) {
    const user = new this(objUser);
    return user.save();
  },
  updateUserPicture(userId, photoUrl) {
    return this.updateOne({ _id: userId }, { $set: { photoUrl } });
  },
  updateUserType(userId, userType) {
    return this.updateOne({ _id: userId }, { $set: { userType } });
  },
  enableDisableUser(userId, enabled) {
    return this.updateOne({ _id: userId }, { $set: { active: enabled } });
  },
  changeLimited(userId, limited) {
    return this.updateOne({ _id: userId }, { $set: { limited } });
  },
  addUserRfid(userId, rfId) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId }).exec((err, result) => {
        if (err) reject(err);
        else if (!result) reject({ message: "user not found" });
        else {
          const currentRfids = result.rfids || [];
          const mergedRfids = currentRfids.some((item) => item.rfid === rfId)
            ? currentRfids
            : [...currentRfids, { rfid: rfId }];

          this.findOneAndUpdate(
            { _id: userId },
            { $set: { rfids: [...mergedRfids] } },
            { new: true },
            (error, user) => {
              if (error) reject(error);
              else {
                resolve({ userId: user._id, rfids: user.rfids });
              }
            }
          );
        }
      });
    });
  },
  removeUserRfid(userId, rfId) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId }).exec((err, result) => {
        if (err) reject(err);
        else if (!result) reject({ message: "user not found" });
        else {
          const currentRfids = result.rfids || [];
          const filteredRfids = currentRfids.filter(
            (item) => item.rfid !== rfId
          );

          this.findOneAndUpdate(
            { _id: userId },
            { $set: { rfids: [...filteredRfids] } },
            { new: true },
            (error, user) => {
              if (error) reject(error);
              else {
                resolve({ userId: user._id, rfids: user.rfids });
              }
            }
          );
        }
      });
    });
  },
  /**
   * Validate if the user token is active
   */
  isValidToken(_token) {
    return new Promise((resolve, reject) => {
      let isValid = false;
      try {
        jwt.verify(_token, _secretKey, (err, decoded) => {
          if (decoded) {
            if (_validateExpDate(decoded.exp)) {
              isValid = true;
            }
          }
          resolve(isValid);
        });
      } catch (err) {
        console.log(err);
        reject(false);
      }
    });
  },
  /**
   * Get the payload of the jwt token
   * @param {String} _token
   */
  getTokenPayload(_token) {
    return new Promise((resolve, reject) => {
      try {
        jwt.verify(_token, _secretKey, (err, decoded) => {
          resolve(decoded);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  encryptPassword(_password) {
    return new Promise((resolve, reject) => {
      const pass = base64.decode(_password);
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(pass, salt, (error, hash) => {
          if (!error) resolve({ hash });
          else reject(error);
        });
      });
    });
  },
  getUserById(id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("suburb", "name")
        .exec((err, result) => {
          if (err) reject(err);
          else {
            resolve(result);
          }
        });
    });
  },
  getUserLeanById(id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("suburb", "name")
        .lean()
        .exec((err, result) => {
          if (err) reject(err);
          else {
            resolve(result);
          }
        });
    });
  },
  getUsersBySuburb(suburbId) {
    return new Promise((resolve, reject) => {
      this.find({ suburb: suburbId })
        .lean()
        .select({
          _id: 1,
          name: 1,
          lastName: 2,
          street: 3,
          streetNumber: 4,
          limited: 5,
          active: 6,
          userType: 7,
          facebookId: 8,
          appleId: 9,
          googleId: 10,
          email: 11,
          loginName: 12,
          addressId: 13,
          rfids: 14,
          pushTokens: 15,
        })
        .exec((err, result) => {
          if (err) reject(err);
          else {
            resolve(result);
          }
        });
    });
  },
  getUsersBySuburbStreet(suburbId, street) {
    return new Promise((resolve, reject) => {
      this.find({ $and: [{ suburb: suburbId }, { street }] }).exec(
        (err, result) => {
          if (err) reject(err);
          else {
            resolve(extractUsersFromDoc(result));
          }
        }
      );
    });
  },
  getUsersByAddress(suburbId, addressId) {
    return new Promise((resolve, reject) => {
      this.find({
        $and: [{ suburb: suburbId }, { addressId }],
      }).exec((err, result) => {
        if (err) reject(err);
        else {
          resolve(extractUsersFromDoc(result));
        }
      });
    });
  },
  updateUserTerms(userId, termsVersion) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId })
        .lean()
        .exec((err, result) => {
          if (err) reject(err);
          let terms = result.signedTerms || [];
          terms = [...terms, termsVersion];
          this.findOneAndUpdate(
            { _id: userId },
            { $set: { signedTerms: terms } },
            { new: true },
            (error) => {
              if (error) reject(error);
              else {
                resolve({ signed: true, termsVersion: terms });
              }
            }
          );
        });
    });
  },
  isPasswordTemp(user, password) {
    return new Promise((resolve, reject) => {
      this.findOne({
        loginName: user,
      }).exec((err, result) => {
        if (err) reject(err);
        else if (
          !result ||
          result.tempPassword === "" ||
          result.tempPassword == null
        ) {
          resolve(false);
        } else {
          bcrypt.compare(password, result.tempPassword).then((valid) => {
            if (valid) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }
      });
    });
  },
  updatePassword(userId, password, tempPassword) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: userId,
      }).exec((err, result) => {
        if (err) reject(err);
        else if (result.tempPassword === "") {
          resolve(false);
        } else {
          bcrypt.compare(tempPassword, result.tempPassword).then((valid) => {
            if (valid) {
              let HashPassword = "";

              this.encryptPassword(base64.encode(password)).then(
                (resEncrypt) => {
                  HashPassword = resEncrypt.hash;

                  this.findOneAndUpdate(
                    { _id: userId },
                    { $set: { tempPassword: null, password: HashPassword } },
                    { new: true },
                    (error) => {
                      if (error) reject(error);
                      else {
                        resolve({
                          success: true,
                          message:
                            "La contrasena fue actualizada exitosamente.",
                        });
                      }
                    }
                  );
                }
              );
            } else {
              reject({
                success: false,
                message: "Hubo un problema al actualizar la contrasena.",
              });
            }
          });
        }
      });
    });
  },
  updateTempPassword(email) {
    return new Promise((resolve, reject) => {
      this.findOne({
        email,
      }).exec((err, result) => {
        if (err) reject(err);
        else if (!result) {
          reject({
            message: "Email does not exist.",
          });
        } else {
          const tempPassword =
            Math.random().toString(36).substring(2, 8).toUpperCase() +
            Math.random().toString(36).substring(2, 4).toUpperCase();

          let tempHashPassword = "";

          this.encryptPassword(base64.encode(tempPassword)).then(
            (resEncrypt) => {
              tempHashPassword = resEncrypt.hash;

              this.findOneAndUpdate(
                {
                  email,
                },
                {
                  $set: {
                    tempPassword: tempHashPassword,
                  },
                },
                {
                  new: true,
                },
                (error) => {
                  if (error) reject(error);
                  else {
                    resolve(tempPassword);
                  }
                }
              );
              resolve(tempPassword);
            }
          );
        }
      });
    });
  },
  getAdminUsers(suburbId) {
    return this.find({ suburb: suburbId, userType: "suburbAdmin" }).lean();
  },
  getIfUserIsLimited(userId) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId })
        .lean()
        .exec((err, result) => {
          if (err || !result) reject(err || "User not found");
          else {
            resolve({
              isLimited:
                typeof result.limited === "undefined" ? false : result.limited,
            });
          }
        });
    });
  },
  updateCurrentPassword(userId, password, newPassword) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId })
        .lean()
        .exec((err, result) => {
          if (err) reject(err);
          else {
            bcrypt.compare(password, result.password).then((valid) => {
              if (valid) {
                this.encryptPassword(base64.encode(newPassword))
                  .then((resEncrypt) => {
                    this.findOneAndUpdate(
                      { _id: userId },
                      {
                        $set: { tempPassword: null, password: resEncrypt.hash },
                      },
                      { new: true },
                      (error) => {
                        if (error) reject(error);
                        else {
                          resolve({
                            success: true,
                            message:
                              "La contrasena fue actualizada exitosamente.",
                          });
                        }
                      }
                    );
                  })
                  .catch(() => {
                    reject({
                      success: false,
                      message: "La contraseña actual no es correcta.",
                    });
                  });
              } else {
                reject({
                  success: false,
                  message: "La contraseña actual no es correcta.",
                });
              }
            });
          }
        });
    });
  },
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
