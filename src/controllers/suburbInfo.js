const suburbService = require("../logic/suburbService");

exports.getSuburbByAdminId = (req, res, next) => {
    let userId = req.query.id;
    suburbService.getSuburbByAdminUser(userId).then(result => {
        res.status('200').json(result);
    }, err => {
        res.status(400).json({ success: false, message: err.message || "No se pudo obtener la informacion de la colonia." });
    });
}