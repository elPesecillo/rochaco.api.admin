const db = require("./connection");
const suburbService = require("../../logic/suburbService");
const addressService = require("../../logic/addressService");
const userService = require("../../logic/userService");
const debtService = require("../../logic/DebtService");
const suburbMock = require("../mocks/suburb");
const addressMocks = require("../mocks/address");
const userMocks = require("../mocks/user");
const debtConfigMock = require("../mocks/debtConfig");

const InitSuburbConfig = async () => {
  const suburb = await suburbService.saveSuburb(suburbMock);
  return suburb;
};

const InitSuburbAddresses = async (suburbId) => {
  const addresses = await addressService.saveSuburbStreet(
    suburbId,
    addressMocks.StreetMock
  );
  return addresses;
};

const InitAdminUser = async (suburbId, address) => {
  const user = await userService.saveUserWithPassword({
    ...userMocks.AdminUserMock,
    suburb: suburbId,
    street: address.name,
    streetNumber: address.number,
  });
  return user.userData;
};

const InitDebtConfig = async (suburbId, userId) => {
  const debtConfig = await debtService.SaveDebtConfig({
    ...debtConfigMock.DefaultConfigMock,
    suburbId,
    userId,
  });
  return debtConfig;
};

const InitDebtAssignments = async (
  debtConfigId,
  addressId,
  suburbId,
  userId
) => {
  console.log(debtConfigId, addressId, suburbId, userId);
  const debtAssignments = await debtService.UpdateDebtAssignments([
    {
      debtConfigId,
      addressId,
      delete: false,
      suburbId,
      userId,
    },
  ]);
  return debtAssignments;
};

exports.InitializeDb = async () => {
  const mongoServer = await db.InitMongoServer();
  await mongoServer.Connect();

  const suburb = await InitSuburbConfig();
  const addresses = await InitSuburbAddresses(suburb.id);
  const adminUser = await InitAdminUser(suburb.id, addresses[0]);
  const defaultDebtConfig = await InitDebtConfig(
    suburb.id,
    adminUser._id.toString()
  );

  const defaultDebtAssigments = await InitDebtAssignments(
    defaultDebtConfig._id.toString(),
    adminUser.addressId,
    suburb.id,
    defaultDebtConfig.userId
  );
  return {
    mongoServer,
    suburb,
    addresses,
    adminUser,
    defaultDebtConfig,
    defaultDebtAssigments,
  };
};
