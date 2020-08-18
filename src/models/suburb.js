const mongoose = require("mongoose");
const moment = require("moment");
const SuburbStatusSchema = require("./schemas/suburbStatusSchema");
const SuburbFileSchema = require("./schemas/suburbFileSchema");

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
  GetSuburb: function (id) {
    return new Promise((resolve, reject) => {
      this.findOne({
        _id: id,
      })
        .populate("userAdmins", "User")
        .exec((err, result) => {
          if (err) reject(err);
          resolve(result);
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
};

const Suburb = mongoose.model("Suburb", SuburbSchema);

module.exports = Suburb;
