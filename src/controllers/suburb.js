const suburbService = require("../logic/suburbService");
const addressService = require("../logic/addressService");
const userService = require("../logic/userService");
const userTypes = require("../constants/types").userTypes;
const moment = require("moment");
const ObjectId = require("mongoose").Types.ObjectId;
const validateRecaptcha = require("../logic/auth").validateRecaptcha;

exports.approveReject = async (req, res, next) => {
  try {
    let { suburbId, newStatus, details } = req.body;
    let suburb = await suburbService.getSuburbById(suburbId);
    let status = suburbService.getSuburbStatus(newStatus);
    if (suburb && status) {
      let addStatus = await suburbService.suburbAddStatus(suburbId, {
        ...status,
        details,
        transtime: moment.utc(),
      });
      if (addStatus) {
        if (status.status === "approved")
          await userService.updateUser({
            _id: suburb.userAdmins[0].id,
            userType: userTypes.suburbAdmin,
            transtime: moment.utc(),
          });
        res.status(200).json({
          success: true,
          message: `El estatus ha sido actualizado correctamente, el nuevo estatus es: "${status.status}"`,
        });
      }
    } else
      res.status(400).json({
        success: false,
        message: "El estatus no es valido o la colonia no existe",
      });
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: ex.message || "No se pudo procesar aprobar/rechazar la colonia.",
    });
  }
};

exports.getSuburbByAdminId = (req, res, next) => {
  let userId = req.query.id;
  suburbService.getSuburbByAdminUser(userId).then(
    (result) => {
      res.status("200").json(result);
    },
    (err) => {
      res.status(400).json({
        success: false,
        message:
          err.message || "No se pudo obtener la informacion de la colonia.",
      });
    }
  );
};

exports.getSuburbById = (req, res, next) => {
  let suburbId = req.query.suburbId;
  suburbService.getSuburbById(suburbId).then(
    (result) => {
      res.status(200).json(result);
    },
    (err) => {
      res.status(400).json({
        success: false,
        message: err.message || "no se encontro la colonia",
      });
    }
  );
};

exports.addSuburbInvite = (req, res, next) => {
  let { suburbId, name, street, streetNumber, userType } = req.body;
  suburbService
    .addSuburbInvite(suburbId, name, street, streetNumber, userType)
    .then(
      (result) => {
        res.status(200).json(result);
      },
      (err) => {
        res.status(500).json({
          success: false,
          message:
            err.message || "No se pudo generar la invitacion para el usuario.",
        });
      }
    );
};

exports.getSuburbInvite = async (req, res, next) => {
  try {
    let { code, captchaToken } = req.query;
    let invite = await suburbService.getSuburbInvite(code);
    let validCaptcha = await validateRecaptcha(captchaToken);
    if (validCaptcha) {
      res.status(200).json(invite);
    } else res.status(401).json({ success: false, message: "token invalido" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "No se pudo obtener la invitacion.",
    });
  }
};

exports.getStreets = (req, res) => {
  let suburbId = req.query.suburbId;
  if (suburbId) {
    userService.getUsersBySuburb(suburbId).then(
      (users) => {
        let streets = users.map((usr) => usr.street);
        const distinctStreets = [...new Set(streets)];
        res
          .status(200)
          .json(
            distinctStreets
              .filter((u) => typeof u !== "undefined")
              .map((s) => ({ street: s }))
          );
      },
      (err) => {
        res.status(500).json({
          success: false,
          message:
            err.message ||
            "No se pudieron obtener las calles del fraccionamiento",
        });
      }
    );
  } else
    res.status(400).json({
      success: false,
      message: "Por favor indique el fraccionamiento.",
    });
};

exports.getStreetNumbers = (req, res) => {
  let { suburbId, street } = req.query;
  if (suburbId) {
    userService.getUsersBySuburbStreet(suburbId, street).then(
      (users) => {
        let streetNumbers = users.map((usr) => usr.streetNumber);
        const distinctStreetNumbers = [...new Set(streetNumbers)];
        res
          .status(200)
          .json(
            distinctStreetNumbers
              .filter((u) => typeof u !== "undefined")
              .map((s) => ({ streetNumber: s }))
          );
      },
      (err) => {
        res.status(500).json({
          success: false,
          message:
            err.message || "No se pudieron obtener los numeros de la calle",
        });
      }
    );
  } else
    res.status(400).json({
      success: false,
      message: "Por favor indique el fraccionamiento.",
    });
};

exports.saveSuburbConfig = (req, res) => {
  let { suburbId, config } = req.body;
  if (ObjectId.isValid(suburbId)) {
    suburbService
      .saveSuburbConfig(suburbId, config)
      .then((sub) => {
        res.status(200).json({
          success: true,
          message:
            "La configuración del fraccionamiento fue actualizada correctamente.",
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: err.message || "No se pudo actualizar la configuracion",
        });
      });
  } else
    res.status(400).json({
      success: false,
      message: "Por favor indique el fraccionamiento.",
    });
};

exports.getSuburbConfig = (req, res) => {
  let { suburbId } = req.query;
  if (ObjectId.isValid(suburbId)) {
    suburbService
      .getSuburbConfig(suburbId)
      .then((config) => {
        res.status(200).json({ ...config });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: err.message || "No se pudo obtener la configuracion",
        });
      });
  } else
    res.status(400).json({
      success: false,
      message: "Por favor indique el fraccionamiento.",
    });
};

exports.saveSuburbStreet = async (req, res) => {
  try {
    let { suburbId, street } = req.body;
    if (ObjectId.isValid(suburbId)) {
      let sub = await addressService.saveSuburbStreet(suburbId, street);

      res.status(200).json({
        success: true,
        message: "La calle fue guardada correctamente.",
      });
    } else
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "No se pudo guardar la calle",
    });
  }
};

exports.getSuburbStreets = async (req, res) => {
  try {
    let { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      let streets = await addressService.getSuburbStreets(suburbId);
      res.status(200).json({ ...streets });
    } else
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        err.message || "No se pudieron obtener las calles del fraccionamiento",
    });
  }
};

exports.getUsersBySuburb = async (req, res) => {
  try {
    let { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      let users = await suburbService.getUsersBySuburb(suburbId);
      res.status(200).json(users);
    } else
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to get the users.",
    });
  }
};

exports.migrateAddresses = async (req, res) => {
  try {
    let { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      let test = await addressService.migrateAddresses(suburbId);
      //let test = await addressService.getSuburbStreets(suburbId);
      res.status(200).json(test);
    } else
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to get the users.",
    });
  }
};

exports.getAddressesBySuburbId = async (req, res) => {
  try {
    let { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      let test = await addressService.getAddressesBySuburbId(suburbId);
      res.status(200).json(test);
    } else
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to get the users.",
    });
  }
};

exports.getAddressesWithUsersStates = async (req, res) => {
  try {
    const { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      const addresses = await addressService.getAddressesBySuburbId(suburbId);
      const users = await userService.getUsersBySuburb(suburbId);

      const addressesInfo = addresses.map((a) => {
        let usersAddress = users.filter((u) =>
          u.addressId ? u.addressId.toString() === a._id.toString() : false
        );
        return {
          address: { ...a },
          users: usersAddress.map((ua) => ({
            id: ua._id.toString(),
            name: ua.name,
            active: ua.active,
            limited: typeof ua.limited !== "undefined" ? ua.limited : false,
          })),
        };
      });

      res.status(200).json(addressesInfo);
    } else
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to get the users.",
    });
  }
};

exports.setLimitedUsersByAddress = async (req, res) => {
  try {
    const { suburbId, addressId, limited } = req.body;
    if (ObjectId.isValid(suburbId)) {
      const users = await userService.getUsersByAddressId(suburbId, addressId);

      let proms = [];
      users.forEach((u) => {
        proms.push(userService.changeLimited(u._id.toString(), limited));
      });
      await Promise.all(proms);
      res.status(200).json(users.map((u) => ({ ...u, limited })));
    } else
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "An unknown error occurs while trying to update the users.",
    });
  }
};

exports.getSuburbAutomationInfo = async (req, res) => {
  try {
    const { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      const addresses = await addressService.getAddressesBySuburbId(suburbId);
      const users = await userService.getUsersBySuburb(suburbId);
      const addressesInfo = addresses.map((a) => {
        let usersAddress = users.filter((u) =>
          u.addressId ? u.addressId.toString() === a._id.toString() : false
        );
        return {
          address: { ...a },
          status: {
            active: usersAddress.some((u) => u.active),
            limited: usersAddress
              .filter((u) => u.active)
              .some((u) =>
                typeof u.limited !== "undefined" ? u.limited : false
              ),
            rfids: usersAddress.map((u) => u.rfids || []).flat(),
          },
        };
      });

      res.status(200).json(addressesInfo);
    } else {
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "An unknown error occurs while trying to get automation info.",
    });
  }
};
