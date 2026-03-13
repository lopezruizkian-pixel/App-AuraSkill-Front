const jwt = require("jsonwebtoken")

const SECRET = "auraskill_secret"

const generateToken = (user) => {

  return jwt.sign(
    {
      id: user._id,
      rol: user.rol
    },
    SECRET,
    {
      expiresIn: "7d"
    }
  )

}

module.exports = {
  generateToken,
  SECRET
}