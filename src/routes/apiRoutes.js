const router = require("express").Router();

const multer = require("multer");
const fs = require("fs");
const siteAuth = require("../controllers/siteAuth");

const menus = require("../controllers/menus");

const postalCodes = require("../controllers/postalCodes");

const signup = require("../controllers/signup");

const handleFiles = require("../controllers/handleFile");

const suburb = require("../controllers/suburb");

const pushNotification = require("../controllers/pushNotification");

const analytics = require("../controllers/analytics");

const vision = require("../controllers/vision");

const notification = require("../controllers/notification");

const debt = require("../controllers/Debt");

const upload = multer({ dest: "./uploads/" });

const upload2 = multer();

router.get("/api/healthCheck", (_req, res) => {
  const rev = fs.readFileSync(".git/HEAD").toString().trim();
  let hash;
  if (rev.indexOf(":") === -1) {
    hash = rev;
  } else {
    hash = fs
      .readFileSync(`.git/${rev.substring(5)}`)
      .toString()
      .trim();
  }
  res.status(200).json({ hash });
});

router.post("/api/checkAuth", siteAuth.checkAuth);
router.post("/api/isValidToken", siteAuth.isValidToken);
router.post("/api/validateTokenPath", siteAuth.validateTokenPath);
router.post("/api/logOff", siteAuth.logOff);
router.get("/api/auth/fbtoken", siteAuth.getTokenByFacebookId);
router.get("/api/auth/googletoken", siteAuth.getTokenByGoogleId);
router.get("/api/auth/appletoken", siteAuth.getTokenByAppleId);
router.post("/api/signUp", signup.signUp);
router.post("/api/auth/internal/auth", siteAuth.internalAuth);

// user apis
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
router.post("/api/userInfo/updateType", userAdmin.updateUserType);
router.post("/api/userInfo/enableDisable", userAdmin.enableDisableUser);
router.get("/api/userInfo/getIfUserIsLimited", userAdmin.getIfUserIsLimited);
router.post("/api/userInfo/changeLimited", userAdmin.changeLimited);

router.post("/api/userInfo/updatePassword", userAdmin.updatePassword);
router.post(
  "/api/userInfo/updateCurrentPassword",
  userAdmin.updateCurrentPassword
);
router.post("/api/userInfo/signUserTerms", userAdmin.signUserTerms);
router.post("/api/userInfo/addUserRfid", userAdmin.addUserRfid);
router.post("/api/userInfo/removeUserRfid", userAdmin.removeUserRfid);
router.post("/api/saveGoogleUser", userAdmin.saveGoogleUser);
router.post("/api/saveFacebookUser", userAdmin.saveFacebookUser);
router.post("/api/saveAppleUser", userAdmin.saveAppleUser);
router.post("/api/saveEmailUser", userAdmin.saveEmailUser);
router.post("/api/saveUserBySuburb", userAdmin.saveUserBySuburbId);
router.post("/api/deleteUserInfo", userAdmin.deleteUserInfo);
router.post("/api/generateTempPassword", userAdmin.generateTempPassword);
// logged user APIs
router.get("/api/me/menu", menus.getMenusByUser);

// postal codes
router.get("/api/cp/getCPInfo", postalCodes.getPostalCodeInfo);

// handle files
router.post("/api/file/upload", upload.any(), handleFiles.uploadFile);

// suburb apis
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
router.get("/api/suburb/getUsers", suburb.getUsersBySuburb);
router.get("/api/suburb/migrateAddresses", suburb.migrateAddresses);
router.get("/api/suburb/getAddresses", suburb.getAddressesBySuburbId);
router.get("/api/suburb/getAddressesBySuburbId", suburb.getAddressesBySuburbId);
router.get("/api/suburb/getSuburbData", suburb.getSuburbData);
router.get(
  "/api/suburb/getAddressesWithUsersStates",
  suburb.getAddressesWithUsersStates
);
router.post(
  "/api/suburb/setLimitedUsersByAddress",
  suburb.setLimitedUsersByAddress
);
router.get(
  "/api/suburb/getSuburbAutomationInfo",
  suburb.getSuburbAutomationInfo
);
router.get("/api/suburb/getRFs", suburb.GetRFIDs);
router.post("/api/suburb/setRFs", suburb.SetRFIDs);
router.get("/api/suburb/getAddress", suburb.GetAddress);
router.post("/api/suburb/addRFId", suburb.AddRFId);
router.patch("/api/suburb/updateRFId", suburb.UpdateRFId);
router.delete("/api/suburb/removeRFId", suburb.RemoveRFId);

// suburb data
router.post("/api/suburb/data", suburb.SaveSuburbData);
router.get("/api/suburb/data", suburb.GetSuburbData);
router.post("/api/suburb/addAccount", suburb.AddAccount);
router.post("/api/suburb/updateAccount", suburb.UpdateAccount);
router.post("/api/suburb/addPhone", suburb.AddPhone);
router.post("/api/suburb/updatePhone", suburb.UpdatePhone);
router.post("/api/suburb/editMap", suburb.EditMap);
router.delete("/api/suburb/removePhone", suburb.RemovePhone);
router.delete("/api/suburb/removeAccount", suburb.RemoveAccount);

// push notifications
router.post("/api/notification/test", pushNotification.sendTestNotification);
router.post(
  "/api/notification/arrive",
  pushNotification.sendArriveNotification
);
router.post(
  "/api/notification/newPayment",
  pushNotification.sendUploadPaymentNotification
);
router.post(
  "/api/notification/approveRejectPayment",
  pushNotification.sendApproveRejectedPaymentNotification
);
router.post(
  "/api/notification/newReservation",
  pushNotification.sendNewSpaceReservationNotification
);
router.post(
  "/api/notification/approveRejectReservation",
  pushNotification.sendApproveRejectedReservationNotification
);
router.post(
  "/api/notification/newSurvey",
  pushNotification.sendNewSurveyNotification
);

// internal notifications apis
router.post("/api/alert/save", upload2.any(), notification.Save);
router.delete("/api/alert/delete", notification.Delete);
router.get("/api/alert/getById", notification.GetById);
router.get("/api/alert/getBySuburbId", notification.GetBySuburbId);
router.get("/api/alert/getByUserId", notification.GetByUserId);

// analytics apis

router.get("/api/analytics/GetVisits", analytics.getSuburbVisits);
router.post("/api/vision/ocr", upload2.any(), vision.processOCR);

// files apis
const blobFilesService = require("../controllers/blobFiles");

router.post("/api/blob/uploadFile", blobFilesService.uploadBlobs);

// debt apis
router.get("/api/debt/getDebtConfigBySuburbId", debt.GetDebtConfigBySuburbId);
router.get("/api/debt/getDebtConfigById", debt.GetDebtConfigById);
router.post("/api/debt/saveDebtConfig", debt.SaveDebtConfig);
router.post("/api/debt/updateDebtConfig", debt.UpdateDebtConfig);
router.delete("/api/debt/deleteDebtConfig", debt.DeactivateDebtConfig);
router.get(
  "/api/debt/getDebtAssignmentsByDebtConfigId",
  debt.GetDebtAssignmentsByDebtConfigId
);
router.post("/api/debt/updateDebtAssignments", debt.UpdateDebtAssignments);
router.post("/api/debt/applyDebtsToAddresses", debt.ApplyDebtsToAddresses);
router.get(
  "/api/debt/getDebtsBySuburbPaginated",
  debt.GetDebtsBySuburbPaginated
);
router.get("/api/debt/getDebtsByAddressId", debt.GetDebtsByAddressId);
router.get(
  "/api/debt/getByAddressPaginated",
  debt.GetDebtsByAddressIdPaginated
);
router.get(
  "/api/debt/getGroupedBySuburbAndAddress",
  debt.GetDebtsGroupedBySuburbAndAddress
);
router.get("/api/debt/getDebtPaymentBySuburb", debt.GetDebtPaymentBySuburb);
router.post("/api/debt/saveDebtPayment", upload2.any(), debt.SaveDebtPayment);
router.get("/api/debt/getDebtPaymentById", debt.GetDebtPaymentById);
router.post("/api/debt/acceptDebtPayment", debt.AcceptDebtPayment);
router.post("/api/debt/rejectDebtPayment", debt.RejectDebtPayment);
router.post("/api/debt/editDebtPayment", upload2.any(), debt.EditDebtPayment);
router.post("/api/debt/adminEditDebtPayment", debt.AdminEditDebtPayment);

// partners apis
router.get("/api/partner/getRFs", suburb.GetRFIDs);
router.post("/api/partner/setRFs", suburb.SetRFIDs);

module.exports = router;
