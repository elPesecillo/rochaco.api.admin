const mongoose = require("mongoose");
const FieldSchema = require("./fieldSchema");

const ScreenSchema = new mongoose.Schema({
  name: { type: String },
  title: { type: String },
  options: { type: mongoose.Schema.Types.Mixed },
  fields: [FieldSchema],
});

module.exports = ScreenSchema;
