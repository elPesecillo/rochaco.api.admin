/* eslint-disable prefer-promise-reject-errors */
const User = require("../models/user");
const permissions = require("../constants/menusConfig").menus;

const validateWithPayload = (path, payload) => {
  let valid = { valid: false, message: 'la pantalla no es valida para tu usuario.' };
  if (!payload || !payload.userType) { return valid; }

  const { userType } = payload;
  const validPath = permissions.filter((p) => {
    const types = p.validUserTypes.filter((g) => g.toLowerCase() === userType.toLowerCase());
    return types.length > 0 && p.path.toLowerCase() === path.toLocaleLowerCase();
  });

  if (validPath.length > 0) { valid = { valid: true, message: 'ok' }; }
  return valid;
};

exports.permissionValid = (path, jwt) => new Promise((resolve, reject) => {
  const user = User;
  const isValid = user.isValidToken(jwt);
  isValid.then(() => {
    const getPayload = user.getTokenPayload(jwt);
    getPayload.then((payload) => {
      const valid = validateWithPayload(path, payload);
      if (valid.valid) resolve(valid);
      else reject(valid);
    }, () => {
      reject({ valid: false, message: 'los datos de la sesión no son validos.' });
    });
  }, () => {
    reject({ valid: false, message: 'el token de la sesión no es valido.' });
  });
});
