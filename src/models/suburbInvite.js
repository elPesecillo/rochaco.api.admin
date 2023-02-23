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
  userType: {
    type: String,
  },
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

SuburbInviteSchema.statics = {
  SaveSuburbInvite(userInviteObj) {
    const userInvite = new this(userInviteObj);
    return userInvite.save();
  },
  UpdateSuburbInviteUsed(code, usedBy) {
    return this.updateOne(
      { $and: [{ code }, { active: true }] },
      {
        $set: {
          usedBy,
          active: false,
          updatedTranstime: moment.utc(),
        },
      }
    );
  },
  GetInviteByCode(code) {
    return new Promise((resolve, reject) => {
      this.findOne({ code, active: true }).exec((err, result) => {
        if (err) {
          reject(err);
        }
        if (!result) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ success: false, message: "Cannot find the invite code." });
        }
        resolve(result);
      });
    });
  },
};

const SuburbInvite = mongoose.model("SuburbInvite", SuburbInviteSchema);

module.exports = SuburbInvite;
