const User = require("../models/user");
const userTypes = require("../constants/types").userTypes;
const axios = require("axios").default;

const openApi = [
  "/api/checkAuth",
  "/api/auth/fbtoken",
  "/api/auth/googletoken",
  "/api/auth/appletoken",
  "/api/saveGoogleUser",
  "/api/saveFacebookUser",
  "/api/saveAppleUser",
  "/api/saveEmailUser",
  "/api/generateTempPassword",
  "/api/saveUserBySuburb",
  "/api/signUp",
  "/api/validateTokenPath",
  "/api/cp/getCPInfo",
  "/api/file/upload",
  "/api/suburb/getInviteByCode",
  "/api/notification/test",
  "/api/suburb/getAllStreets",
  "/api/suburb/updateConfig", // remover esta api de esta lista
  "/api/suburb/getConfig", //remover esta api de esta lista
  "/api/userInfo/getSignedUserTerms", //remover
  "/api/userInfo/isPasswordTemp",
  "/api/userInfo/signUserTerms", //remove
];

const protectedApi = ["/api/suburb/approveReject"];

exports.Auth = class Auth {
  validateToken(token) {
    let user = User;

    let def = user.isValidToken(token);
    return new Promise(
      (resolve, reject) => {
        def.then(function (isValid) {
          if (isValid) resolve({ valid: true, message: "the token is valid" });
          else
            resolve({
              valid: false,
              message: "the token is not valid",
            });
        });
      },
      (err) => reject({ valid: false, message: "The token cannot be checked." })
    );
  }

  validateAdminUser(token) {
    let user = User;
    let getPayload = user.getTokenPayload(token);
    return new Promise(
      (resolve, reject) => {
        getPayload.then((payload) => {
          if (payload.userType !== userTypes.admin)
            reject({
              valid: false,
              message:
                "The user does not have permissions to execute this api.",
            });
          else resolve({ valid: true, message: "Ok" });
        });
      },
      (err) => {
        console.log(err);
        reject({
          valid: false,
          message: "The user does not have permissions to execute this api.",
        });
      }
    );
  }

  isOpenApi(apiPath) {
    return openApi.indexOf(apiPath) !== -1 ? true : false;
  }

  isProtectedApi(apiPath) {
    return protectedApi.indexOf(apiPath) !== -1 ? true : false;
  }

  validateApiRequest(apiPath, token) {
    if (this.isOpenApi(apiPath))
      return new Promise((resolve) =>
        resolve({ valid: true, message: "the api is open." })
      );
    else if (this.isProtectedApi(apiPath)) {
      return new Promise((resolve, reject) => {
        this.validateAdminUser(token)
          .then((res) => {
            let validateToken = this.validateToken(token);
            validateToken
              .then((res) => resolve(res))
              .catch((err) => reject(err));
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else {
      return this.validateToken(token);
    }
  }
};

exports.validateRecaptcha = async (token) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET;
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    let response = await axios.post(
      verificationURL,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
      }
    );

    let captchaResult = response.data;
    return captchaResult.success;
  } catch (err) {
    throw err;
  }
};
