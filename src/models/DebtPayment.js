const mongoose = require("mongoose");
const {
  PAYMENT_STATUS_PENDING,
  PAYMENT_STATUS_IN_REVIEW,
  PAYMENT_STATUS_APPROVED,
  PAYMENT_STATUS_REJECTED,
} = require("../constants/DebtTypes");

const MAX_LIMIT = 50;

const DebtPaymentSchema = new mongoose.Schema({
  suburbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb",
    required: true,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: [
      PAYMENT_STATUS_PENDING,
      PAYMENT_STATUS_IN_REVIEW,
      PAYMENT_STATUS_APPROVED,
      PAYMENT_STATUS_REJECTED,
    ],
  },
  receiptData: [
    {
      url: {
        type: String,
      },
      fileName: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  statusHistory: [
    {
      status: {
        type: String,
        enum: [
          PAYMENT_STATUS_PENDING,
          PAYMENT_STATUS_IN_REVIEW,
          PAYMENT_STATUS_APPROVED,
          PAYMENT_STATUS_REJECTED,
        ],
      },
      date: {
        type: Date,
        default: Date.now,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  timeStamp: {
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

DebtPaymentSchema.statics = {
  async GetById(paymentId) {
    return this.findById(paymentId).lean();
  },
  async GetDetailsById(paymentId) {
    return this.findById(paymentId)
      .populate("debts.debtId")
      .populate("addressId")
      .lean();
  },
  async SavePayment(payment) {
    const newPayment = new this(payment);
    return newPayment.save();
  },
  async UpdatePayment(paymentId, payment) {
    const query = {
      _id: paymentId,
    };
    const update = {
      $set: payment,
    };
    return this.findOneAndUpdate(query, update, { new: true });
  },
  async UpdateStatus(paymentId, status, userId, comment) {
    const query = {
      _id: paymentId,
    };
    const update = {
      $set: { status, timeStamp: Date.now() },
      $push: {
        statusHistory: {
          status,
          date: Date.now(),
          userId,
          comment,
        },
      },
    };
    return this.findOneAndUpdate(query, update, { new: true });
  },
  async GetBySuburbPaginated(
    suburbId,
    statuses,
    addressesIds,
    filterByAddress,
    page,
    limit
  ) {
    let selectedLimit = parseInt(limit, 10);
    let selectedPage = parseInt(page, 10);
    if (page < 0) {
      selectedPage = 0;
    }
    if (selectedLimit > MAX_LIMIT) {
      selectedLimit = MAX_LIMIT;
    }
    const query = {
      suburbId,
      status: { $in: statuses },
    };
    if (filterByAddress) {
      query.addressId = { $in: addressesIds };
    }

    const total = await this.countDocuments(query);

    const debtPayments = await this.find(query)
      .populate("addressId")
      .populate("debts.debtId")
      .sort({ createdAt: -1 })
      .skip(selectedPage * selectedLimit)
      .limit(limit)
      .lean();

    return { total, debtPayments, page, pageSize: limit };
  },
  async GetByAddressPaginated(addressId, statuses, page, limit) {
    let selectedLimit = parseInt(limit, 10);
    let selectedPage = parseInt(page, 10);
    if (page < 0) {
      selectedPage = 0;
    }
    if (selectedLimit > MAX_LIMIT) {
      selectedLimit = MAX_LIMIT;
    }
    const query = {
      addressId,
      status: { $in: statuses },
    };
    return this.find(query)
      .populate("addressId", "debts.debtId")
      .sort({ createdAt: -1 })
      .skip(selectedPage * selectedLimit)
      .limit(limit)
      .lean();
  },
};

const DebtPayment = mongoose.model("DebtPayment", DebtPaymentSchema);

module.exports = DebtPayment;
