const express = require("express")
const router = express.Router()
const Asset = require("../models/Asset")

// Get all assets
router.get("/", async (req, res) => {
  const assets = await Asset.find().populate("room servicesUsed transfers")
  res.json(assets)
})

// Add a new asset
router.post("/", async (req, res) => {
  const newAsset = new Asset(req.body)
  await newAsset.save()
  res.status(201).json(newAsset)
})

// Get a specific asset
router.get("/:id", async (req, res) => {
  const asset = await Asset.findById(req.params.id).populate("room servicesUsed transfers")
  res.json(asset)
})

// Update a asset
router.put("/:id", async (req, res) => {
  const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, {new: true})
  res.json(updatedAsset)
})

// Delete a asset
router.delete("/:id", async (req, res) => {
  await Asset.findByIdAndDelete(req.params.id)
  res.status(204).send()
})

module.exports = router
