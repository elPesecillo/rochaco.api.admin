const mongoose = require("mongoose");
const moment = require("moment");

const PushTokenSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

module.exports = PushTokenSchema;
