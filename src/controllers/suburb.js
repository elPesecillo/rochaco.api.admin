const moment = require("moment");
const { ObjectId } = require("mongoose").Types;
const suburbService = require("../logic/suburbService");
const addressService = require("../logic/addressService");
const userService = require("../logic/userService");
const { userTypes } = require("../constants/types");
const { validateRecaptcha } = require("../logic/auth");

exports.approveReject = async (req, res) => {
  try {
    const { suburbId, newStatus, details } = req.body;
    const suburb = await suburbService.getSuburbById(suburbId);
    const status = suburbService.getSuburbStatus(newStatus);
    if (suburb && status) {
      const addStatus = await suburbService.suburbAddStatus(suburbId, {
        ...status,
        details,
        transtime: moment.utc(),
      });
      if (addStatus) {
        if (status.status === "approved") {
          await userService.updateUser({
            _id: suburb.userAdmins[0].id,
            userType: userTypes.suburbAdmin,
            transtime: moment.utc(),
          });
        }
        res.status(200).json({
          success: true,
          message: `El estatus ha sido actualizado correctamente, el nuevo estatus es: "${status.status}"`,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "El estatus no es valido o la colonia no existe",
      });
    }
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: ex.message || "No se pudo procesar aprobar/rechazar la colonia.",
    });
  }
};

exports.getSuburbByAdminId = (req, res) => {
  const userId = req.query.id;
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

exports.getSuburbById = (req, res) => {
  const { suburbId } = req.query;
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

exports.addSuburbInvite = (req, res) => {
  const { suburbId, name, street, streetNumber, userType } = req.body;
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

exports.getSuburbInvite = async (req, res) => {
  try {
    const { code, captchaToken } = req.query;
    const invite = await suburbService.getSuburbInvite(code);
    const validCaptcha = await validateRecaptcha(captchaToken);
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
  const { suburbId } = req.query;
  if (suburbId) {
    userService.getUsersBySuburb(suburbId).then(
      (users) => {
        const streets = users.map((usr) => usr.street);
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
  } else {
    res.status(400).json({
      success: false,
      message: "Por favor indique el fraccionamiento.",
    });
  }
};

exports.getStreetNumbers = (req, res) => {
  const { suburbId, street } = req.query;
  if (suburbId) {
    userService.getUsersBySuburbStreet(suburbId, street).then(
      (users) => {
        const streetNumbers = users.map((usr) => usr.streetNumber);
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
  } else {
    res.status(400).json({
      success: false,
      message: "Por favor indique el fraccionamiento.",
    });
  }
};

exports.saveSuburbConfig = (req, res) => {
  const { suburbId, config } = req.body;
  if (ObjectId.isValid(suburbId)) {
    suburbService
      .saveSuburbConfig(suburbId, config)
      .then(() => {
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
  } else {
    res.status(400).json({
      success: false,
      message: "Por favor indique el fraccionamiento.",
    });
  }
};

exports.getSuburbConfig = (req, res) => {
  const { suburbId } = req.query;
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
  } else {
    res.status(400).json({
      success: false,
      message: "Por favor indique el fraccionamiento.",
    });
  }
};

exports.saveSuburbStreet = async (req, res) => {
  try {
    const { suburbId, street } = req.body;
    if (ObjectId.isValid(suburbId)) {
      const addresses = await addressService.saveSuburbStreet(suburbId, street);

      res.status(200).json(addresses);
    } else {
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "No se pudo guardar la calle",
    });
  }
};

exports.getSuburbStreets = async (req, res) => {
  try {
    const { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      const streets = await addressService.getSuburbStreets(suburbId);
      res.status(200).json({ ...streets });
    } else {
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
    }
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
    const { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      const users = await suburbService.getUsersBySuburb(suburbId);
      res.status(200).json(users);
    } else {
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to get the users.",
    });
  }
};

exports.migrateAddresses = async (req, res) => {
  try {
    const { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      const test = await addressService.migrateAddresses(suburbId);
      // let test = await addressService.getSuburbStreets(suburbId);
      res.status(200).json(test);
    } else {
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to get the users.",
    });
  }
};

exports.getAddressesBySuburbId = async (req, res) => {
  try {
    const { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      const test = await addressService.getAddressesBySuburbId(suburbId);
      res.status(200).json(test);
    } else {
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
    }
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
        const usersAddress = users.filter((u) =>
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
    } else {
      res.status(400).json({
        success: false,
        message: "Por favor indique el fraccionamiento.",
      });
    }
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

      const proms = [];
      users.forEach((u) => {
        proms.push(userService.changeLimited(u._id.toString(), limited));
      });
      await Promise.all(proms);
      res.status(200).json(users.map((u) => ({ ...u, limited })));
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
        "An unknown error occurs while trying to update the users.",
    });
  }
};

exports.SaveSuburbData = async (req, res) => {
  try {
    const { accounts, phones, suburbId, mapUrl } = req.body;
    const result = await suburbService.SaveSuburbData({
      accounts,
      phones,
      suburbId,
      mapUrl,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "An unknown error occurs while trying to save suburb data.",
    });
  }
};

exports.GetSuburbData = async (req, res) => {
  try {
    const { suburbId } = req.query;
    const result = await suburbService.GetSuburbData(suburbId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "An unknown error occurs while trying to get suburb data.",
    });
  }
};

exports.AddAccount = async (req, res) => {
  try {
    const { account, suburbId } = req.body;
    const result = await suburbService.AddAccountSuburb(account, suburbId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to add account.",
    });
  }
};

exports.UpdateAccount = async (req, res) => {
  try {
    const { account, suburbId } = req.body;
    const result = await suburbService.UpdateAccountSuburb(account, suburbId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to add phone.",
    });
  }
};

exports.AddPhone = async (req, res) => {
  try {
    const { phone, suburbId } = req.body;
    const result = await suburbService.AddPhoneSuburb(phone, suburbId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to add phone.",
    });
  }
};

exports.UpdatePhone = async (req, res) => {
  try {
    const { phone, suburbId } = req.body;
    const result = await suburbService.UpdatePhoneSuburb(phone, suburbId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to add phone.",
    });
  }
};

exports.RemovePhone = async (req, res) => {
  try {
    const { suburbId, phoneId } = req.query;
    const result = await suburbService.RemovePhone(phoneId, suburbId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to delete phone.",
    });
  }
};

exports.RemoveAccount = async (req, res) => {
  try {
    const { suburbId, accountId } = req.query;
    const result = await suburbService.RemoveAccount(accountId, suburbId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "An unknown error occurs while trying to delete account.",
    });
  }
};

exports.EditMap = async (req, res) => {
  try {
    const { suburbId, mapUrl } = req.body;
    const result = await suburbService.EditMap(mapUrl, suburbId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to edit map.",
    });
  }
};

exports.getSuburbAutomationInfo = async (req, res) => {
  try {
    const { suburbId } = req.query;
    if (ObjectId.isValid(suburbId)) {
      const addresses = await addressService.getAddressesBySuburbId(suburbId);
      const users = await userService.getUsersBySuburb(suburbId);
      const addressesInfo = addresses.map((address) => {
        const usersAddress = users.filter((u) =>
          u.addressId
            ? u.addressId.toString() === address._id.toString()
            : false
        );
        return {
          address: { ...address },
          status: {
            active: usersAddress.some((u) => u.active),
            limited: usersAddress
              .filter((u) => u.active)
              .some((u) =>
                typeof u.limited !== "undefined" ? u.limited : false
              ),
            rfids: address.rfIds || [], // usersAddress.map((u) => u.rfids || []).flat(),
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

exports.getSuburbData = async (req, res) => {
  try {
    const { suburbId } = req.query;
    res.status(200).json({ hello: `suburbId: ${suburbId}` });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "An unknown error occurs while trying to get automation info.",
    });
  }
};

exports.GetRFIDs = async (req, res) => {
  try {
    const { street, streetNumber, suburbId } = req.query;
    const result = await suburbService.GetAddressRFIDs(
      street,
      streetNumber,
      suburbId
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "An unknown error occurs while trying to get address rfids.",
    });
  }
};

exports.SetRFIDs = async (req, res) => {
  try {
    const { street, streetNumber, suburbId, rfIds } = req.body;
    const result = await suburbService.SetAddressRFIDs(
      street,
      streetNumber,
      suburbId,
      rfIds
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An unknown error occurs while trying to set rfids.",
    });
  }
};
