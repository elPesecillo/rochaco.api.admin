/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, cryptoKey, description, main, scripts, repository, keywords, author, license, dependencies, devDependencies, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"rochaco_api\",\"version\":\"1.0.0\",\"cryptoKey\":\"secretKey123\",\"description\":\"rochaco management apis\",\"main\":\"index.js\",\"scripts\":{\"test\":\"echo \\\"Error: no test specified\\\" && exit 1\",\"heroku-prebuild\":\"npm install --dev\",\"build:server\":\"webpack --config webpack.config.js \",\"start\":\"node build/app.server.js\",\"heroku-postbuild\":\"npm run build:server\",\"start-all\":\"npm build:server & npm start\"},\"repository\":{\"type\":\"git\",\"url\":\"https://phdez@dev.azure.com/phdez/rochaco_web/_git/rochaco_api\"},\"keywords\":[\"rochaco\",\"api\",\"nodejs\"],\"author\":\"Pascual Hernandez\",\"license\":\"ISC\",\"dependencies\":{\"@sendgrid/mail\":\"^6.5.4\",\"base-64\":\"^0.1.0\",\"bcryptjs\":\"^2.4.3\",\"body-parser\":\"^1.19.0\",\"cors\":\"^2.8.5\",\"crypto-js\":\"^4.0.0\",\"dotenv\":\"^8.1.0\",\"dropbox-v2-api\":\"^2.4.13\",\"expo-server-sdk\":\"^3.6.0\",\"express\":\"^4.17.1\",\"fs\":\"0.0.1-security\",\"jsonwebtoken\":\"^8.5.1\",\"moment\":\"^2.24.0\",\"mongoose\":\"^5.6.11\",\"morgan\":\"^1.9.1\",\"multer\":\"^1.4.2\",\"request\":\"^2.88.0\"},\"devDependencies\":{\"@babel/core\":\"^7.5.5\",\"babel-loader\":\"^8.0.6\",\"babel-plugin-transform-class-properties\":\"^6.24.1\",\"path\":\"^0.12.7\",\"source-map\":\"^0.7.3\",\"webpack\":\"^4.42.1\",\"webpack-cli\":\"^3.3.11\",\"webpack-node-externals\":\"^1.7.2\"}}");

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const dotenv = __webpack_require__(/*! dotenv */ "dotenv");

const express = __webpack_require__(/*! express */ "express");

const logger = __webpack_require__(/*! morgan */ "morgan");

const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");

const cors = __webpack_require__(/*! cors */ "cors");

dotenv.config();

const connectDb = __webpack_require__(/*! ./models */ "./src/models/index.js").connectDb;

var router = __webpack_require__(/*! ./routes/router */ "./src/routes/router.js");

var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.use('/', router);
connectDb();
module.exports = app;

/***/ }),

/***/ "./src/constants/menusConfig.js":
/*!**************************************!*\
  !*** ./src/constants/menusConfig.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const userType = __webpack_require__(/*! ./types */ "./src/constants/types.js").userTypes;
/**
 * Get menus list
 */


exports.menus = [{
  name: "Mi Cuenta",
  path: "/admin/cuenta",
  icon: "icon icon-account_circle",
  visible: true,
  validUserTypes: [userType.guard, userType.suburbAdmin, userType.admin, userType.guest, userType.neighbor],
  order: 5
}, {
  name: "Guardias",
  path: "/admin/guardias",
  icon: "icon icon-shield",
  visible: true,
  validUserTypes: [userType.guest, userType.guard, userType.admin],
  order: 2
}, {
  name: "GuardiasForm",
  icon: "icon icon-shield",
  path: "/admin/guardias-form",
  visible: false,
  validUserTypes: [userType.suburbAdmin, userType.admin],
  order: 6
}, {
  name: "Vecinos",
  path: "/admin/vecinos",
  icon: "icon icon-users",
  visible: true,
  validUserTypes: [userType.guard, userType.suburbAdmin, userType.admin],
  order: 3
}, {
  name: "Colonia",
  path: "/admin/colonias",
  icon: "icon icon-building",
  visible: true,
  validUserTypes: [userType.admin, userType.suburbAdmin, userType.guest],
  order: 4
}, {
  name: "Colonia Status",
  path: "/admin/coloniaStatus",
  icon: "icon icon-building",
  visible: false,
  validUserTypes: [userType.admin, userType.suburbAdmin, userType.guest],
  order: 4
}, {
  name: "Colonia Status",
  path: "/admin/coloniaMain",
  icon: "icon icon-building",
  visible: false,
  validUserTypes: [userType.admin, userType.suburbAdmin, userType.suburbAdmin],
  order: 4
}];

/***/ }),

/***/ "./src/constants/types.js":
/*!********************************!*\
  !*** ./src/constants/types.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.userTypes = {
  guest: "guest",
  admin: "admin",
  suburbAdmin: "suburbAdmin",
  guard: "guard",
  neighbor: "neighbor"
};
exports.suburbStatus = [{
  status: "pending",
  description: "Tu solicitud para registrar la colonia ha sido enviada, por favor espera de 2 a 3 dias habiles o contactanos por medio de nuestras redes sociales para mayor informacion."
}, {
  status: "rejected",
  description: "Lo sentimos tu solicitud fue rechazada."
}, {
  status: "approved",
  description: "Tu solicitud a sido aprobada."
}, {
  status: "feedback",
  description: "Tu solicitud a sido revisada, se requiere mas información."
}];

/***/ }),

/***/ "./src/controllers/handleFile.js":
/*!***************************************!*\
  !*** ./src/controllers/handleFile.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const userServices = __webpack_require__(/*! ../logic/userService */ "./src/logic/userService.js");

const suburbService = __webpack_require__(/*! ../logic/suburbService */ "./src/logic/suburbService.js"); //const fetchDbx = require('isomorphic-fetch');


const fs = __webpack_require__(/*! fs */ "fs"); // const Dropbox = require("dropbox").Dropbox;


const dropboxV2Api = __webpack_require__(/*! dropbox-v2-api */ "dropbox-v2-api");

const sgMail = __webpack_require__(/*! @sendgrid/mail */ "@sendgrid/mail");

const getFileName = (nodeFileName, originalName) => {
  let idx = originalName.lastIndexOf(".");
  return `${nodeFileName}.${originalName.substring(idx + 1)}`;
};

const uploadFileDropbox = file => {
  const dropbox = dropboxV2Api.authenticate({
    token: process.env.DROPBOX_TOKEN
  });
  return new Promise((resolve, reject) => {
    dropbox({
      resource: "files/upload",
      parameters: {
        path: `/neighby/${getFileName(file.filename, file.originalname)}`
      },
      readStream: fs.createReadStream(`${file.destination}/${file.filename}`)
    }, (err, result, response) => {
      if (!err) resolve(result);else reject(err);
    });
  });
};

const base64_encode = file_path => {
  // read binary data
  var bitmap = fs.readFileSync(file_path); // convert binary data to base64 encoded string

  return new Buffer.from(bitmap, "base64").toString("base64"); //.toString('base64');
};

const getEmailAttachments = files => {
  let attachments = [];
  files.forEach(file => {
    attachments.push({
      filename: `${file.originalname}`,
      content: base64_encode(`${file.destination}/${file.filename}`)
    });
  });
  return attachments;
};

const sendEmail = async (files, user, suburb, suburbId) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: process.env.OWNER_EMAILS.split(","),
      from: "support@neighby.com",
      subject: "Nuevo requerimiento de registro de colonia.",
      text: `solicitud de registro.`,
      html: `<strong>El usuario ${user} desea registrar la colonia ${suburb} y envia los documentos para revisión adjuntos en este email para revision, id de referencia:[${suburbId}].</strong>`,
      attachments: getEmailAttachments(files)
    };
    await sgMail.send(msg);
  } catch (ex) {
    throw ex;
  }
};

const deleteTemporaryFiles = files => {
  files.forEach(file => {
    fs.unlink(`${file.destination}/${file.filename}`, err => {
      if (err) throw err;
      console.log(`path file ${file.destination}/${file.filename} has been deleted.`);
    });
  });
};

const processFileUpload = async (files, data) => {
  try {
    let {
      userId,
      name,
      lastName,
      cellphone,
      email,
      postalCode,
      section,
      suburbName,
      recaptchaToken
    } = data;
    let validCaptcha = await userServices.validateRecaptcha(recaptchaToken);
    let proms = [];
    files.forEach(file => {
      proms.push(uploadFileDropbox(file));
    });
    let uploadedFiles = await Promise.all(proms);
    let saveSuburb = await suburbService.saveSuburb({
      name: suburbName,
      location: section,
      postalCode: postalCode,
      active: true,
      userAdmins: [userId],
      status: [suburbService.getSuburbStatus("pending")],
      files: files.map(fil => ({
        fileName: fil.filename,
        originalName: fil.originalname,
        actionType: "solicitudRegistro",
        mimetype: fil.mimetype
      }))
    });
    let updateUser = await userServices.updateUser({
      _id: userId,
      name,
      lastName,
      cellphone,
      email,
      active: true
    });
    await sendEmail(files, `${name} ${lastName}`, suburbName, saveSuburb.id);
    deleteTemporaryFiles(files);
    return saveSuburb;
  } catch (ex) {
    throw ex;
  }
};

exports.uploadFile = async (req, res, next) => {
  try {
    let {
      userId,
      name,
      lastName,
      cellphone,
      email,
      postalCode,
      section,
      suburbName,
      recaptchaToken
    } = req.body;
    let processFiles = await processFileUpload(req.files, {
      userId,
      name,
      lastName,
      cellphone,
      email,
      postalCode,
      section,
      suburbName,
      recaptchaToken
    });
    res.status(202).json({
      message: "ok"
    });
  } catch (ex) {
    res.status(400).json({
      message: ex.message || "No se pudo completar el registro."
    });
  }
};

/***/ }),

/***/ "./src/controllers/menus.js":
/*!**********************************!*\
  !*** ./src/controllers/menus.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const menuService = __webpack_require__(/*! ../logic/menuService */ "./src/logic/menuService.js");
/**
 * [GET] method to get the menus by user types
 */


exports.getMenusByUser = async (req, res, next) => {
  let token = req.headers["authorization"];

  try {
    const result = await menuService.getMenusByUser(token);
    res.status('200').json(result);
  } catch (err) {
    res.status('401').json(err);
  }
};

/***/ }),

/***/ "./src/controllers/postalCodes.js":
/*!****************************************!*\
  !*** ./src/controllers/postalCodes.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const postalCodeService = __webpack_require__(/*! ../logic/postalCodeService */ "./src/logic/postalCodeService.js");

exports.getPostalCodeInfo = async (req, res, next) => {
  try {
    let result = await postalCodeService.getCPInfo(req.query.postalCode);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

/***/ }),

/***/ "./src/controllers/pushNotification.js":
/*!*********************************************!*\
  !*** ./src/controllers/pushNotification.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const pushNotificationService = __webpack_require__(/*! ../logic/pushNotificationService */ "./src/logic/pushNotificationService.js");

const {
  getUserById
} = __webpack_require__(/*! ../logic/userService */ "./src/logic/userService.js");

exports.sendTestNotification = async (req, res, next) => {
  try {
    let result = await pushNotificationService.sendPushNotification(["ExponentPushToken[TRMrLcG4VUxVUwmsCXPIyw]"], {
      sound: "default",
      body: "This is a test notification ;)",
      data: {
        withSome: "data"
      },
      title: "Notificacion Nueva",
      subtitle: "soy un subtitulo"
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.sendArriveNotification = async (req, res) => {
  try {
    let {
      userId,
      guest
    } = req.body;
    let user = await getUserById(userId);
    let pushTokens = user.pushTokens.map(t => t._doc.token);
    let result = await pushNotificationService.sendPushNotification(pushTokens, {
      sound: "default",
      body: guest.isService ? `Tu servicio ${guest.name} ha llegado.` : `Tu invitado ${guest.name} ha llegado.`,
      data: {
        redirect: "myVisits"
      },
      title: `Hola ${user.name}`
    });
    return result;
  } catch (err) {
    res.status(400).json(err);
  }
};

/***/ }),

/***/ "./src/controllers/signup.js":
/*!***********************************!*\
  !*** ./src/controllers/signup.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const user = __webpack_require__(/*! ./userAdmin */ "./src/controllers/userAdmin.js");

exports.signUp = (req, res, next) => {
  if (req.body.token === undefined || req.body.token === '' || req.body.token === null) {
    res.send({
      success: false,
      message: 'Por favor intenta de nuevo (codigo recaptcha no encontrado).'
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
    password,
    token
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
      password,
      token
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
      password,
      token
    };
    user.saveGoogleUser(req, res, next);
  } else {
    req.body = {
      email,
      name,
      lastName,
      loginName: email,
      cellphone,
      facebookId,
      googleId,
      password,
      token
    };
    user.saveEmailUser(req, res, next);
  } //mandar llamar registro aqui
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

/***/ }),

/***/ "./src/controllers/siteAuth.js":
/*!*************************************!*\
  !*** ./src/controllers/siteAuth.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const User = __webpack_require__(/*! ../models/user */ "./src/models/user.js");

const viewPermissions = __webpack_require__(/*! ../logic/viewPermissions */ "./src/logic/viewPermissions.js");

const validateUser = (userLogin, password) => {
  return new Promise((resolve, reject) => {
    User.getLogin(userLogin).then((login, err) => {
      if (login) {
        let validPass = login.validatePassword(password);
        validPass.then(result => {
          //generate jwt token
          let token = login.generateUserToken();
          resolve({
            success: true,
            message: token
          });
        }, err => {
          reject({
            success: false,
            message: err.message || 'La contraseña no es valida.'
          });
        });
      } else reject({
        succes: false,
        message: 'El usuario no existe.'
      });
    });
  });
};

exports.checkAuth = (req, res, next) => {
  //over here check the db to know if the auth is valid
  let user = req.body.user;
  let password = req.body.password;
  validateUser(user, password).then(result => {
    if (result.success) {
      // var session = req.session;
      // session.token = result.message;
      // session.user = user;
      res.status('200').json(result);
    } else res.status('401').json({
      success: false,
      message: 'Unauthorized'
    });
  }, err => {
    res.status('401').json({
      success: false,
      message: err.message || 'Unauthorized'
    });
  });
};

exports.getTokenByFacebookId = (req, res) => {
  let facebookId = req.query['id'];
  User.getUserByFacebookId(facebookId).then(usr => {
    if (usr) {
      let token = usr.generateUserToken();
      res.status('200').json({
        token
      });
    } else {
      res.status('404').json({
        token: null
      });
    }
  });
};

exports.getTokenByGoogleId = (req, res) => {
  let googleId = req.query['id'];
  User.getUserByGoogleId(googleId).then(usr => {
    if (usr) {
      let token = usr.generateUserToken();
      res.status('200').json({
        token
      });
    } else {
      res.status('404').json({
        token: null
      });
    }
  });
};

exports.isValidToken = (req, res, next) => {
  let token = req.headers["authorization"];
  return new Promise((resolve, reject) => {
    User.isValidToken(token).then(isValid => {
      if (isValid) res.status('200').json({
        valid: true,
        message: "the token is valid"
      });else res.status('401')({
        valid: false,
        message: "the token is not valid"
      });
    }, err => res.status('500')(err));
  });
};

exports.validateTokenPath = (req, res, next) => {
  let {
    token,
    user,
    path
  } = req.body; //over here add logic to check if a path is valid for the given context (user-> userType and jwt token)

  viewPermissions.permissionValid(path, token, user).then(result => {
    res.status('200').json({
      valid: true,
      message: "ok :)"
    });
  }, err => {
    res.status('401').json(err);
  });
};

exports.logOff = (req, res, next) => {
  if (req.session) req.session.destroy(err => {
    if (err) res.status('500').json({
      success: false,
      message: err.message || 'An unknow error occurs while trying to log off.'
    });
    res.status('200').json({
      success: true,
      message: 'session destroyed.'
    });
  });
};

/***/ }),

/***/ "./src/controllers/suburb.js":
/*!***********************************!*\
  !*** ./src/controllers/suburb.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const suburbService = __webpack_require__(/*! ../logic/suburbService */ "./src/logic/suburbService.js");

const userService = __webpack_require__(/*! ../logic/userService */ "./src/logic/userService.js");

const userTypes = __webpack_require__(/*! ../constants/types */ "./src/constants/types.js").userTypes;

const moment = __webpack_require__(/*! moment */ "moment");

exports.approveReject = async (req, res, next) => {
  try {
    let {
      suburbId,
      newStatus,
      details
    } = req.body;
    let suburb = await suburbService.getSuburbById(suburbId);
    let status = suburbService.getSuburbStatus(newStatus);

    if (suburb && status) {
      let addStatus = await suburbService.suburbAddStatus(suburbId, { ...status,
        details,
        transtime: moment.utc()
      });

      if (addStatus) {
        if (status.status === "approved") await userService.updateUser({
          _id: suburb.userAdmins[0].id,
          userType: userTypes.suburbAdmin,
          transtime: moment.utc()
        });
        res.status(200).json({
          success: true,
          message: `El estatus ha sido actualizado correctamente, el nuevo estatus es: "${status.status}"`
        });
      }
    } else res.status(400).json({
      success: false,
      message: "El estatus no es valido o la colonia no existe"
    });
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: ex.message || "No se pudo procesar aprobar/rechazar la colonia."
    });
  }
};

exports.getSuburbByAdminId = (req, res, next) => {
  let userId = req.query.id;
  suburbService.getSuburbByAdminUser(userId).then(result => {
    res.status("200").json(result);
  }, err => {
    res.status(400).json({
      success: false,
      message: err.message || "No se pudo obtener la informacion de la colonia."
    });
  });
};

exports.getSuburbById = (req, res, next) => {
  let suburbId = req.query.suburbId;
  suburbService.getSuburbById(suburbId).then(result => {
    res.status(200).json(result);
  }, err => {
    res.status(400).json({
      success: false,
      message: err.message || "no se encontro la colonia"
    });
  });
};

exports.addSuburbInvite = (req, res, next) => {
  let {
    suburbId,
    name,
    street,
    streetNumber
  } = req.body;
  suburbService.addSuburbInvite(suburbId, name, street, streetNumber).then(result => {
    res.status(200).json(result);
  }, err => {
    res.status(500).json({
      success: false,
      message: err.message || "No se pudo generar la invitacion para el usuario."
    });
  });
};

exports.getSuburbInvite = (req, res, next) => {
  let code = req.query.code;
  suburbService.getSuburbInvite(code).then(result => {
    res.status(200).json(result);
  }, err => {
    res.status(500).json({
      success: false,
      message: err.message || "No se pudo obtener la invitacion."
    });
  });
};

exports.getStreets = (req, res) => {
  let suburbId = req.query.suburbId;

  if (suburbId) {
    userService.getUsersBySuburb(suburbId).then(users => {
      let streets = users.map(usr => usr.street);
      const distinctStreets = [...new Set(streets)];
      res.status(200).json(distinctStreets.filter(u => typeof u !== "undefined").map(s => ({
        street: s
      })));
    }, err => {
      res.status(500).json({
        success: false,
        message: err.message || "No se pudieron obtener las calles del fraccionamiento"
      });
    });
  } else res.status(400).json({
    success: false,
    message: "Por favor indique el fraccionamiento."
  });
};

exports.getStreetNumbers = (req, res) => {
  let {
    suburbId,
    street
  } = req.query;

  if (suburbId) {
    userService.getUsersBySuburbStreet(suburbId, street).then(users => {
      let streetNumbers = users.map(usr => usr.streetNumber);
      const distinctStreetNumbers = [...new Set(streetNumbers)];
      res.status(200).json(distinctStreetNumbers.filter(u => typeof u !== "undefined").map(s => ({
        streetNumber: s
      })));
    }, err => {
      res.status(500).json({
        success: false,
        message: err.message || "No se pudieron obtener los numeros de la calle"
      });
    });
  } else res.status(400).json({
    success: false,
    message: "Por favor indique el fraccionamiento."
  });
};

/***/ }),

/***/ "./src/controllers/userAdmin.js":
/*!**************************************!*\
  !*** ./src/controllers/userAdmin.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const userService = __webpack_require__(/*! ../logic/userService */ "./src/logic/userService.js");

const userTypes = __webpack_require__(/*! ../constants/types */ "./src/constants/types.js").userTypes;

const SuburbInvite = __webpack_require__(/*! ../models/suburbInvite */ "./src/models/suburbInvite.js");

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
    token
  } = req.body; //validate the captcha here

  userService.validateRecaptcha(token).then(resV => {
    //save the user here
    userService.saveUser({
      name,
      lastName,
      loginName,
      email,
      password,
      cellphone,
      facebookId,
      googleId,
      userConfirmed: true
    }).then(resSave => {
      res.status("200").json({
        success: true,
        message: res.message || "Has sido registrado correctamente."
      });
    }, err => {
      res.status("400").json({
        success: false,
        message: err.message || "Bad request."
      });
    });
  }, err => {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  });
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
    token
  } = req.body; //validate the captcha here

  userService.validateRecaptcha(token).then(resV => {
    //save the user here
    userService.saveUser({
      name,
      lastName,
      loginName,
      email,
      password,
      cellphone,
      facebookId,
      googleId,
      userConfirmed: true
    }).then(resSave => {
      res.status("200").json({
        success: true,
        message: res.message || "Has sido registrado correctamente."
      });
    }, err => {
      res.status("400").json({
        success: false,
        message: err.message || "Bad request."
      });
    });
  }, err => {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
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
    token
  } = req.body; //validate the captcha here

  userService.validateRecaptcha(token).then(resV => {
    //if the user is registered through email credentials the user needs to be confirmed through an email
    userService.saveUserWithPassword({
      name,
      lastName,
      loginName,
      email,
      password: password,
      cellphone,
      facebookId,
      googleId,
      userConfirmed: false
    }).then(resSave => {
      res.status("200").json({
        success: true,
        message: res.message || "Has sido registrado correctamente."
      });
    }, err => {
      res.status("400").json({
        success: false,
        message: err.message || "Bad request."
      });
    });
  }, err => {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  });
};

exports.createUserByType = async (req, res, next) => {
  try {
    const {
      name,
      lastName,
      loginName,
      email,
      cellphone
    } = req.body;
    const userType = userTypes[req.params.userType];

    if (!userType) {
      res.status("400").json({
        success: false,
        message: "Bad request."
      });
      return;
    }

    const result = await userService.saveUser({
      name,
      lastName,
      loginName,
      email,
      cellphone,
      userConfirmed: false,
      userType
    });
    res.status("200").json({
      success: true,
      message: result.message || "Has sido registrado correctamente."
    });
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
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
    token // add captcha here

  } = req.body;
  SuburbInvite.GetInviteByCode(code).then(resInv => {
    //***add validate captcha here***
    let save = null;
    if (password && password.trim() !== "") save = userService.saveUserWithPassword({
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
      userConfirmed: false // if the user is an email user the user needs to confirm

    });else save = userService.saveUser({
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
      userConfirmed: true
    });
    save.then(resSave => {
      SuburbInvite.UpdateSuburbInviteUsed(code, resSave.userData._doc._id.toString()).then(resCodeUpdate => {
        res.status("200").json({
          success: true,
          message: resCodeUpdate.message || "Has sido registrado correctamente."
        });
      }).catch(err => {
        res.status("400").json({
          success: false,
          message: err.message || "Bad request."
        });
      });
    }, err => {
      res.status("400").json({
        success: false,
        message: err.message || "Bad request."
      });
    });
  }).catch(err => {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  });
};

exports.getUserByType = async (req, res, next) => {
  try {
    const userType = userTypes[req.params.userType];

    if (!userType) {
      res.status("400").json({
        success: false,
        message: "Bad request."
      });
      return;
    }

    const result = await userService.getUserByType(userType);
    res.status("200").json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    userService.getUserByToken(req.query.token).then(result => {
      res.status("200").json(result);
    }, err => {
      res.status("400").json({
        success: false,
        message: err.message || "Bad request."
      });
    });
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    let result = await userService.getUserById(req.query.id);
    res.status("200").json(result);
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  }
};

exports.getUserFavs = async (req, res, next) => {
  try {
    let userFavs = await userService.getUserFavorites(req.query.userId);
    res.status("200").json(userFavs);
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  }
};

exports.addUserFavs = async (req, res, next) => {
  try {
    let {
      favs,
      userId
    } = req.body;
    let userFavs = await userService.saveUserFavorites(userId, favs);
    res.status("200").json(userFavs);
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  }
};

exports.removeUserFavs = async (req, res, next) => {
  try {
    let {
      favs,
      userId
    } = req.body;
    let userFavs = await userService.removeUserFavorites(userId, favs);
    res.status("200").json(userFavs);
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  }
};

exports.addUserPushToken = async (req, res, next) => {
  try {
    let {
      pushToken,
      userId
    } = req.body;
    let pushTokens = await userService.addUserPushToken(userId, pushToken);
    res.status("200").json(pushTokens);
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  }
};

exports.getUsersByAddress = async (req, res) => {
  try {
    let {
      suburbId,
      street,
      streetNumber
    } = req.query;
    let users = await userService.getUsersByAddress(suburbId, street, streetNumber);
    res.status("200").json(users);
  } catch (err) {
    res.status("400").json({
      success: false,
      message: err.message || "Bad request."
    });
  }
};

/***/ }),

/***/ "./src/logic/auth.js":
/*!***************************!*\
  !*** ./src/logic/auth.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const User = __webpack_require__(/*! ../models/user */ "./src/models/user.js");

const userTypes = __webpack_require__(/*! ../constants/types */ "./src/constants/types.js").userTypes;

const openApi = ["/api/checkAuth", "/api/auth/fbtoken", "/api/auth/googletoken", "/api/saveGoogleUser", "/api/saveFacebookUser", "/api/saveEmailUser", "/api/saveUserBySuburb", "/api/signUp", "/api/validateTokenPath", "/api/cp/getCPInfo", "/api/file/upload", //"/api/userInfo/favorites", //remover esto cuando se agregue authenticacion en mobile
//"/api/userInfo/addFavorites", //remover esto cuando se agregue authenticacion en mobile
//"/api/userInfo/removeFavorites", //remover esto cuando se agregue authenticacion en mobile
"/api/suburb/getInviteByCode", "/api/notification/test"];
const protectedApi = ["/api/suburb/approveReject"];
module.exports = class Auth {
  validateToken(token) {
    let user = User;
    let def = user.isValidToken(token);
    return new Promise((resolve, reject) => {
      def.then(function (isValid) {
        if (isValid) resolve({
          valid: true,
          message: "the token is valid"
        });else resolve({
          valid: false,
          message: "the token is not valid"
        });
      });
    }, err => reject({
      valid: false,
      message: "The token cannot be checked."
    }));
  }

  validateAdminUser(token) {
    let user = User;
    let getPayload = user.getTokenPayload(token);
    return new Promise((resolve, reject) => {
      getPayload.then(payload => {
        if (payload.userType !== userTypes.admin) reject({
          valid: false,
          message: "The user does not have permissions to execute this api."
        });else resolve({
          valid: true,
          message: "Ok"
        });
      });
    }, err => {
      console.log(err);
      reject({
        valid: false,
        message: "The user does not have permissions to execute this api."
      });
    });
  }

  isOpenApi(apiPath) {
    return openApi.indexOf(apiPath) !== -1 ? true : false;
  }

  isProtectedApi(apiPath) {
    return protectedApi.indexOf(apiPath) !== -1 ? true : false;
  }

  validateApiRequest(apiPath, token) {
    if (this.isOpenApi(apiPath)) return new Promise(resolve => resolve({
      valid: true,
      message: "the api is open."
    }));else if (this.isProtectedApi(apiPath)) {
      return new Promise((resolve, reject) => {
        this.validateAdminUser(token).then(res => {
          let validateToken = this.validateToken(token);
          validateToken.then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => {
          reject(err);
        });
      });
    } else {
      return this.validateToken(token);
    }
  }

};

/***/ }),

/***/ "./src/logic/menuService.js":
/*!**********************************!*\
  !*** ./src/logic/menuService.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const User = __webpack_require__(/*! ../models/user */ "./src/models/user.js");

const menus = __webpack_require__(/*! ../constants/menusConfig */ "./src/constants/menusConfig.js").menus;
/**
 * Get menus by logged user
 */


exports.getMenusByUser = async userToken => {
  return new Promise((resolve, reject) => {
    let getPayload = User.getTokenPayload(userToken);
    getPayload.then(payload => {
      const {
        userType,
        loginName
      } = payload;
      let userMenus = menus.filter(menu => {
        let types = menu.validUserTypes.filter(g => g.toLowerCase() === userType.toLowerCase());
        return types.length > 0;
      }).map(item => ({
        name: item.name,
        path: item.path,
        visible: item.visible,
        icon: item.icon,
        order: item.order
      }));
      resolve(userMenus);
    }, errP => {
      reject({
        valid: false,
        message: 'The token is not allowed'
      });
    });
  });
};

/***/ }),

/***/ "./src/logic/postalCodeService.js":
/*!****************************************!*\
  !*** ./src/logic/postalCodeService.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const PostalCode = __webpack_require__(/*! ../models/postalCode */ "./src/models/postalCode.js");

exports.getCPInfo = async postalCode => {
  return new Promise((resolve, reject) => {
    if (postalCode.length > 2) {
      getInfo = PostalCode.getCPInfo(postalCode);
      getInfo.then(cp => {
        resolve(cp);
      }, err => {
        reject({
          valid: false,
          message: 'No se pudo obtener la informaion del codigo postal.'
        });
      });
    } else {
      reject({
        valid: false,
        message: 'La longitud del codigo postal no es valida.'
      });
    }
  });
};

/***/ }),

/***/ "./src/logic/pushNotificationService.js":
/*!**********************************************!*\
  !*** ./src/logic/pushNotificationService.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Expo = __webpack_require__(/*! expo-server-sdk */ "expo-server-sdk").Expo;

let expo = new Expo();

const getMessagesBatches = (pushTokens, message) => {
  let messages = [];
  pushTokens.forEach(token => {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid push token`); //continue;
    }

    messages = [...messages, { ...message,
      to: token
    }];
  });
  return expo.chunkPushNotifications(messages);
};

const sendExpoNotification = async chunks => {
  //(async () => {
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  let tickets = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk); // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }

  return tickets; //})();
};

const checkTickets = async tickets => {
  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.
  let receiptIds = [];

  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds); //(async () => {
  // Like sending notifications, there are different strategies you could use
  // to retrieve batches of receipts from the Expo service.

  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log(receipts); // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.

      for (let receiptId in receipts) {
        let {
          status,
          message,
          details
        } = receipts[receiptId];

        if (status === "ok") {//continue;
        } else if (status === "error") {
          console.error(`There was an error sending a notification: ${message}`);

          if (details && details.error) {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            // You must handle the errors appropriately.
            console.error(`The error code is ${details.error}`);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  } //})();

};

const sendPushNotification = async (pushTokens, message) => {
  try {
    let chunks = getMessagesBatches(pushTokens, message);
    let tickets = await sendExpoNotification(chunks);
    await checkTickets(tickets);
  } catch (ex) {
    throw ex;
  }
};

module.exports = {
  sendPushNotification
};

/***/ }),

/***/ "./src/logic/suburbService.js":
/*!************************************!*\
  !*** ./src/logic/suburbService.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Suburb = __webpack_require__(/*! ../models/suburb */ "./src/models/suburb.js");

const suburbStatus = __webpack_require__(/*! ../constants/types */ "./src/constants/types.js").suburbStatus;

const SuburbInvite = __webpack_require__(/*! ../models/suburbInvite */ "./src/models/suburbInvite.js");

const User = __webpack_require__(/*! ../models/user */ "./src/models/user.js");

const CryptoJS = __webpack_require__(/*! crypto-js */ "crypto-js");

var pjson = __webpack_require__(/*! ../../package.json */ "./package.json");

const getSuburbStatus = statusName => {
  let status = suburbStatus.filter(st => st.status === statusName);
  return status[0];
};

const encryption = data => {
  if (!data) return "";
  return CryptoJS.AES.encrypt(data, pjson.cryptoKey).toString();
};

const decryption = data => {
  if (!data) return "";
  var bytes = CryptoJS.AES.decrypt(data, pjson.cryptoKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const saveSuburb = suburbObj => {
  return new Promise((resolve, reject) => {
    Suburb.SaveSuburb(suburbObj).then((sub, err) => {
      if (!err) resolve({
        success: true,
        message: "La colonia fue guardada correctamente.",
        id: sub.id
      });else reject({
        success: false,
        message: err.message || "Ocurrio un error al intentar guardar la colonia."
      });
    });
  });
};

const suburbAddStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    Suburb.UpdateStatus(id, status).then((sub, err) => {
      if (!err) resolve({
        success: true,
        message: "El status de la colonia fue actualizado correctamente."
      });else reject({
        success: false,
        message: err.message || "Ocurrio un error al intentar actualizar el estatus de la colonia."
      });
    });
  });
};

const suburbAddStatusByName = (name, postalCode, status) => {
  return new Promise((resolve, reject) => {
    Suburb.UpdateStatusByName(name, postalCode, status).then((sub, err) => {
      if (!err) resolve({
        success: true,
        message: "El status de la colonia fue actualizado correctamente."
      });else reject({
        success: false,
        message: err.message || "Ocurrio un error al intentar actualizar el estatus de la colonia."
      });
    });
  });
};

const getSuburbByAdminUser = userId => {
  return new Promise((resolve, reject) => {
    Suburb.GetSuburbByUserId(userId).then((sub, err) => {
      if (!err) resolve(sub);else reject({
        success: false,
        message: err.message || "Ocurrio un error al intentar obtener la colonia por usuario administrador."
      });
    });
  });
};

const getSuburbById = suburbId => {
  return new Promise((resolve, reject) => {
    Suburb.GetSuburb(suburbId).then((sub, err) => {
      if (!err) resolve(sub);else reject({
        success: false,
        message: err.message || "Ocurrio un error al intentar obtener la colonia."
      });
    }).catch(err => reject(err));
  });
};

const addSuburbInvite = (suburbId, name, street, streetNumber) => {
  return new Promise((resolve, reject) => {
    let _code = Math.random().toString(36).substring(2, 4).toUpperCase() + Math.random().toString(36).substring(2, 4).toUpperCase();

    console.log(encryption(street));
    SuburbInvite.SaveSuburbInvite({
      code: _code,
      suburbId,
      name,
      street: encryption(street),
      streetNumber: encryption(streetNumber)
    }).then((subInv, err) => {
      if (!err) {
        Suburb.AddSuburbInvite(suburbId, subInv._id.toString()).then((sub, err) => {
          if (!err) resolve(subInv);else reject({
            success: false,
            message: err.message || "Ocurrio un error al intentar agregar una invitacion a usuario"
          });
        });
      } else reject({
        success: false,
        message: err.message || "Ocurrio un error al intentar agregar una invitacion a usuario"
      });
    });
  });
};

const getSuburbInvite = code => {
  return new Promise((resolve, reject) => {
    SuburbInvite.GetInviteByCode(code).then((subInvite, err) => {
      if (!err) {
        Suburb.GetSuburbBasicInfo(subInvite.suburbId.toString()).then((suburb, err) => {
          if (!err) {
            const {
              street,
              streetNumber,
              ...props
            } = subInvite._doc;
            const result = {
              suburb: { ...suburb
              },
              invite: {
                street: decryption(street),
                streetNumber: decryption(streetNumber),
                ...props
              }
            };
            resolve(result);
          } else {
            reject({
              success: false,
              message: err.message || "Ocurrio un error al intentar obtener la invitación"
            });
          }
        });
      } else reject({
        success: false,
        message: err.message || "Ocurrio un error al intentar obtener la invitación"
      });
    }).catch(err => {
      reject({
        sucess: false,
        message: err.message || "Ocurrion un error al intentar obtener la invitación"
      });
    });
  });
};

module.exports = {
  saveSuburb,
  suburbAddStatus,
  suburbAddStatusByName,
  getSuburbByAdminUser,
  getSuburbById,
  getSuburbStatus,
  addSuburbInvite,
  getSuburbInvite
};

/***/ }),

/***/ "./src/logic/userService.js":
/*!**********************************!*\
  !*** ./src/logic/userService.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const User = __webpack_require__(/*! ../models/user */ "./src/models/user.js");

const request = __webpack_require__(/*! request */ "request");

const userTypes = __webpack_require__(/*! ../constants/types */ "./src/constants/types.js").userTypes;

const saveUser = userObj => {
  return new Promise((resolve, reject) => {
    User.getLogin(userObj.loginName).then(login => {
      if (login) {
        reject({
          success: false,
          message: "El usuario existe actualmente en la base de datos."
        });
      } else {
        //create the user
        User.saveUser(userObj.userType ? userObj : { ...userObj,
          userType: userTypes.guest
        }).then((usr, err) => {
          //check if there is an error
          if (!err) resolve({
            success: true,
            message: "Has sido registrado correctamente.",
            userData: { ...usr
            }
          });else reject({
            success: false,
            message: err.message || "No se pudo registrar el usuario."
          });
        }, err => {
          reject({
            success: false,
            message: err.message
          });
        });
      }
    }, err => {
      reject({
        success: false,
        message: err.message || "Ocurrio un error al tratar de guardar el usuario."
      });
    });
  });
};

const updateUser = async userObj => {
  return new Promise((resolve, reject) => {
    User.updateUser(userObj).then((usr, err) => {
      if (!err) resolve({
        success: true,
        message: "Ha sido actualizado correctamente."
      });else reject({
        success: false,
        message: err.message || "No se pudo actualizar el usuario."
      });
    }, err => {
      reject({
        success: false,
        message: err.message
      });
    });
  });
};

const validateRecaptcha = async token => {
  const secretKey = process.env.RECAPTCHA_SECRET;
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  return new Promise((resolve, reject) => {
    request.post(verificationURL, (error, resG, body) => {
      if (error) reject({
        success: false,
        message: "Por favor intenta de nuevo (no es posible validar recaptcha)."
      });
      let status = JSON.parse(body);
      if (!status.success) reject({
        success: false,
        message: "Por favor intenta de nuevo."
      });else if (status.score <= 0.5) reject({
        success: false,
        message: "Por favor intenta de nuevo (score demasiado bajo)."
      });else resolve({
        success: true,
        message: "recaptcha valido."
      });
    });
  });
};

const saveUserWithPassword = async userObj => {
  const {
    password
  } = userObj;
  return new Promise((resolve, reject) => {
    User.encryptPassword(password).then(resEncrypt => {
      let encryptedPassword = resEncrypt.hash;
      userObj.password = encryptedPassword;
      saveUser(userObj).then(result => {
        resolve(result);
      }, err => {
        reject(err);
      });
    }, err => {
      reject({
        success: false,
        message: err.message || "Bad request."
      });
    });
  });
};

const getUserByType = async userType => {
  try {
    return await User.find({
      userType: userType
    });
  } catch (ex) {
    return ex;
  }
};

const getUserByToken = async token => {
  try {
    let payload = await User.getTokenPayload(token);
    return await User.findById(payload.userId);
  } catch (ex) {
    return ex;
  }
};

const getUserById = async id => {
  try {
    return await User.getUserById(id);
  } catch (ex) {
    throw ex;
  }
};

const getUserFavorites = async userId => {
  try {
    let payload = await User.getUserFavs(userId);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const saveUserFavorites = async (userId, favs) => {
  try {
    let payload = await User.addUserFavs(userId, favs);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const removeUserFavorites = async (userId, favs) => {
  try {
    let payload = await User.removeUserFavs(userId, favs);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const addUserPushToken = async (userId, pushToken) => {
  try {
    let payload = await User.addUserPushToken(userId, pushToken);
    return payload;
  } catch (ex) {
    throw ex;
  }
};

const getUsersBySuburb = async suburbId => {
  try {
    let users = await User.getUsersBySuburb(suburbId);
    return users;
  } catch (err) {
    throw err;
  }
};

const getUsersBySuburbStreet = async (suburbId, street) => {
  try {
    let users = await User.getUsersBySuburbStreet(suburbId, street);
    return users;
  } catch (err) {
    throw err;
  }
};

const getUsersByAddress = async (suburbId, street, streetNumber) => {
  try {
    let users = await User.getUsersByAddress(suburbId, street, streetNumber);
    return users;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  saveUser,
  validateRecaptcha,
  saveUserWithPassword,
  getUserByType,
  getUserByToken,
  updateUser,
  getUserFavorites,
  saveUserFavorites,
  removeUserFavorites,
  getUserById,
  addUserPushToken,
  getUsersBySuburb,
  getUsersBySuburbStreet,
  getUsersByAddress
};

/***/ }),

/***/ "./src/logic/viewPermissions.js":
/*!**************************************!*\
  !*** ./src/logic/viewPermissions.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const User = __webpack_require__(/*! ../models/user */ "./src/models/user.js");

const permissions = __webpack_require__(/*! ../constants/menusConfig */ "./src/constants/menusConfig.js").menus;

const validateWithPayload = (path, payload) => {
  let valid = {
    valid: false,
    message: 'la pantalla no es valida para tu usuario.'
  };
  if (!payload || !payload.userType) return valid;
  const {
    userType
  } = payload;
  let validPath = permissions.filter(p => {
    let types = p.validUserTypes.filter(g => g.toLowerCase() === userType.toLowerCase());
    return types.length > 0 && p.path.toLowerCase() === path.toLocaleLowerCase();
  });
  if (validPath.length > 0) valid = {
    valid: true,
    message: 'ok'
  };
  return valid;
};

exports.permissionValid = (path, jwt) => {
  return new Promise((resolve, reject) => {
    let user = User;
    let isValid = user.isValidToken(jwt);
    isValid.then(res => {
      let getPayload = user.getTokenPayload(jwt);
      getPayload.then(payload => {
        let valid = validateWithPayload(path, payload);
        if (valid.valid) resolve(valid);else reject(valid);
      }, errP => {
        reject({
          valid: false,
          message: 'los datos de la sesión no son validos.'
        });
      });
    }, err => {
      reject({
        valid: false,
        message: 'el token de la sesión no es valido.'
      });
    });
  });
};

/***/ }),

/***/ "./src/middleware/auth.js":
/*!********************************!*\
  !*** ./src/middleware/auth.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Auth = __webpack_require__(/*! ../logic/auth */ "./src/logic/auth.js");

const validApiRequest = (apiPath, token) => {
  return new Promise((resolve, reject) => {
    let auth = new Auth();
    auth.validateApiRequest(apiPath, token).then(res => {
      resolve(res);
    }, err => reject({
      valid: false,
      message: err.message ? err.message : `Error: ${JSON.stringify(err)}`
    }));
  });
};

exports.checkApiAuth = (req, res, next) => {
  console.log(`validando si el request esta autenticado...`); //check request headers over here to know if the request is authenticated

  let apiPath = req.baseUrl,
      token = req.headers["authorization"];
  validApiRequest(apiPath, token).then(result => {
    if (result.valid) next();else res.status("401").json({
      success: false,
      error: "Unauthorized request."
    });
  }, err => res.status("401").json({
    success: false,
    error: err.message || "An error occurs while validating the request."
  }));
};

/***/ }),

/***/ "./src/models/index.js":
/*!*****************************!*\
  !*** ./src/models/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const Menu = __webpack_require__(/*! ./menu */ "./src/models/menu.js");

const Role = __webpack_require__(/*! ./role */ "./src/models/role.js");

const User = __webpack_require__(/*! ./user */ "./src/models/user.js");

const SuburbInvite = __webpack_require__(/*! ./suburbInvite */ "./src/models/suburbInvite.js");

const PostalCode = __webpack_require__(/*! ./postalCode */ "./src/models/postalCode.js");

const models = {
  Menu,
  Role,
  User,
  PostalCode,
  SuburbInvite
};

const connectDb = () => {
  //setup the mongo connection
  let mConn = mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true
  });
  mongoose.connection.on("error", console.error.bind(console, "Mongo db connection error: "));
  return mConn;
};

module.exports = {
  connectDb,
  models
};

/***/ }),

/***/ "./src/models/menu.js":
/*!****************************!*\
  !*** ./src/models/menu.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const moment = __webpack_require__(/*! moment */ "moment");

const mongoose = __webpack_require__(/*! mongoose */ "mongoose"); //const Base = require('./baseModel');


const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Enter the menu name'
  },
  link: {
    type: String,
    required: 'Enter the menu link'
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  },
  position: {
    type: Number,
    default: 1
  },
  icon: {
    type: String
  },
  visible: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  },
  type: {
    type: String
  },
  transtime: {
    type: Date,
    default: moment.utc()
  }
});
MenuSchema.statics = {
  getMenuById: function (menuId) {
    //, projectId){
    return this.findOne({
      _id: menuId //, 
      //project: projectId

    });
  },
  updateMenu: function (objMenu) {
    return this.update({
      _id: objMenu._id
    }, {
      $set: {
        'name': objMenu.name,
        'link': objMenu.link,
        'parentId': objMenu.parentId,
        'position': objMenu.position,
        'icon': objMenu.position,
        'visible': objMenu.visible,
        'active': objMenu.active,
        'type': objMenu.active,
        'transtime': moment.utc()
      }
    });
  },
  deleteMenu: function (menuId) {
    return this.deleteMany({
      _id: menuId
    });
  },
  getChildMenus: function (menuId) {
    return this.find({
      parentId: menuId
    });
  },
  getChildMenusRecursively: function (parents) {
    let _this = this;

    let getThisLevelChilds = this.getChildMenus(parents);
    let elements = [];
    return new Promise((resolve, reject) => {
      getThisLevelChilds.then(childs => {
        if (childs.length > 0) {
          elements = JSON.parse(JSON.stringify(childs)).map(child => {
            return child._id;
          });

          let getInnerChilds = _this.getChildMenusRecursively(elements);

          getInnerChilds.then(result => {
            resolve(elements.concat(result));
          });
        } else resolve(elements);
      }, err => {
        reject(err);
      });
    });
  },
  getParentMenusRecursively: function (menuId) {
    let _this = this;

    let getThisLevel = this.getMenuById(menuId);
    let elements = [];
    return new Promise((resolve, reject) => {
      getThisLevel.then(menu => {
        menu = JSON.parse(JSON.stringify(menu));

        if (menu && menu.parentId) {
          elements.push(menu.parentId);

          let getMoreParents = _this.getParentMenusRecursively(menu.parentId);

          getMoreParents.then(result => resolve(elements.concat(result)));
        } else resolve(elements);
      }, err => reject(err));
    });
  },
  getMenus: function (menus) {
    return this.find({
      _id: menus
    });
  }
};
const Menu = mongoose.model("Menu", MenuSchema);
module.exports = Menu;

/***/ }),

/***/ "./src/models/postalCode.js":
/*!**********************************!*\
  !*** ./src/models/postalCode.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const PostalCodeSchema = new mongoose.Schema({
  d_codigo: {
    type: String
  },
  d_asenta: {
    type: String
  },
  d_tipo_asenta: {
    type: String
  },
  D_mnpio: {
    type: String
  },
  d_estado: {
    type: String
  },
  d_ciudad: {
    type: String
  },
  d_CP: {
    type: String
  },
  c_estado: {
    type: String
  },
  c_oficina: {
    type: String
  },
  c_CP: {
    type: String
  },
  c_tipo_asenta: {
    type: String
  },
  c_mnpio: {
    type: String
  },
  id_asenta_cpcons: {
    type: String
  },
  d_zona: {
    type: String
  },
  c_cve_ciudad: {
    type: String
  }
});
PostalCodeSchema.statics = {
  getCPInfo: function (cp) {
    let regCp = new RegExp(cp);
    return this.find({
      d_codigo: regCp
    }).limit(100);
  }
};
const PostalCode = mongoose.model("PostalCode", PostalCodeSchema);
module.exports = PostalCode;

/***/ }),

/***/ "./src/models/role.js":
/*!****************************!*\
  !*** ./src/models/role.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const moment = __webpack_require__(/*! moment */ "moment");

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Enter the name of the role'
  },
  description: {
    type: String,
    required: 'Enter the description of the role'
  },
  siteAdministration: {
    type: Boolean,
    default: false
  },
  sysAdministrator: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  menus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }],
  transtime: {
    type: Date,
    default: moment.utc()
  }
});
RoleSchema.statics = {
  deleteRole: function (roleId) {
    return this.deleteMany({
      _id: roleId
    });
  },
  setRoleMenu: function (roleId, menus) {
    if (!Array.isArray(menus)) menus = [menus];
    return this.update({
      _id: roleId
    }, {
      $addToSet: {
        menus: {
          $each: menus
        }
      }
    }, {
      multi: true
    });
  },
  deleteRoleMenu: function (roles, menus) {
    if (!Array.isArray(menus)) menus = [menus];
    if (!Array.isArray(roles)) roles = [roles];
    return this.update({
      _id: {
        $in: roles
      }
    }, {
      $pullAll: {
        menus: menus
      }
    }, {
      multi: true
    });
  },
  getRoleMenus: function (roleId) {
    return new Promise((resolve, reject) => {
      this.find({
        _id: roleId
      }).populate('menus').exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
};
const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;

/***/ }),

/***/ "./src/models/schemas/guestSchema.js":
/*!*******************************************!*\
  !*** ./src/models/schemas/guestSchema.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const moment = __webpack_require__(/*! moment */ "moment");

const GuestSchema = new mongoose.Schema({
  name: {
    type: String
  },
  vehicle: {
    type: String
  },
  subject: {
    type: String
  },
  isService: {
    type: Boolean,
    default: false
  },
  plates: {
    type: String
  },
  additionalInformation: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  arriveOn: {
    type: Date
  },
  leaveOn: {
    type: Date
  },
  count: {
    type: Number,
    default: 0
  },
  transtime: {
    type: Date,
    default: moment.utc()
  }
});
module.exports = GuestSchema;

/***/ }),

/***/ "./src/models/schemas/pushTokenSchema.js":
/*!***********************************************!*\
  !*** ./src/models/schemas/pushTokenSchema.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const moment = __webpack_require__(/*! moment */ "moment");

const PushTokenSchema = new mongoose.Schema({
  token: {
    type: String
  },
  transtime: {
    type: Date,
    default: moment.utc()
  }
});
module.exports = PushTokenSchema;

/***/ }),

/***/ "./src/models/schemas/suburbFileSchema.js":
/*!************************************************!*\
  !*** ./src/models/schemas/suburbFileSchema.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const moment = __webpack_require__(/*! moment */ "moment");

const SuburbFileSchema = new mongoose.Schema({
  fileName: {
    type: String
  },
  originalName: {
    type: String
  },
  actionType: {
    type: String
  },
  mimetype: {
    type: String
  },
  transtime: {
    type: Date,
    default: moment.utc()
  }
});
module.exports = SuburbFileSchema;

/***/ }),

/***/ "./src/models/schemas/suburbStatusSchema.js":
/*!**************************************************!*\
  !*** ./src/models/schemas/suburbStatusSchema.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const moment = __webpack_require__(/*! moment */ "moment");

const SuburbStatusSchema = new mongoose.Schema({
  status: {
    type: String
  },
  description: {
    type: String
  },
  details: {
    type: String
  },
  transtime: {
    type: Date,
    default: moment.utc()
  }
}); //const SuburbStatus = mongoose.model("SuburbStatus", SuburbStatusSchema);

module.exports = SuburbStatusSchema;

/***/ }),

/***/ "./src/models/suburb.js":
/*!******************************!*\
  !*** ./src/models/suburb.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const moment = __webpack_require__(/*! moment */ "moment");

const SuburbStatusSchema = __webpack_require__(/*! ./schemas/suburbStatusSchema */ "./src/models/schemas/suburbStatusSchema.js");

const SuburbFileSchema = __webpack_require__(/*! ./schemas/suburbFileSchema */ "./src/models/schemas/suburbFileSchema.js");

const SuburbSchema = new mongoose.Schema({
  name: {
    type: String
  },
  location: {
    type: String
  },
  postalCode: {
    type: Number
  },
  active: {
    type: Boolean
  },
  transtime: {
    type: Date,
    default: moment.utc()
  },
  userAdmins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  /*
        estatus validos:
        activacionPendiente,
        activacionRechazada
        activadoBasico,
        activadoPlus
    */
  status: [SuburbStatusSchema],
  files: [SuburbFileSchema],
  suburbInvites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuburbInvite"
  }]
});
SuburbSchema.statics = {
  SaveSuburb: function (suburbObj) {
    let suburb = new this(suburbObj);
    return suburb.save();
  },
  UpdateStatus: function (id, status) {
    if (!Array.isArray(status)) status = [status];
    return this.updateOne({
      _id: id
    }, {
      $addToSet: {
        status: {
          $each: status
        }
      }
    }, {
      multi: true
    });
  },
  UpdateStatusByName: function (name, postalCode) {
    if (!Array.isArray(status)) status = [status];
    return this.updateOne({
      name: name,
      postalCode: postalCode
    }, {
      $addToSet: {
        status: {
          $each: status
        }
      }
    }, {
      multi: true
    });
  },
  AddSuburbInvite: function (id, userInviteId) {
    if (!Array.isArray(userInviteId)) userInviteId = [userInviteId];
    return this.updateOne({
      _id: id
    }, {
      $addToSet: {
        suburbInvites: {
          $each: userInviteId
        }
      }
    }, {
      multi: true
    });
  },
  GetSuburb: function (id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id
      }).populate("userAdmins", "User").populate("suburbInvites", "SuburbInvite").exec((err, result) => {
        if (err) reject(err);
        let {
          name,
          location,
          postalCode,
          active,
          transtime,
          status,
          suburbInvites
        } = result;
        resolve({
          name,
          location,
          postalCode,
          active,
          transtime,
          status,
          suburbInvites
        });
      });
    });
  },
  GetSuburbBasicInfo: function (id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id
      }).exec((err, result) => {
        if (err) reject(err);
        let {
          name,
          location,
          postalCode,
          active,
          transtime
        } = result;
        resolve({
          name,
          location,
          postalCode,
          active,
          transtime
        });
      });
    });
  },
  GetSuburbByName: function (postalCode, name) {
    return new Promise((resolve, reject) => {
      this.findOne({
        postalCode: postalCode,
        name: name
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  GetSuburbByUserId: function (userId) {
    return new Promise((resolve, reject) => {
      this.findOne({
        userAdmins: mongoose.Types.ObjectId(userId)
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
};
const Suburb = mongoose.model("Suburb", SuburbSchema);
module.exports = Suburb;

/***/ }),

/***/ "./src/models/suburbInvite.js":
/*!************************************!*\
  !*** ./src/models/suburbInvite.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const moment = __webpack_require__(/*! moment */ "moment");

const SuburbInviteSchema = new mongoose.Schema({
  code: {
    type: String
  },
  name: {
    type: String
  },
  street: {
    type: String
  },
  streetNumber: {
    type: String
  },
  suburbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb"
  },
  active: {
    type: Boolean,
    default: true
  },
  usedBy: {
    type: String
  },
  updatedTranstime: {
    type: Date
  },
  transtime: {
    type: Date,
    default: moment.utc()
  }
});
SuburbInviteSchema.statics = {
  SaveSuburbInvite: function (userInviteObj) {
    let userInvite = new this(userInviteObj);
    return userInvite.save();
  },
  UpdateSuburbInviteUsed: function (code, usedBy) {
    return this.updateOne({
      $and: [{
        code: code
      }, {
        active: true
      }]
    }, {
      $set: {
        usedBy: usedBy,
        active: false,
        updatedTranstime: moment.utc()
      }
    });
  },
  GetInviteByCode: function (code) {
    return new Promise((resolve, reject) => {
      return this.findOne({
        code: code,
        active: true
      }).exec((err, result) => {
        if (err) reject(err);
        if (!result) reject({
          success: false,
          message: "Cannot find the invite code."
        });
        resolve(result);
      });
    });
  }
};
const SuburbInvite = mongoose.model("SuburbInvite", SuburbInviteSchema);
module.exports = SuburbInvite;

/***/ }),

/***/ "./src/models/user.js":
/*!****************************!*\
  !*** ./src/models/user.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const moment = __webpack_require__(/*! moment */ "moment");

const bcrypt = __webpack_require__(/*! bcryptjs */ "bcryptjs");

const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const base64 = __webpack_require__(/*! base-64 */ "base-64");

const GuestSchema = __webpack_require__(/*! ./schemas/guestSchema */ "./src/models/schemas/guestSchema.js");

const PushTokenSchema = __webpack_require__(/*! ./schemas/pushTokenSchema */ "./src/models/schemas/pushTokenSchema.js");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Ingresa el nombre"
  },
  lastName: {
    type: String
  },
  password: {
    type: String
  },
  loginName: {
    type: String,
    unique: true
  },
  email: {
    type: String
  },
  cellphone: {
    type: String
  },
  photoUrl: {
    type: String
  },
  street: {
    type: String
  },
  streetNumber: {
    type: String
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  temporaryDisabled: {
    type: Boolean,
    default: false
  },
  disabledSince: {
    type: Date
  },
  lastAccess: {
    type: Date,
    default: moment.utc()
  },

  /**
   * valid user types:
   *  guest -> a guest user
   *  guard -> a guard of the suburb
   *  admin -> an administrator of the suburb
   *  sudo  -> an administrator of the app
   */
  userType: {
    type: String,
    default: "guest"
  },
  userConfirmed: {
    type: Boolean
  },
  facebookId: {
    type: String
  },
  googleId: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  transtime: {
    type: Date,
    default: moment.utc()
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role"
  }],
  suburb: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb"
  },
  favorites: [GuestSchema],
  pushTokens: [PushTokenSchema]
});
/**
 * Private attributes
 */

const _secretKey = process.env.JWT_SECRET;

let _getExpDate = () => {
  var expTimeByMin = process.env.exptoken != null ? process.env.exptoken : "1440";
  return moment().add(expTimeByMin, "minutes").unix();
};

let _getValidApis = id => {
  //return an array with the valid apis
  return [];
};

let _getValidMenus = id => {
  //return an array with the valid menus for the user
  return [];
};
/**
 * Method to validate exp from the user token.
 * @param {*} expDate
 */


let _validateExpDate = function (expDate) {
  let currentTime = moment().unix();
  return expDate > currentTime;
};

UserSchema.methods = {
  validatePassword: function (_password) {
    var _this = this;

    let pass = base64.decode(_password);
    return new Promise((resolve, reject) => {
      if (_this.temporaryDisabled) {
        let wait = 10 - this.getDisabledSince();
        if (wait > 0) reject({
          success: false,
          message: `El usuario esta temporalmente desabilitado, por favor espere ${wait} minutos para volver a intentar.`
        });else this.increaseLoginAttempts(true).then(res => {
          this.validatePassword(_password).then(result => resolve(result), err => reject(err));
        });
      } else bcrypt.compare(pass, _this.password).then(valid => {
        if (valid) {
          //reset logint attempts
          this.increaseLoginAttempts(true).then(res => {
            resolve({
              success: true,
              message: "La contraseña coincide."
            });
          }, err => reject({
            success: false,
            message: "Un error occurio."
          }));
        } else {
          //increase login attempts
          this.increaseLoginAttempts().then(res => {
            reject({
              success: false,
              message: "La contraseña no es valida."
            });
          }, err => reject({
            success: false,
            message: "Un error occurio, la contraseña no es valida."
          }));
        }
      });
    }, err => reject({
      success: false,
      message: "Ocurrio un error al comparar la contraseña."
    }));
  },
  getDisabledSince: function () {
    let disabledSince = this.disabledSince ? this.disabledSince : moment.utc();
    let start = moment(disabledSince);
    let end = moment(moment.utc());
    return end.diff(start, "minutes");
  },
  increaseLoginAttempts: function (reset) {
    if (reset) {
      this.loginAttempts = 0;
      this.temporaryDisabled = false;
      this.disabledSince = null;
    } else {
      let loginAttempts = this.loginAttempts + 1;
      this.loginAttempts = loginAttempts;
      this.temporaryDisabled = loginAttempts > 10;
      this.disabledSince = loginAttempts > 10 ? moment.utc() : null;
    }

    return new Promise((resolve, reject) => {
      return this.save().then(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  },
  generateUserToken: function (_suburb) {
    let payload = {
      userId: this._id != undefined ? JSON.parse(JSON.stringify(this._id)) : "",
      userName: `${this.name} ${this.lastName}`,
      loginName: this.loginName,
      suburb: this.suburb || _suburb,
      userType: this.userType,
      exp: _getExpDate(),
      validApis: _getValidApis(this._id),
      pushTokens: this.pushTokens,
      street: this.street,
      streetNumber: this.streetNumber //validMenus: _getValidMenus(this._id) //verify if is better put this in another schema i.e. suburb

    };
    let token = jwt.sign(payload, _secretKey);
    return token;
  },
  setUserRole: function (userId, roles) {
    if (!Array.isArray(roles)) roles = [roles];
    return this.update({
      _id: userId
    }, {
      $addToSet: {
        roles: {
          $each: roles
        }
      }
    }, {
      multi: true
    });
  },
  deleteUserRole: function (users, roles) {
    if (!Array.isArray(users)) users = [users];
    if (!Array.isArray(roles)) roles = [roles];
    return this.update({
      _id: {
        $in: users
      }
    }, {
      $pullAll: {
        roles: roles
      }
    }, {
      multi: true
    });
  },
  getUserRoles: function (userId) {
    return new Promise((resolve, reject) => {
      this.find({
        _id: userId
      }).populate("roles").exec((err, result) => {
        if (err) reject(err);
        resolve(getCleanResult(result, "roles"));
      });
    });
  }
};

const mergeArrayObjects = (currentFavs, newFavs) => {
  let firstMerge = currentFavs.map((item, i) => {
    let assign = {
      name: item.name,
      vehicle: item.vehicle,
      subject: item.subject,
      isService: item.isService,
      count: item.count || 0
    };
    newFavs.forEach(a2 => {
      if (item.name === a2.name) {
        assign = Object.assign({}, {
          name: item.name,
          vehicle: item.vehicle,
          subject: item.subject,
          isService: item.isService,
          count: item.count || 0 + 1 //add 1 to calculate more used favs

        }, a2);
      }
    });
    return { ...assign
    };
  });
  let all = [];
  newFavs.forEach(item => {
    let add = true;
    firstMerge.forEach(fm => {
      if (item.name.trim() === fm.name.trim()) add = false;
    });
    if (add) all.push(item);
  });
  let items = [...firstMerge, ...all].sort((a, b) => b.count - a.count);
  return items.slice(0, items.length <= 30 ? items.length : 30); // solo mantendremos 30 favoritos para no sobrecargar la bd
};

const mergePushTokens = (currentPushTokens, newPushToken) => {
  let tokens = currentPushTokens.map(t => t.token === newPushToken.token ? { ...newPushToken
  } : { ...t._doc
  });
  let exists = tokens.filter(t => t.token === newPushToken.token);
  return exists.length > 0 ? [...tokens] : [...tokens, newPushToken];
};

const extractUsersFromDoc = mUsers => {
  let users = mUsers.map(u => {
    let {
      _id,
      name,
      lastName,
      street,
      streetNumber,
      active
    } = u._doc;
    return {
      _id,
      name,
      lastName,
      street,
      streetNumber,
      active
    };
  });
  return users;
};

UserSchema.statics = {
  /**
   * Method to get a user by login name
   */
  getLogin: function (_loginName) {
    return new Promise((resolve, reject) => {
      this.findOne({
        loginName: _loginName
      })
      /*.populate({
             path: 'roles',
             populate: {
                 path: 'menus',
                 model: 'Menu'
             }
         })*/
      .exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  getUserByFacebookId: function (_facebookId) {
    return new Promise((resolve, reject) => {
      this.findOne({
        facebookId: _facebookId
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  getUserByGoogleId: function (_googleId) {
    return new Promise((resolve, reject) => {
      this.findOne({
        googleId: _googleId
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  getUserFavs: function (userId) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: userId
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(result.favorites);
      });
    });
  },
  addUserFavs: function (userId, favs) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: userId
      }).exec((err, result) => {
        if (err) reject(err);
        if (!result) reject({
          message: "user not found"
        });
        let mergedFavs = mergeArrayObjects(result.favorites || [], favs);
        this.findOneAndUpdate({
          _id: userId
        }, {
          $set: {
            favorites: mergedFavs
          }
        }, {
          new: true
        }, function (err, user) {
          if (err) reject(err);
          resolve(mergedFavs);
        });
        resolve(result);
      });
    });
  },
  removeUserFavs: function (userId, favs) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: userId
      }).exec((err, result) => {
        if (err) reject(err);
        if (!result) reject({
          message: "user not found"
        });
        let filterFavs = (result.favorites || []).filter(item => {
          let exists = favs.filter(f => f.name.trim() === item.name.trim());
          return exists.length === 0;
        });
        this.findOneAndUpdate({
          _id: userId
        }, {
          $set: {
            favorites: filterFavs
          }
        }, {
          new: true
        }, function (err, user) {
          if (err) reject(err);
          resolve(filterFavs);
        });
        resolve(result);
      });
    });
  },
  addUserPushToken: function (userId, pushToken) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: userId
      }).exec((err, result) => {
        if (err) reject(err);
        if (!result) reject({
          message: "user not found"
        });
        let mergedPushTokens = mergePushTokens(result.pushTokens, {
          token: pushToken
        });
        this.findOneAndUpdate({
          _id: userId
        }, {
          $set: {
            pushTokens: mergedPushTokens
          }
        }, {
          new: true
        }, function (err, user) {
          if (err) reject(err);
          resolve(mergedPushTokens);
        });
      });
    });
  },
  updateUser: function (objUser) {
    return this.updateOne({
      _id: objUser._id
    }, {
      $set: {
        name: objUser.name,
        lastName: objUser.lastName,
        password: objUser.password,
        email: objUser.email,
        cellphone: objUser.cellphone,
        active: objUser.active,
        userType: objUser.userType,
        transtime: moment.utc()
      }
    });
  },
  saveUser: function (objUser) {
    let user = new this(objUser);
    return user.save();
  },

  /**
   * Validate if the user token is active
   */
  isValidToken: function (_token) {
    return new Promise(function (resolve, reject) {
      var isValid = false;

      try {
        jwt.verify(_token, _secretKey, function (err, decoded) {
          if (decoded) {
            if (_validateExpDate(decoded.exp)) {
              isValid = true;
            }
          }

          resolve(isValid);
        });
      } catch (err) {
        console.log(err);
        reject(false);
      }
    });
  },

  /**
   * Get the payload of the jwt token
   * @param {String} _token
   */
  getTokenPayload: function (_token) {
    return new Promise(function (resolve, reject) {
      try {
        jwt.verify(_token, _secretKey, function (err, decoded) {
          resolve(decoded);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  encryptPassword: function (_password) {
    return new Promise((resolve, reject) => {
      let pass = base64.decode(_password);
      let saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(pass, salt, (err, hash) => {
          if (!err) resolve({
            hash
          });else reject(err);
        });
      });
    });
  },
  getUserById: function (id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id
      }).populate("suburb", "name").exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  getUsersBySuburb: function (suburbId) {
    return new Promise((resolve, reject) => {
      this.find({
        suburb: suburbId
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(extractUsersFromDoc(result));
      });
    });
  },
  getUsersBySuburbStreet: function (suburbId, street) {
    return new Promise((resolve, reject) => {
      this.find({
        $and: [{
          suburb: suburbId
        }, {
          street: street
        }]
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(extractUsersFromDoc(result));
      });
    });
  },
  getUsersByAddress: function (suburbId, street, streetNumber) {
    return new Promise((resolve, reject) => {
      this.find({
        $and: [{
          suburb: suburbId
        }, {
          street: street
        }, {
          streetNumber: streetNumber
        }]
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(extractUsersFromDoc(result));
      });
    });
  }
};
const User = mongoose.model("User", UserSchema);
module.exports = User;

/***/ }),

/***/ "./src/routes/apiRoutes.js":
/*!*********************************!*\
  !*** ./src/routes/apiRoutes.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const router = __webpack_require__(/*! express */ "express").Router();

const siteAuth = __webpack_require__(/*! ../controllers/siteAuth */ "./src/controllers/siteAuth.js");

const menus = __webpack_require__(/*! ../controllers/menus */ "./src/controllers/menus.js");

const postalCodes = __webpack_require__(/*! ../controllers/postalCodes */ "./src/controllers/postalCodes.js");

const signup = __webpack_require__(/*! ../controllers/signup */ "./src/controllers/signup.js");

const handleFiles = __webpack_require__(/*! ../controllers/handleFile */ "./src/controllers/handleFile.js");

const multer = __webpack_require__(/*! multer */ "multer");

const suburb = __webpack_require__(/*! ../controllers/suburb */ "./src/controllers/suburb.js");

const pushNotification = __webpack_require__(/*! ../controllers/pushNotification */ "./src/controllers/pushNotification.js");

let upload = multer({
  dest: "./uploads/"
});
router.post("/api/checkAuth", siteAuth.checkAuth);
router.post("/api/isValidToken", siteAuth.isValidToken);
router.post("/api/validateTokenPath", siteAuth.validateTokenPath);
router.post("/api/logOff", siteAuth.logOff);
router.get("/api/auth/fbtoken", siteAuth.getTokenByFacebookId);
router.get("/api/auth/googletoken", siteAuth.getTokenByGoogleId);
router.post("/api/signUp", signup.signUp); //user apis

const userAdmin = __webpack_require__(/*! ../controllers/userAdmin */ "./src/controllers/userAdmin.js");

router.post("/api/user/:userType", userAdmin.createUserByType);
router.get("/api/user/:userType", userAdmin.getUserByType);
router.get("/api/user", userAdmin.getUserInfo);
router.get("/api/userId", userAdmin.getUserById);
router.get("/api/userInfo/favorites", userAdmin.getUserFavs);
router.post("/api/userInfo/addFavorites", userAdmin.addUserFavs);
router.post("/api/userInfo/removeFavorites", userAdmin.removeUserFavs);
router.post("/api/userInfo/addUserPushToken", userAdmin.addUserPushToken);
router.get("/api/userInfo/getUsersByAddress", userAdmin.getUsersByAddress);
router.post("/api/saveGoogleUser", userAdmin.saveGoogleUser);
router.post("/api/saveFacebookUser", userAdmin.saveFacebookUser);
router.post("/api/saveEmailUser", userAdmin.saveEmailUser);
router.post("/api/saveUserBySuburb", userAdmin.saveUserBySuburbId); //logged user APIs

router.get("/api/me/menu", menus.getMenusByUser); //postal codes

router.get("/api/cp/getCPInfo", postalCodes.getPostalCodeInfo); //handle files

router.post("/api/file/upload", upload.any(), handleFiles.uploadFile); //suburb apis

router.post("/api/suburb/approveReject", suburb.approveReject);
router.get("/api/suburb/info", suburb.getSuburbByAdminId);
router.get("/api/suburb/get", suburb.getSuburbById);
router.post("/api/suburb/addSuburbInvite", suburb.addSuburbInvite);
router.get("/api/suburb/getInviteByCode", suburb.getSuburbInvite);
router.get("/api/suburb/getStreets", suburb.getStreets);
router.get("/api/suburb/getStreetNumbers", suburb.getStreetNumbers); //push notifications

router.post("/api/notification/test", pushNotification.sendTestNotification);
router.post("/api/notification/arrive", pushNotification.sendArriveNotification);
module.exports = router;

/***/ }),

/***/ "./src/routes/router.js":
/*!******************************!*\
  !*** ./src/routes/router.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(/*! express */ "express");

const router = express.Router();

const auth = __webpack_require__(/*! ../middleware/auth */ "./src/middleware/auth.js"); //routes


const apiRoutes = __webpack_require__(/*! ./apiRoutes */ "./src/routes/apiRoutes.js");

router.use("/api/*", auth.checkApiAuth);
router.all("/api/*", apiRoutes);
module.exports = router;

/***/ }),

/***/ "./src/server.js":
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */
var app = __webpack_require__(/*! ./app */ "./src/app.js");

var debug = __webpack_require__(/*! debug */ "debug")('rochacoapi:server');

var http = __webpack_require__(/*! http */ "http");
/**
 * Get port from environment and store in Express.
 */


var port = normalizePort(process.env.PORT || '4010');
app.set('port', port);
/**
 * Create HTTP server.
 */

var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port; // handle specific listen errors with friendly messages

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */


function onListening() {
  console.log("running on port", process.env.PORT);
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/***/ }),

/***/ "@sendgrid/mail":
/*!*********************************!*\
  !*** external "@sendgrid/mail" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@sendgrid/mail");

/***/ }),

/***/ "base-64":
/*!**************************!*\
  !*** external "base-64" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("base-64");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcryptjs");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "crypto-js":
/*!****************************!*\
  !*** external "crypto-js" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto-js");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "dropbox-v2-api":
/*!*********************************!*\
  !*** external "dropbox-v2-api" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dropbox-v2-api");

/***/ }),

/***/ "expo-server-sdk":
/*!**********************************!*\
  !*** external "expo-server-sdk" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("expo-server-sdk");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ })

/******/ });
//# sourceMappingURL=app.server.js.map