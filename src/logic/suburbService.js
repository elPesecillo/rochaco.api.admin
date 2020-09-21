const Suburb = require("../models/suburb");
const suburbStatus = require("../constants/types").suburbStatus;
const SuburbInvite = require("../models/suburbInvite");

const getSuburbStatus = (statusName) => {
  let status = suburbStatus.filter((st) => st.status === statusName);
  return status[0];
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

const addSuburbInvite = (suburbId, name, street, streetNumber) => {
  return new Promise((resolve, reject) => {
    let _code =
      Math.random().toString(36).substring(2, 5).toUpperCase() +
      Math.random().toString(36).substring(2, 5).toUpperCase();
    SuburbInvite.SaveSuburbInvite({
      code: _code,
      suburbId,
      name,
      street,
      streetNumber,
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

module.exports = {
  saveSuburb,
  suburbAddStatus,
  suburbAddStatusByName,
  getSuburbByAdminUser,
  getSuburbById,
  getSuburbStatus,
  addSuburbInvite,
};
