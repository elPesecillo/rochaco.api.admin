const PostalCode = require("../models/postalCode");


exports.getCPInfo = async (postalCode) => {
    return new Promise((resolve, reject) => {
        if (postalCode.length > 2) {
            getInfo = PostalCode.getCPInfo(postalCode);
            getInfo.then(cp => {
                resolve(cp);
            }, err => {
                reject({ valid: false, message: 'No se pudo obtener la informaion del codigo postal.' });
            });
        }
        else {
            reject({ valid: false, message: 'La longitud del codigo postal no es valida.' });
        }
    });
}