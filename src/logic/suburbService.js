const Suburb = require("../models/suburb");
const suburbStatus = require("../constants/types").suburbStatus;
const SuburbInvite = require("../models/suburbInvite");
const User = require("../models/user");
const SuburbConfig = require("../models/suburbConfig");
const SuburbStreet = require("../models/suburbStreet");
const ObjectId = require("mongoose").Types.ObjectId;
const suburbData = require("../models/suburbData");

const CryptoJS = require("crypto-js");

var pjson = require("../../package.json");
const { Mongoose } = require("mongoose");

const getSuburbStatus = (statusName) => {
  let status = suburbStatus.filter((st) => st.status === statusName);
  return status[0];
};

const encryption = (data) => {
  if (!data) return "";
  return CryptoJS.AES.encrypt(data, pjson.cryptoKey).toString();
};

const decryption = (data) => {
  if (!data) return "";
  var bytes = CryptoJS.AES.decrypt(data, pjson.cryptoKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const saveSuburb = (suburbObj) => {
  return new Promise((resolve, reject) => {
    Suburb.SaveSuburb(suburbObj).then((sub, err) => {
      if (!err)
        resolve({
          success: true,
          message: "La colonia fue guardada correctamente.",
          id: sub.id,
        });
      else
        reject({
          success: false,
          message:
            err.message || "Ocurrio un error al intentar guardar la colonia.",
        });
    });
  });
};

const suburbAddStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    Suburb.UpdateStatus(id, status).then((sub, err) => {
      if (!err)
        resolve({
          success: true,
          message: "El status de la colonia fue actualizado correctamente.",
        });
      else
        reject({
          success: false,
          message:
            err.message ||
            "Ocurrio un error al intentar actualizar el estatus de la colonia.",
        });
    });
  });
};

const suburbAddStatusByName = (name, postalCode, status) => {
  return new Promise((resolve, reject) => {
    Suburb.UpdateStatusByName(name, postalCode, status).then((sub, err) => {
      if (!err)
        resolve({
          success: true,
          message: "El status de la colonia fue actualizado correctamente.",
        });
      else
        reject({
          success: false,
          message:
            err.message ||
            "Ocurrio un error al intentar actualizar el estatus de la colonia.",
        });
    });
  });
};

const getSuburbByAdminUser = (userId) => {
  return new Promise((resolve, reject) => {
    Suburb.GetSuburbByUserId(userId).then((sub, err) => {
      if (!err) resolve(sub);
      else
        reject({
          success: false,
          message:
            err.message ||
            "Ocurrio un error al intentar obtener la colonia por usuario administrador.",
        });
    });
  });
};

const getSuburbById = (suburbId) => {
  return new Promise((resolve, reject) => {
    Suburb.GetSuburb(suburbId)
      .then((sub, err) => {
        if (!err) resolve(sub);
        else
          reject({
            success: false,
            message:
              err.message || "Ocurrio un error al intentar obtener la colonia.",
          });
      })
      .catch((err) => reject(err));
  });
};

const addSuburbInvite = (suburbId, name, street, streetNumber, userType) => {
  return new Promise((resolve, reject) => {
    let _code =
      Math.random().toString(36).substring(2, 4).toUpperCase() +
      Math.random().toString(36).substring(2, 4).toUpperCase();
    console.log(encryption(street));
    SuburbInvite.SaveSuburbInvite({
      code: _code,
      suburbId,
      name,
      street: encryption(street),
      streetNumber: encryption(streetNumber),
      userType,
    }).then((subInv, err) => {
      if (!err) {
        Suburb.AddSuburbInvite(suburbId, subInv._id.toString()).then(
          (sub, err) => {
            if (!err) resolve(subInv);
            else
              reject({
                success: false,
                message:
                  err.message ||
                  "Ocurrio un error al intentar agregar una invitacion a usuario",
              });
          }
        );
      } else
        reject({
          success: false,
          message:
            err.message ||
            "Ocurrio un error al intentar agregar una invitacion a usuario",
        });
    });
  });
};

const getSuburbInvite = (code) => {
  return new Promise((resolve, reject) => {
    SuburbInvite.GetInviteByCode(code)
      .then((subInvite, err) => {
        if (!err) {
          Suburb.GetSuburbBasicInfo(subInvite.suburbId.toString()).then(
            (suburb, err) => {
              if (!err) {
                const { street, streetNumber, ...props } = subInvite._doc;
                const result = {
                  suburb: {
                    ...suburb,
                  },
                  invite: {
                    street: decryption(street),
                    streetNumber: decryption(streetNumber),
                    ...props,
                  },
                };
                resolve(result);
              } else {
                reject({
                  success: false,
                  message:
                    err.message ||
                    "Ocurrio un error al intentar obtener la invitación",
                });
              }
            }
          );
        } else
          reject({
            success: false,
            message:
              err.message ||
              "Ocurrio un error al intentar obtener la invitación",
          });
      })
      .catch((err) => {
        reject({
          sucess: false,
          message:
            err.message ||
            "Ocurrion un error al intentar obtener la invitación",
        });
      });
  });
};

const saveSuburbConfig = async (suburbId, config) => {
  try {
    let suburbData = await Suburb.GetSuburb(suburbId);
    if (!ObjectId.isValid(suburbData.config)) {
      let saveConfig = await SuburbConfig.SaveConfig(config);
      await Suburb.SaveSuburbConfig(suburbId, saveConfig._id);
      return {
        success: true,
        message: "la configuracion fue agregada con exito.",
        id: saveConfig.id,
      };
    } else {
      let updateConfig = await SuburbConfig.UpdateConfig(
        suburbData.config.toString(),
        config
      );
      return {
        success: true,
        message: "la configuracion fue actualizada con exito.",
      };
    }
  } catch (err) {
    throw err;
  }
};

const getSuburbConfig = async (suburbId) => {
  try {
    return await Suburb.GetSuburbConfig(suburbId);
  } catch (err) {
    throw err;
  }
};

const saveSuburbStreet = async (suburbId, street) => {
  try {
    let suburbData = await Suburb.GetSuburbStreets(suburbId);
    let selectedStreet = suburbData.streets
      ? suburbData.streets.filter(
          (st) => st.street.toLowerCase() === street.street.toLowerCase()
        )
      : [];
    if (selectedStreet.length === 0) {
      let saveStreet = await SuburbStreet.SaveStreet(street);
      await Suburb.SaveSuburbStreet(suburbId, saveStreet._id);
      return {
        success: true,
        message: "la calle fue agregada con exito.",
        id: saveStreet.id,
      };
    } else {
      let updateStreet = await SuburbStreet.UpdateStreet(
        selectedStreet[0]._id,
        street
      );
      return { success: true, message: "la calle fue actualizada con exito." };
    }
  } catch (err) {
    throw err;
  }
};

const getSuburbStreets = async (suburbId) => {
  try {
    return await Suburb.GetSuburbStreets(suburbId);
  } catch (err) {
    throw err;
  }
};

const getUsersBySuburb = async (suburbId) => {
  try {
    return await User.getUsersBySuburb(suburbId);
  } catch (err) {
    throw err;
  }
};

const saveSuburbData = async (data) => {
  try {
    if (data) {
      return await suburbData.Save(data);
    } else {
      return await suburbData.AddAccount(data);
    }
  } catch (error) {
    throw error;
  }
};

const getSuburbData = async (suburbId) => {
  try {
    return await suburbData.GetDataBySuburb(suburbId);
  } catch (error) {
    throw error;
  }
};

const addAccountSuburb = async (account, suburbId) => {
  try {
    const data = await suburbData.GetDataBySuburb(suburbId);
    if (data) {
      return await suburbData.AddAccount(account, suburbId);
    } else {
      return await suburbData.Save({ suburbId, accounts: [account] });
    }
  } catch (error) {
    throw error;
  }
};

const addPhoneSuburb = async (phone, suburbId) => {
  try {
    const data = await suburbData.GetDataBySuburb(suburbId);
    if (data) {
      return await suburbData.AddPhone(phone, suburbId);
    } else {
      return await suburbData.Save({ suburbId, phones: [phone] });
    }
  } catch (error) {
    throw error;
  }
};

const removePhone = async (phoneId, suburbId) => {
  try {
    return await suburbData.RemovePhone(phoneId, suburbId);
  } catch (error) {
    throw error;
  }
};

const removeAccount = async (accountId, suburbId) => {
  try {
    return await suburbData.RemoveAccount(accountId, suburbId);
  } catch (error) {
    throw error;
  }
};

const editMap = async (mapId, suburbId) => {
  try {
    return await suburbData.EditMap(mapId, suburbId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveSuburb,
  suburbAddStatus,
  suburbAddStatusByName,
  getSuburbByAdminUser,
  getSuburbById,
  getSuburbStatus,
  addSuburbInvite,
  getSuburbInvite,
  saveSuburbConfig,
  getSuburbConfig,
  saveSuburbStreet,
  getSuburbStreets,
  getUsersBySuburb,
  saveSuburbData,
  getSuburbData,
  addAccountSuburb,
  addPhoneSuburb,
  removePhone,
  removeAccount,
  editMap,
};
