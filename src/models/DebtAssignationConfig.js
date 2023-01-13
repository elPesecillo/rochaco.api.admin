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
  async DeleteMany(debtAssignationIds) {
    return this.deleteMany({ _id: { $in: debtAssignationIds } });
  },
};

const DebtAssignationConfig = mongoose.model(
  "DebtAssignationConfig",
  DebtAssignationConfigSchema
);

module.exports = DebtAssignationConfig;
