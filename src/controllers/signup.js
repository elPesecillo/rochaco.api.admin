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
  let {
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
  //mandar llamar registro aqui
  // if (googleId || facebookId)
  //     axios({
  //         method: 'post',
  //         url: googleId ? `${process.env.ADMIN_API_HOST}/api/saveGoogleUser` : `${process.env.ADMIN_API_HOST}/api/saveFacebookUser`,
  //         data: {
  //             name,
  //             lastName,
  //             loginName: googleId ? googleId : facebookId,
  //             email,
  //             cellphone,
  //             googleId,
  //             facebookId,
  //             token
  //         }
  //     }).then(resS => {
  //         res.send({ success: true, message: resS.data.message || "Ok" });
  //     })
  //         .catch(err => {
  //             let errMsg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message || "No se pudo guardar el usuario.";
  //             res.send({ success: false, message: errMsg });
  //         });
  // else {
  //     axios({
  //         method: 'post',
  //         url: `${process.env.ADMIN_API_HOST}/api/saveEmailUser`,
  //         data: {
  //             name,
  //             lastName,
  //             loginName: email,
  //             email,
  //             cellphone,
  //             password,
  //             token
  //         }
  //     }).then(resS => {
  //         res.send({ success: true, message: resS.data.message || "Ok" });
  //     })
  //         .catch(err => {
  //             let errMsg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message || "No se pudo guardar el usuario.";
  //             res.send({ success: false, message: errMsg });
  //         });
  // }
};
