const {
  ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");

const computerVisionKey = process.env.VISION_KEY;
const computerVisionEndPoint = process.env.VISION_ENDPOINT;

exports.processOCR = async (req, res) => {
  try {
    const data = req.files[0];
    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
      computerVisionKey
    );
    const client = new ComputerVisionClient(
      cognitiveServiceCredentials,
      computerVisionEndPoint
    );

    const options = {
      //   maxCandidates: 5,
      //   language: "en",
    };
    const response = await client.recognizePrintedTextInStream(
      true,
      data.buffer,
      options
    );
    res.status("200").json(response);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};
