/* eslint-disable prefer-promise-reject-errors */
const request = require("request");
const User = require("../models/user");
const GlobalConfig = require("../models/globalConfig");
const { userTypes } = require("../constants/types");
const AddressService = require("./addressService");

const saveUser = (userObj) =>
  new Promise((resolve, reject) => {
    User.getLogin(userObj.loginName).then(
      async (login) => {
        if (login) {
          reject({
            success: false,
            message: "El usuario existe actualmente en la base de datos.",
          });
        } else {
          const addressId = (
            await AddressService.GetAddressByNameNumberAndSuburbId(
              userObj.street,
              userObj.streetNumber,
              userObj.suburb
            )
          )._id.toString();
          // create the user
          User.saveUser(
            userObj.userType
              ? { ...userObj, addressId }
              : { ...userObj, userType: userTypes.guest, addressId }
          ).then(
            (usr, err) => {
              // check if there is an error
              if (!err) {
                resolve({
                  success: true,
                  message: "Has sido registrado correctamente.",
                  userData: { ...usr.toObject() },
                });
              } else {
                reject({
                  success: false,
                  message: err.message || "No se pudo registrar el usuario.",
                });
              }
            },
            (err) => {
              reject({ success: false, message: err.message });
            }
          );
        }
      },
      (err) => {
        reject({
          success: false,
          message:
            err.message || "Ocurrio un error al tratar de guardar el usuario.",
        });
      }
    );
  });

const updateUser = async (userObj) =>
  new Promise((resolve, reject) => {
    User.updateUser(userObj).then(
      (usr, err) => {
        if (!err) {
          resolve({
            success: true,
            message: "Ha sido actualizado correctamente.",
          });
        } else {
          reject({
            success: false,
            message: err.message || "No se pudo actualizar el usuario.",
          });
        }
      },
      (err) => {
        reject({ success: false, message: err.message });
      }
    );
  });

const updateUserPicture = async (userId, photoUrl) => {
  try {
    return await User.updateUserPicture(userId, photoUrl);
  } catch (err) {
    throw err;
  }
};

const validateRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET;
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  return new Promise((resolve, reject) => {
    request.post(verificationURL, (error, resG, body) => {
      if (error) {
        reject({
          success: false,
          message:
            "Por favor intenta de nuevo (no es posible validar recaptcha).",
        });
      }
      const status = JSON.parse(body);
      if (!status.success) {
        reject({ success: false, message: "Por favor intenta de nuevo." });
      } else if (status.score <= 0.5) {
        reject({
          success: false,
          message: "Por favor intenta de nuevo (score demasiado bajo).",
        });
      } else resolve({ success: true, message: "recaptcha valido." });
    });
  });
};

const saveUserWithPassword = async (newUser) => {
  const userObj = { ...newUser };
  const { password } = userObj;
  return new Promise((resolve, reject) => {
    User.encryptPassword(password).then(
      async (resEncrypt) => {
        try {
          const encryptedPassword = resEncrypt.hash;
          userObj.password = encryptedPassword;

          const addressId = (
            await AddressService.GetAddressByNameNumberAndSuburbId(
              userObj.street,
              userObj.streetNumber,
              userObj.suburb
            )
          )._id.toString();
          saveUser({ ...userObj, addressId }).then(
            (result) => {
              resolve(result);
            },
            (err) => {
              reject(err);
            }
          );
        } catch (err) {
          reject({
            success: false,
            message: err.message || "No se pudo obtener la direccion",
          });
        }
      },
      (err) => {
        reject({ success: false, message: err.message || "Bad request." });
      }
    );
  });
};

const getUserByType = async (userType) => {
  try {
    return await User.find({
      userType,
    });
  } catch (ex) {
    return ex;
  }
};

const getUserByToken = async (token) => {
  try {
    const payload = await User.getTokenPayload(token);
    return await User.findById(payload.userId);
  } catch (ex) {
    return ex;
  }
};

const getUserById = async (id) => {
  try {
    return await User.getUserById(id);
  } catch (ex) {
    throw ex;
  }
};

const getUserFavorites = async (userId) => {
  try {
    const payload = await User.getUserFavs(userId);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const saveUserFavorites = async (userId, favs) => {
  try {
    const payload = await User.addUserFavs(userId, favs);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const removeUserFavorites = async (userId, favs) => {
  try {
    const payload = await User.removeUserFavs(userId, favs);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const addUserPushToken = async (userId, pushToken) => {
  try {
    const payload = await User.addUserPushToken(userId, pushToken);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const getUsersBySuburb = async (suburbId) => {
  try {
    const users = await User.getUsersBySuburb(suburbId);
    return users;
  } catch (err) {
    throw err;
  }
};

const getUsersBySuburbStreet = async (suburbId, street) => {
  try {
    const users = await User.getUsersBySuburbStreet(suburbId, street);
    return users;
  } catch (err) {
    throw err;
  }
};

const getUsersByAddress = async (suburbId, street, streetNumber) => {
  try {
    const addressId = (
      await AddressService.getAddressByNameAndNumber(street, streetNumber)
    )._id.toString();
    const users = await User.getUsersByAddress(suburbId, addressId);
    return users;
  } catch (err) {
    throw err;
  }
};

const getUsersByAddressId = async (suburbId, addressId) => {
  try {
    return await User.getUsersByAddress(suburbId, addressId);
  } catch (err) {
    throw err;
  }
};

const getAdminUsers = async (suburbId) => {
  try {
    const adminUsers = await User.getAdminUsers(suburbId);
    return adminUsers;
  } catch (err) {
    throw err;
  }
};

const isPasswordTemp = async (user, password) => {
  try {
    const isPasTemp = await User.isPasswordTemp(user, password);
    return isPasTemp;
  } catch (err) {
    throw err;
  }
};

const updatePassword = async (user, password, tempPassword) => {
  try {
    const updatePass = await User.updatePassword(user, password, tempPassword);
    return updatePass;
  } catch (err) {
    throw err;
  }
};

const deleteUserInfo = async (userId) => {
  try {
    const payload = await User.deleteUserInfo(userId);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const getSignedUserTerms = async (userId) => {
  try {
    const user = await User.getUserLeanById(userId);
    const terms = await GlobalConfig.GetTermsAndCons();
    const userTerms = user.signedTerms || [];
    // logic to check if the latest term is signed
    const latestTerms = terms
      .map((t) => parseFloat(t))
      .reduce((i, n) => (i > n ? i : n));
    return {
      signed: userTerms.indexOf(latestTerms) !== -1,
      termsVersion: latestTerms,
    };
  } catch (ex) {
    throw ex;
  }
};

const signUserTerms = async (userId, termsVersion) => {
  try {
    const updateTerms = await User.updateUserTerms(userId, termsVersion);
    return updateTerms;
  } catch (ex) {
    throw ex;
  }
};

const updateTempPassword = async (email) => {
  try {
    const updatePass = await User.updateTempPassword(email);

    return updatePass;
  } catch (ex) {
    throw ex;
  }
};

const updateCurrentPassword = async (userId, currentPassword, newPassword) => {
  try {
    return await User.updateCurrentPassword(
      userId,
      currentPassword,
      newPassword
    );
  } catch (ex) {
    throw ex;
  }
};

const updateUserType = async (userId, userType) => {
  try {
    if (["neighbor", "guard", "suburbAdmin"].indexOf(userType) === -1) {
      throw Error(`The user type ${userType} is not valid.`);
    }
    return await User.updateUserType(userId, userType);
  } catch (ex) {
    throw ex;
  }
};

const enableDisableUser = async (userId, enabled) => {
  try {
    await User.enableDisableUser(userId, enabled);
    return { userId, active: enabled };
  } catch (ex) {
    throw ex;
  }
};

const changeLimited = async (userId, limited) => {
  try {
    return await User.changeLimited(userId, limited);
  } catch (ex) {
    throw ex;
  }
};

const getUserLeanById = async (userId) => {
  try {
    return await User.getUserLeanById(userId);
  } catch (err) {
    throw err;
  }
};

const getIfUserIsLimited = async (userId) => {
  try {
    return await User.getIfUserIsLimited(userId);
  } catch (err) {
    throw err;
  }
};

const addUserRfid = async (userId, rfid) => {
  try {
    return await User.addUserRfid(userId, rfid);
  } catch (err) {
    throw err;
  }
};

const removeUserRfid = async (userId, rfid) => {
  try {
    return await User.removeUserRfid(userId, rfid);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  saveUser,
  validateRecaptcha,
  saveUserWithPassword,
  getUserByType,
  getUserByToken,
  updateUser,
  getUserFavorites,
  saveUserFavorites,
  removeUserFavorites,
  getUserById,
  addUserPushToken,
  getUsersBySuburb,
  getUsersBySuburbStreet,
  getUsersByAddress,
  getUsersByAddressId,
  updateUserPicture,
  deleteUserInfo,
  getSignedUserTerms,
  signUserTerms,
  updateTempPassword,
  isPasswordTemp,
  updatePassword,
  updateUserType,
  enableDisableUser,
  changeLimited,
  getAdminUsers,
  getUserLeanById,
  getIfUserIsLimited,
  updateCurrentPassword,
  addUserRfid,
  removeUserRfid,
};
