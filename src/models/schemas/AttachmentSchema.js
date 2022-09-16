const mongoose = require("mongoose");
const moment = require("moment");

const AttachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
  },
  url: {
    type: String,
  },
  transTime: {
    type: Date,
    default: moment.utc(),
  },
});

module.exports = AttachmentSchema;
