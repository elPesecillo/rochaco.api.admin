const Api = require("../api/ApiService");

const apiAnalytics = process.env.API_ANALYTICS_URL;
const apiKey = process.env.API_ANALYTICS_KEY;

exports.getSuburbVisits = async (req, res) => {
  try {
    let { suburbId, startDate, endDate } = req.query;
    let response = await Api.get(`${apiAnalytics}/GetVisitsInfo`, {
      code: apiKey,
      suburbId,
      startDate,
      endDate,
    });
    res.status("200").json(response);
  } catch (err) {
    console.error(err);
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};
