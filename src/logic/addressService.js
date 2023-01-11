const Address = require("../models/Address");
const Suburb = require("../models/suburb");
const User = require("../models/user");

const migrateAddresses = async (suburbId) => {
  try {
    const suburbAddresses = await Suburb.GetSuburbStreets(suburbId);
    const promises = [];
    suburbAddresses.streets.forEach((address) => {
      promises.push(
        Address.SaveSuburbStreet(suburbId, address.street, address.numbers)
      );
    });
    let savedAddresses = await Promise.all(promises);
    const suburbUsers = await User.getUsersBySuburb(suburbId);
    // eslint-disable-next-line no-console
    console.log(suburbUsers);
    const updateUserPromises = [];
    savedAddresses = [].concat(...savedAddresses);
    suburbUsers.forEach((user) => {
      let address = savedAddresses.filter(
        (a) => a.name === user.street && a.number === user.streetNumber
      );
      address = address.length > 0 ? address[0]._id.toString() : "";
      if (address) {
        updateUserPromises.push(
          User.updateUser({
            ...user,
            _id: user._id.toString(),
            addressId: address,
          })
        );
      }
    });
    await Promise.all(updateUserPromises);
    return savedAddresses;
  } catch (err) {
    throw err;
  }
};

const getSuburbStreets = async (suburbId) => {
  try {
    return await Address.GetStreetsBySuburb(suburbId);
  } catch (err) {
    throw err;
  }
};

const saveSuburbStreet = async (suburbId, street) => {
  try {
    return await Address.SaveSuburbStreet(
      suburbId,
      street.street,
      street.numbers
    );
  } catch (err) {
    throw err;
  }
};

const getAddressByNameAndNumber = async (streetName, number) => {
  try {
    return await Address.GetAddressByNameAndNumber(streetName, number);
  } catch (err) {
    throw err;
  }
};

const getAddressesBySuburbId = async (suburbId) => {
  try {
    return await Address.GetAddressesBySuburb(suburbId);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  migrateAddresses,
  getSuburbStreets,
  saveSuburbStreet,
  getAddressByNameAndNumber,
  getAddressesBySuburbId,
};
