const mongoose = require("mongoose");
const moment = require("moment");

const SuburbInviteSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  name: {
    type: String,
  },
  street: {
    type: String,
  },
  streetNumber: {
    type: String,
  },
  suburbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb",
  },
  active: {
    type: Boolean,
    default: true,
  },
  usedBy: {
    type: String,
  },
  updatedTranstime: {
    type: Date,
  },
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

SuburbInviteSchema.statics = {
  SaveSuburbInvite: function (userInviteObj) {
    let userInvite = new this(userInviteObj);
    return userInvite.save();
  },
  UpdateSuburbInviteUsed: function (code, usedBy) {
    return this.updateOne(
      { $and: [{ code: code }, { active: true }] },
      {
        $set: {
          usedBy: usedBy,
          active: false,
          updatedTranstime: moment.utc(),
        },
      }
    );
  },
  GetInviteByCode: function (code) {
    return new Promise((resolve, reject) => {
      return this.findOne({ code: code, active: true }).exec((err, result) => {
        if (err) reject(err);
        if (!result)
          reject({ success: false, message: "Cannot find the invite code." });
        resolve(result);
      });
    });
  },
};

const SuburbInvite = mongoose.model("SuburbInvite", SuburbInviteSchema);

module.exports = SuburbInvite;
