const mongoose = require("mongoose");

const DebtConfigScheduledSchema = new mongoose.Schema({
  debtConfigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DebtConfig",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recordsGenerated: {
    type: Number,
    default: 0,
  },
  errors: [
    {
      type: String,
    },
  ],
  lastPeriod: {
    type: Date,
  },
});

DebtConfigScheduledSchema.statics = {
  async GetLatestScheduledConfigByConfigId(debtConfigId) {
    const debtConfigScheduled = await this.findOne({
      debtConfigId,
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();
    return debtConfigScheduled;
  },
  async Save(debtConfigScheduled) {
    return this.create(debtConfigScheduled);
  }
};

const DebtConfigScheduled = mongoose.model(
  "DebtConfigScheduled",
  DebtConfigScheduledSchema
);

module.exports = DebtConfigScheduled;
