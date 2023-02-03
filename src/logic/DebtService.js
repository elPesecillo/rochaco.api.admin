/* eslint-disable indent */
const dayjs = require("dayjs");
const Debt = require("../models/Debt");
const DebtConfig = require("../models/DebtConfig");
const DebtAssignationConfig = require("../models/DebtAssignationConfig");
const DebtPayment = require("../models/DebtPayment");
const Address = require("./addressService");
const {
  AUTOMATIC_DEBT_TYPE,
  MANUAL_DEBT_TYPE,
  DEBT_STATUS_PENDING,
  DEBT_STATUS_PAID,
  DEBT_STATUS_IN_REVIEW,
  DEBT_STATUS_CHARGED,
  DEBT_STATUS_EXPIRED,
  PAYMENT_STATUS_PENDING,
  PAYMENT_STATUS_REJECTED,
  PAYMENT_STATUS_APPROVED,
  PAYMENT_COMMENT_STATUS_CREATED,
  PAYMENT_COMMENT_STATUS_APPROVED,
  PAYMENT_COMMENT_STATUS_UPDATED,
  JOB_STATUS_FAILED,
  JOB_STATUS_SUCCESS,
  DEBT_STATUS_CANCELLED,
  PAYMENT_STATUS_IN_REVIEW,
} = require("../constants/DebtTypes");
const DebtConfigScheduled = require("../models/DebtConfigScheduled");
const { UploadBlob } = require("./blobService");

const ValidateDebtConfig = async (debt) => {
  const errors = {};
  if (
    debt.type === AUTOMATIC_DEBT_TYPE &&
    (!debt.chargeOnDay || !debt.chargeEvery || !debt.generateUpTo)
  ) {
    errors.automaticConfig =
      "Charge on day, charge every, and generate up to are required for automatic debts";
  }
  if (debt._id) {
    const debtConfig = await DebtConfig.GetConfigById(debt._id);
    if (!debtConfig) {
      errors.debtConfig = "Debt config not found";
    }
  }
  return errors;
};

const GetDebtConfigsBySuburbId = async (suburbId) => {
  const debts = await DebtConfig.GetConfigBySuburbId(suburbId);
  return debts;
};

const GetDebtConfigById = async (debtConfigId) => {
  const debt = await DebtConfig.GetConfigById(debtConfigId);
  return debt;
};

const SaveDebtConfig = async (debt) => {
  const errors = await ValidateDebtConfig(debt);
  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }
  const createdAt = new Date();
  const timeStamp = new Date();
  const savedDebt = await DebtConfig.SaveConfig({
    ...debt,
    createdAt,
    timeStamp,
  });
  return savedDebt;
};

const UpdateDebtConfig = async (updateDebt) => {
  const debt = updateDebt;
  const errors = await ValidateDebtConfig(debt);
  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }
  if (debt.createdAt) {
    delete debt.createdAt;
  }
  const timeStamp = new Date();
  const updatedDebt = await DebtConfig.UpdateConfig({ ...debt, timeStamp });
  return updatedDebt;
};

const DeactivateDebtConfig = async (debtId) => {
  const updatedDebt = await DebtConfig.DeactivateConfig(debtId);
  return updatedDebt;
};

const GetDebtAssignmentsByDebtConfigId = async (debtConfigId) => {
  const debtAssignations =
    await DebtAssignationConfig.GetAssignationsByDebtConfigId(debtConfigId);
  return debtAssignations;
};

const UpdateDebtAssignments = async (debtAssignations) => {
  if (debtAssignations.length === 0) {
    throw new Error("No debts to update");
  }
  const debtConfig = await DebtConfig.GetConfigById(
    debtAssignations[0].debtConfigId
  );
  if (!debtConfig) {
    throw new Error("Debt config not found");
  }
  const timeStamp = new Date();
  const debtsToDelete = debtAssignations.filter((debt) => debt.delete === true);
  const debtsToSave = debtAssignations.filter((debt) => debt.delete === false);
  const currentDebtAssignations =
    await DebtAssignationConfig.GetAssignationsByDebtConfigId(debtConfig._id);
  const uniqueDebtsToSave = debtsToSave.filter(
    (debt) =>
      !currentDebtAssignations.some(
        (currentDebt) =>
          currentDebt.addressId.toString() === debt.addressId.toString()
      )
  );
  const deletedDebtAssignations = await DebtAssignationConfig.DeleteMany(
    debtsToDelete.map((debt) => ({
      debtConfigId: debt.debtConfigId,
      addressId: debt.addressId,
    }))
  );

  const savedDebtAssignations = await DebtAssignationConfig.SaveMany(
    uniqueDebtsToSave.map((debt) => ({
      ...debt,
      suburbId: debtConfig.suburbId,
      debtConfigId: debtConfig._id,
      timeStamp,
    }))
  );
  return {
    deleted: deletedDebtAssignations,
    saved: savedDebtAssignations,
  };
};

const GeneratePeriods = (startAt, numberOfPeriods) => {
  const periods = [];
  for (let i = 0; i < numberOfPeriods; i += 1) {
    const period = dayjs(startAt).add(i, "month").startOf("month");
    periods.push(period);
  }
  return periods;
};

const GenerateRawDebts = (addresses, periods, debtConfig) => {
  const rawDebts = [];
  addresses.forEach((addressId) => {
    periods.forEach((period) => {
      rawDebts.push({
        suburbId: debtConfig.suburbId,
        addressId,
        status: DEBT_STATUS_PENDING,
        chargeDate: dayjs(period).add(
          Number.parseInt(debtConfig.chargeOnDay, 10) - 1,
          "day"
        ),
        expirationDate: dayjs(period).add(
          Number.parseInt(debtConfig.chargeExpiresOnDay, 10) - 1,
          "day"
        ),
        periodDate: period,
        amount: debtConfig.amount,
        missingAmount: debtConfig.missingAmount,
      });
    });
  });
  return rawDebts;
};

const GetAutomaticDebtConfigs = async () => {
  const debts = await DebtConfig.GetAutomaticConfigs();
  return debts;
};

const GenerateAutomaticDebts = async (debtConfigId) => {
  const startOfMonth = dayjs(new Date()).startOf("month");
  const debtConfig = await DebtConfig.GetConfigById(debtConfigId);
  if (debtConfig.type !== AUTOMATIC_DEBT_TYPE) {
    return {
      status: JOB_STATUS_FAILED,
      message: `Debt config is not automatic ${debtConfigId}, time stamp ${new Date()}`,
    };
  }
  const { assignAllAddresses, generateUpTo, expirationDate } = debtConfig;

  const expirationDateMonth = dayjs(expirationDate).startOf("month");

  // Get last period created
  const lastDebtConfigScheduled =
    await DebtConfigScheduled.GetLatestScheduledConfigByConfigId(debtConfigId);
  // get number of months to generate
  const monthDiff = lastDebtConfigScheduled?.lastPeriod
    ? Number.parseInt(
        startOfMonth.diff(lastDebtConfigScheduled.lastPeriod, "month"),
        10
      ) -
      1 +
      generateUpTo
    : generateUpTo;
  if (monthDiff === 0) {
    return {
      status: JOB_STATUS_FAILED,
      message: `No months to generate debts for debt config ${debtConfigId}, time stamp ${new Date()}`,
    };
  }

  // Get addresses to generate debts
  let addresses = [];
  if (assignAllAddresses) {
    addresses = (await Address.getAddressesBySuburbId(debtConfig.suburbId)).map(
      (address) => address._id
    );
  } else {
    addresses = (await GetDebtAssignmentsByDebtConfigId(debtConfigId)).map(
      (assignation) => assignation.addressId
    );
  }
  if (addresses.length === 0) {
    return {
      status: JOB_STATUS_FAILED,
      message: `No addresses to generate debts for debt config ${debtConfigId}, time stamp ${new Date()}`,
    };
  }

  const periodStartAt = lastDebtConfigScheduled?.lastPeriod
    ? dayjs(lastDebtConfigScheduled.lastPeriod).add(1, "month").startOf("month")
    : startOfMonth;

  // Generate periods for debts
  const periods = GeneratePeriods(periodStartAt, monthDiff);

  // remove periods after expiration date
  const periodsToGenerate = periods.filter(
    (period) => period <= expirationDateMonth
  );

  if (periodsToGenerate.length === 0) {
    return {
      status: JOB_STATUS_FAILED,
      message: `No periods to generate debts for debt config ${debtConfigId} due expiration date for this config is ${expirationDateMonth} time stamp ${new Date()}`,
    };
  }
  const rawDebts = GenerateRawDebts(addresses, periodsToGenerate, debtConfig);
  const currentDebts = await Debt.GetByAddressesAndPeriods(
    addresses.map((address) => address._id),
    periodsToGenerate
  );

  const debtsToSave = rawDebts.filter(
    (rawDebt) =>
      !currentDebts.some(
        (currentDebt) =>
          currentDebt.addressId === rawDebt.addressId &&
          currentDebt.periodDate === rawDebt.periodDate
      )
  );
  const debtsSaved = await Debt.SaveDebts(debtsToSave);
  if (debtsSaved.length > 0) {
    // at last insert the debt config scheduled
    await DebtConfigScheduled.Save({
      debtConfigId,
      createdAt: new Date(),
      recordsGenerated: debtsSaved.length,
      lastPeriod: periodsToGenerate[periodsToGenerate.length - 1],
    });
  }
  return {
    status: JOB_STATUS_SUCCESS,
    message: `Job id ${debtConfigId} completed at ${new Date()}, records generated ${
      debtsSaved.length
    }`,
    data: debtsSaved,
  };
};

const ApplyDebtsToAddresses = async (debtConfigId, addressesIds) => {
  const debtConfig = await DebtConfig.GetConfigById(debtConfigId);
  if (debtConfig.type !== MANUAL_DEBT_TYPE) {
    throw new Error(`Debt config is not manual ${debtConfigId}`);
  }

  const addresses = await Address.GetAddressesByAddressesIds(addressesIds);

  const currentDay = dayjs(new Date()).startOf("day");
  const debts = addresses.map((address) => ({
    suburbId: debtConfig.suburbId,
    addressId: address._id,
    status: DEBT_STATUS_PENDING,
    chargeDate: dayjs(currentDay).add(
      Number.parseInt(debtConfig.chargeOnDay, 10) - 1,
      "day"
    ),
    expirationDate: dayjs(currentDay).add(
      Number.parseInt(debtConfig.chargeExpiresOnDay, 10) - 1,
      "day"
    ),
    periodDate: currentDay,
    amount: debtConfig.amount,
    missingAmount: debtConfig.missingAmount,
  }));
  const debtsSaved = await Debt.SaveDebts(debts);

  // TODO: send push notification to affected users
  return debtsSaved;
};

const GetDebtsBySuburbPaginated = async (
  suburbId,
  statuses,
  page,
  pageSize
) => {
  const selectedStatuses =
    statuses === "all"
      ? `${DEBT_STATUS_PENDING},${DEBT_STATUS_PAID},${DEBT_STATUS_IN_REVIEW},${DEBT_STATUS_CANCELLED}`
      : statuses;
  const debts = await Debt.GetDebtsPaginatedBySuburbId(
    suburbId,
    selectedStatuses.split(","),
    page,
    pageSize
  );
  return debts;
};

const GetDebtsByAddressId = async (addressId, statuses) => {
  const selectedStatuses =
    statuses === "all"
      ? `${DEBT_STATUS_PENDING},${DEBT_STATUS_PAID},${DEBT_STATUS_IN_REVIEW},${DEBT_STATUS_CANCELLED}`
      : statuses;
  const debts = await Debt.GetDebtsByAddressId(
    addressId,
    selectedStatuses.split(",")
  );
  return debts;
};

const UpdateDebtsReadyToBeCharged = async (
  suburbId,
  currentDate = new Date()
) => {
  if (!suburbId) {
    return {
      status: JOB_STATUS_FAILED,
      message: `No suburb id provided`,
    };
  }

  const debts = await Debt.GetDebtsReadyToChargeBySuburb(
    suburbId,
    currentDate,
    [DEBT_STATUS_PENDING]
  );
  if (debts.length === 0) {
    return {
      status: JOB_STATUS_FAILED,
      message: `No debts found for current suburb ${suburbId} and period date ${currentDate}`,
    };
  }
  const updatedDebts = await Debt.UpdateManyDebtStatus(
    debts.map((debt) => debt._id.toString()),
    DEBT_STATUS_CHARGED
  );
  return {
    status: JOB_STATUS_SUCCESS,
    message: `Job id ${suburbId} completed at ${new Date()}, records updated ${
      updatedDebts?.n
    }`,
    data: debts,
  };
};

const UpdateDebtsExpired = async (suburbId, currentDate = new Date()) => {
  if (!suburbId) {
    return {
      status: JOB_STATUS_FAILED,
      message: `No suburb id provided`,
    };
  }

  const debts = await Debt.GetDebtsExpiredBySuburb(suburbId, currentDate, [
    DEBT_STATUS_PENDING,
    DEBT_STATUS_CHARGED,
  ]);
  if (debts.length === 0) {
    return {
      status: JOB_STATUS_FAILED,
      message: `No debts found for current suburb ${suburbId} and period date ${currentDate}`,
    };
  }
  const updatedDebts = await Debt.UpdateManyDebtStatus(
    debts.map((debt) => debt._id.toString()),
    DEBT_STATUS_EXPIRED
  );
  return {
    status: JOB_STATUS_SUCCESS,
    message: `Job id ${suburbId} completed at ${new Date()}, records updated ${
      updatedDebts?.n
    }`,
    data: debts,
  };
};

const GetDebtPaymentBySuburb = async (suburbId, statuses, page, limit) => {
  const selectedStatuses =
    statuses === "all"
      ? `${PAYMENT_STATUS_PENDING},${PAYMENT_STATUS_APPROVED},${PAYMENT_STATUS_REJECTED},${PAYMENT_STATUS_IN_REVIEW}`
      : statuses;
  const payments = await DebtPayment.GetBySuburbPaginated(
    suburbId,
    selectedStatuses.split(","),
    page,
    limit
  );
  return payments;
};

const GetTotalAmountFromDebts = async (debts) => {
  const totalAmount = debts.reduce((acc, debt) => acc + debt.amount, 0);
  return totalAmount;
};

const DebtPaymentValidations = async (
  debts,
  amount,
  paymentId,
  validPrevStatus
) => {
  if (debts.length === 0) {
    throw new Error("At least one debt is required");
  }
  const totalAmount = await GetTotalAmountFromDebts(debts);
  if (totalAmount !== amount) {
    throw new Error("Amount is not equal to debts amount");
  }
  let oldDebtPayment = null;
  if (paymentId && validPrevStatus) {
    oldDebtPayment = await DebtPayment.GetById(paymentId);
    if (oldDebtPayment.status !== validPrevStatus) {
      throw new Error(`Payment is not in ${validPrevStatus} status`);
    }
  }

  return { totalAmount, oldDebtPayment };
};

const GenerateBlobFiles = (files) => {
  const blobFiles = files.map((file) => ({
    ...file,
    name: file.originalname,
    uri: file.buffer.toString("base64"),
  }));
  return blobFiles;
};

const SaveDebtPayment = async (debtPayment) => {
  const status = PAYMENT_STATUS_PENDING;
  const { files: rawFiles, debts, amount } = debtPayment;
  await DebtPaymentValidations(debts, amount);
  const unprocessedFiles = GenerateBlobFiles(rawFiles);

  const files = await UploadBlob(unprocessedFiles, "receipts");
  const createdAt = new Date();
  const savedPayment = (
    await DebtPayment.SavePayment({
      ...debtPayment,
      status,
      receiptData: files.map((file) => ({
        url: file.url,
        fileName: file.filename,
        date: new Date(),
        userId: debtPayment.userId,
      })),
      statusHistory: [
        {
          status,
          date: new Date(),
          userId: debtPayment.userId,
          comment: PAYMENT_COMMENT_STATUS_CREATED,
        },
      ],
      createdAt,
    })
  ).toObject();
  await Debt.UpdateManyDebtStatus(
    savedPayment.debts.map((debt) => debt.debtId.toString()),
    DEBT_STATUS_IN_REVIEW,
    debtPayment.userId,
    savedPayment
  );

  // TODO: send push notification to admins
  return savedPayment;
};

const AcceptDebtPayment = async (paymentId, userId, comment) => {
  const payment = await DebtPayment.GetById(paymentId);
  if (payment.status !== PAYMENT_STATUS_PENDING) {
    throw new Error("Payment is not pending");
  }
  const status = PAYMENT_STATUS_APPROVED;

  const updatedPayment = (
    await DebtPayment.UpdateStatus(paymentId, status, userId, comment)
  ).toObject();
  await Debt.UpdateManyDebtStatus(
    payment.debts.map((debt) => debt.debtId.toString()),
    DEBT_STATUS_PAID,
    userId
  );
  // TODO: send push notification to user who made the payment
  return updatedPayment;
};

const RejectDebtPayment = async (paymentId, userId, comment) => {
  const payment = await DebtPayment.GetById(paymentId);
  if (payment.status !== PAYMENT_STATUS_PENDING) {
    throw new Error("Payment is not pending");
  }
  const status = PAYMENT_STATUS_REJECTED;

  const updatedStatus = await DebtPayment.UpdateStatus(
    paymentId,
    status,
    userId,
    comment
  );
  await Debt.UpdateManyDebtStatus(
    payment.debts.map((debt) => debt.debtId.toString()),
    DEBT_STATUS_PENDING,
    userId
  );

  await Debt.RemoveDebtsPayments(
    payment.debts.map((debt) => debt.debtId.toString()),
    paymentId
  );

  // TODO: send push notification to user who made the payment
  return updatedStatus;
};

const EditDebtPayment = async (debtPayment) => {
  const { debtPaymentId, debts, amount, files: rawFiles } = debtPayment;
  const status = PAYMENT_STATUS_PENDING;
  const { oldDebtPayment } = await DebtPaymentValidations(
    debts,
    amount,
    debtPaymentId,
    PAYMENT_STATUS_REJECTED
  );

  let newReceiptData = [];
  if (rawFiles) {
    const unprocessedFiles = GenerateBlobFiles(rawFiles);
    const files = await UploadBlob(unprocessedFiles, "receipts");
    newReceiptData = [
      ...files.map((file) => ({
        url: file.url,
        fileName: file.filename,
        date: new Date(),
        userId: debtPayment.userId,
      })),
    ];
  }
  // update debts status to pending
  await Debt.UpdateManyDebtStatus(
    oldDebtPayment.debts.map((debt) => debt.debtId.toString()),
    DEBT_STATUS_PENDING,
    debtPayment.userId,
    oldDebtPayment
  );

  // remove old debts payments
  await Debt.RemoveDebtsPayments(
    oldDebtPayment.debts.map((debt) => debt.debtId.toString()),
    debtPayment._id
  );
  // update debt payment
  const updatedPayment = (
    await DebtPayment.UpdatePayment(oldDebtPayment._id.toString(), {
      ...oldDebtPayment,
      status,
      receiptData: [...oldDebtPayment.receiptData, ...newReceiptData],
      statusHistory: [
        ...oldDebtPayment.statusHistory,
        {
          status,
          date: new Date(),
          userId: debtPayment.userId,
          comment: PAYMENT_COMMENT_STATUS_UPDATED,
        },
      ],
      timeStamp: new Date(),
    })
  ).toObject();
  // add new debts payments
  await Debt.UpdateManyDebtStatus(
    updatedPayment.debts.map((debt) => debt.debtId.toString()),
    DEBT_STATUS_IN_REVIEW,
    debtPayment.userId,
    updatedPayment
  );

  // TODO: send push notification to admins
  return updatedPayment;
};

const AdminEditDebtPayment = async (debtPayment) => {
  const { debtPaymentId, debts, amount } = debtPayment;
  const status = PAYMENT_STATUS_APPROVED;
  const { oldDebtPayment } = await DebtPaymentValidations(
    debts,
    amount,
    debtPaymentId,
    PAYMENT_STATUS_PENDING
  );

  // update debts status to pending
  await Debt.UpdateManyDebtStatus(
    oldDebtPayment.debts.map((debt) => debt.debtId.toString()),
    DEBT_STATUS_PENDING,
    debtPayment.userId,
    oldDebtPayment
  );

  // remove old debts payments
  await Debt.RemoveDebtsPayments(
    oldDebtPayment.debts.map((debt) => debt.debtId.toString()),
    debtPaymentId
  );

  // update payment
  const updatedPayment = (
    await DebtPayment.UpdatePayment(debtPaymentId, {
      ...oldDebtPayment,
      ...debtPayment,
      status,
      statusHistory: [
        ...oldDebtPayment.statusHistory,
        {
          status,
          date: new Date(),
          userId: debtPayment.userId,
          comment: PAYMENT_COMMENT_STATUS_APPROVED,
        },
      ],
      timeStamp: new Date(),
    })
  ).toObject();

  // update debts status to paid
  await Debt.UpdateManyDebtStatus(
    updatedPayment.debts.map((debt) => debt.debtId.toString()),
    DEBT_STATUS_PAID,
    debtPayment.userId,
    updatedPayment
  );

  // TODO: send push notification to user who made the payment
  return updatedPayment;
};

module.exports = {
  GetDebtConfigsBySuburbId,
  SaveDebtConfig,
  GetDebtConfigById,
  UpdateDebtConfig,
  DeactivateDebtConfig,
  GetDebtAssignmentsByDebtConfigId,
  UpdateDebtAssignments,
  GetAutomaticDebtConfigs,
  GenerateAutomaticDebts,
  ApplyDebtsToAddresses,
  GetDebtsBySuburbPaginated,
  GetDebtsByAddressId,
  GetDebtPaymentBySuburb,
  UpdateDebtsReadyToBeCharged,
  UpdateDebtsExpired,
  SaveDebtPayment,
  AcceptDebtPayment,
  RejectDebtPayment,
  EditDebtPayment,
  AdminEditDebtPayment,
};
