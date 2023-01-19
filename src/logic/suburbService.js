/* eslint-disable prefer-promise-reject-errors */
const { ObjectId } = require("mongoose").Types;
const CryptoJS = require("crypto-js");
const Suburb = require("../models/suburb");
require("mongoose");

const { suburbStatus } = require("../constants/types");
const SuburbInvite = require("../models/suburbInvite");
const User = require("../models/user");
const SuburbConfig = require("../models/suburbConfig");
const SuburbStreet = require("../models/suburbStreet");

const pjson = require("../../package.json");

const getSuburbStatus = (statusName) => {
  const status = suburbStatus.filter((st) => st.status === statusName);
  return status[0];
};

const encryption = (data) => {
  if (!data) return "";
  return CryptoJS.AES.encrypt(data, pjson.cryptoKey).toString();
};

const decryption = (data) => {
  if (!data) return "";
  const bytes = CryptoJS.AES.decrypt(data, pjson.cryptoKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const saveSuburb = (suburbObj) =>
  new Promise((resolve, reject) => {
    Suburb.SaveSuburb(suburbObj).then((sub, err) => {
      if (!err) {
        resolve({
          success: true,
          message: "La colonia fue guardada correctamente.",
          id: sub.id,
        });
      } else {
        reject({
          success: false,
          message:
            err.message || "Ocurrio un error al intentar guardar la colonia.",
        });
      }
    });
  });

const suburbAddStatus = (id, status) =>
  new Promise((resolve, reject) => {
    Suburb.UpdateStatus(id, status).then((sub, err) => {
      if (!err) {
        resolve({
          success: true,
          message: "El status de la colonia fue actualizado correctamente.",
        });
      } else {
        reject({
          success: false,
          message:
            err.message ||
            "Ocurrio un error al intentar actualizar el estatus de la colonia.",
        });
      }
    });
  });

const suburbAddStatusByName = (name, postalCode, status) =>
  new Promise((resolve, reject) => {
    Suburb.UpdateStatusByName(name, postalCode, status).then((sub, err) => {
      if (!err) {
        resolve({
          success: true,
          message: "El status de la colonia fue actualizado correctamente.",
        });
      } else {
        reject({
          success: false,
          message:
            err.message ||
            "Ocurrio un error al intentar actualizar el estatus de la colonia.",
        });
      }
    });
  });

const getSuburbByAdminUser = (userId) =>
  new Promise((resolve, reject) => {
    Suburb.GetSuburbByUserId(userId).then((sub, err) => {
      if (!err) resolve(sub);
      else {
        reject({
          success: false,
          message:
            err.message ||
            "Ocurrio un error al intentar obtener la colonia por usuario administrador.",
        });
      }
    });
  });

const getSuburbById = (suburbId) =>
  new Promise((resolve, reject) => {
    Suburb.GetSuburb(suburbId)
      .then((sub, err) => {
        if (!err) resolve(sub);
        else {
          reject({
            success: false,
            message:
              err.message || "Ocurrio un error al intentar obtener la colonia.",
          });
        }
      })
      .catch((err) => reject(err));
  });

const addSuburbInvite = (suburbId, name, street, streetNumber, userType) =>
  new Promise((resolve, reject) => {
    const _code =
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
          (sub, error) => {
            if (!error) resolve(subInv);
            else {
              reject({
                success: false,
                message:
                  error.message ||
                  "Ocurrio un error al intentar agregar una invitacion a usuario",
              });
            }
          }
        );
      } else {
        reject({
          success: false,
          message:
            err.message ||
            "Ocurrio un error al intentar agregar una invitacion a usuario",
        });
      }
    });
  });

const getSuburbInvite = (code) =>
  new Promise((resolve, reject) => {
    SuburbInvite.GetInviteByCode(code)
      .then((subInvite, err) => {
        if (!err) {
          Suburb.GetSuburbBasicInfo(subInvite.suburbId.toString()).then(
            (suburb, error) => {
              if (!error) {
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
                    error.message ||
                    "Ocurrio un error al intentar obtener la invitación",
                });
              }
            }
          );
        } else {
          reject({
            success: false,
            message:
              err.message ||
              "Ocurrio un error al intentar obtener la invitación",
          });
        }
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

const saveSuburbConfig = async (suburbId, config) => {
  try {
    const suburbData = await Suburb.GetSuburb(suburbId);
    if (!ObjectId.isValid(suburbData.config)) {
      const saveConfig = await SuburbConfig.SaveConfig(config);
      await Suburb.SaveSuburbConfig(suburbId, saveConfig._id);
      return {
        success: true,
        message: "la configuracion fue agregada con exito.",
        id: saveConfig.id,
      };
    }
    await SuburbConfig.UpdateConfig(suburbData.config.toString(), config);
    return {
      success: true,
      message: "la configuracion fue actualizada con exito.",
    };
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
    const suburbData = await Suburb.GetSuburbStreets(suburbId);
    const selectedStreet = suburbData.streets
      ? suburbData.streets.filter(
        (st) => st.street.toLowerCase() === street.street.toLowerCase()
      )
      : [];
    if (selectedStreet.length === 0) {
      const saveStreet = await SuburbStreet.SaveStreet(street);
      await Suburb.SaveSuburbStreet(suburbId, saveStreet._id);
      return {
        success: true,
        message: "la calle fue agregada con exito.",
        id: saveStreet.id,
      };
    }
    await SuburbStreet.UpdateStreet(selectedStreet[0]._id, street);
    return { success: true, message: "la calle fue actualizada con exito." };
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

const GetAllSuburbs = async () => {
  const suburbs = await Suburb.GetAllSuburbs();
  return suburbs;
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
  GetAllSuburbs,
};
