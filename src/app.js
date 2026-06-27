const express = require("express");
const connectDb = require("./config/database");
const cors = require("cors");

require("dotenv").config();

const info = require("./routes/info");
const app = express();

app.use(cors());

app.use("/", info);

connectDb()
  .then(() => {
    console.log("Db connection successful");
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is successfully listening to port ${process.env.PORT}`,
      );
    });
  })
  .catch((e) => {
    console.log("Database cannot be connected");
  });
