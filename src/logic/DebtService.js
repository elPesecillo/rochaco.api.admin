/* eslint-disable indent */
const dayjs = require("dayjs");
const Debt = require("../models/Debt");
const DebtConfig = require("../models/DebtConfig");
const DebtAssignationConfig = require("../models/DebtAssignationConfig");
const Address = require("../models/Address");
const {
  AUTOMATIC_DEBT_TYPE,
  DEBT_STATUS_PENDING,
} = require("../constants/DebtTypes");
const DebtConfigScheduled = require("../models/DebtConfigScheduled");

const ValidateDebtConfig = (debt) => {
  const errors = {};
  if (
    debt.type === AUTOMATIC_DEBT_TYPE &&
    (!debt.chargeOnDay || !debt.chargeEvery || !debt.generateUpTo)
  ) {
    errors.automaticConfig =
      "Charge on day, charge every, and generate up to are required for automatic debts";
  }
  return errors;
};

const GetDebtConfigsBySuburbId = async (suburbId) => {
  const debts = await DebtConfig.GetConfigBySuburbId(suburbId);
  return debts;
};

const SaveDebtConfig = async (debt) => {
  const errors = ValidateDebtConfig(debt);
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
  const errors = ValidateDebtConfig(debt);
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

const GetDebtAssignationsByDebtConfigId = async (debtConfigId) => {
  const debtAssignations = await DebtConfig.GetDebAssignationsByDebtConfigId(
    debtConfigId
  );
  return debtAssignations;
};

const UpdateDebtAssignations = async (debtAssignations) => {
  const debtsToDelete = debtAssignations.filter((debt) => debt.delete === true);
  const debtsToSave = debtAssignations.filter((debt) => debt.delete === false);
  const currentDebtAssignations =
    await DebtAssignationConfig.GetDebAssignationsByDebtConfigId(
      debtAssignations[0].debtConfigId
    );
  const uniqueDebtsToSave = debtsToSave.filter(
    (debt) =>
      !currentDebtAssignations.some(
        (currentDebt) => currentDebt.addressId === debt.addressId
      )
  );
  const deletedDebtAssignations = await DebtAssignationConfig.DeleteMany(
    debtsToDelete.map((debt) => debt._id)
  );

  const savedDebtAssignations = await DebtAssignationConfig.SaveMany(
    uniqueDebtsToSave
  );
  return { deleted: deletedDebtAssignations, saved: savedDebtAssignations };
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
        chargeDate: dayjs(period).add(debtConfig.chargeOnDay, "day"),
        expirationDate: dayjs(period).add(debtConfig.chargeExpiresOnDay, "day"),
        periodDate: period,
        amount: debtConfig.amount,
        missingAmount: debtConfig.missingAmount,
      });
    });
  });
  return rawDebts;
};

const GenerateAutomaticDebts = async (debtConfigId) => {
  const currentDateJs = dayjs(new Date());
  const debtConfig = await DebtConfig.GetConfigById(debtConfigId);
  if (debtConfig.type !== AUTOMATIC_DEBT_TYPE) {
    throw new Error("Debt config is not automatic");
  }
  const { assignAllAddresses, generateUpTo } = debtConfig;
  let addresses = [];
  if (assignAllAddresses) {
    addresses = (await Address.GetAddressesBySuburbId(debtConfig.suburbId)).map(
      (address) => address._id
    );
  } else {
    addresses = await GetDebtAssignationsByDebtConfigId(debtConfigId).map(
      (assignation) => assignation.addressId
    );
  }
  if (addresses.length === 0) {
    throw new Error("No addresses to generate debts");
  }

  const lastDebtConfigScheduled =
    await DebtConfigScheduled.GetLatestScheduledConfigByConfigId(debtConfigId);
  const monthDiff = lastDebtConfigScheduled?.lastPeriod
    ? Number.parseInt(
        currentDateJs.diff(lastDebtConfigScheduled.lastPeriod, "month"),
        10
      )
    : generateUpTo;
  const periods = GeneratePeriods(
    lastDebtConfigScheduled || new Date(),
    monthDiff
  );
  const rawDebts = GenerateRawDebts(addresses, periods, debtConfig);
  const currentDebts = await Debt.GetByAddressesAndPeriods(
    addresses.map((address) => address._id),
    periods
  );

  const debtsToSave = rawDebts.filter(
    (rawDebt) =>
      !currentDebts.some(
        (currentDebt) =>
          currentDebt.addressId === rawDebt.addressId &&
          currentDebt.periodDate === rawDebt.periodDate
      )
  );
  const debtsSaved = await Debt.SaveMany(debtsToSave);
  // over here insert the debt config scheduled
  await DebtConfigScheduled.Save({
    debtConfigId,
    createdAt: new Date(),
    recordsGenerated: debtsSaved.length,
    lastPeriod: periods[periods.length - 1],
  });
  return debtsSaved;
};

module.exports = {
  GetDebtConfigsBySuburbId,
  SaveDebtConfig,
  UpdateDebtConfig,
  DeactivateDebtConfig,
  GetDebtAssignationsByDebtConfigId,
  UpdateDebtAssignations,
  GenerateAutomaticDebts,
};
