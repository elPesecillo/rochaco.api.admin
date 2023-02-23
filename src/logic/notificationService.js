const moment = require("moment");

const notificationModel = require("../models/Notification");
const { getUsersBySuburb } = require("./userService");
const { sendPushNotification } = require("./pushNotificationService");

const NOTIFICATION_DEFAULT_SOUND = "default";

const Save = async ({
  suburbId,
  title,
  body,
  level,
  attachments,
  users,
  metadata,
}) => {
  try {
    return await notificationModel.Save({
      suburbId,
      title,
      body,
      level,
      attachments,
      users,
      metadata,
      transtime: moment.utc(),
    });
  } catch (err) {
    throw err;
  }
};

const SendSuburbNotification = async ({
  suburbId,
  title,
  body,
  level,
  attachments,
}) => {
  try {
    const suburbUsers = (await getUsersBySuburb(suburbId)).filter(
      (user) => user.active
    );
    const userPushTokensArrays = suburbUsers.map((user) => user.pushTokens);
    // eslint-disable-next-line prefer-spread
    const rawUserPushTokens = [].concat.apply([], userPushTokensArrays);
    const userPushTokens = rawUserPushTokens.reduce((acc, cur) => {
      if (acc.indexOf(cur) === -1) {
        acc.push(cur);
      }
      return acc;
    }, []);
    return await sendPushNotification(
      userPushTokens.map((pushToken) => pushToken.token),
      {
        sound: NOTIFICATION_DEFAULT_SOUND,
        body,
        title,
        data: {
          level,
          attachments,
        },
      }
    );
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
    const allNotifications = [...suburbNotifications, ...userNotifications];
    const notificationsWithoutUsers = allNotifications.map(
      ({ users, ...rest }) => ({ ...rest })
    );
    return notificationsWithoutUsers.sort((a, b) => b.transtime - a.transtime);
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
  SendSuburbNotification,
};
