const mongoose = require("mongoose");
const moment = require("moment");

const SuburbNewInviteSchema = new mongoose.Schema({
  active: {
    type: Boolean,
  },
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});
const SuburbNewInvite = mongoose.model("SuburbNewInvite", SuburbSchema);

module.exports = SuburbNewInvite;
