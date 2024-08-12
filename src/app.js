require("dotenv").config()
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const logger = require("morgan")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")
const hbs = require("hbs")
hbs.registerHelper("uppercase", function (text, options) {
  return text.toUpperCase()
})
hbs.registerHelper("lowercase", function (text, options) {
  return text.toLowerCase()
})
hbs.registerHelper("localDate", function (date, options) {
  return new Date(date).toLocaleDateString("id-ID")
})
hbs.registerPartials(path.join(__dirname, "views/partials"))
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected!")
  })
  .catch((error) => {
    console.log(error)
  })

const app = express()
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(cookieParser())
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"))
app.use("/assets", express.static(path.join(__dirname, "..", "/assets")))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
)
// Routes
const { authRouter, isAuthenticated, authorizeRole } = require("./routes/auth")
const clientRoutes = require("./routes/clients")
// Protecting routes
app.use("/clients", isAuthenticated, clientRoutes)
module.exports = app
