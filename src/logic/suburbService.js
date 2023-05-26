/* eslint-disable indent */
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
const suburbData = require("../models/suburbData");
const Address = require("../models/Address");

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
      Math.random().toString(36).substring(2, 5).toUpperCase() +
      Math.random().toString(36).substring(2, 4).toUpperCase();
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
    const suburb = await Suburb.GetSuburb(suburbId);
    if (!ObjectId.isValid(suburb.config)) {
      const saveConfig = await SuburbConfig.SaveConfig(config);
      await Suburb.SaveSuburbConfig(suburbId, saveConfig._id);
      return {
        success: true,
        message: "la configuracion fue agregada con exito.",
        id: saveConfig.id,
      };
    }
    await SuburbConfig.UpdateConfig(suburb.config.toString(), config);
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
    const suburbStreets = await Suburb.GetSuburbStreets(suburbId);
    const selectedStreet = suburbStreets.streets
      ? suburbStreets.streets.filter(
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

const SaveSuburbData = async (data) => {
  try {
    if (data) {
      return await suburbData.Save(data);
    }
    return await suburbData.AddAccount(data);
  } catch (error) {
    throw error;
  }
};

const GetSuburbData = async (suburbId) => {
  try {
    return await suburbData.GetDataBySuburb(suburbId);
  } catch (error) {
    throw error;
  }
};

const AddAccountSuburb = async (account, suburbId) => {
  try {
    const data = await suburbData.GetDataBySuburb(suburbId);
    if (data) {
      const get = await suburbData.AddAccount(account, suburbId);
      return get.accounts[get.accounts.length - 1];
    }
    const add = await suburbData.Save({ suburbId, accounts: [account] });
    return add.accounts[add.accounts.length - 1];
  } catch (error) {
    throw error;
  }
};

const UpdateAccountSuburb = async (account, suburbId) => {
  try {
    const get = await suburbData.UpdateAccount(account, suburbId);
    return get.accounts[get.accounts.length - 1];
  } catch (error) {
    throw error;
  }
};

const AddPhoneSuburb = async (phone, suburbId) => {
  try {
    const dataSuburb = await suburbData.GetDataBySuburb(suburbId);
    if (dataSuburb) {
      const get = await suburbData.AddPhone(phone, suburbId);
      return get.phones[get.phones.length - 1];
    }

    const add = await suburbData.Save({ suburbId, phones: [phone] });
    return add.phones[add.phones.length - 1];
  } catch (error) {
    throw error;
  }
};

const UpdatePhoneSuburb = async (phone, suburbId) => {
  try {
    const get = await suburbData.UpdatePhone(phone, suburbId);
    return get.phones[get.phones.length - 1];
  } catch (error) {
    throw error;
  }
};

const RemovePhone = async (phoneId, suburbId) => {
  try {
    return await suburbData.RemovePhone(phoneId, suburbId);
  } catch (error) {
    throw error;
  }
};

const RemoveAccount = async (accountId, suburbId) => {
  try {
    return await suburbData.RemoveAccount(accountId, suburbId);
  } catch (error) {
    throw error;
  }
};

const EditMap = async (mapUrl, suburbId) => {
  try {
    const get = (await suburbData.EditMap(mapUrl, suburbId)).toObject();
    return get.mapUrl;
  } catch (error) {
    throw error;
  }
};

const GetAddressRFIDs = async (street, streetNumber, suburbId) => {
  const selectedAddress = await Address.GetAddressByNameNumberAndSuburbId(
    street,
    streetNumber,
    suburbId
  );
  if (selectedAddress) {
    return selectedAddress.rfIds || [];
  }
  return [];
};

const SetAddressRFIDs = async (street, streetNumber, suburbId, rfIds) => {
  const selectedAddress = await Address.GetAddressByNameNumberAndSuburbId(
    street,
    streetNumber,
    suburbId
  );
  if (selectedAddress) {
    const rfsToAdd = rfIds.filter((rfId) => rfId.add);
    const rfsToRemove = rfIds.filter((rfId) => rfId.remove);
    const addPromise = rfsToAdd.map((rfId) =>
      Address.AddAddressRFId(selectedAddress._id.toString(), rfId.rfId)
    );
    const added = await Promise.all(addPromise);
    const removePromise = rfsToRemove.map((rfId) =>
      Address.RemoveAddressRFId(selectedAddress._id.toString(), rfId.rfId)
    );
    const removed = await Promise.all(removePromise);
    return [...added, ...removed];
  }
  return [];
};

const AddRFId = async (addressId, rfId) =>
  Address.AddRFIdToAddress(addressId, rfId);

const UpdateRFId = async (addressId, rfId, newRfId) =>
  Address.UpdateRFIdToAddress(addressId, rfId, newRfId);

const RemoveRFId = async (addressId, rfId) =>
  Address.RemoveRFIdFromAddress(addressId, rfId);

const GetAddress = async (addressId) =>
  Address.GetAddressByAddressId(addressId);

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
  SaveSuburbData,
  GetSuburbData,
  AddAccountSuburb,
  UpdateAccountSuburb,
  AddPhoneSuburb,
  UpdatePhoneSuburb,
  RemovePhone,
  RemoveAccount,
  EditMap,
  GetAddressRFIDs,
  SetAddressRFIDs,
  AddRFId,
  UpdateRFId,
  RemoveRFId,
  GetAddress,
};
