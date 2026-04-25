const { registerUser, loginUser } = require("./auth.service")
const { pool } = require("../../config/db")
const bcrypt = require("bcrypt")

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
    const { token, user } = result

    // Configuración de la cookie
    res.cookie("token", token, {
      httpOnly: true, // No accesible por JS (Protege contra XSS)
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: "none", // Necesario para CORS entre diferentes dominios
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    })

    res.json({ message: "Login exitoso", user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none"
  })
  res.json({ message: "Sesión cerrada correctamente" })
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

const changePassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body
    if (!passwordActual || !passwordNueva) return res.status(400).json({ error: "Faltan campos" })
    if (passwordNueva.length < 8) return res.status(400).json({ error: "La nueva contraseña debe tener mínimo 8 caracteres" })

    const result = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" })

    const valid = await bcrypt.compare(passwordActual, result.rows[0].password)
    if (!valid) return res.status(400).json({ error: "Contraseña actual incorrecta" })

    const hashed = await bcrypt.hash(passwordNueva, 10)
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, req.user.id])

    res.json({ message: "Contraseña actualizada correctamente" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body
    if (!password) return res.status(400).json({ error: "Se requiere la contraseña para eliminar la cuenta" })

    const result = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" })

    const valid = await bcrypt.compare(password, result.rows[0].password)
    if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" })

    await pool.query('DELETE FROM users WHERE id = $1', [req.user.id])
    res.json({ message: "Cuenta eliminada correctamente" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { register, login, getProfile, changePassword, deleteAccount }

const updateProfile = async (req, res) => {
  try {
    const { nombre, usuario, habilidades, intereses, mood_actual } = req.body
    const result = await pool.query(
      `UPDATE users SET nombre=$1, usuario=$2, habilidades=$3, intereses=$4, mood_actual=$5
       WHERE id=$6 RETURNING id, nombre, usuario, correo, rol, habilidades, intereses, mood_actual`,
      [nombre, usuario, habilidades || [], intereses || [], mood_actual || 'neutral', req.user.id]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { register, login, logout, getProfile, changePassword, deleteAccount, updateProfile }
