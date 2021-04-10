const mongoose = require("mongoose");
const moment = require("moment");
const SuburbStatusSchema = require("./schemas/suburbStatusSchema");
const SuburbFileSchema = require("./schemas/suburbFileSchema");
const suburbConfig = require("./suburbConfig");
const suburbStreet = require("./suburbStreet");

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
  ]
});

SuburbSchema.statics = {
  SaveSuburb: function (suburbObj) {
    let suburb = new this(suburbObj);
    return suburb.save();
  },
  UpdateStatus: function (id, status) {
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
  UpdateStatusByName: function (name, postalCode) {
    if (!Array.isArray(status)) status = [status];
    return this.updateOne(
      { name: name, postalCode: postalCode },
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
  AddSuburbInvite: function (id, userInviteId) {
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
  GetSuburb: function (id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("userAdmins", "User")
        .populate("suburbInvites", "SuburbInvite")
        .exec((err, result) => {
          if (err) reject(err);
          let {
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
  GetSuburbBasicInfo: function (id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      }).exec((err, result) => {
        if (err) reject(err);
        let { name, location, postalCode, active, transtime } = result;
        resolve({
          name,
          location,
          postalCode,
          active,
          transtime,
        });
      });
    });
  },
  GetSuburbByName: function (postalCode, name) {
    return new Promise((resolve, reject) => {
      this.findOne({
        postalCode: postalCode,
        name: name,
      }).exec((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  GetSuburbByUserId: function (userId) {
    return new Promise((resolve, reject) => {
      this.findOne({ userAdmins: mongoose.Types.ObjectId(userId) }).exec(
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },
  SaveSuburbConfig: function (id, configId) {
    return this.updateOne(
      {
        _id: id,
      },
      {
        $set: { config: configId },
      }
    );
  },
  GetSuburbConfig: function (id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("config")
        .exec((err, result) => {
          if (err) reject(err);
          let { config } = result;
          if (config) resolve({ ...config._doc });
          else resolve({});
        });
    });
  },
  SaveSuburbStreet: function (id, streetId) {
    if (!Array.isArray(streetId)) streetId = [streetId];
    return this.updateOne(
      { _id: id },
      { $addToSet: { streets: { $each: streetId } } },
      { multi: true }
    );
  },
  GetSuburbStreets: function (id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("streets")
        .lean()
        .exec((err, result) => {
          if (err) reject(err);
          if (result) {
            let { streets } = result;
            if (streets) resolve({ streets: [...streets] });
            else resolve({ streets: [] });
          } else resolve({ streets: [] });
        });
    });
  },
};

const Suburb = mongoose.model("Suburb", SuburbSchema);

module.exports = Suburb;
