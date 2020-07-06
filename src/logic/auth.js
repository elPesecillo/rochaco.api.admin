const User = require("../models/user");
//const connectDb = require("../models/index").connectDb;

const openApi = [
    "/api/checkAuth",
    "/api/auth/fbtoken",
    "/api/auth/googletoken",
    "/api/saveGoogleUser",
    "/api/saveFacebookUser",
    "/api/saveEmailUser",
    "/api/signUp",
    "/api/validateTokenPath",
    "/api/cp/getCPInfo",
    "/api/file/upload"
];

module.exports = class Auth {
    validateToken(token) {
        let user = User;

        let def = user.isValidToken(token);
        return new Promise((resolve, reject) => {
            def.then(function (isValid) {
                if (isValid)
                    resolve({ valid: true, message: "the token is valid" })
                else
                    resolve({
                        valid: false,
                        message: "the token is not valid"
                    });

            });
        }, err => reject({ valid: false, message: "The token cannot be checked." }));
    }

    isOpenApi(apiPath) {
        return openApi.indexOf(apiPath) !== -1 ? true : false;
    }

    validateApiRequest(apiPath, token) {
        if (this.isOpenApi(apiPath)) return new Promise(resolve => resolve({ valid: true, message: "the api is open." }));
        else
            return this.validateToken(token);
    }
}