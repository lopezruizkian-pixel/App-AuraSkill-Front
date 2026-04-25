const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET

if (!SECRET && process.env.NODE_ENV === 'production') {
  throw new Error("JWT_SECRET must be defined in production environment");
}

const FINAL_SECRET = SECRET || "auraskill_dev_secret_key_123"

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      rol: user.rol
    },
    FINAL_SECRET,
    { expiresIn: "24h" }
  )
}

module.exports = { generateToken, SECRET: FINAL_SECRET }
