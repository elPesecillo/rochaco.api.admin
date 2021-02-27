const mongoose = require("mongoose");
const moment = require("moment");
const FieldSchema = require("./fieldSchema");

const ScreenSchema = new mongoose.Schema({
  name: { type: String },
  title: { type: String },
  fields: [FieldSchema],
});

module.exports = ScreenSchema;
