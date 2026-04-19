const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET || "auraskill_secret"

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      rol: user.rol
    },
    SECRET,
    { expiresIn: "7d" }
  )
}

module.exports = { generateToken, SECRET }
