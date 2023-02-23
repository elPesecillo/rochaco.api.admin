const mongoose = require("mongoose");
const ChildMenuSchema = require("./childMenuSchema");

const MenuSchema = new mongoose.Schema({
  item: { type: String },
  label: { type: String },
  validUserTypes: [String],
  childMenus: [ChildMenuSchema],
});

module.exports = MenuSchema;
