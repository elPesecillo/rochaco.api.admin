const mongoose = require("mongoose");
const Menu = require("./menu");
const Role = require("./role");
const User = require("./user");
const SuburbInvite = require("./suburbInvite");
const PostalCode = require("./postalCode");

const models = { Menu, Role, User, PostalCode, SuburbInvite };

const connectDb = () => {
  //setup the mongo connection
  let mConn = mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
  });

  mongoose.connection.on(
    "error",
    console.error.bind(console, "Mongo db connection error: ")
  );
  return mConn;
};

module.exports = { connectDb, models };
