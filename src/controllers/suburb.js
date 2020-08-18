const suburbService = require("../logic/suburbService");
const userService = require("../logic/userService");
const userTypes = require("../constants/types").userTypes;
const moment = require("moment");

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
