const mongoose = require("mongoose")

const assetSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  location: {type: String, enum: ["Room", "General"], default: "General"},
  status: {type: String, enum: ["Working", "Needs Repair", "Replaced"], default: "Working"},
})

const Asset = mongoose.model("Asset", assetSchema)
module.exports = Asset
