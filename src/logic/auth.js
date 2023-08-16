/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable class-methods-use-this */
const axios = require("axios").default;
const User = require("../models/user");
const { userTypes } = require("../constants/types");

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
  "/api/suburb/getConfig", // remover esta api de esta lista
  "/api/userInfo/isPasswordTemp",
  "/api/healthCheck",
];

const apiWithKey = [
  "/api/notification/newPayment", // add api key for this kind of requests
  "/api/notification/approveRejectPayment", // add api key for this kind of requests
  "/api/suburb/getAddressesBySuburbId", // add api key for this kind of requests
  "/api/suburb/getSuburbAutomationInfo",
  "/api/auth/internal/auth",
  "/api/notification/newReservation",
  "/api/notification/approveRejectReservation",
  "/api/notification/newSurvey",
  "/api/partner/getRFs",
  "/api/partner/setRFs",
  "/api/partner/getAllRFs",
  "/api/partner/setAllRFs",
];

const protectedApi = ["/api/suburb/approveReject"];

exports.Auth = class Auth {
  validateToken(token) {
    const user = User;

    const def = user.isValidToken(token);
    return new Promise((resolve, reject) => {
      def
        .then((isValid) => {
          if (isValid) resolve({ valid: true, message: "the token is valid" });
          else {
            resolve({
              valid: false,
              message: "the token is not valid",
            });
          }
        })
        .catch(() => {
          reject({ valid: false, message: "The token cannot be checked." });
        });
    });
  }

  validateAdminUser(token) {
    const user = User;
    const getPayload = user.getTokenPayload(token);
    return new Promise((resolve, reject) => {
      getPayload
        .then((payload) => {
          if (payload.userType !== userTypes.admin) {
            reject({
              valid: false,
              message:
                "The user does not have permissions to execute this api.",
            });
          } else resolve({ valid: true, message: "Ok" });
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
          reject({
            valid: false,
            message: "The user does not have permissions to execute this api.",
          });
        });
    });
  }

  isOpenApi(apiPath) {
    return openApi.indexOf(apiPath) !== -1;
  }

  isApiWithKey(apiPath) {
    return apiWithKey.indexOf(apiPath) !== -1;
  }

  isProtectedApi(apiPath) {
    return protectedApi.indexOf(apiPath) !== -1;
  }

  validateApiRequest(apiPath, token, apiKey) {
    if (this.isOpenApi(apiPath)) {
      return new Promise((resolve) => {
        resolve({ valid: true, message: "the api is open." });
      });
    }
    if (this.isApiWithKey(apiPath)) {
      // check if the api key is valid
      return new Promise((resolve, reject) => {
        if (process.env.PROTECTED_API_KEY === apiKey) {
          resolve({ valid: true, message: "the api key is ok" });
        } else {
          reject({ valid: false, message: "unknown api key" });
        }
      });
    }
    if (this.isProtectedApi(apiPath)) {
      return new Promise((resolve, reject) => {
        this.validateAdminUser(token)
          .then(() => {
            const validateToken = this.validateToken(token);
            validateToken
              .then((res) => resolve(res))
              .catch((err) => reject(err));
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
    return this.validateToken(token);
  }
};

// eslint-disable-next-line no-unused-vars, arrow-body-style
exports.validateRecaptcha = async (token) => {
  // TODO: implement recaptcha validation
  return true;
  // const secretKey = process.env.RECAPTCHA_SECRET;
  // const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  // const response = await axios.post(
  //   verificationURL,
  //   {},
  //   {
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  //     },
  //   }
  // );

  // const captchaResult = response.data;
  // return captchaResult.success;
};
