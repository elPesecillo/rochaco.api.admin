const mongoose = require("mongoose");
const moment = require("moment");
const ScreenSchema = require("./schemas/config/screenSchema");

const SuburbConfigSchema = new mongoose.Schema({
  imageUrl: { type: String },
  screens: [ScreenSchema],
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

SuburbConfigSchema.statics = {
  SaveConfig: function (suburbConfig) {
    let config = new this(suburbConfig);
    return config.save();
  },
  UpdateConfig: function (id, config) {
    return this.updateOne({ _id: id }, { ...config });
  },
};

const SuburbConfig = mongoose.model("SuburbConfig", SuburbConfigSchema);

module.exports = SuburbConfig;
