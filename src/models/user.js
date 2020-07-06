const moment = require('moment');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const base64 = require("base-64");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Ingresa el nombre'
    },
    lastName: {
        type: String
    },
    password: {
        type: String
    },
    loginName: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    cellphone: {
        type: String
    },
    suburb: {
        type: String
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    temporaryDisabled: {
        type: Boolean,
        default: false
    },
    disabledSince: {
        type: Date
    },
    lastAccess: {
        type: Date,
        default: moment.utc()
    },
    /**
     * valid user types:
     *  guest -> a guest user
     *  guard -> a guard of the suburb
     *  admin -> an administrator of the suburb
     *  sudo  -> an administrator of the app
     */
    userType: {
        type: String,
        default: "guest"
    },
    userConfirmed: {
        type: Boolean
    },
    facebookId: {
        type: String
    },
    googleId: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    transtime: {
        type: Date,
        default: moment.utc()
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    suburb: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suburb'
    }
});

/**
 * Private attributes
 */
const _secretKey = process.env.JWT_SECRET;

let _getExpDate = () => {
    var expTimeByMin = process.env.exptoken != null ? process.env.exptoken : "180";
    return moment().add(expTimeByMin, 'minutes').valueOf();
};

let _getValidApis = (id) => {
    //return an array with the valid apis
    return [];
}

let _getValidMenus = (id) => {
    //return an array with the valid menus for the user
    return [];
}

/**
 * Method to validate exp from the user token.
 * @param {*} expDate 
 */
let _validateExpDate = function (expDate) {
    let currentTime = moment().valueOf();
    return (expDate > currentTime);
};

UserSchema.methods = {
    validatePassword: function (_password) {
        var _this = this;
        let pass = base64.decode(_password);
        return new Promise((resolve, reject) => {
            if (_this.temporaryDisabled) {
                let wait = 10 - this.getDisabledSince();
                if (wait > 0)
                    reject({ success: false, message: `El usuario esta temporalmente desabilitado, por favor espere ${wait} minutos para volver a intentar.` })
                else
                    this.increaseLoginAttempts(true).then(res => {
                        this.validatePassword(_password).then(result => resolve(result), err => reject(err));
                    });
            }
            else
                bcrypt.compare(pass, _this.password).then(valid => {
                    if (valid) {
                        //reset logint attempts
                        this.increaseLoginAttempts(true).then(res => {
                            resolve({ success: true, message: 'La contraseña coincide.' });
                        }, err => reject({ success: false, message: 'Un error occurio.' }));
                    }
                    else {
                        //increase login attempts
                        this.increaseLoginAttempts().then(res => {
                            reject({ success: false, message: 'La contraseña no es valida.' })
                        }, err => reject({ success: false, message: 'Un error occurio, la contraseña no es valida.' }));
                    }
                });
        }, err => reject({ success: false, message: 'Ocurrio un error al comparar la contraseña.' }))
    },
    getDisabledSince: function () {
        let disabledSince = this.disabledSince ? this.disabledSince : moment.utc();
        let start = moment(disabledSince);
        let end = moment(moment.utc());
        return end.diff(start, 'minutes');
    },
    increaseLoginAttempts: function (reset) {
        if (reset) {
            this.loginAttempts = 0;
            this.temporaryDisabled = false;
            this.disabledSince = null;
        }
        else {
            let loginAttempts = this.loginAttempts + 1;
            this.loginAttempts = loginAttempts;
            this.temporaryDisabled = loginAttempts > 10;
            this.disabledSince = loginAttempts > 10 ? moment.utc() : null;
        }
        return new Promise((resolve, reject) => {
            return this.save().then(res => {
                resolve(res);
            }, err => {
                reject(err);
            });
        });
    },
    generateUserToken: function (_suburb) {
        let payload = {
            userId: this._id != undefined ? JSON.parse(JSON.stringify(this._id)) : "",
            loginName: this.loginName,
            suburb: this.suburb || _suburb,
            userType: this.userType,
            exp: _getExpDate(),
            validApis: _getValidApis(this._id),
            //validMenus: _getValidMenus(this._id) //verify if is better put this in another schema i.e. suburb
        };
        let token = jwt.sign(payload, _secretKey);
        return token;
    },
    setUserRole: function (userId, roles) {
        if (!Array.isArray(roles)) roles = [roles];
        return this.update({
            _id: userId
        }, {
            $addToSet: {
                roles: {
                    $each: roles
                }
            }
        }, {
            multi: true
        });
    },
    deleteUserRole: function (users, roles) {
        if (!Array.isArray(users)) users = [users];
        if (!Array.isArray(roles)) roles = [roles];

        return this.update({
            _id: {
                $in: users
            }
        }, {
            $pullAll: {
                roles: roles
            }
        }, {
            multi: true
        });
    },
    getUserRoles: function (userId) {
        return new Promise((resolve, reject) => {
            this.find({
                _id: userId
            }).populate('roles').exec((err, result) => {
                if (err) reject(err);
                resolve(getCleanResult(result, 'roles'));
            });
        });
    }
};

UserSchema.statics = {
    /**
     * Method to get a user by login name
     */
    getLogin: function (_loginName) {
        return new Promise((resolve, reject) => {
            this.findOne({
                loginName: _loginName
            })/*.populate({
                path: 'roles',
                populate: {
                    path: 'menus',
                    model: 'Menu'
                }
            })*/.exec((err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },
    getUserByFacebookId: function (_facebookId) {
        return new Promise((resolve, reject) => {
            this.findOne({
                facebookId: _facebookId
            }).exec((err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        })
    },
    getUserByGoogleId: function (_googleId) {
        return new Promise((resolve, reject) => {
            this.findOne({
                googleId: _googleId
            }).exec((err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        })
    },
    updateUser: function (objUser) {
        return this.updateOne({
            _id: objUser._id
        }, {
            $set: {
                'name': objUser.name,
                'lastName': objUser.lastName,
                'password': objUser.password,
                'email': objUser.email,
                'cellphone': objUser.cellphone,
                'active': objUser.active,
                'transtime': moment.utc()
            }
        })
    },
    saveUser: function (objUser) {
        let user = new this(objUser);
        return user.save();
    },
    /**
     * Validate if the user token is active
     */
    isValidToken: function (_token) {
        return new Promise(function (resolve, reject) {
            var isValid = false;
            try {
                jwt.verify(_token, _secretKey, function (err, decoded) {
                    if (decoded) {
                        if (_validateExpDate(decoded.exp)) {
                            isValid = true;
                        }
                    }
                    resolve(isValid);
                });
            }
            catch (err) {
                console.log(err);
                reject(false);
            }
        });
    },
    /**
     * Get the payload of the jwt token
     * @param {String} _token 
     */
    getTokenPayload: function (_token) {
        return new Promise(function (resolve, reject) {
            try {
                jwt.verify(_token, _secretKey, function (err, decoded) {
                    resolve(decoded);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    },
    encryptPassword: function (_password) {
        return new Promise((resolve, reject) => {
            let pass = base64.decode(_password);
            let saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(pass, salt, (err, hash) => {
                    if (!err)
                        resolve({ hash });
                    else
                        reject(err);
                })
            });
        });
    }
}

const User = mongoose.model("User", UserSchema);

module.exports = User;