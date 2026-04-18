const { registerUser, loginUser } = require("./auth.service")
const { pool } = require("../../config/db")

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body)
    res.status(201).json({ message: "Usuario registrado", user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, usuario, correo, rol, habilidades, intereses, mood_actual, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { register, login, getProfile }
