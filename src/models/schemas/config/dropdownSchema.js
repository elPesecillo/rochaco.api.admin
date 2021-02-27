const mongoose = require("mongoose");

const DropdownSchema = new mongoose.Schema({
  value: {
    type: String,
  },
  text: {
    type: String,
  },
});

module.exports = DropdownSchema;
