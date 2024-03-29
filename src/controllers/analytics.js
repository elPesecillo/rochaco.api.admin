const Api = require("../api/ApiService");

const apiAnalytics = process.env.API_ANALYTICS_URL;
const apiKey = process.env.API_ANALYTICS_KEY;

exports.getSuburbVisits = async (req, res) => {
  try {
    const { suburbId, startDate, endDate } = req.query;
    let { offset } = req.query;
    if (!offset) offset = 5;
    const response = await Api.get(`${apiAnalytics}/GetVisitsInfo`, {
      code: apiKey,
      suburbId,
      startDate,
      endDate,
      offset,
    });
    res.status("200").json(response);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res
      .status("400")
      .json({ success: false, message: err.message || "Bad request." });
  }
};
