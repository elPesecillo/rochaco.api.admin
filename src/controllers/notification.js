const notificationService = require("../logic/notificationService");

exports.Save = async (req, res) => {
  try {
    const {
      suburbId,
      title,
      body,
      notificationType,
      level,
      attachments,
      users,
    } = req.body;

    const result = await notificationService.SaveNotification({
      suburbId,
      title,
      body,
      notificationType,
      level,
      attachments,
      users,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.Delete = async (req, res) => {
  try {
    const { notificationId } = req.body;
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
