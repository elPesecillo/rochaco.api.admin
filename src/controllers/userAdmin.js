const userService = require("../logic/userService");
const { userTypes } = require("../constants/types");
const SuburbInvite = require("../models/suburbInvite");
const { validateRecaptcha } = require("../logic/auth");
const handleFile = require("./handleFile");

exports.saveGoogleUser = (req, res) => {
  // get user data here
  const {
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
  // validate the captcha here
  userService.validateRecaptcha(token).then(
    () => {
      // save the user here
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
          () => {
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

exports.saveFacebookUser = (req, res) => {
  const {
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
  // validate the captcha here
  userService.validateRecaptcha(token).then(
    () => {
      // save the user here
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
          () => {
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

exports.saveAppleUser = (req, res) => {
  const {
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
  // validate the captcha here
  userService.validateRecaptcha(token).then(
    () => {
      // save the user here
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
          () => {
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
  const { userId, photoUrl } = req.body;
  userService
    .updateUserPicture(userId, photoUrl)
    .then(() => {
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

exports.saveEmailUser = (req, res) => {
  const {
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
  // validate the captcha here
  userService.validateRecaptcha(token).then(
    () => {
      // if the user is registered through email credentials
      // the user needs to be confirmed through an email
      userService
        .saveUserWithPassword({
          name,
          lastName,
          loginName,
          email,
          password,
          cellphone,
          facebookId,
          googleId,
          appleId,
          userConfirmed: false,
        })
        .then(
          () => {
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
    const { email, captchaToken } = req.body;
    const validCaptcha = await validateRecaptcha(captchaToken);

    if (validCaptcha) {
      const tempPass = await userService.updateTempPassword(email);

      if (tempPass) {
        await handleFile.sendTempPassEmail(email, tempPass);

        res.status("200").json({
          message: "Se ha enviado el correo correctamente.",
        });
      } else {
        res.status("401").json({
          message: "Hubo un problema al enviar el correo.",
        });
      }
    } else {
      res.status("401").json({
        message: "Hubo un problema al enviar el correo.",
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("error", err);
    res.status("404").json({
      message: err.message || "Hubo un problema al enviar el correo.",
    });
  }
};

exports.createUserByType = async (req, res) => {
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
    const {
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
    const validCaptcha = await validateRecaptcha(captchaToken);
    if (validCaptcha) {
      await SuburbInvite.GetInviteByCode(code);
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
      const updateCode = await SuburbInvite.UpdateSuburbInviteUsed(
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

exports.getUserByType = async (req, res) => {
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

exports.getUserInfo = async (req, res) => {
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

exports.getUserById = async (req, res) => {
  try {
    const result = await userService.getUserById(req.query.id);
    res.status("200").json(result);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.getUserFavs = async (req, res) => {
  try {
    const userFavs = await userService.getUserFavorites(req.query.userId);
    res.status("200").json(userFavs);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.addUserFavs = async (req, res) => {
  try {
    const { favs, userId } = req.body;
    const userFavs = await userService.saveUserFavorites(userId, favs);
    res.status("200").json(userFavs);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.removeUserFavs = async (req, res) => {
  try {
    const { favs, userId } = req.body;
    const userFavs = await userService.removeUserFavorites(userId, favs);
    res.status("200").json(userFavs);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.addUserPushToken = async (req, res) => {
  try {
    const { pushToken, userId } = req.body;
    const pushTokens = await userService.addUserPushToken(userId, pushToken);
    res.status("200").json(pushTokens);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.getUsersByAddress = async (req, res) => {
  try {
    const { suburbId, street, streetNumber } = req.query;
    const users = await userService.getUsersByAddress(
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

exports.deleteUserInfo = async (req, res) => {
  try {
    const { userId } = req.body;
    const removeUserInfo = await userService.deleteUserInfo(userId);
    res.status("200").json(removeUserInfo);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.getSignedUserTerms = async (req, res) => {
  try {
    const { userId } = req.query;
    const signedUserTerms = await userService.getSignedUserTerms(userId);
    res.status("200").json(signedUserTerms);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.isPasswordTemp = async (req, res) => {
  try {
    const { user, password } = req.query;
    const buff = Buffer.from(password, "base64");
    const decodedPassword = buff.toString("utf-8");
    const isPassTemp = await userService.isPasswordTemp(user, decodedPassword);
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
    const { userId, password, tempPassword } = req.body;
    const buff = Buffer.from(password, "base64");
    const decodedPassword = buff.toString("utf-8");

    const buff2 = Buffer.from(tempPassword, "base64");
    const decodedTempPassword = buff2.toString("utf-8");

    const isPassTemp = await userService.updatePassword(
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

exports.updateCurrentPassword = async (req, res) => {
  try {
    const { userId } = req.body;
    let { currentPassword, newPassword } = req.body;
    currentPassword = Buffer.from(currentPassword, "base64").toString("utf-8");
    newPassword = Buffer.from(newPassword, "base64").toString("utf-8");
    const result = await userService.updateCurrentPassword(
      userId,
      currentPassword,
      newPassword
    );
    res.status("200").json(result);
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request.",
    });
  }
};

exports.signUserTerms = async (req, res) => {
  try {
    const { userId, termsVersion } = req.body;
    const update = await userService.signUserTerms(userId, termsVersion);
    res.status("200").json(update);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.updateUserType = async (req, res) => {
  try {
    const { userId, userType } = req.body;
    const update = await userService.updateUserType(userId, userType);
    res.status("200").json(update);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.enableDisableUser = async (req, res) => {
  try {
    const { userId, enabled } = req.body;
    const update = await userService.enableDisableUser(userId, enabled);
    res.status("200").json(update);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.changeLimited = async (req, res) => {
  try {
    const { userId, limited } = req.body;
    const update = await userService.changeLimited(userId, limited);
    res.status("200").json(update);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.getIfUserIsLimited = async (req, res) => {
  try {
    const { userId } = req.query;
    const isLimited = await userService.getIfUserIsLimited(userId);
    res.status("200").json(isLimited);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.addUserRfid = async (req, res) => {
  try {
    const { userId, rfid } = req.body;
    const update = await userService.addUserRfid(userId, rfid);
    res.status("200").json(update);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};

exports.removeUserRfid = async (req, res) => {
  try {
    const { userId, rfid } = req.body;
    const update = await userService.removeUserRfid(userId, rfid);
    res.status("200").json(update);
  } catch (err) {
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};
