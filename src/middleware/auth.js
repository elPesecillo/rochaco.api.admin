const Auth = require("../logic/auth");

const validApiRequest = (apiPath, token) => {
    return new Promise((resolve, reject) => {
        let auth = new Auth();
        auth.validateApiRequest(apiPath, token).then(res => {
            resolve(res);
        }, err => reject({ valid: false, message: `Error: ${JSON.stringify(err)}` }));
    });
}


exports.checkApiAuth = (req, res, next) => {
    console.log(`validando si el request esta autenticado...`);
    //check request headers over here to know if the request is authenticated
    let apiPath = req.baseUrl, token = req.headers["authorization"];

    validApiRequest(apiPath, token).then(result => {
        if (result.valid)
            next();
        else
            res.status('401').json({ success: false, error: 'Unauthorized request.' });
    }, err => res.status('500').json({ success: false, error: 'An error occurs while validating the request.' }));
}