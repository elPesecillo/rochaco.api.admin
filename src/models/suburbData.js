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
    return this.findOne({ suburbId }).lean();
  },
  AddAccount: function (newAccount, suburbId) {
    return this.findOneAndUpdate(
      { suburbId },
      { $push: { accounts: newAccount } },
      { new: true }
    );
  },
  UpdateAccount: function (account, suburbId) {
    return this.findOneAndUpdate(
      { suburbId, "accounts._id": account.id },
      {
        $set: {
          "accounts.$.account": account.account,
          "accounts.$.CLABE": account.CLABE,
          "accounts.$.cardNumber": account.cardNumber,
          "accounts.$.holder": account.holder,
        },
      },
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
  UpdatePhone: function (phone, suburbId) {
    return this.findOneAndUpdate(
      { suburbId, "phones._id": phone.id },
      {
        $set: {
          "phones.$.name": phone.name,
          "phones.$.phoneNumber": phone.phoneNumber,
        },
      },
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
