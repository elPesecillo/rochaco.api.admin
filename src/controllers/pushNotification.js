const pushNotificationService = require("../logic/pushNotificationService");
const {
  getUserLeanById,
  getAdminUsers,
  getUsersByAddressId,
  getUsersBySuburb,
} = require("../logic/userService");
const moment = require("moment");

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
    let user = await getUserLeanById(userId);
    let pushTokens = user.pushTokens.map((t) => t.token);
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
    //esto es solo para pruebas
    //users = users.filter((u) => u.facebookId === "10221055228718114");

    let user = await getUserLeanById(userId);
    let promises = [];
    users.forEach((u) => {
      promises.push(
        pushNotificationService.sendPushNotification(
          u.pushTokens.map((t) => t.token),
          {
            sound: "default",
            body: `El usuario ${user.name} con la dirección ${user.street} ${user.streetNumber} realizo un pago de ${paymentType}.`,
            data: {
              redirect: { stack: "PaymentsControl", screen: "PaymentList" },
              props: { street: user.street, streetNumber: user.streetNumber },
            },
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
    let { suburbId, addressId, status, comment, paymentName } = req.body;
    let users = await getUsersByAddressId(suburbId, addressId);
    let promises = [];
    users.forEach((u) => {
      promises.push(
        pushNotificationService.sendPushNotification(
          u.pushTokens.map((t) => t.token),
          {
            sound: "default",
            body:
              status === "approved"
                ? `Tu pago de ${paymentName} ha sido aceptado`
                : status === "rejected"
                ? `Tu pago de ${paymentName} ha sido rechazado por la siguiente razón: ${comment}`
                : `Tu pago ${paymentName} esta siendo procesado.`,
            data: {
              redirect: {
                stack: "Payments",
                screen: "Info",
              },
              props: {
                filter: status,
              },
            },
            title:
              status === "approved"
                ? "Pago aceptado"
                : status === "rejected"
                ? "Pago rechazado"
                : "Cambio en el estatus de tus pagos",
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

exports.sendNewSpaceReservationNotification = async (req, res) => {
  try {
    const { suburbId, userId, reservationId } = req.body;
    const adminUsers = await getAdminUsers(suburbId);

    const user = await getUserLeanById(userId);
    let promises = [];
    adminUsers.forEach((u) => {
      promises.push(
        pushNotificationService.sendPushNotification(
          u.pushTokens.map((t) => t.token),
          {
            sound: "default",
            body: `El usuario ${user.name} con la dirección ${user.street} ${user.streetNumber} ha realizado una reserva de un area común.`,
            data: {
              redirect: { stack: "CommonAreas", screen: "ApprovalScreen" },
              props: {
                street: user.street,
                streetNumber: user.streetNumber,
                reservationId,
              },
            },
            title: `Nueva reserva de area común`,
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

const getReservationStatusMessage = (status, comment) => {
  switch (status) {
    case "approved":
      return "Tu reservación ha sido aprobada";
    case "rejected":
      return `Tu reservación ha sido rechazada por la siguiente razón: ${comment}`;
    case "pending":
      return "Tu reservación esta siendo procesada";
    default:
      return "El estatus de tu reservación ha cambiado";
  }
};

exports.sendApproveRejectedReservationNotification = async (req, res) => {
  try {
    const { suburbId, addressId, status, comment, reservationId } = req.body;
    let promises = [];
    let users = await getUsersByAddressId(suburbId, addressId);
    users.forEach((user) => {
      promises.push(
        pushNotificationService.sendPushNotification(
          user.pushTokens.map((t) => t.token),
          {
            sound: "default",
            body: getReservationStatusMessage(status, comment),
            title: "Cambio en el estatus de tu reservación",
            data: {
              redirect: { stack: "CommonAreas", screen: "MyReservationsStack" },
              props: {
                street: user.street,
                streetNumber: user.streetNumber,
                reservationId,
              },
            },
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

exports.sendNewSurveyNotification = async (req, res) => {
  try {
    const { suburbId, surveyName, expirationDate } = req.body;
    const users = await getUsersBySuburb(suburbId);
    if (users) {
      const activeUsers = users.filter((user) => user.active);
      const userPushTokensArrays = activeUsers.map((user) => user.pushTokens);
      const rawUserPushTokens = [].concat.apply([], userPushTokensArrays);
      const userPushTokens = rawUserPushTokens.reduce((acc, cur) => {
        if (acc.indexOf(cur) === -1) {
          acc.push(cur);
        }
        return acc;
      }, []);
      const sendNotifications = pushNotificationService.sendPushNotification(
        userPushTokens,
        {
          sound: "default",
          body: `Se ha creado la encuesta "${surveyName}", tienes hasta la siguiente fecha para participar: ${moment(
            expirationDate
          ).format("YYYY/MM/DD")}`,
          title: "Nueva encuesta disponible",
          data: {
            redirect: { stack: "SurveysNeighbours", screen: "Survey" },
            props: {
              surveyName,
            },
          },
        }
      );
      res.status(200).json(sendNotifications);
    } else {
      res.status(404).json({ message: "users not found" });
    }
  } catch (err) {
    console.log("notification error details", err);
    res.status(500).json(err);
  }
};
