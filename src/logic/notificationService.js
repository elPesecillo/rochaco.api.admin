const notificationModel = require("../models/Notification");

const Save = async ({
  suburbId,
  title,
  body,
  notificationType,
  level,
  attachments,
  users,
}) => {
  try {
    // todo: add logic to upload image attachments here
    return await notificationModel.SaveNotification({
      suburbId,
      title,
      body,
      notificationType,
      level,
      attachments,
      users,
    });
  } catch (err) {
    throw err;
  }
};

const Delete = async (notificationId) => {
  try {
    return await notificationModel.Delete(notificationId);
  } catch (err) {
    throw err;
  }
};

const GetById = async (notificationId) => {
  try {
    return await notificationModel.GetById(notificationId);
  } catch (err) {
    throw err;
  }
};

const GetBySuburbId = async (suburbId, minDate) => {
  try {
    return await notificationModel.GetBySuburbId(suburbId, minDate);
  } catch (err) {
    throw err;
  }
};

const GetByUserId = async (suburbId, userId, minDate) => {
  try {
    const suburbNotifications = await notificationModel.GetBySuburbId(
      suburbId,
      minDate
    );
    const userNotifications = await notificationModel.GetByUserId(
      suburbId,
      userId,
      minDate
    );
    const allRawNotifications = [...suburbNotifications, ...userNotifications];

    const allNotifications = allRawNotifications.reduce((acc, cur) => {
      if (!acc.some((notification) => notification._id === cur._id)) {
        cur.push(cur);
      }
      return cur;
    }, []);
    return allNotifications;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  Save,
  Delete,
  GetById,
  GetBySuburbId,
  GetByUserId,
};
