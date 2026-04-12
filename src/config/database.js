const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    process.env.DBPASSWORD
  );
};

module.exports = connectDb;