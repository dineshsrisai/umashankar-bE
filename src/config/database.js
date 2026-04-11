const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://dineshsrisai24_db_user:" + process.env.DBPASSWORD + "@umashankar.fqotgge.mongodb.net/"
  );
};

module.exports = connectDb;