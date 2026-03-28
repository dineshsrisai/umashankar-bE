const mongoose = require("mongoose");
const { DBPASSWORD } = require("../utils/constants");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://dineshsrisai24_db_user:"+ DBPASSWORD +"@umashankar.fqotgge.mongodb.net/",
  );
};

module.exports = connectDb;