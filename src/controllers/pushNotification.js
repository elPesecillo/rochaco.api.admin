const pushNotificationService = require("../logic/pushNotificationService");
const { getUserById } = require("../logic/userService");

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

exports.sendArriveNotification = async (req, res) => {
  try {
    let { userId, guest } = req.body;
    console.log("getting user");
    let user = await getUserById(userId);
    console.log("user", user._doc);
    let pushTokens = user.pushTokens.map((t) => t._doc.token);
    console.log("push tokens", pushTokens);

    console.log("send notifications...");
    let result = await pushNotificationService.sendPushNotification(
      pushTokens,
      {
        sound: "default",
        body: guest.isService
          ? `Tu servicio ${guest.name} ha llegado.`
          : `Tu invitado ${guest.name} ha llegado.`,
        data: { redirect: "myVisits" },
        title: `Hola ${user.name}`,
      }
    );
    res.status(200).json(result);
  } catch (err) {
    console.log("notification error details: ", err);
    res.status(400).json(err);
  }
};
