const debtService = require("../logic/DebtService");

exports.GetDebtConfigBySuburbId = async (req, res) => {
  try {
    const { suburbId } = req.query;
    const result = await debtService.GetDebtConfigsBySuburbId(suburbId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.SaveDebtConfig = async (req, res) => {
  try {
    const { debtConfig } = req.body;
    const result = await debtService.SaveDebtConfig(debtConfig);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.UpdateDebtConfig = async (req, res) => {
  try {
    const { debtConfig } = req.body;
    const result = await debtService.UpdateDebtConfig(debtConfig);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.DeactivateDebtConfig = async (req, res) => {
  try {
    const { debtConfigId } = req.query;
    const result = await debtService.DeactivateDebtConfig(debtConfigId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetDebtAssignmentsByDebtConfigId = async (req, res) => {
  try {
    const { debtConfigId } = req.query;
    const result = await debtService.GetDebtAssignmentsByDebtConfigId(
      debtConfigId
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.UpdateDebtAssignments = async (req, res) => {
  try {
    const { debtAssignments } = req.body;
    const result = await debtService.UpdateDebtAssignments(debtAssignments);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetDebtsBySuburbPaginated = async (req, res) => {
  try {
    const { suburbId, statuses, page, pageSize } = req.query;
    const result = await debtService.GetDebtsBySuburbPaginated(
      suburbId,
      statuses,
      Number.parseInt(page, 10),
      Number.parseInt(pageSize, 10)
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetDebtsByAddressId = async (req, res) => {
  try {
    const { addressId, statuses } = req.query;
    const result = await debtService.GetDebtsByAddressId(addressId, statuses);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetDebtPaymentBySuburb = async (req, res) => {
  try {
    const { suburbId, statuses, page, limit = 10 } = req.query;
    const result = await debtService.GetDebtPaymentBySuburb(
      suburbId,
      statuses,
      Number.parseInt(page, 10),
      Number.parseInt(limit, 10)
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.SaveDebtPayment = async (req, res) => {
  try {
    const { files } = req;
    const {
      suburbId,
      addressId,
      amount: rawAmount,
      userId,
      debts: rawDebts,
    } = req.body;
    const debts = JSON.parse(rawDebts);
    const amount = Number.parseFloat(rawAmount);
    const result = await debtService.SaveDebtPayment({
      files,
      suburbId,
      addressId,
      amount,
      userId,
      debts,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err?.message || err });
  }
};

exports.AcceptDebtPayment = async (req, res) => {
  try {
    const { debtPaymentId, userId, comment } = req.body;
    const result = await debtService.AcceptDebtPayment(
      debtPaymentId,
      userId,
      comment
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.RejectDebtPayment = async (req, res) => {
  try {
    const { debtPaymentId, userId, comment } = req.body;
    const result = await debtService.RejectDebtPayment(
      debtPaymentId,
      userId,
      comment
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.EditDebtPayment = async (req, res) => {
  try {
    const { files } = req;
    const {
      suburbId,
      addressId,
      debtPaymentId,
      amount: rawAmount,
      userId,
      debts: rawDebts,
    } = req.body;
    const debts = JSON.parse(rawDebts);
    const amount = Number.parseFloat(rawAmount);
    const result = await debtService.EditDebtPayment({
      files,
      suburbId,
      addressId,
      debtPaymentId,
      amount,
      userId,
      debts,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err?.message || err });
  }
};

exports.AdminEditDebtPayment = async (req, res) => {
  try {
    const { debtPayment } = req.body;
    const result = await debtService.AdminEditDebtPayment(debtPayment);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
