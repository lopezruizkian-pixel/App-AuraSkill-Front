const { pool } = require('../../config/db');

const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, nombre, usuario, correo, rol, habilidades, intereses, mood_actual, created_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, nombre, usuario, correo, rol, habilidades, intereses, mood_actual, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const updateUser = async (id, data) => {
  const { nombre, usuario, habilidades, intereses, mood_actual } = data;
  const result = await pool.query(
    `UPDATE users SET nombre=$1, usuario=$2, habilidades=$3, intereses=$4, mood_actual=$5
     WHERE id=$6 RETURNING id, nombre, usuario, correo, rol, habilidades, intereses, mood_actual, created_at`,
    [nombre, usuario, habilidades || [], intereses || [], mood_actual || 'neutral', id]
  );
  return result.rows[0];
};

const deleteUser = async (id) => {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
