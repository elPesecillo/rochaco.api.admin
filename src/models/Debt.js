const mongoose = require("mongoose");
const {
  DEBT_STATUS_PENDING,
  DEBT_STATUS_IN_REVIEW,
  DEBT_STATUS_PAID,
  DEBT_STATUS_CANCELLED,
  DEBT_STATUS_EXPIRED,
  DEBT_STATUS_CHARGED,
} = require("../constants/DebtTypes");

const MAX_LIMIT = 50;

const DebtSchema = new mongoose.Schema({
  suburbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Suburb",
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  debtConfigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DebtConfig",
  },
  status: {
    type: String,
    enum: [
      DEBT_STATUS_PENDING,
      DEBT_STATUS_CHARGED,
      DEBT_STATUS_IN_REVIEW,
      DEBT_STATUS_PAID,
      DEBT_STATUS_EXPIRED,
      DEBT_STATUS_CANCELLED,
    ],
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: [
          DEBT_STATUS_PENDING,
          DEBT_STATUS_CHARGED,
          DEBT_STATUS_IN_REVIEW,
          DEBT_STATUS_PAID,
          DEBT_STATUS_EXPIRED,
          DEBT_STATUS_CANCELLED,
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
    },
  ],
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
  async GetDebtsByIds(debtIds) {
    return this.find({ _id: { $in: debtIds } }).lean();
  },
  async SaveDebts(debts) {
    return this.insertMany(debts);
  },
  async UpdateManyDebtStatus(debtIds, status, userId, debtPayments) {
    const addDebtPayment = !!debtPayments;
    if (!addDebtPayment) {
      return this.updateMany(
        { _id: { $in: debtIds } },
        {
          $set: {
            status,
          },
          $push: {
            statusHistory: {
              status,
              date: Date.now(),
              userId,
            },
          },
        }
      );
    }

    const updatePromises = [];
    debtIds.forEach((debtId) => {
      const selectedDebt = debtPayments.debts.find(
        (debt) => debt.debtId.toString() === debtId
      );
      if (selectedDebt) {
        updatePromises.push(
          this.updateOne(
            { _id: debtId },
            {
              $set: {
                status,
              },
              $push: {
                statusHistory: {
                  status,
                  date: Date.now(),
                  userId,
                },
                payments: {
                  debtPaymentId: debtPayments._id,
                  amount: selectedDebt.amount,
                },
              },
            },
            { new: true }
          )
        );
      }
    });
    return Promise.all(updatePromises);
  },
  async RemoveDebtsPayments(debtIds, paymentId) {
    return this.updateMany(
      { _id: { $in: debtIds } },
      { $pull: { payments: { debtPaymentId: paymentId } } }
    );
  },
  async GetDebtsPaginatedBySuburbId(suburbId, statuses, page, limit) {
    let selectedLimit = limit;
    let selectedPage = page;
    if (selectedLimit > MAX_LIMIT) {
      selectedLimit = MAX_LIMIT;
    }
    if (selectedPage < 0) {
      selectedPage = 0;
    }
    const query = {
      suburbId,
      status: { $in: statuses },
    };

    return this.find(query)
      .sort({ periodDate: "asc" })
      .skip(selectedPage * selectedLimit)
      .limit(limit)
      .lean();
  },
  async GetDebtsByAddressId(addressId, statuses) {
    const query = {
      addressId,
      status: { $in: statuses },
    };
    return this.find(query)
      .sort({ periodDate: "asc" })
      .populate("addressId")
      .populate("debtConfigId")
      .lean();
  },
  async GetDebtsReadyToChargeBySuburb(suburbId, currentDate, statuses) {
    const query = {
      suburbId,
      chargeDate: { $lte: currentDate },
      expirationDate: { $gte: currentDate },
      status: { $in: statuses },
    };
    return this.find(query).lean();
  },
  async GetDebtsExpiredBySuburb(suburbId, currentDate, statuses) {
    const query = {
      suburbId,
      expirationDate: { $lt: currentDate },
      status: { $in: statuses },
    };
    return this.find(query).lean();
  },
  async GetDebtsGroupedBySuburbId(suburbId, statuses, maxDate) {
    const query = {
      suburbId,
      status: { $in: statuses },
      periodDate: { $lte: maxDate },
    };
    return this.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$suburbId",
          total: {
            $sum: "$missingAmount",
          },
        },
      },
    ]);
  },
  async GetDebtsGroupedBySuburbIdAndAddressId(suburbId, statuses, maxDate) {
    const query = {
      suburbId,
      status: { $in: statuses },
      periodDate: { $lte: maxDate },
    };
    return this.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: { suburbId: "$suburbId", addressId: "$addressId" },
          total: {
            $sum: "$missingAmount",
          },
        },
      },
    ]);
  },
};

const Debt = mongoose.model("Debt", DebtSchema);

module.exports = Debt;
