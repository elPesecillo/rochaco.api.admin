const User = require("../models/user");
const viewPermissions = require("../logic/viewPermissions");

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

exports.checkAuth = (req, res, next) => {
  //over here check the db to know if the auth is valid
  let user = req.body.user;
  let password = req.body.password;
  validateUser(user, password).then(
    (result) => {
      if (result.success) {
        // var session = req.session;
        // session.token = result.message;
        // session.user = user;
        res.status("200").json(result);
      } else
        res.status("401").json({ success: false, message: "Unauthorized" });
    },
    (err) => {
      res
        .status("401")
        .json({ success: false, message: err.message || "Unauthorized" });
    }
  );
};

exports.getTokenByFacebookId = (req, res) => {
  let facebookId = req.query["id"];
  User.getUserByFacebookId(facebookId).then((usr) => {
    if (usr) {
      let token = usr.generateUserToken();
      res.status("200").json({ token });
    } else {
      res.status("404").json({ token: null });
    }
  });
};

exports.getTokenByGoogleId = (req, res) => {
  let googleId = req.query["id"];
  User.getUserByGoogleId(googleId).then((usr) => {
    if (usr) {
      let token = usr.generateUserToken();
      res.status("200").json({ token });
    } else {
      res.status("404").json({ token: null });
    }
  });
};

exports.getTokenByAppleId = (req, res) => {
  let appleId = req.query["id"];
  User.getUserByAppleId(appleId).then((usr) => {
    if (usr) {
      let token = usr.generateUserToken();
      res.status("200").json({ token });
    } else {
      res.status("404").json({ token: null });
    }
  });
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
