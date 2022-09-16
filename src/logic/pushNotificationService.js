const Expo = require("expo-server-sdk").Expo;

const expo = new Expo();

const DIFFERENT_PROJECTS_ERROR_MESSAGE = "PUSH_TOO_MANY_EXPERIENCE_IDS";

const getMessagesBatches = (pushTokens, message) => {
  const validTokens = pushTokens.reduce((tokens, currentToken) => {
    if (Expo.isExpoPushToken(currentToken)) {
      tokens.push(currentToken);
    }
    return tokens;
  }, []);
  const messages = validTokens.map((token) => ({ ...message, to: token }));
  return expo.chunkPushNotifications(messages);
};

const sendExpoNotification = async (chunks) => {
  try {
    //(async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    let tickets = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
        if (error.code === DIFFERENT_PROJECTS_ERROR_MESSAGE) {
          const diffProjectsTickets =
            await handlePushNotificationsFromDifferentProjects(
              error.details,
              chunk
            );
          tickets.push([].concat.apply([], diffProjectsTickets));
        }
      }
    }
    return tickets;
    //})();
  } catch (err) {
    console.log("send expo notification error", err);
    throw err;
  }
};

const handlePushNotificationsFromDifferentProjects = async (
  projects,
  notifications
) => {
  try {
    const projectChunks = Object.keys(projects).map((key) => {
      const projectTokens = projects[key];
      const projectNotifications = projectTokens.map((token) => {
        return notifications.find((notification) => notification.to === token);
      });
      return projectNotifications;
    });
    let tickets = [];
    for (const projectChunk of projectChunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(projectChunk);
        tickets.push(ticketChunk);
      } catch (err) {
        console.log(err);
      }
    }
    return tickets;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const checkTickets = async (tickets) => {
  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.
  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  //(async () => {
  // Like sending notifications, there are different strategies you could use
  // to retrieve batches of receipts from the Expo service.
  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log(receipts);

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      for (let receiptId in receipts) {
        let { status, message, details } = receipts[receiptId];
        if (status === "ok") {
          //continue;
        } else if (status === "error") {
          console.error(
            `There was an error sending a notification: ${message}`
          );
          if (details && details.error) {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            // You must handle the errors appropriately.
            console.error(`The error code is ${details.error}`);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  //})();
};

const sendPushNotification = async (pushTokens, message) => {
  try {
    console.log("getting chunks...");
    let chunks = getMessagesBatches(pushTokens, message);
    console.log("chunks", chunks);

    console.log("send push notifications");
    let tickets = await sendExpoNotification(chunks);
    console.log("await check tickets");
    await checkTickets(tickets);
  } catch (ex) {
    console.log("notification error details:", ex);
    throw ex;
  }
};

module.exports = {
  sendPushNotification,
};
