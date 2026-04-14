const User = require("../users/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerUser = async (data) => {

  const { nombre, usuario, correo, password, rol, habilidades } = data

  if (!nombre || !usuario || !correo || !password) {
    throw new Error("Todos los campos son obligatorios")
  }

  const email = correo.toLowerCase()

  const existingUser = await User.findOne({
    $or: [
      { correo: email },
      { usuario: usuario }
    ]
  })

  if (existingUser) {
    throw new Error("El usuario o correo ya está registrado")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new User({
    nombre,
    usuario,
    correo: email,
    password: hashedPassword,
    rol: rol || "alumno",
    habilidades: habilidades || [],
    intereses: [],
    mood_actual: "neutral"
  })

  await newUser.save()

  const userObject = newUser.toObject()
  delete userObject.password

  return userObject
}

const loginUser = async (data) => {

  const { correo, password } = data

  if (!correo || !password) {
    throw new Error("Correo y contraseña son obligatorios")
  }

  const email = correo.toLowerCase()

  const user = await User.findOne({ correo: email })

  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    throw new Error("Contraseña incorrecta")
  }

  const token = jwt.sign(
    {
      id: user._id,
      rol: user.rol
    },
    process.env.JWT_SECRET || "auraskill_secret",
    {
      expiresIn: "7d"
    }
  )

  const userObject = user.toObject()
  delete userObject.password

  return {
    token,
    user: userObject
  }
}

module.exports = {
  registerUser,
  loginUser
}
