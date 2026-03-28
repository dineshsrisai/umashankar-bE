const express = require("express");
const infoRouter = express.Router();
const Device = require("../models/device");

infoRouter.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const deviceInfo = await Device.find({ type });
    res.send(deviceInfo);
  } catch (e) {
    res.status(400).send("Error" + e.message);
  }
});

module.exports = infoRouter;
