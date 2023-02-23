const mongoose = require("mongoose");
const moment = require("moment");
const ScreenSchema = require("./schemas/config/screenSchema");
const MenuSchema = require("./schemas/config/menuSchema");

const SuburbConfigSchema = new mongoose.Schema({
  imageUrl: { type: String },
  screens: [ScreenSchema],
  menus: [MenuSchema],
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

SuburbConfigSchema.statics = {
  SaveConfig(suburbConfig) {
    const config = new this(suburbConfig);
    return config.save();
  },
  UpdateConfig(id, config) {
    return this.updateOne({ _id: id }, { ...config });
  },
};

const SuburbConfig = mongoose.model("SuburbConfig", SuburbConfigSchema);

module.exports = SuburbConfig;
