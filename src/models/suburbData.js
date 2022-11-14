const mongoose = require("mongoose");
const moment = require("moment");
const AccountSchema = require("./schemas/AccountSchema");
const PhoneSchema = require("./schemas/PhoneSchema");

const SuburbDataSchema = new mongoose.Schema({
  accounts: [AccountSchema],
  phones: [PhoneSchema],
  suburbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb",
  },
  mapUrl: { type: String },
});

SuburbDataSchema.statics = {
  Save: function (suburbData) {
    const data = new this(suburbData);
    return data.save();
  },
  GetDataBySuburb: function (suburbId) {
    return this.find({ suburbId }).lean();
  },
  AddAccount: function (newAccount, suburbId) {
    return this.findOneAndUpdate(
      { suburbId },
      { $push: { accounts: newAccount } },
      { new: true }
    );
  },
  AddPhone: function (newPhone, suburbId) {
    return this.findOneAndUpdate(
      { suburbId },
      { $push: { phones: newPhone } },
      { new: true }
    );
  },
  RemovePhone: function (phoneId, suburbId) {
    return this.findOneAndUpdate(
      { suburbId },
      { $pull: { phones: { _id: phoneId } } },
      { new: true }
    );
  },
  RemoveAccount: function (accountId, suburbId) {
    return this.findOneAndUpdate(
      { suburbId },
      { $pull: { accounts: { _id: accountId } } },
      { new: true }
    );
  },
  EditMap: function (mapUrl, suburbId) {
    return this.findOneAndUpdate({ suburbId }, { mapUrl }, { new: true });
  },
};

const SuburbData = mongoose.model("SuburbData", SuburbDataSchema);

module.exports = SuburbData;
