const mongoose = require("mongoose");
const moment = require("moment");
const DropdownSchema = require("./dropdownSchema");
const FieldSchema = new mongoose.Schema({
  field: {
    type: String,
  },
  type: {
    type: String,
  },
  data: [DropdownSchema],
  label: {
    type: String,
  },
  mandatory: {
    type: Boolean,
    default: false,
  },
  mandatoryMessage: {
    type: String,
  },
});

module.exports = FieldSchema;
