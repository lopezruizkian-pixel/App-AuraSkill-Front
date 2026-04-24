const { pool } = require('../../config/db');

// Obtener todas las habilidades del catálogo global (opcionalmente filtrado por categoría)
const obtenerCatalogoSkills = async (categoria) => {
  if (categoria) {
    const result = await pool.query('SELECT * FROM skills WHERE categoria = $1 ORDER BY nombre ASC', [categoria]);
    return result.rows;
  }
  const result = await pool.query('SELECT * FROM skills ORDER BY nombre ASC');
  return result.rows;
};

// Obtener una habilidad específica por ID
const obtenerSkillPorId = async (id) => {
  const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
  return result.rows[0] || null;
};

// Asignar una habilidad a un mentor
const asignarSkillAMentor = async (userId, skillId) => {
  const result = await pool.query(
    'INSERT INTO mentor_skills (user_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
    [userId, skillId]
  );
  return result.rows[0];
};

// Desasignar una habilidad de un mentor
const desasignarSkillDeMentor = async (userId, skillId) => {
  await pool.query('DELETE FROM mentor_skills WHERE user_id = $1 AND skill_id = $2', [userId, skillId]);
};

// Obtener las habilidades asignadas a un mentor específico
const obtenerSkillsPorMentor = async (mentorId) => {
  const result = await pool.query(
    `SELECT s.* FROM skills s
     JOIN mentor_skills ms ON s.id = ms.skill_id
     WHERE ms.user_id = $1
     ORDER BY s.nombre ASC`,
    [mentorId]
  );
  return result.rows;
};

// Buscar habilidades en el catálogo global
const buscarSkillsEnCatalogo = async (query) => {
  const result = await pool.query(
    `SELECT * FROM skills WHERE nombre ILIKE $1 OR categoria ILIKE $1 ORDER BY nombre ASC`,
    [`%${query}%`]
  );
  return result.rows;
};

// Obtener todas las categorías únicas disponibles
const obtenerCategorias = async () => {
  const result = await pool.query('SELECT DISTINCT categoria FROM skills WHERE categoria IS NOT NULL AND categoria != \'\' ORDER BY categoria ASC');
  return result.rows.map(row => row.categoria);
};

module.exports = { 
  obtenerCatalogoSkills, 
  obtenerSkillPorId, 
  asignarSkillAMentor, 
  desasignarSkillDeMentor, 
  obtenerSkillsPorMentor,
  buscarSkillsEnCatalogo,
  obtenerCategorias
};
