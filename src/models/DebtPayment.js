const mongoose = require("mongoose");
const CommentSchema = require("./schemas/CommentSchema");

const DebtPaymentSchema = new mongoose.Schema({
  suburbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb",
  },
  amount: {
    type: Number,
    required: true,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
  },
  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  debts: [
    {
      debtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Debt",
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
});

DebtPaymentSchema.statics = {};

const DebtPayment = mongoose.model("DebtPayment", DebtPaymentSchema);

module.exports = DebtPayment;
