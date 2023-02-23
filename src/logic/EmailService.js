const SGMail = require("@sendgrid/mail");

const API_KEY = process.env.SENDGRID_API_KEY;
const APP_OWNER_EMAILS = process.env.OWNER_EMAILS.split(",");
const SUPPORT_EMAIL = "support@neighby.com";

exports.SendEmailToAppAdmins = async (subject, htmlBody) => {
  if (!API_KEY) {
    throw new Error("No API key found for SendGrid");
  }
  if (!subject) {
    throw new Error("No subject found for email");
  }
  if (!htmlBody) {
    throw new Error("No html body found for email");
  }
  SGMail.setApiKey(API_KEY);
  const msg = {
    to: APP_OWNER_EMAILS,
    from: SUPPORT_EMAIL,
    html: htmlBody,
    subject,
  };
  await SGMail.send(msg);
};
