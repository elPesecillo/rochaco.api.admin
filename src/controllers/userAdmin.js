const userService = require("../logic/userService");
const userTypes = require("../constants/userType").userTypes;

exports.saveGoogleUser = (req, res, next) => {
    //get user data here
    let { name, lastName, loginName, email, password, cellphone, facebookId, googleId, token } = req.body;
    //validate the captcha here
    userService.validateRecaptcha(token).then(resV => {
        //save the user here
        userService.saveUser({ name, lastName, loginName, email, password, cellphone, facebookId, googleId, userConfirmed: true }).then(resSave => {
            res.status('200').json({ success: true, message: res.message || "Has sido registrado correctamente." })
        }, err => {
            res.status('400').json({ success: false, message: err.message || 'Bad request.' });

        });
    }, err => {
        res.status('400').json({ success: false, message: err.message || 'Bad request.' });
    });
}

exports.saveFacebookUser = (req, res, next) => {
    let { name, lastName, loginName, email, password, cellphone, facebookId, googleId, token } = req.body;
    //validate the captcha here
    userService.validateRecaptcha(token).then(resV => {
        //save the user here
        userService.saveUser({ name, lastName, loginName, email, password, cellphone, facebookId, googleId, userConfirmed: true }).then(resSave => {
            res.status('200').json({ success: true, message: res.message || "Has sido registrado correctamente." })
        }, err => {
            res.status('400').json({ success: false, message: err.message || 'Bad request.' });
        });
    }, err => {
        res.status('400').json({ success: false, message: err.message || 'Bad request.' });
    });
}

exports.saveEmailUser = (req, res, next) => {
    let { name, lastName, loginName, email, password, cellphone, facebookId, googleId, token } = req.body;
    //validate the captcha here
    userService.validateRecaptcha(token).then(resV => {
        //if the user is registered through email credentials the user needs to be confirmed through an email
        userService.saveUserWithPassword({ name, lastName, loginName, email, password: password, cellphone, facebookId, googleId, userConfirmed: false })
            .then(resSave => {
                res.status('200').json({ success: true, message: res.message || "Has sido registrado correctamente." })
            }, err => {
                res.status('400').json({ success: false, message: err.message || 'Bad request.' });
            });
    }, err => {
        res.status('400').json({ success: false, message: err.message || 'Bad request.' });
    });
};

exports.createUserByType = async (req, res, next) => {
    try {
        const { name, lastName, loginName, email, cellphone } = req.body;
        const userType = userTypes[req.params.userType];
        if (!userType) {
            res.status('400').json({ success: false, message: 'Bad request.' });
            return;
        }
        const result = await userService.saveUser({ name, lastName, loginName, email, cellphone, userConfirmed: false, userType });
        res.status('200').json({ success: true, message: result.message || "Has sido registrado correctamente." });
    } catch (err) {
        res.status('400').json({ success: false, message: err.message || 'Bad request.' });
    }
};

exports.getUserByType = async (req, res, next) => {
    try {
        const userType = userTypes[req.params.userType];
        if (!userType) {
            res.status('400').json({ success: false, message: 'Bad request.' });
            return;
        }
        const result = await userService.getUserByType(userType);
        res.status('200').json({ success: true, data: result });
    } catch (err) {
        res.status('400').json({ success: false, message: err.message || 'Bad request.' });
    }
};

exports.getUserInfo = async (req, res, next) => {
    try {
        userService.getUserByToken(req.query.token).then(result => {
            res.status('200').json(result);
        }, err => {
            res.status('400').json({ success: false, message: err.message || 'Bad request.' });
        });
    }
    catch (err) {
        res.status('400').json({ success: false, message: err.message || 'Bad request.' });
    }
}