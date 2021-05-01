const router = require("express").Router();

const siteAuth = require("../controllers/siteAuth");

const menus = require("../controllers/menus");

const postalCodes = require("../controllers/postalCodes");

const signup = require("../controllers/signup");

const handleFiles = require("../controllers/handleFile");

const multer = require("multer");

const suburb = require("../controllers/suburb");

const pushNotification = require("../controllers/pushNotification");

const analytics = require("../controllers/analytics");

let upload = multer({ dest: "./uploads/" });

router.post("/api/checkAuth", siteAuth.checkAuth);

router.post("/api/isValidToken", siteAuth.isValidToken);

router.post("/api/validateTokenPath", siteAuth.validateTokenPath);

router.post("/api/logOff", siteAuth.logOff);

router.get("/api/auth/fbtoken", siteAuth.getTokenByFacebookId);

router.get("/api/auth/googletoken", siteAuth.getTokenByGoogleId);

router.get("/api/auth/appletoken", siteAuth.getTokenByAppleId);

router.post("/api/signUp", signup.signUp);

//user apis
const userAdmin = require("../controllers/userAdmin");

router.post("/api/user/:userType", userAdmin.createUserByType);
router.get("/api/user/:userType", userAdmin.getUserByType);
router.get("/api/user", userAdmin.getUserInfo);
router.get("/api/userId", userAdmin.getUserById);
router.get("/api/userInfo/favorites", userAdmin.getUserFavs);
router.post("/api/userInfo/addFavorites", userAdmin.addUserFavs);
router.post("/api/userInfo/removeFavorites", userAdmin.removeUserFavs);
router.post("/api/userInfo/addUserPushToken", userAdmin.addUserPushToken);
router.get("/api/userInfo/getUsersByAddress", userAdmin.getUsersByAddress);
router.post("/api/userInfo/updatePicture", userAdmin.updateUserPicture);
router.get("/api/userInfo/getSignedUserTerms", userAdmin.getSignedUserTerms);
router.get("/api/userInfo/isPasswordTemp", userAdmin.isPasswordTemp);

router.post("/api/userInfo/updatePassword", userAdmin.updatePassword);
router.post("/api/userInfo/signUserTerms", userAdmin.signUserTerms);
router.post("/api/saveGoogleUser", userAdmin.saveGoogleUser);
router.post("/api/saveFacebookUser", userAdmin.saveFacebookUser);
router.post("/api/saveAppleUser", userAdmin.saveAppleUser);
router.post("/api/saveEmailUser", userAdmin.saveEmailUser);
router.post("/api/saveUserBySuburb", userAdmin.saveUserBySuburbId);
router.post("/api/deleteUserInfo", userAdmin.deleteUserInfo);
router.post("/api/generateTempPassword", userAdmin.generateTempPassword);
//logged user APIs
router.get("/api/me/menu", menus.getMenusByUser);

//postal codes
router.get("/api/cp/getCPInfo", postalCodes.getPostalCodeInfo);

//handle files
router.post("/api/file/upload", upload.any(), handleFiles.uploadFile);

//suburb apis
router.post("/api/suburb/approveReject", suburb.approveReject);

router.get("/api/suburb/info", suburb.getSuburbByAdminId);

router.get("/api/suburb/get", suburb.getSuburbById);

router.post("/api/suburb/addSuburbInvite", suburb.addSuburbInvite);

router.get("/api/suburb/getInviteByCode", suburb.getSuburbInvite);

router.get("/api/suburb/getStreets", suburb.getStreets);

router.get("/api/suburb/getStreetNumbers", suburb.getStreetNumbers);

router.post("/api/suburb/updateConfig", suburb.saveSuburbConfig);

router.get("/api/suburb/getConfig", suburb.getSuburbConfig);

router.post("/api/suburb/saveStreet", suburb.saveSuburbStreet);

router.get("/api/suburb/getAllStreets", suburb.getSuburbStreets);

//push notifications
router.post("/api/notification/test", pushNotification.sendTestNotification);
router.post(
  "/api/notification/arrive",
  pushNotification.sendArriveNotification
);

router.get("/api/analytics/GetVisits", analytics.getSuburbVisits);

module.exports = router;
