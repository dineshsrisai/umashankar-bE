const express = require("express");
const connectDb = require("./config/database");
const cors = require("cors");

const info = require("./routes/info");
const app = express();

app.use(cors());

app.use("/", info);

connectDb()
  .then(() => {
    console.log("Db connection successful");
    app.listen(3000, () => {
      console.log("Server is successfully listening to port 3000");
    });
  })
  .catch((e) => {
    console.log("Database cannot be connected");
  });
