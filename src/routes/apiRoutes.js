const router = require("express").Router();

const siteAuth = require("../controllers/siteAuth");

const menus = require("../controllers/menus");

const postalCodes = require("../controllers/postalCodes");

const signup = require("../controllers/signup");

const handleFiles = require("../controllers/handleFile");

const multer = require("multer");

const suburb = require("../controllers/suburb");

let upload = multer({ dest: "./uploads/" });

router.post("/api/checkAuth", siteAuth.checkAuth);

router.post("/api/isValidToken", siteAuth.isValidToken);

router.post("/api/validateTokenPath", siteAuth.validateTokenPath);

router.post("/api/logOff", siteAuth.logOff);

router.get("/api/auth/fbtoken", siteAuth.getTokenByFacebookId);

router.get("/api/auth/googletoken", siteAuth.getTokenByGoogleId);

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

router.post("/api/saveGoogleUser", userAdmin.saveGoogleUser);
router.post("/api/saveFacebookUser", userAdmin.saveFacebookUser);
router.post("/api/saveEmailUser", userAdmin.saveEmailUser);
router.post("/api/saveUserBySuburb", userAdmin.saveUserBySuburbId);

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

module.exports = router;
