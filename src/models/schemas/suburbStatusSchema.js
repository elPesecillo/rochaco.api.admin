const mongoose = require("mongoose");
const moment = require("moment");

const SuburbStatusSchema = new mongoose.Schema({
  status: {
    type: String,
  },
  description: {
    type: String,
  },
  details: {
    type: String,
  },
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

// const SuburbStatus = mongoose.model("SuburbStatus", SuburbStatusSchema);

module.exports = SuburbStatusSchema;
