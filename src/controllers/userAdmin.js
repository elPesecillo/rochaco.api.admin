const userService = require("../logic/userService");
const userTypes = require("../constants/types").userTypes;
const SuburbInvite = require("../models/suburbInvite");
const validateRecaptcha = require("../logic/auth").validateRecaptcha;
const handleFile = require("../controllers/handleFile");
exports.saveGoogleUser = (req, res, next) => {
  //get user data here
  let {
    name,
    lastName,
    loginName,
    email,
    password,
    cellphone,
    facebookId,
    googleId,
    appleId,
    token,
  } = req.body;
  //validate the captcha here
  userService.validateRecaptcha(token).then(
    (resV) => {
      //save the user here
      userService
        .saveUser({
          name,
          lastName,
          loginName,
          email,
          password,
          cellphone,
          facebookId,
          googleId,
          appleId,
          userConfirmed: true,
        })
        .then(
          (resSave) => {
            res.status("200").json({
              success: true,
              message: res.message || "Has sido registrado correctamente.",
            });
          },
          (err) => {
            res
              .status("400")
              .json({ success: false, message: err.message || "Bad request." });
          }
        );
    },
    (err) => {
      res
        .status("400")
        .json({ success: false, message: err.message || "Bad request." });
    }
  );
};

exports.saveFacebookUser = (req, res, next) => {
  let {
    name,
    lastName,
    loginName,
    email,
    password,
    cellphone,
    facebookId,
    googleId,
    appleId,
    token,
  } = req.body;
  //validate the captcha here
  userService.validateRecaptcha(token).then(
    (resV) => {
      //save the user here
      userService
        .saveUser({
          name,
          lastName,
          loginName,
          email,
          password,
          cellphone,
          facebookId,
          appleId,
          googleId,
          userConfirmed: true,
        })
        .then(
          (resSave) => {
            res.status("200").json({
              success: true,
              message: res.message || "Has sido registrado correctamente.",
            });
          },
          (err) => {
            res
              .status("400")
              .json({ success: false, message: err.message || "Bad request." });
          }
        );
    },
    (err) => {
      res
        .status("400")
        .json({ success: false, message: err.message || "Bad request." });
    }
  );
};

exports.saveAppleUser = (req, res, next) => {
  let {
    name,
    lastName,
    loginName,
    email,
    password,
    cellphone,
    facebookId,
    googleId,
    appleId,
    token,
  } = req.body;
  //validate the captcha here
  userService.validateRecaptcha(token).then(
    (resV) => {
      //save the user here
      userService
        .saveUser({
          name,
          lastName,
          loginName,
          email,
          password,
          cellphone,
          facebookId,
          googleId,
          appleId,
          userConfirmed: true,
        })
        .then(
          (resSave) => {
            res.status("200").json({
              success: true,
              message: res.message || "Has sido registrado correctamente.",
            });
          },
          (err) => {
            res
              .status("400")
              .json({ success: false, message: err.message || "Bad request." });
          }
        );
    },
    (err) => {
      res
        .status("400")
        .json({ success: false, message: err.message || "Bad request." });
    }
  );
};

exports.updateUserPicture = (req, res) => {
  let { userId, photoUrl } = req.body;
  userService
    .updateUserPicture(userId, photoUrl)
    .then((updated) => {
      res
        .status("200")
        .json({ success: true, message: "profile picture updated." });
    })
    .catch((err) => {
      res
        .status("400")
        .json({ success: false, message: err.message || "Bad request." });
    });
};

exports.saveEmailUser = (req, res, next) => {
  let {
    name,
    lastName,
    loginName,
    email,
    password,
    cellphone,
    facebookId,
    googleId,
    appleId,
    token,
  } = req.body;
  //validate the captcha here
  userService.validateRecaptcha(token).then(
    (resV) => {
      //if the user is registered through email credentials the user needs to be confirmed through an email
      userService
        .saveUserWithPassword({
          name,
          lastName,
          loginName,
          email,
          password: password,
          cellphone,
          facebookId,
          googleId,
          appleId,
          userConfirmed: false,
        })
        .then(
          (resSave) => {
            res.status("200").json({
              success: true,
              message: res.message || "Has sido registrado correctamente.",
            });
          },
          (err) => {
            res
              .status("400")
              .json({ success: false, message: err.message || "Bad request." });
          }
        );
    },
    (err) => {
      res
        .status("400")
        .json({ success: false, message: err.message || "Bad request." });
    }
  );
};

exports.generateTempPassword = async (req, res) => {
  try {
    let { email, captchaToken } = req.body;
    let validCaptcha = await validateRecaptcha(captchaToken);

    if (validCaptcha) {
      let tempPass = await userService.updateTempPassword(email);

      if (tempPass) {
        let sendMail = await handleFile.sendTempPassEmail(email, tempPass);

        res.status("200").json({
          message: "Se ha enviado el correo correctamente.",
        });
      } else {
        res.status("401").json({
          message: "Hubo un problema al enviar el correo.",
        });
      }
    } else
      res.status("401").json({
        message: "Hubo un problema al enviar el correo.",
      });
  } catch (err) {
    console.log("error", err);
    res.status("404").json({
      message: err.message || "Hubo un problema al enviar el correo.",
    });
  }
};

exports.createUserByType = async (req, res, next) => {
  try {
    const { name, lastName, loginName, email, cellphone } = req.body;
    const userType = userTypes[req.params.userType];
    if (!userType) {
      res.status("400").json({ success: false, message: "Bad request." });
      return;
    }
    const result = await userService.saveUser({
      name,
      lastName,
      loginName,
      email,
      cellphone,
      userConfirmed: false,
      userType,
    });
    res.status("200").json({
      success: true,
      message: result.message || "Has sido registrado correctamente.",
    });
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.saveUserBySuburbId = async (req, res) => {
  try {
    let {
      name,
      lastName,
      loginName,
      email,
      password,
      cellphone,
      facebookId,
      googleId,
      appleId,
      photoUrl,
      suburbId,
      street,
      streetNumber,
      code,
      userType,
      captchaToken, // add captcha here
    } = req.body;
    let validCaptcha = await validateRecaptcha(captchaToken);
    if (validCaptcha) {
      let getcode = await SuburbInvite.GetInviteByCode(code);
      let save = null;
      if (password && password.trim() !== "") {
        save = await userService.saveUserWithPassword({
          name,
          lastName,
          loginName,
          email,
          password,
          cellphone,
          photoUrl,
          facebookId,
          googleId,
          appleId,
          suburb: suburbId,
          street,
          streetNumber,
          userType,
          userConfirmed: false, // if the user is an email user the user needs to confirm
        });
      } else {
        save = await userService.saveUser({
          name,
          lastName,
          loginName,
          email,
          password,
          cellphone,
          photoUrl,
          facebookId,
          googleId,
          appleId,
          suburb: suburbId,
          street,
          streetNumber,
          userType,
          userConfirmed: true,
        });
      }
      let updateCode = await SuburbInvite.UpdateSuburbInviteUsed(
        code,
        save.userData._doc._id.toString()
      );

      res.status("200").json({
        success: true,
        message: updateCode.message || "Has sido registrado correctamente.",
      });
    } else res.status("401").json({ success: false, message: "invalid token" });
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.getUserByType = async (req, res, next) => {
  try {
    const userType = userTypes[req.params.userType];
    if (!userType) {
      res.status("400").json({ success: false, message: "Bad request." });
      return;
    }
    const result = await userService.getUserByType(userType);
    res.status("200").json({ success: true, data: result });
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    userService.getUserByToken(req.query.token).then(
      (result) => {
        res.status("200").json(result);
      },
      (err) => {
        res
          .status("400")
          .json({ success: false, message: err.message || "Bad request." });
      }
    );
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    let result = await userService.getUserById(req.query.id);
    res.status("200").json(result);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.getUserFavs = async (req, res, next) => {
  try {
    let userFavs = await userService.getUserFavorites(req.query.userId);
    res.status("200").json(userFavs);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.addUserFavs = async (req, res, next) => {
  try {
    let { favs, userId } = req.body;
    let userFavs = await userService.saveUserFavorites(userId, favs);
    res.status("200").json(userFavs);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.removeUserFavs = async (req, res, next) => {
  try {
    let { favs, userId } = req.body;
    let userFavs = await userService.removeUserFavorites(userId, favs);
    res.status("200").json(userFavs);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.addUserPushToken = async (req, res, next) => {
  try {
    let { pushToken, userId } = req.body;
    let pushTokens = await userService.addUserPushToken(userId, pushToken);
    res.status("200").json(pushTokens);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.getUsersByAddress = async (req, res) => {
  try {
    let { suburbId, street, streetNumber } = req.query;
    let users = await userService.getUsersByAddress(
      suburbId,
      street,
      streetNumber
    );
    res.status("200").json(users);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.deleteUserInfo = async (req, res, next) => {
  try {
    let { userId } = req.body;
    let removeUserInfo = await userService.deleteUserInfo(userId);
    res.status("200").json(removeUserInfo);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.getSignedUserTerms = async (req, res) => {
  try {
    let { userId } = req.query;
    let signedUserTerms = await userService.getSignedUserTerms(userId);
    res.status("200").json(signedUserTerms);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.isPasswordTemp = async (req, res) => {
  try {
    let { user, password } = req.query;
    let buff = Buffer.from(password, "base64");
    let decodedPassword = buff.toString("utf-8");
    let isPassTemp = await userService.isPasswordTemp(user, decodedPassword);
    res.status("200").json(isPassTemp);
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request.",
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    let { userId, password, tempPassword } = req.body;
    let buff = Buffer.from(password, "base64");
    let decodedPassword = buff.toString("utf-8");

    let buff2 = Buffer.from(tempPassword, "base64");
    let decodedTempPassword = buff2.toString("utf-8");

    let isPassTemp = await userService.updatePassword(
      userId,
      decodedPassword,
      decodedTempPassword
    );
    res.status("200").json(isPassTemp);
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request.",
    });
  }
};

exports.signUserTerms = async (req, res) => {
  try {
    let { userId, termsVersion } = req.body;
    let update = await userService.signUserTerms(userId, termsVersion);
    res.status("200").json(update);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};
