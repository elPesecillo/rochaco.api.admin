const ApiBlobUrl = process.env.API_BLOB_URL;
const ApiBlobKey = process.env.API_BLOB_KEY;

const { post } = require("../api/ApiService");

const UploadBlob = async (files, container) => {
  try {
    return await post(
      `${ApiBlobUrl}/UploadFile2${ApiBlobKey ? `?code=${ApiBlobKey}` : ""}`,
      { files, container }
    );
  } catch (err) {
    throw err;
  }
};

module.exports = {
  UploadBlob,
};
