const User = require("../models/user");
const menus = require("../constants/menusConfig").menus;

/**
 * Get menus by logged user
 */
exports.getMenusByUser = async (userToken) => {
  return new Promise((resolve, reject) => {
    let getPayload = User.getTokenPayload(userToken);
    getPayload.then(payload => {
      const { userType, loginName } = payload;

      let userMenus = menus.filter(menu => {
        let types = menu.validUserTypes.filter(g => g.toLowerCase() === userType.toLowerCase());
        return types.length > 0;
      }).map(item => ({ name: item.name, path: item.path, visible: item.visible, icon: item.icon, order: item.order }));


      resolve(userMenus);
    }, errP => {
      reject({ valid: false, message: 'The token is not allowed' });
    });
  });
};