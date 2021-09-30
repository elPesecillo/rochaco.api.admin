const apiUrl = process.env.API_BLOB_URL;
const apiKey = process.env.API_BLOB_KEY;
const request = require("request");
const User = require("../logic/userService");

/** This service acts like a proxy to redirect the request to the blob service
 *
 * @param {*} req
 * @param {*} res
 */
exports.uploadBlobs = async (req, res) => {
  try {
    let url = `${apiUrl}/UploadFile${apiKey ? `?code=${apiKey}` : ""}`;
    req
      .pipe(
        request({ url: url }, (error, response, body) => {
          if (error) {
            console.log(
              `An error occurs in the following url: ${url}: `,
              error
            );
            let message = "dev proxy error: ";
            if (error && error.code === "ECONNREFUSED") {
              message = message.concat("Refused connection");
            } else if (error && error.code === "ECONNRESET") {
              message = message.concat("The target connection has been lost");
            } else {
              message = message.concat("Unhandled error");
            }
            req.res.status(500).json({
              errorMessage: message || "",
              exception: message || {},
            });
          } else {
            if (response.statusCode < 300)
              User.updateUserPicture(
                req.query.userId,
                JSON.parse(response.body)[0].url
              );
          }
        })
      )
      .pipe(res);
    //res.status("200").json({ message: "ok" });
  } catch (err) {
    console.error(err);
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};
