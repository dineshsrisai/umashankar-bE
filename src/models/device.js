const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  featured: Boolean,
  type: {
    type: String,
    enum: ["printer", "computer", "cctv"],
  },
});

deviceSchema.index({ type: 1 });

module.exports = mongoose.model("Device", deviceSchema);
