/* eslint-disable no-console */
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
const Notification = require("./Notification");
const SuburbData = require("./suburbData");

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
  Notification,
  SuburbData,
};

const connectDb = async () => {
  // setup the mongo connection
  const mongooseConnection = await mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(mongoose.models);

  mongoose.connection.on(
    "error",
    console.error.bind(console, "Mongo db connection error: ")
  );
  return mongooseConnection;
};

module.exports = { connectDb, models };
