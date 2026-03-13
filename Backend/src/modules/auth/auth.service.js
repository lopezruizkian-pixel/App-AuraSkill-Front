const User = require("./auth.model")
const { hashPassword, comparePassword } = require("../../utils/helpers")
const { generateToken } = require("../../utils/jwt")

const registerUser = async (data) => {

  const { nombre, usuario, correo, password } = data

  const email = correo.toLowerCase()

  const existingUser = await User.findOne({ correo: email })

  if (existingUser) {
    throw new Error("El usuario ya existe")
  }

  const hashedPassword = await hashPassword(password)

  const newUser = new User({
    nombre,
    usuario,
    correo: email,
    password: hashedPassword
  })

  await newUser.save()

  const userObject = newUser.toObject()

  delete userObject.password

  return userObject
}

const loginUser = async (data) => {

  const { correo, password } = data

  const email = correo.toLowerCase()

  const user = await User.findOne({ correo: email })

  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  const validPassword = await comparePassword(password, user.password)

  if (!validPassword) {
    throw new Error("Contraseña incorrecta")
  }

  const token = generateToken(user)

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