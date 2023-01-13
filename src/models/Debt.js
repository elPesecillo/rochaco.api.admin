const mongoose = require("mongoose");
const {
  DEBT_STATUS_PENDING,
  DEBT_STATUS_IN_REVIEW,
  DEBT_STATUS_PAID,
  DEBT_STATUS_EXPIRED,
  DEBT_STATUS_CANCELLED,
} = require("../constants/DebtTypes");

const DebtSchema = new mongoose.Schema({
  suburbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb",
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  status: {
    type: String,
    enum: [
      DEBT_STATUS_PENDING,
      DEBT_STATUS_IN_REVIEW,
      DEBT_STATUS_PAID,
      DEBT_STATUS_EXPIRED,
      DEBT_STATUS_CANCELLED,
    ],
  },
  chargeDate: {
    type: Date,
  },
  expirationDate: {
    type: Date,
  },
  periodDate: {
    type: Date,
  },
  amount: {
    type: Number,
    required: true,
  },
  missingAmount: {
    type: Number,
  },
  payments: [
    {
      debtPaymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DebtPayment",
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
});

DebtSchema.statics = {
  async GetByAddressesAndPeriods(addressIds, periodDates) {
    return this.find({
      addressId: { $in: addressIds },
      periodDate: { $in: periodDates },
    }).lean();
  },
  async SaveDebts(debts) {
    return this.insertMany(debts);
  }
};

const Debt = mongoose.model("Debt", DebtSchema);

module.exports = Debt;
