const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

exports.InitMongoServer = async () => {
  const mongo = await MongoMemoryServer.create();

  const Connect = async () => {
    const uri = mongo.getUri();

    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(uri, mongooseOpts);
  };

  const CloseDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  };

  const ClearDatabase = async () => {
    const { collections } = mongoose.connection;

    const promises = [];
    Object.keys(collections).forEach((key) => {
      const collection = collections[key];
      promises.push(collection.deleteMany());
    });
    await Promise.all(promises);
  };

  return { Connect, CloseDatabase, ClearDatabase };
};
