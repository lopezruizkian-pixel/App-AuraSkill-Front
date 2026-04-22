const { pool } = require('../../config/db');

const crearSkill = async (data, mentorId) => {
  const { nombre, descripcion, categoria, nivel } = data;
  const result = await pool.query(
    `INSERT INTO skills (nombre, descripcion, categoria, nivel, mentor_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nombre, descripcion, categoria, nivel || 'basico', mentorId]
  );
  return result.rows[0];
};

const obtenerSkills = async (mentorId = null) => {
  if (mentorId) {
    const result = await pool.query(
      'SELECT * FROM skills WHERE mentor_id = $1 ORDER BY created_at DESC',
      [mentorId]
    );
    return result.rows;
  }
  const result = await pool.query('SELECT * FROM skills ORDER BY created_at DESC');
  return result.rows;
};

const obtenerSkillPorId = async (id) => {
  const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const buscarSkills = async (query, mentorId = null) => {
  if (mentorId) {
    const result = await pool.query(
      `SELECT * FROM skills WHERE (nombre ILIKE $1 OR categoria ILIKE $1) AND mentor_id = $2`,
      [`%${query}%`, mentorId]
    );
    return result.rows;
  }
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
