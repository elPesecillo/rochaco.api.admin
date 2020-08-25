const mongoose = require("mongoose");
const moment = require("moment");

const GuestSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  vehicle: {
    type: String,
  },
  subject: {
    type: String,
  },
  isService: {
    type: Boolean,
    default: false,
  },
  plates: {
    type: String,
  },
  additionalInformation: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  arriveOn: {
    type: Date,
  },
  leaveOn: {
    type: Date,
  },
  count: {
    type: Number,
    default: 0,
  },
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

module.exports = GuestSchema;
