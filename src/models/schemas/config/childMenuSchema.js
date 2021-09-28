const mongoose = require("mongoose");

const ChildMenuSchema = new mongoose.Schema({
  item: { type: String },
  label: { type: String },
  color: { type: String },
  navigate: { type: String },
  screen: { type: String },
  isHome: { type: Boolean },
  iconName: { type: String },
  iconFamily: { type: String },
});

module.exports = ChildMenuSchema;
