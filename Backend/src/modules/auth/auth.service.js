const { pool } = require('../../config/db');
const { hashPassword, comparePassword } = require('../../utils/helpers');
const { generateToken } = require('../../utils/jwt');

const registerUser = async (data) => {
  const { nombre, usuario, correo, password, rol, habilidades } = data;
  const email = correo.toLowerCase();
  const normalizedUser = usuario.trim().toLowerCase();

  const existing = await pool.query('SELECT id FROM users WHERE correo = $1 OR usuario = $2', [email, normalizedUser]);
  if (existing.rows.length > 0) throw new Error('El usuario o correo ya existe');

  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (nombre, usuario, correo, password, rol, habilidades)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nombre, usuario, correo, rol, habilidades, mood_actual, created_at`,
    [nombre, normalizedUser, email, hashedPassword, rol || 'alumno', habilidades || []]
  );

  return result.rows[0];
};

const loginUser = async (data) => {
  const { correo, password } = data;
  const email = correo.toLowerCase();

  const result = await pool.query('SELECT * FROM users WHERE correo = $1', [email]);
  if (result.rows.length === 0) throw new Error('Usuario no encontrado');

  const user = result.rows[0];
  const validPassword = await comparePassword(password, user.password);
  if (!validPassword) throw new Error('Contraseña incorrecta');

  const token = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

module.exports = { registerUser, loginUser };
