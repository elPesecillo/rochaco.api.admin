const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  account: {
    type: String,
  },
  CLABE: {
    type: String,
  },
  cardNumber: {
    type: String,
  },
  holder: {
    type: String,
  },
});

module.exports = AccountSchema;
