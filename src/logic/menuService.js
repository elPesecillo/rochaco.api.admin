const User = require("../models/user");
const { menus } = require("../constants/menusConfig");

/**
 * Get menus by logged user
 */
exports.getMenusByUser = async (userToken) =>
  new Promise((resolve, reject) => {
    const getPayload = User.getTokenPayload(userToken);
    getPayload.then(
      (payload) => {
        const { userType } = payload;

        const userMenus = menus
          .filter((menu) => {
            const types = menu.validUserTypes.filter(
              (g) => g.toLowerCase() === userType.toLowerCase()
            );
            return types.length > 0;
          })
          .map((item) => ({
            name: item.name,
            path: item.path,
            visible: item.visible,
            icon: item.icon,
            order: item.order,
          }));

        resolve(userMenus);
      },
      () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ valid: false, message: "The token is not allowed" });
      }
    );
  });
