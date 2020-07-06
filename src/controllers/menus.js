const menuService = require("../logic/menuService");



/**
 * [GET] method to get the menus by user types
 */
exports.getMenusByUser = async (req, res, next) => {
    let token = req.headers["authorization"];
    try {
        const result = await menuService.getMenusByUser(token);
        res.status('200').json(result);
    } catch (err) {
        res.status('401').json(err);
    }
}