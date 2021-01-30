const userService = require("../logic/userService");
const userTypes = require("../constants/types").userTypes;
const SuburbInvite = require("../models/suburbInvite");

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

exports.saveUserBySuburbId = async (req, res, next) => {
  let {
    name,
    lastName,
    loginName,
    email,
    password,
    cellphone,
    facebookId,
    googleId,
    photoUrl,
    suburbId,
    street,
    streetNumber,
    code,
    token, // add captcha here
  } = req.body;

  SuburbInvite.GetInviteByCode(code)
    .then((resInv) => {
      //***add validate captcha here***

      let save = null;
      if (password && password.trim() !== "")
        save = userService.saveUserWithPassword({
          name,
          lastName,
          loginName,
          email,
          password,
          cellphone,
          photoUrl,
          facebookId,
          googleId,
          suburb: suburbId,
          street,
          streetNumber,
          userConfirmed: false, // if the user is an email user the user needs to confirm
        });
      else
        save = userService.saveUser({
          name,
          lastName,
          loginName,
          email,
          password,
          cellphone,
          photoUrl,
          facebookId,
          googleId,
          suburb: suburbId,
          street,
          streetNumber,
          userConfirmed: true,
        });
      save.then(
        (resSave) => {
          SuburbInvite.UpdateSuburbInviteUsed(
            code,
            resSave.userData._doc._id.toString()
          )
            .then((resCodeUpdate) => {
              res.status("200").json({
                success: true,
                message: resCodeUpdate.message || "Has sido registrado correctamente.",
              });
            })
            .catch((err) => {
              res.status("400").json({
                success: false,
                message: err.message || "Bad request.",
              });
            });
        },
        (err) => {
          res
            .status("400")
            .json({ success: false, message: err.message || "Bad request." });
        }
      );
    })
    .catch((err) => {
      res
        .status("400")
        .json({ success: false, message: err.message || "Bad request." });
    });
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
