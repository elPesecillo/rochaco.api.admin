const mongoose = require("mongoose");
const moment = require("moment");
const { getUsersBySuburbStreet } = require("../logic/userService");

const suburbStreetSchema = new mongoose.Schema({
  street: {
    type: String,
  },
  numbers: [{ type: String }],
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

suburbStreetSchema.statics = {
  SaveStreet: function (suburbStreet) {
    let config = new this(suburbStreet);
    return config.save();
  },
  UpdateStreet: function (id, street) {
    return this.updateOne({ _id: id }, { ...street });
  },
};

const SuburbStreet = mongoose.model("SuburbStreet", suburbStreetSchema);

module.exports = SuburbStreet;
