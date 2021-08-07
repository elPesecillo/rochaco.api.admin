const mongoose = require("mongoose");
const Menu = require("./menu");
const Role = require("./role");
const User = require("./user");
const SuburbInvite = require("./suburbInvite");
const SuburbConfig = require("./suburbConfig");
const SuburbStreet = require("./suburbStreet");
const PostalCode = require("./postalCode");
const Address = require("./Address");
const GlobalConfig = require("./globalConfig");

const models = {
  Menu,
  Role,
  User,
  PostalCode,
  SuburbInvite,
  SuburbConfig,
  SuburbStreet,
  Address,
  GlobalConfig,
};

const connectDb = () => {
  //setup the mongo connection
  let mConn = mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on(
    "error",
    console.error.bind(console, "Mongo db connection error: ")
  );
  return mConn;
};

module.exports = { connectDb, models };
