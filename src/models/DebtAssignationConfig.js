const mongoose = require("mongoose");

const DebtAssignationConfigSchema = new mongoose.Schema({
  suburbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb",
    required: true,
  },
  debtConfigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DebtConfig",
    required: true,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

DebtAssignationConfigSchema.statics = {
  async GetAssignationsBySuburbId(suburbId) {
    return this.find({ suburbId }).lean();
  },
  async GetAssignationsByDebtConfigId(debtConfigId) {
    return this.find({ debtConfigId }).lean();
  },
  async SaveMany(debtAssignationConfigs) {
    return this.insertMany(debtAssignationConfigs);
  },
  async DeleteMany(debtAssignments) {
    if (debtAssignments.length === 0) {
      return Promise.resolve();
    }
    return this.deleteMany({
      $and: [
        {
          debtConfigId: debtAssignments[0].debtConfigId,
        },
        {
          addressId: { $in: debtAssignments.map((d) => d.addressId) },
        },
      ],
    });
  },
};

const DebtAssignationConfig = mongoose.model(
  "DebtAssignationConfig",
  DebtAssignationConfigSchema
);

module.exports = DebtAssignationConfig;
