const Auth = require("../logic/auth").Auth;

const validApiRequest = (apiPath, token, apiKey) => {
  return new Promise((resolve, reject) => {
    let auth = new Auth();
    auth.validateApiRequest(apiPath, token, apiKey).then(
      (res) => {
        resolve(res);
      },
      (err) =>
        reject({
          valid: false,
          message: err.message ? err.message : `Error: ${JSON.stringify(err)}`,
        })
    );
  });
};

exports.checkApiAuth = (req, res, next) => {
  console.log(`validando si el request esta autenticado...`);
  //check request headers over here to know if the request is authenticated
  let apiPath = req.baseUrl,
    token = req.headers["authorization"],
    apiKey =
      req.headers["api-key"] || req.query["api-key"] || req.body["api-key"];

  validApiRequest(apiPath, token, apiKey).then(
    (result) => {
      if (result.valid) next();
      else
        res
          .status("401")
          .json({ success: false, error: "Unauthorized request." });
    },
    (err) =>
      res.status("401").json({
        success: false,
        error: err.message || "An error occurs while validating the request.",
      })
  );
};
