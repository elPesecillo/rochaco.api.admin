const mongoose = require("mongoose");

const PhoneSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
  },
  name: {
    type: String,
  },
});

module.exports = PhoneSchema;
