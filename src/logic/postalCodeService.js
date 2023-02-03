/* eslint-disable prefer-promise-reject-errors */
const PostalCode = require("../models/postalCode");

exports.getCPInfo = async (postalCode) =>
  new Promise((resolve, reject) => {
    if (postalCode.length > 2) {
      const getInfo = PostalCode.getCPInfo(postalCode);
      getInfo.then(
        (cp) => {
          resolve(cp);
        },
        () => {
          reject({
            valid: false,
            message: "No se pudo obtener la informaion del codigo postal.",
          });
        }
      );
    } else {
      reject({
        valid: false,
        message: "La longitud del codigo postal no es valida.",
      });
    }
  });
