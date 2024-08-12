// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next()
  }
  res.redirect("/login")
}

// Middleware to authorize based on role
const authorizeRole = (role) => (req, res, next) => {
  if (req.session.role === role) {
    return next()
  }
  res.status(403).render("error", {message: "Access denied"})
}

const validate = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.body)
  if (error) return res.status(400).render("error", {message: error.details[0].message})
  next()
}

module.exports = {isAuthenticated, authorizeRole, validate}
