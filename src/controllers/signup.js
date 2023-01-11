const user = require("./userAdmin");

exports.signUp = (req, res, next) => {
  if (
    req.body.token === undefined ||
    req.body.token === "" ||
    req.body.token === null
  ) {
    res.send({
      success: false,
      message: "Por favor intenta de nuevo (codigo recaptcha no encontrado).",
    });
    return;
  }
  const {
    email,
    name,
    lastName,
    cellphone,
    facebookId,
    googleId,
    appleId,
    password,
    token,
  } = req.body;
  if (facebookId) {
    req.body = {
      email,
      name,
      lastName,
      loginName: facebookId,
      cellphone,
      facebookId,
      googleId,
      appleId,
      password,
      token,
    };
    user.saveFacebookUser(req, res, next);
  } else if (googleId) {
    req.body = {
      email,
      name,
      lastName,
      loginName: googleId,
      cellphone,
      facebookId,
      googleId,
      appleId,
      password,
      token,
    };
    user.saveGoogleUser(req, res, next);
  } else if (appleId) {
    req.body = {
      email,
      name,
      lastName,
      loginName: appleId,
      cellphone,
      facebookId,
      googleId,
      appleId,
      password,
      token,
    };
    user.saveAppleUser(req, res, next);
  } else {
    req.body = {
      email,
      name,
      lastName,
      loginName: email,
      cellphone,
      facebookId,
      googleId,
      appleId,
      password,
      token,
    };
    user.saveEmailUser(req, res, next);
  }
};
