const User = require("../models/user");
const viewPermissions = require("../logic/viewPermissions");
const axios = require("axios").default;
const validateRecaptcha = require("../logic/auth").validateRecaptcha;

const validateUser = (userLogin, password) => {
  return new Promise((resolve, reject) => {
    User.getLogin(userLogin).then((login, err) => {
      if (login) {
        let validPass = login.validatePassword(password);
        validPass.then(
          (result) => {
            //generate jwt token
            let token = login.generateUserToken();
            resolve({ success: true, message: token });
          },
          (err) => {
            reject({
              success: false,
              message: err.message || "La contraseña no es valida.",
            });
          }
        );
      } else reject({ succes: false, message: "El usuario no existe." });
    });
  });
};

exports.checkAuth = async (req, res, next) => {
  try {
    //over here check the db to know if the auth is valid
    let { user, password, captchaToken } = req.body;

    let validCaptcha = await validateRecaptcha(captchaToken);
    if (validCaptcha) {
      let usr = await validateUser(user, password); //.then(

      if (usr) {
        if (usr.success) {
          // var session = req.session;
          // session.token = result.message;
          // session.user = user;
          res.status("200").json(usr);
        } else
          res.status("401").json({ success: false, message: "Unauthorized" });
      } else {
        res
          .status("401")
          .json({ success: false, message: err.message || "Unauthorized" });
      }
    } else
      res
        .status("401")
        .json({ success: false, message: err.message || "Unauthorized" });
  } catch (err) {
    console.log("error", err);
    res.status("404").json({ token: null });
  }
};

exports.getTokenByFacebookId = async (req, res) => {
  try {
    let { id, captchaToken } = req.query;
    let validCaptcha = await validateRecaptcha(captchaToken);
    if (validCaptcha) {
      let usr = await User.getUserByFacebookId(id); //.then((usr) => {
      if (usr) {
        let token = usr.generateUserToken();
        res.status("200").json({ token });
      } else {
        res.status("404").json({ token: null });
      }
    } else res.status("401").json({ token: null });
  } catch (err) {
    console.log("error", err);
    res.status("404").json({ token: null });
  }
};

exports.getTokenByGoogleId = async (req, res) => {
  try {
    let { id, captchaToken } = req.query;
    let validCaptcha = await validateRecaptcha(captchaToken);
    if (validCaptcha) {
      let usr = await User.getUserByGoogleId(id);
      if (usr) {
        let token = usr.generateUserToken();
        res.status("200").json({ token });
      } else {
        res.status("404").json({ token: null });
      }
    } else res.status("401").json({ token: null });
  } catch (err) {
    console.log("error", err);
    res.status("404").json({ token: null });
  }
};

exports.getTokenByAppleId = async (req, res) => {
  try {
    let { id, captchaToken } = req.query;
    let validCaptcha = await validateRecaptcha(captchaToken);
    if (validCaptcha) {
      let usr = await User.getUserByAppleId(id);
      if (usr) {
        let token = usr.generateUserToken();
        res.status("200").json({ token });
      } else {
        res.status("404").json({ token: null });
      }
    } else res.status("401").json({ token: null });
  } catch (err) {
    console.log("error", err);
    res.status("404").json({ token: null });
  }
};

exports.isValidToken = (req, res, next) => {
  let token = req.headers["authorization"];
  return new Promise((resolve, reject) => {
    User.isValidToken(token).then(
      (isValid) => {
        if (isValid)
          res
            .status("200")
            .json({ valid: true, message: "the token is valid" });
        else
          res.status("401")({
            valid: false,
            message: "the token is not valid",
          });
      },
      (err) => res.status("500")(err)
    );
  });
};

exports.validateTokenPath = (req, res, next) => {
  let { token, user, path } = req.body;
  //over here add logic to check if a path is valid for the given context (user-> userType and jwt token)
  viewPermissions.permissionValid(path, token, user).then(
    (result) => {
      res.status("200").json({ valid: true, message: "ok :)" });
    },
    (err) => {
      res.status("401").json(err);
    }
  );
};

exports.logOff = (req, res, next) => {
  if (req.session)
    req.session.destroy((err) => {
      if (err)
        res.status("500").json({
          success: false,
          message:
            err.message || "An unknow error occurs while trying to log off.",
        });
      res.status("200").json({ success: true, message: "session destroyed." });
    });
};
