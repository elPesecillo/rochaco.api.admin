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
    return this.find({ debtConfigId }).populate("addressId").lean();
  },
  async SaveMany(debtAssignationConfigs) {
    const savedAssignations = await this.insertMany(debtAssignationConfigs);
    const populatedAssignations = await this.find({
      _id: { $in: savedAssignations.map((a) => a._id.toString()) },
    })
      .populate("addressId")
      .lean();

    return populatedAssignations;
  },
  async DeleteMany(debtAssignments) {
    if (debtAssignments.length === 0) {
      return Promise.resolve();
    }
    const assignmentsToDelete = await this.find({
      $and: [
        {
          debtConfigId: debtAssignments[0].debtConfigId,
        },
        {
          addressId: { $in: debtAssignments.map((d) => d.addressId) },
        },
      ],
    })
      .populate("addressId")
      .lean();
    await this.deleteMany({
      $and: [
        {
          debtConfigId: debtAssignments[0].debtConfigId,
        },
        {
          addressId: { $in: debtAssignments.map((d) => d.addressId) },
        },
      ],
    });

    return assignmentsToDelete;
  },
};

const DebtAssignationConfig = mongoose.model(
  "DebtAssignationConfig",
  DebtAssignationConfigSchema
);

module.exports = DebtAssignationConfig;
