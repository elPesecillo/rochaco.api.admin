const mongoose = require("mongoose");
const {
  AUTOMATIC_DEBT_TYPE,
  MANUAL_DEBT_TYPE,
  CHARGE_EVERY_MONTH,
  CHARGE_EVERY_NA,
} = require("../constants/DebtTypes");

const DebtConfigSchema = new mongoose.Schema({
  suburbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb",
    required: true,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    max: 50,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: [AUTOMATIC_DEBT_TYPE, MANUAL_DEBT_TYPE],
    required: true,
  },
  chargeEvery: {
    type: String,
    enum: [CHARGE_EVERY_MONTH, CHARGE_EVERY_NA],
    required: true,
  },
  chargeOnDay: {
    type: Number,
    min: 1,
    max: 31,
  },
  chargeExpiresOnDay: {
    type: Number,
    min: 1,
    max: 31,
  },
  limitUserPermissionsOnExpiration: {
    type: Boolean,
    default: false,
  },
  expirationDate: {
    type: Date,
  },
  generateUpTo: {
    type: Number,
    min: 1,
    max: 24,
  },
  assignAllAddresses: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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

DebtConfigSchema.statics = {
  async GetConfigBySuburbId(suburbId) {
    return this.find({ suburbId, active: true }).lean();
  },
  async GetConfigById(configId) {
    return this.findOne({ _id: configId }).lean();
  },
  async GetAutomaticConfigs() {
    return this.find({ type: AUTOMATIC_DEBT_TYPE, active: true }).lean();
  },
  async SaveConfig(config) {
    return this.create(config);
  },
  async UpdateConfig(config) {
    return this.findOneAndUpdate({ _id: config._id }, config, {
      new: true,
    });
  },
  async DeactivateConfig(configId) {
    return this.findOneAndUpdate(
      { _id: configId },
      { active: false, timeStamp: new Date() },
      { new: true }
    );
  },
};

const DebtConfig = mongoose.model("DebtConfig", DebtConfigSchema);

module.exports = DebtConfig;
