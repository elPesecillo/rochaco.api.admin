const mongoose = require("mongoose");
const moment = require("moment");

const AddressSchema = new mongoose.Schema({
  suburbId: {
    type: String,
  },
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

AddressSchema.statics = {
  async GetAddressesByCoincidences(suburbId, address) {
    return this.find({
      suburbId,
      $or: [
        { name: { $regex: address, $options: "i" } },
        { number: { $regex: address, $options: "i" } },
      ],
    }).lean();
  },
  async SaveSuburbStreet(suburbId, name, numbers) {
    const addresses = numbers.map((number) => ({ suburbId, name, number }));

    return this.insertMany(addresses);
  },
  async GetAddressesByAddressesIds(addressesIds) {
    return this.find({ _id: { $in: addressesIds } }).lean();
  },
  GetStreetsBySuburb(suburbId) {
    return new Promise((resolve, reject) => {
      this.find({ suburbId })
        .lean()
        .exec((err, result) => {
          if (err) reject(err);
          if (result) {
            const addresses = result.map((s) => ({
              street: s.name,
              number: s.number,
              transtime: s.transtime,
            }));
            // eslint-disable-next-line no-shadow
            const streets = addresses.reduce((streets, street) => {
              if (
                streets.filter((s) => s.street === street.street).length > 0
              ) {
                const existing = streets.filter(
                  (s) => s.street === street.street
                )[0];
                // eslint-disable-next-line no-param-reassign
                streets = [
                  ...streets.filter((s) => s.street !== street.street),
                  {
                    ...existing,
                    numbers: [...existing.numbers.map((e) => e), street.number],
                  },
                ];
              } else {
                // eslint-disable-next-line no-param-reassign
                streets = [
                  ...streets,
                  {
                    street: street.street,
                    numbers: [street.number],
                    transtime: street.transtime,
                  },
                ];
              }
              return streets;
            }, []);
            resolve({ streets });
          }
        });
    });
  },
  GetAddressesBySuburb(suburbId) {
    return this.find({ suburbId }).sort({ name: "asc", number: "asc" }).lean();
  },
  GetAddressByNameAndNumber(streetName, number) {
    return this.findOne({ name: streetName, number }).lean();
  },
};

const Address = mongoose.model("Address", AddressSchema);

module.exports = Address;
