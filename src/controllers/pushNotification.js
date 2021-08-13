const pushNotificationService = require("../logic/pushNotificationService");
const {
  getUserLeanById,
  getAdminUsers,
  getUsersByAddressId,
} = require("../logic/userService");

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

exports.sendUploadPaymentNotification = async (req, res) => {
  try {
    let { suburbId, userId, paymentType } = req.body;
    let users = await getAdminUsers(suburbId);
    let user = await getUserLeanById(userId);
    let promises = [];
    users.forEach((u) => {
      promises.push(
        pushNotificationService.sendPushNotification(
          u.pushTokens.map((t) => t.token),
          {
            sound: "default",
            body: `El usuario ${user.name} con la dirección ${user.street} ${user.streetNumber} realizo un pago de ${paymentType}.`,
            data: { redirect: "paymentControl" },
            title: `Nuevo pago realizado`,
          }
        )
      );
    });
    let sendNotifications = await Promise.all(promises);
    res.status(200).json(sendNotifications);
  } catch (err) {
    console.log("notification error details: ", err);
    res.status(400).json(err);
  }
};

exports.sendApproveRejectedPaymentNotification = async (req, res) => {
  try {
    let { suburbId, addressId, approved, comment, paymentName } = req.body;
    let users = await getUsersByAddressId(suburbId, addressId);
    let promises = [];
    users.forEach((u) => {
      promises.push(
        pushNotificationService.sendPushNotification(
          u.pushTokens.map((t) => t.token),
          {
            sound: "default",
            body: approved
              ? `Tu pago de ${paymentName} ha sido aceptado`
              : `Tu pago de ${paymentName} ha sido rechazado por la siguiente razón: ${comment}`,
            data: { redirect: "payments" },
            title: approved ? "Pago aceptado" : "Pago rechazado",
          }
        )
      );
    });

    let sendNotifications = await Promise.all(promises);
    res.status(200).json(sendNotifications);
  } catch (err) {
    console.log("notification error details: ", err);
    res.status(400).json(err);
  }
};
