const pushNotificationService = require("../logic/pushNotificationService");

exports.sendTestNotification = async (req, res, next) => {
  try {
    let result = await pushNotificationService.sendPushNotification(
      ["ExponentPushToken[TRMrLcG4VUxVUwmsCXPIyw]"],
      {
        sound: "default",
        body: "This is a test notification ;)",
        data: { withSome: "data" },
        title: "Notificacion Nueva",
        subtitle: "soy un subtitulo",
      }
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
