const jwt = require("jsonwebtoken")
const { SECRET } = require("../utils/jwt")

const verifyToken = (req, res, next) => {
  // Intentar obtener el token de las cookies o del header
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({
      error: "Token requerido (No se encontró sesión activa)"
    })
  }

  try {

    const decoded = jwt.verify(token, SECRET)

    req.user = decoded

    next()

  } catch (error) {

    return res.status(401).json({
      error: "Token inválido"
    })

  }

}

module.exports = {
  verifyToken
}
