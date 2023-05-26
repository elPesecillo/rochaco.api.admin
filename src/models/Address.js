const mongoose = require("mongoose");
const moment = require("moment");
const RFIdSchema = require("./schemas/RFIdSchema");

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
  rfIds: [RFIdSchema],
});

AddressSchema.statics = {
  async GetAddressesByCoincidences(suburbId, address) {
    return this.aggregate(
      [
        {
          $project: {
            address: { $concat: ["$name", " ", "$number"] },
            suburbId: 1,
            doc: "$$ROOT",
          },
        },
        {
          $match: {
            suburbId,
            address: { $regex: address, $options: "i" },
          },
        },
      ],
      (err, result) => {
        if (err) throw err;
        return result?.map((r) => r.doc);
      }
    );
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
  GetAddressByNameNumberAndSuburbId(streetName, number, suburbId) {
    return this.findOne({ name: streetName, number, suburbId }).lean();
  },
  async AddAddressRFId(addressId, rfid) {
    const address = await this.findOne({ _id: addressId });
    if (address) {
      const alreadyExists = address.rfIds?.find((r) => r.rfid === rfid);
      if (!alreadyExists) {
        address.rfIds.push({ rfid, transtime: moment.utc() });
        return address.save();
      }
    }
    return null;
  },
  async RemoveAddressRFId(addressId, rfid) {
    const address = await this.findOne({ _id: addressId }).lean();
    if (address) {
      const alreadyExists = address.rfIds?.find((r) => r.rfid === rfid);
      if (alreadyExists) {
        const rfIds = address.rfIds.filter((r) => r.rfid !== rfid);
        return this.findOneAndUpdate(
          { _id: addressId },
          { rfIds },
          { new: true }
        );
      }
    }
    return null;
  },
  async AddRFIdToAddress(addressId, rfid) {
    const address = await this.findOne({ _id: addressId });
    if (address) {
      const alreadyExists = address.rfIds?.find((r) => r.rfid === rfid);
      if (!alreadyExists) {
        address.rfIds.push({ rfid, transtime: moment.utc() });
        return address.save();
      }
      return address;
    }
    return null;
  },
  async UpdateRFIdToAddress(addressId, rfid, newRfId) {
    const address = await this.findOne({ _id: addressId }).lean();
    if (address) {
      const alreadyExists = address.rfIds?.find((r) => r.rfid === rfid);
      if (alreadyExists) {
        const rfIds = address.rfIds.map((r) => {
          if (r.rfid === rfid) {
            return { rfid: newRfId, transtime: moment.utc() };
          }
          return r;
        });
        return this.findOneAndUpdate(
          { _id: addressId },
          { rfIds },
          { new: true, useFindAndModify: false }
        );
      }
      return address;
    }
    return null;
  },
  async RemoveRFIdFromAddress(addressId, rfid) {
    const address = await this.findOne({ _id: addressId }).lean();
    if (address) {
      const alreadyExists = address.rfIds?.find((r) => r.rfid === rfid);
      if (alreadyExists) {
        const rfIds = address.rfIds.filter((r) => r.rfid !== rfid);
        return this.findOneAndUpdate(
          { _id: addressId },
          { rfIds },
          { new: true, useFindAndModify: false }
        );
      }
      return address;
    }
    return null;
  },
  async GetAddressByAddressId(addressId) {
    return this.findOne({ _id: addressId }).lean();
  },
};

const Address = mongoose.model("Address", AddressSchema);

module.exports = Address;
