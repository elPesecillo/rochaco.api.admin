const mongoose = require("mongoose");
const moment = require("moment");
const SuburbStatusSchema = require("./schemas/suburbStatusSchema");
const SuburbFileSchema = require("./schemas/suburbFileSchema");
require("./suburbConfig");
require("./suburbStreet");

const SuburbSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  postalCode: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  transtime: {
    type: Date,
    default: moment.utc(),
  },
  userAdmins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  /*
        estatus validos:
        activacionPendiente,
        activacionRechazada
        activadoBasico,
        activadoPlus
    */
  status: [SuburbStatusSchema],
  files: [SuburbFileSchema],
  suburbInvites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuburbInvite",
    },
  ],
  config: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuburbConfig",
  },
  streets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuburbStreet",
    },
  ],
});

SuburbSchema.statics = {
  SaveSuburb(suburbObj) {
    const suburb = new this(suburbObj);
    return suburb.save();
  },
  UpdateStatus(id, newStatus) {
    let status = newStatus;
    if (!Array.isArray(status)) status = [status];
    return this.updateOne(
      { _id: id },
      {
        $addToSet: {
          status: {
            $each: status,
          },
        },
      },
      {
        multi: true,
      }
    );
  },
  UpdateStatusByName(name, newPostalCode) {
    let postalCode = newPostalCode;
    if (!Array.isArray(postalCode)) postalCode = [postalCode];
    return this.updateOne(
      { name, postalCode },
      {
        $addToSet: {
          status: {
            $each: postalCode,
          },
        },
      },
      {
        multi: true,
      }
    );
  },
  AddSuburbInvite(id, newUserInviteId) {
    let userInviteId = newUserInviteId;
    if (!Array.isArray(userInviteId)) userInviteId = [userInviteId];
    return this.updateOne(
      { _id: id },
      {
        $addToSet: {
          suburbInvites: {
            $each: userInviteId,
          },
        },
      },
      { multi: true }
    );
  },
  GetSuburb(id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("userAdmins", "User")
        .populate("suburbInvites", "SuburbInvite")
        .exec((err, result) => {
          if (err) reject(err);
          const {
            name,
            location,
            postalCode,
            active,
            transtime,
            status,
            suburbInvites,
            config,
          } = result;
          resolve({
            name,
            location,
            postalCode,
            active,
            transtime,
            status,
            suburbInvites,
            config,
          });
        });
    });
  },
  GetSuburbBasicInfo(id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      }).exec((err, result) => {
        if (err || !result) reject(err);
        if (result) {
          const { name, location, postalCode, active, transtime } = result;
          resolve({
            name,
            location,
            postalCode,
            active,
            transtime,
          });
        }
      });
    });
  },
  GetSuburbByName(postalCode, name) {
    return new Promise((resolve, reject) => {
      this.findOne({
        postalCode,
        name,
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  GetSuburbByUserId(userId) {
    return new Promise((resolve, reject) => {
      this.findOne({ userAdmins: mongoose.Types.ObjectId(userId) }).exec(
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },
  SaveSuburbConfig(id, configId) {
    return this.updateOne(
      {
        _id: id,
      },
      {
        $set: { config: configId },
      }
    );
  },
  GetSuburbConfig(id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("config")
        .exec((err, result) => {
          if (err || !result) reject(err || "No se encontro la configuracion");
          else {
            const { config } = result;
            if (config) resolve({ ...config._doc });
            else resolve({});
          }
        });
    });
  },
  SaveSuburbStreet(id, newStreetId) {
    let streetId = newStreetId;
    if (!Array.isArray(streetId)) streetId = [streetId];
    return this.updateOne(
      { _id: id },
      { $addToSet: { streets: { $each: streetId } } },
      { multi: true }
    );
  },
  GetSuburbStreets(id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("streets")
        .lean()
        .exec((err, result) => {
          if (err) reject(err);
          if (result) {
            const { streets } = result;
            if (streets) resolve({ streets: [...streets] });
            else resolve({ streets: [] });
          } else resolve({ streets: [] });
        });
    });
  },
  async GetAllSuburbs() {
    const suburbs = await this.find({ active: true }).lean();
    return suburbs;
  },
};

const Suburb = mongoose.model("Suburb", SuburbSchema);

module.exports = Suburb;
