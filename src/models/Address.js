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
  SaveSuburbStreet: function (suburbId, name, numbers) {
    let addresses = numbers.map((number) => ({ suburbId, name, number }));
    return new Promise((resolve, reject) => {
      Address.insertMany(addresses)
        .then((value) => {
          resolve(value);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  GetStreetsBySuburb: function (suburbId) {
    return new Promise((resolve, reject) => {
      this.find({ suburbId: suburbId })
        .lean()
        .exec((err, result) => {
          if (err) reject(err);
          if (result) {
            let addresses = result.map((s) => ({
              street: s.name,
              number: s.number,
              transtime: s.transtime,
            }));
            let streets = addresses.reduce((streets, street) => {
              if (
                streets.filter((s) => s.street === street.street).length > 0
              ) {
                let existing = streets.filter(
                  (s) => s.street === street.street
                )[0];
                streets = [
                  ...streets.filter((s) => s.street !== street.street),
                  {
                    ...existing,
                    numbers: [...existing.numbers.map((e) => e), street.number],
                  },
                ];
              } else {
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
            resolve({ streets: streets });
          }
        });
    });
  },
  GetAddressesBySuburb: function (suburbId) {
    return this.find({ suburbId: suburbId })
      .sort({ name: 'asc', number: 'asc' })
      .lean();
  },
  GetAddressByNameAndNumber: function (streetName, number) {
    return this.findOne({ name: streetName, number: number }).lean();
  },
};

const Address = mongoose.model("Address", AddressSchema);

module.exports = Address;
