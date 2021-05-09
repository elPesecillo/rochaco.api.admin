const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const base64 = require("base-64");
const GuestSchema = require("./schemas/guestSchema");
const PushTokenSchema = require("./schemas/pushTokenSchema");

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
});

/**
 * Private attributes
 */
const _secretKey = process.env.JWT_SECRET;

let _getExpDate = () => {
  var expTimeByMin =
    process.env.EXP_TOKEN != null ? process.env.EXP_TOKEN : "1440";
  return moment().add(expTimeByMin, "minutes").unix();
};

let _getValidApis = (id) => {
  //return an array with the valid apis
  return [];
};

let _getValidMenus = (id) => {
  //return an array with the valid menus for the user
  return [];
};

/**
 * Method to validate exp from the user token.
 * @param {*} expDate
 */
let _validateExpDate = function (expDate) {
  let currentTime = moment().unix();
  return expDate > currentTime;
};

UserSchema.methods = {
  validatePassword: function (_password, isTemporary = false) {
    var _this = this;
    let pass = base64.decode(_password);

    let compareValue = isTemporary ? _this.tempPassword : _this.password;

    return new Promise(
      (resolve, reject) => {
        if (_this.temporaryDisabled) {
          let wait = 10 - this.getDisabledSince();
          if (wait > 0)
            reject({
              success: false,
              message: `El usuario esta temporalmente desabilitado, por favor espere ${wait} minutos para volver a intentar.`,
            });
          else
            this.increaseLoginAttempts(true).then((res) => {
              this.validatePassword(_password).then(
                (result) => resolve(result),
                (err) => reject(err)
              );
            });
        } else
          bcrypt.compare(pass, compareValue).then((valid) => {
            if (valid) {
              //reset logint attempts
              this.increaseLoginAttempts(true).then(
                (res) => {
                  resolve({
                    success: true,
                    message: "La contraseña coincide.",
                  });
                },
                (err) =>
                  reject({ success: false, message: "Un error occurio." })
              );
            } else {
              //increase login attempts
              this.increaseLoginAttempts().then(
                (res) => {
                  reject({
                    success: false,
                    message: "La contraseña no es valida.",
                  });
                },
                (err) =>
                  reject({
                    success: false,
                    message: "Un error occurio, la contraseña no es valida.",
                  })
              );
            }
          });
      },
      (err) =>
        reject({
          success: false,
          message: "Ocurrio un error al comparar la contraseña.",
        })
    );
  },
  getDisabledSince: function () {
    let disabledSince = this.disabledSince ? this.disabledSince : moment.utc();
    let start = moment(disabledSince);
    let end = moment(moment.utc());
    return end.diff(start, "minutes");
  },
  increaseLoginAttempts: function (reset) {
    if (reset) {
      this.loginAttempts = 0;
      this.temporaryDisabled = false;
      this.disabledSince = null;
    } else {
      let loginAttempts = this.loginAttempts + 1;
      this.loginAttempts = loginAttempts;
      this.temporaryDisabled = loginAttempts > 10;
      this.disabledSince = loginAttempts > 10 ? moment.utc() : null;
    }
    return new Promise((resolve, reject) => {
      return this.save().then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  },
  generateUserToken: function (_suburb) {
    let payload = {
      userId: this._id != undefined ? JSON.parse(JSON.stringify(this._id)) : "",
      userName: `${this.name} ${this.lastName}`,
      loginName: this.loginName,
      suburb: this.suburb || _suburb,
      userType: this.userType,
      exp: _getExpDate(),
      validApis: _getValidApis(this._id),
      pushTokens: this.pushTokens,
      street: this.street,
      streetNumber: this.streetNumber,
      //validMenus: _getValidMenus(this._id) //verify if is better put this in another schema i.e. suburb
    };
    let token = jwt.sign(payload, _secretKey);
    return token;
  },
  setUserRole: function (userId, roles) {
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
  deleteUserRole: function (users, roles) {
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
          roles: roles,
        },
      },
      {
        multi: true,
      }
    );
  },
  getUserRoles: function (userId) {
    return new Promise((resolve, reject) => {
      this.find({
        _id: userId,
      })
        .populate("roles")
        .exec((err, result) => {
          if (err) reject(err);
          resolve(getCleanResult(result, "roles"));
        });
    });
  },
};

const mergeArrayObjects = (currentFavs, newFavs) => {
  let firstMerge = currentFavs.map((item, i) => {
    let assign = {
      name: item.name,
      vehicle: item.vehicle,
      subject: item.subject,
      isService: item.isService,
      count: item.count || 0,
    };
    newFavs.forEach((a2) => {
      if (item.name === a2.name) {
        assign = Object.assign(
          {},
          {
            name: item.name,
            vehicle: item.vehicle,
            subject: item.subject,
            isService: item.isService,
            count: item.count || 0 + 1, //add 1 to calculate more used favs
          },
          a2
        );
      }
    });
    return { ...assign };
  });

  let all = [];
  newFavs.forEach((item) => {
    let add = true;
    firstMerge.forEach((fm) => {
      if (item.name.trim() === fm.name.trim()) add = false;
    });
    if (add) all.push(item);
  });

  let items = [...firstMerge, ...all].sort((a, b) => b.count - a.count);
  return items.slice(0, items.length <= 30 ? items.length : 30); // solo mantendremos 30 favoritos para no sobrecargar la bd
};

const mergePushTokens = (currentPushTokens, newPushToken) => {
  let tokens = currentPushTokens.map((t) =>
    t.token === newPushToken.token ? { ...newPushToken } : { ...t._doc }
  );

  let exists = tokens.filter((t) => t.token === newPushToken.token);
  return exists.length > 0 ? [...tokens] : [...tokens, newPushToken];
};

const extractUsersFromDoc = (mUsers) => {
  let users = mUsers.map((u) => {
    let { _id, name, lastName, street, streetNumber, active } = u._doc;
    return { _id, name, lastName, street, streetNumber, active };
  });
  return users;
};

UserSchema.statics = {
  /**
   * Method to get a user by login name
   */
  getLogin: function (_loginName) {
    return new Promise((resolve, reject) => {
      this.findOne({
        $and: [
          {
            loginName: _loginName,
          },
          { active: true },
        ],
      }) /*.populate({
                path: 'roles',
                populate: {
                    path: 'menus',
                    model: 'Menu'
                }
            })*/
        .exec((err, result) => {
          if (err) reject(err);
          resolve(result);
        });
    });
  },
  getUserByFacebookId: function (_facebookId) {
    return new Promise((resolve, reject) => {
      this.findOne({
        facebookId: _facebookId,
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  getUserByGoogleId: function (_googleId) {
    return new Promise((resolve, reject) => {
      this.findOne({
        googleId: _googleId,
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  getUserByAppleId: function (_appleId) {
    return new Promise((resolve, reject) => {
      this.findOne({
        appleId: _appleId,
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  getUserFavs: function (userId) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId }).exec((err, result) => {
        if (err) reject(err);
        resolve(result.favorites);
      });
    });
  },
  addUserFavs: function (userId, favs) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId }).exec((err, result) => {
        if (err) reject(err);
        if (!result) reject({ message: "user not found" });
        let mergedFavs = mergeArrayObjects(result.favorites || [], favs);
        this.findOneAndUpdate(
          { _id: userId },
          { $set: { favorites: mergedFavs } },
          { new: true },
          function (err, user) {
            if (err) reject(err);
            resolve(mergedFavs);
          }
        );
        resolve(result);
      });
    });
  },
  removeUserFavs: function (userId, favs) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId }).exec((err, result) => {
        if (err) reject(err);
        if (!result) reject({ message: "user not found" });
        let filterFavs = (result.favorites || []).filter((item) => {
          let exists = favs.filter((f) => f.name.trim() === item.name.trim());
          return exists.length === 0;
        });

        this.findOneAndUpdate(
          { _id: userId },
          { $set: { favorites: filterFavs } },
          { new: true },
          function (err, user) {
            if (err) reject(err);
            resolve(filterFavs);
          }
        );
        resolve(result);
      });
    });
  },
  addUserPushToken: function (userId, pushToken) {
    return new Promise((resolve, reject) => {
      this.findOne({ _id: userId }).exec((err, result) => {
        if (err) reject(err);
        if (!result) reject({ message: "user not found" });
        let mergedPushTokens = mergePushTokens(result.pushTokens, {
          token: pushToken,
        });
        this.findOneAndUpdate(
          { _id: userId },
          { $set: { pushTokens: mergedPushTokens } },
          { new: true },
          function (err, user) {
            if (err) reject(err);
            resolve(mergedPushTokens);
          }
        );
      });
    });
  },
  updateUser: function (objUser) {
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
        },
      }
    );
  },
  deleteUserInfo: function (userId) {
    return this.deleteOne({ _id: userId });
  },
  saveUser: function (objUser) {
    let user = new this(objUser);
    return user.save();
  },
  updateUserPicture: function (userId, photoUrl) {
    return this.updateOne({ _id: userId }, { $set: { photoUrl: photoUrl } });
  },
  /**
   * Validate if the user token is active
   */
  isValidToken: function (_token) {
    return new Promise(function (resolve, reject) {
      var isValid = false;
      try {
        jwt.verify(_token, _secretKey, function (err, decoded) {
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
  getTokenPayload: function (_token) {
    return new Promise(function (resolve, reject) {
      try {
        jwt.verify(_token, _secretKey, function (err, decoded) {
          resolve(decoded);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  encryptPassword: function (_password) {
    return new Promise((resolve, reject) => {
      let pass = base64.decode(_password);
      let saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(pass, salt, (err, hash) => {
          if (!err) resolve({ hash });
          else reject(err);
        });
      });
    });
  },
  getUserById: function (id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("suburb", "name")
        .exec((err, result) => {
          if (err) reject(err);
          resolve(result);
        });
    });
  },
  getUserLeanById: function (id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("suburb", "name")
        .lean()
        .exec((err, result) => {
          if (err) reject(err);
          resolve(result);
        });
    });
  },
  getUsersBySuburb: function (suburbId) {
    return new Promise((resolve, reject) => {
      this.find({ suburb: suburbId })
        .lean()
        .select({
          _id: 1,
          name: 1,
          lastName: 2,
          street: 3,
          streetNumber: 4,
          active: 5,
          userType: 6,
        })
        .exec((err, result) => {
          if (err) reject(err);
          resolve(result);
        });
    });
  },
  getUsersBySuburbStreet: function (suburbId, street) {
    return new Promise((resolve, reject) => {
      this.find({ $and: [{ suburb: suburbId }, { street: street }] }).exec(
        (err, result) => {
          if (err) reject(err);
          resolve(extractUsersFromDoc(result));
        }
      );
    });
  },
  getUsersByAddress: function (suburbId, street, streetNumber) {
    return new Promise((resolve, reject) => {
      this.find({
        $and: [
          { suburb: suburbId },
          { street: street },
          { streetNumber: streetNumber },
        ],
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(extractUsersFromDoc(result));
      });
    });
  },
  updateUserTerms: function (userId, termsVersion) {
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
            function (err, user) {
              if (err) reject(err);
              resolve({ signed: true, termsVersion: terms });
            }
          );
        });
    });
  },
  isPasswordTemp: function (user, password) {
    return new Promise((resolve, reject) => {
      this.findOne({
        loginName: user,
      }).exec((err, result) => {
        if (err) reject(err);

        if (result.tempPassword == "" || result.tempPassword == null) {
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
  updatePassword: function (userId, password, tempPassword) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: userId,
      }).exec((err, result) => {
        if (err) reject(err);

        if (result.tempPassword == "") {
          resolve(false);
        }

        bcrypt.compare(tempPassword, result.tempPassword).then((valid) => {
          if (valid) {
            let HashPassword = "";

            this.encryptPassword(base64.encode(password)).then((resEncrypt) => {
              HashPassword = resEncrypt.hash;

              this.findOneAndUpdate(
                { _id: userId },
                { $set: { tempPassword: null, password: HashPassword } },
                { new: true },
                function (err, user) {
                  if (err) reject(err);
                  resolve({
                    success: true,
                    message: "La contrasena fue actualizada exitosamente.",
                  });
                }
              );
            });
          } else {
            reject({
              success: false,
              message: "Hubo un problema al actualizar la contrasena.",
            });
          }
        });
      });
    });
  },
  updateTempPassword: function (email) {
    return new Promise((resolve, reject) => {
      this.findOne({
        email: email,
      }).exec((err, result) => {
        if (err) reject(err);
        if (!result)
          reject({
            message: "Email does not exist.",
          });

        let tempPassword =
          Math.random().toString(36).substring(2, 8).toUpperCase() +
          Math.random().toString(36).substring(2, 4).toUpperCase();

        let tempHashPassword = "";

        this.encryptPassword(base64.encode(tempPassword)).then((resEncrypt) => {
          tempHashPassword = resEncrypt.hash;

          this.findOneAndUpdate(
            {
              email: email,
            },
            {
              $set: {
                tempPassword: tempHashPassword,
              },
            },
            {
              new: true,
            },
            function (err) {
              if (err) reject(err);
              resolve(tempPassword);
            }
          );
          resolve(tempPassword);
        });
      });
    });
  },
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
