const notificationService = require("../logic/notificationService");
const { UploadBlob } = require("../logic/blobService");

const NOTIFICATIONS_CONTAINER = "notifications";
exports.Save = async (req, res) => {
  try {
    const { suburbId, title, body, level, users } = req.body;
    let { attachments } = req.body;
    if (!attachments && req.files) {
      //upload attachments here
      const files = req.files.map((file) => ({
        ...file,
        name: file.originalname,
        uri: file.buffer.toString("base64"),
      }));

      attachments = await UploadBlob(files, NOTIFICATIONS_CONTAINER);
    }

    const result = await notificationService.Save({
      suburbId,
      title,
      body,
      level,
      attachments: attachments ?? [],
      users: users ?? [],
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.Delete = async (req, res) => {
  try {
    const { notificationId } = req.query;
    const result = await notificationService.Delete(notificationId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.GetById = async (req, res) => {
  try {
    const { notificationId } = req.query;
    const result = await notificationService.GetById(notificationId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.GetBySuburbId = async (req, res) => {
  try {
    const { suburbId, minDate } = req.query;
    const result = await notificationService.GetBySuburbId(suburbId, minDate);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.GetByUserId = async (req, res) => {
  try {
    const { suburbId, userId, minDate } = req.query;
    const result = await notificationService.GetByUserId(
      suburbId,
      userId,
      minDate
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
