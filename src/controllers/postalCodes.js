const postalCodeService = require("../logic/postalCodeService");

exports.getPostalCodeInfo = async (req, res) => {
  try {
    const result = await postalCodeService.getCPInfo(req.query.postalCode);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
