const mongoose = require("mongoose");

const GlobalConfigSchema = new mongoose.Schema({
  termsAndConditions: [mongoose.Decimal128],
});

GlobalConfigSchema.statics = {
  SaveInitialConfig() {
    const terms = new this({ termsAndConditions: [1.0] });
    return terms.save();
  },
  GetTermsAndCons() {
    return new Promise((resolve, reject) => {
      this.findOne({})
        .lean()
        .exec((err, result) => {
          if (err) reject(err);
          if (!result) {
            this.SaveInitialConfig();
          }
          const terms = result ? result.termsAndConditions : [1.0];
          resolve(terms || [1.0]);
        });
    });
  },
};

const GlobalConfig = mongoose.model("GlobalConfig", GlobalConfigSchema);

module.exports = GlobalConfig;
