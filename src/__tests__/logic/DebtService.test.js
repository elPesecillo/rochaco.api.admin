/* eslint-disable no-undef */
const seeds = require("../db");
const debtService = require("../../logic/DebtService");
const debtConfigMock = require("../mocks/debtConfig");

let suburbData = null;
beforeAll(async () => {
  suburbData = await seeds.InitializeDb();
});

afterAll(async () => {
  await suburbData.mongoServer.ClearDatabase();
  await suburbData.mongoServer.CloseDatabase();
});

describe("DebtService", () => {
  describe("Debt Config", () => {
    it("should return all configs", async () => {
      const result = await debtService.GetDebtConfigsBySuburbId(
        suburbData.suburb.id
      );
      expect(result.length).toBe(1);
      expect(result[0]).toMatchObject(debtConfigMock.DefaultConfigMock);
    });

    it("should throw an error when saving an invalid config", async () => {
      try {
        await debtService.SaveDebtConfig({
          ...debtConfigMock.DefaultConfigMock,
          chargeOnDay: null,
        });
      } catch (err) {
        expect(err.message).toBe(
          '{"automaticConfig":"Charge on day, charge every, and generate up to are required for automatic debts"}'
        );
      }
    });
    it("should throw an error if suburb id doesn't exists", async () => {
      try {
        await debtService.SaveDebtConfig({
          ...debtConfigMock.DefaultConfigMock,
          userId: suburbData.adminUser._id.toString(),
        });
      } catch (err) {
        expect(err.message).toBe(
          "DebtConfig validation failed: suburbId: Path `suburbId` is required."
        );
      }
    });
    it("should update a debt config", async () => {
      const newExpirationDate = new Date("2028-01-01");
      const saveAdditionalConfig = await debtService.SaveDebtConfig({
        ...debtConfigMock.AdditionalConfigMock,
        suburbId: suburbData.suburb.id,
        userId: suburbData.adminUser._id.toString(),
      });
      const updatedConfig = await debtService.UpdateDebtConfig({
        ...debtConfigMock.AdditionalConfigMock,
        _id: saveAdditionalConfig.id,
        chargeExpiresOnDay: 12,
        expirationDate: newExpirationDate,
      });

      expect(updatedConfig.expirationDate.toString()).toBe(
        newExpirationDate.toString()
      );
    });
    it("should throw an error if config id doesn't exists", async () => {
      try {
        await debtService.UpdateDebtConfig({
          ...debtConfigMock.AdditionalConfigMock,
          _id: "5f6b0f6d7d6b9b1c8c1f1f1f",
          chargeExpiresOnDay: 12,
        });
      } catch (err) {
        expect(err.message).toBe('{"debtConfig":"Debt config not found"}');
      }
    });
  });
});
