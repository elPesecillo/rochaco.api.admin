const { Auth } = require("../logic/auth");

const validApiRequest = (apiPath, token, apiKey) => new Promise((resolve, reject) => {
  const auth = new Auth();
  auth.validateApiRequest(apiPath, token, apiKey).then(
    (res) => {
      resolve(res);
    },
    (err) =>
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({
        valid: false,
        message: err.message ? err.message : `Error: ${JSON.stringify(err)}`,
      })
  );
});

exports.checkApiAuth = (req, res, next) => {
  // check request headers over here to know if the request is authenticated
  const apiPath = req.baseUrl;
  // eslint-disable-next-line no-console
  console.log(`validando si el request esta autenticado, path: ${apiPath}`);
  const token = req.headers.authorization;
  const apiKey =
      req.headers["api-key"] || req.query["api-key"] || req.body["api-key"];

  validApiRequest(apiPath, token, apiKey).then(
    (result) => {
      if (result.valid) next();
      else {
        res
          .status("401")
          .json({ success: false, error: "Unauthorized request." });
      }
    },
    (err) =>
      res.status("401").json({
        success: false,
        error: err.message || "An error occurs while validating the request.",
      })
  );
};
