const User = require("../models/user");
const request = require("request");

const saveUser = (userObj) => {
    return new Promise((resolve, reject) => {
        User.getLogin(userObj.loginName).then((login) => {
            if (login) {
                reject({ success: false, message: "El usuario existe actualmente en la base de datos." });
            }
            else {
                //create the user
                User.saveUser(userObj).then((usr, err) => {
                    //check if there is an error
                    if (!err)
                        resolve({ success: true, message: "Has sido registrado correctamente." });
                    else
                        reject({ success: false, message: err.message || "No se pudo registrar el usuario." });
                }, err => {
                    reject({ success: false, message: err.message })
                });
            }
        }, err => {
            reject({ success: false, message: err.message || "Ocurrio un error al tratar de guardar el usuario." })
        });
    });
};


const updateUser = async (userObj) => {
    return new Promise((resolve, reject) => {
        User.updateUser(userObj).then((usr, err) => {
            if (!err)
                resolve({ success: true, message: "Ha sido actualizado correctamente." });
            else
                reject({ success: false, message: err.message || "No se pudo actualizar el usuario." })
        }, err => {
            reject({ success: false, message: err.message })
        });
    });
};

const validateRecaptcha = async (token) => {
    const secretKey = process.env.RECAPTCHA_SECRET;
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    return new Promise((resolve, reject) => {
        request.post(verificationURL,
            (error, resG, body) => {
                if (error)
                    reject({ success: false, message: 'Por favor intenta de nuevo (no es posible validar recaptcha).' });
                let status = JSON.parse(body);
                if (!status.success)
                    reject({ success: false, message: 'Por favor intenta de nuevo.' });
                else if (status.score <= 0.5)
                    reject({ success: false, message: 'Por favor intenta de nuevo (score demasiado bajo).' });
                else
                    resolve({ success: true, message: 'recaptcha valido.' });
            }
        );
    });
};

const saveUserWithPassword = async (userObj) => {
    const { password } = userObj;
    return new Promise((resolve, reject) => {
        User.encryptPassword(password).then(resEncrypt => {
            let encryptedPassword = resEncrypt.hash;
            userObj.password = encryptedPassword;
            saveUser(userObj).then(result => {
                resolve(result);
            }, err => {
                reject(err);
            });
        }, err => {
            reject({ success: false, message: err.message || 'Bad request.' });
        });
    });
};

const getUserByType = async (userType) => {
    try {
        return await User.find({
            "userType": userType
        });
    } catch (ex) {
        return ex;
    }
};

const getUserByToken = async (token) => {
    try {
        let payload = await User.getTokenPayload(token);
        return await User.findById(payload.userId);
    }
    catch (ex) {
        return ex;
    }
}

module.exports = {
    saveUser,
    validateRecaptcha,
    saveUserWithPassword,
    getUserByType,
    getUserByToken,
    updateUser
};
