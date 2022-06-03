const mongoose = require("mongoose");
const moment = require("moment");

const RFIdSchema = new mongoose.Schema({
  rfid: {
    type: String,
  },
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

module.exports = RFIdSchema;
