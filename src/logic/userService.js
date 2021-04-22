const User = require("../models/user");
const request = require("request");
const GlobalConfig = require("../models/globalConfig");
const userTypes = require("../constants/types").userTypes;

const saveUser = (userObj) => {
  return new Promise((resolve, reject) => {
    User.getLogin(userObj.loginName).then(
      (login) => {
        if (login) {
          reject({
            success: false,
            message: "El usuario existe actualmente en la base de datos.",
          });
        } else {
          //create the user
          User.saveUser(
            userObj.userType
              ? userObj
              : { ...userObj, userType: userTypes.guest }
          ).then(
            (usr, err) => {
              //check if there is an error
              if (!err)
                resolve({
                  success: true,
                  message: "Has sido registrado correctamente.",
                  userData: { ...usr },
                });
              else
                reject({
                  success: false,
                  message: err.message || "No se pudo registrar el usuario.",
                });
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
};

const updateUser = async (userObj) => {
  return new Promise((resolve, reject) => {
    User.updateUser(userObj).then(
      (usr, err) => {
        if (!err)
          resolve({
            success: true,
            message: "Ha sido actualizado correctamente.",
          });
        else
          reject({
            success: false,
            message: err.message || "No se pudo actualizar el usuario.",
          });
      },
      (err) => {
        reject({ success: false, message: err.message });
      }
    );
  });
};

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
      if (error)
        reject({
          success: false,
          message:
            "Por favor intenta de nuevo (no es posible validar recaptcha).",
        });
      let status = JSON.parse(body);
      if (!status.success)
        reject({ success: false, message: "Por favor intenta de nuevo." });
      else if (status.score <= 0.5)
        reject({
          success: false,
          message: "Por favor intenta de nuevo (score demasiado bajo).",
        });
      else resolve({ success: true, message: "recaptcha valido." });
    });
  });
};

const saveUserWithPassword = async (userObj) => {
  const { password } = userObj;
  return new Promise((resolve, reject) => {
    User.encryptPassword(password).then(
      (resEncrypt) => {
        let encryptedPassword = resEncrypt.hash;
        userObj.password = encryptedPassword;
        saveUser(userObj).then(
          (result) => {
            resolve(result);
          },
          (err) => {
            reject(err);
          }
        );
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
      userType: userType,
    });
  } catch (ex) {
    return ex;
  }
};

const getUserByToken = async (token) => {
  try {
    let payload = await User.getTokenPayload(token);
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
    let payload = await User.getUserFavs(userId);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const saveUserFavorites = async (userId, favs) => {
  try {
    let payload = await User.addUserFavs(userId, favs);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const removeUserFavorites = async (userId, favs) => {
  try {
    let payload = await User.removeUserFavs(userId, favs);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const addUserPushToken = async (userId, pushToken) => {
  try {
    let payload = await User.addUserPushToken(userId, pushToken);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const getUsersBySuburb = async (suburbId) => {
  try {
    let users = await User.getUsersBySuburb(suburbId);
    return users;
  } catch (err) {
    throw err;
  }
};

const getUsersBySuburbStreet = async (suburbId, street) => {
  try {
    let users = await User.getUsersBySuburbStreet(suburbId, street);
    return users;
  } catch (err) {
    throw err;
  }
};

const getUsersByAddress = async (suburbId, street, streetNumber) => {
  try {
    let users = await User.getUsersByAddress(suburbId, street, streetNumber);
    return users;
  } catch (err) {
    throw err;
  }
};

const isPasswordTemp = async (user, password) => {
  try {
    let isPasTemp = await User.isPasswordTemp(user, password);
    return isPasTemp;
  } catch (err) {
    throw err;
  }
};

const updatePassword = async (user, password) => {
  try {
    let updatePass = await User.updatePassword(user, password);
    return updatePass;
  } catch (err) {
    throw err;
  }
};

const deleteUserInfo = async (userId) => {
  try {
    let payload = await User.deleteUserInfo(userId);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const getSignedUserTerms = async (userId) => {
  try {
    let user = await User.getUserLeanById(userId);
    let terms = await GlobalConfig.GetTermsAndCons();
    let userTerms = user.signedTerms || [];
    //logic to check if the latest term is signed
    let latestTerms = terms
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
    let updateTerms = await User.updateUserTerms(userId, termsVersion);
    return updateTerms;
  } catch (ex) {
    throw ex;
  }
};

const updateTempPassword = async (email) => {
  try {
    let updatePass = await User.updateTempPassword(email);

    return updatePass;
  } catch (ex) {
    throw ex;
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
  updateUserPicture,
  deleteUserInfo,
  getSignedUserTerms,
  signUserTerms,
  updateTempPassword,
  isPasswordTemp,
  updatePassword,
};
