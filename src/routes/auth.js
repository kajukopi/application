const express = require("express")
const User = require("../models/User")
const router = express.Router()

// Login
router.post("/login", async (req, res) => {
  const {username, password} = req.body
  const user = await User.findOne({username})
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).render("login", {error: "Invalid credentials"})
  }
  req.session.userId = user._id
  req.session.role = user.role
  res.redirect("/")
})

router.post("/register", async (req, res) => {
  const {username, password, role} = req.body

  // Basic validation
  if (!username || !password) {
    return res.status(400).render("register", {error: "Please fill in all fields"})
  }

  // Check if the username is already taken
  const existingUser = await User.findOne({username})
  if (existingUser) {
    return res.status(400).render("register", {error: "Username is already taken"})
  }

  // Create a new user
  const newUser = new User({username, password, role: role || "staff"})

  // Save the user to the database
  await newUser.save()

  // Automatically log the user in after registration
  req.session.userId = newUser._id
  req.session.role = newUser.role

  res.redirect("/")
})

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/login")
})

module.exports = router
