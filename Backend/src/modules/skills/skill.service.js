const { pool } = require('../../config/db');

const crearSkill = async (data) => {
  const { nombre, descripcion, categoria, nivel } = data;
  const result = await pool.query(
    `INSERT INTO skills (nombre, descripcion, categoria, nivel)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nombre, descripcion, categoria, nivel || 'basico']
  );
  return result.rows[0];
};

const obtenerSkills = async () => {
  const result = await pool.query('SELECT * FROM skills ORDER BY created_at DESC');
  return result.rows;
};

const obtenerSkillPorId = async (id) => {
  const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const buscarSkills = async (query) => {
  const result = await pool.query(
    `SELECT * FROM skills WHERE nombre ILIKE $1 OR categoria ILIKE $1`,
    [`%${query}%`]
  );
  return result.rows;
};

const eliminarSkill = async (id) => {
  await pool.query('DELETE FROM skills WHERE id = $1', [id]);
};

module.exports = { crearSkill, obtenerSkills, obtenerSkillPorId, buscarSkills, eliminarSkill };
