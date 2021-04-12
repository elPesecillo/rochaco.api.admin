const mongoose = require("mongoose");
const moment = require("moment");

const GlobalConfigSchema = new mongoose.Schema({
  termsAndConditions: [mongoose.Decimal128],
});

GlobalConfigSchema.statics = {
  SaveInitialConfig: function () {
    let terms = new this({ termsAndConditions: [1.0] });
    return terms.save();
  },
  GetTermsAndCons: function () {
    return new Promise((resolve, reject) => {
      this.findOne({})
        .lean()
        .exec((err, result) => {
          if (err) reject(err);
          if (!result) {
            this.SaveInitialConfig();
          }
          let terms = result ? result.termsAndConditions : [1.0];
          resolve(terms || [1.0]);
        });
    });
  },
};

const GlobalConfig = mongoose.model("GlobalConfig", GlobalConfigSchema);

module.exports = GlobalConfig;
