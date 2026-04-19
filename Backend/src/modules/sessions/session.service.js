const { pool } = require('../../config/db');

const crearSesion = async (data) => {
  const { room_id, mentor_id, mentor_name, room_name, habilidad, mood } = data;
  const result = await pool.query(
    `INSERT INTO sessions (room_id, mentor_id, mentor_name, room_name, habilidad, mood)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [room_id, mentor_id, mentor_name, room_name, habilidad, mood]
  );
  return result.rows[0];
};

const cerrarSesion = async (sessionId, endReason = 'disconnect') => {
  const result = await pool.query(
    `UPDATE sessions SET ended_at = NOW(), is_active = false, end_reason = $1,
     duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INT
     WHERE id = $2 RETURNING *`,
    [endReason, sessionId]
  );
  return result.rows[0];
};

const getHistorialUsuario = async (userId) => {
  const result = await pool.query(
    `SELECT s.*, r.nombre AS room_name, u.nombre AS mentor_name
     FROM sessions s
     JOIN rooms r ON s.room_id = r.id
     JOIN users u ON s.mentor_id = u.id
     LEFT JOIN session_participants sp ON s.id = sp.session_id
     WHERE sp.user_id = $1 OR s.mentor_id = $1
     ORDER BY s.started_at DESC`,
    [userId]
  );
  return result.rows;
};

const getSesionActiva = async (roomId) => {
  const result = await pool.query(
    'SELECT * FROM sessions WHERE room_id = $1 AND is_active = true',
    [roomId]
  );
  return result.rows[0] || null;
};

module.exports = { crearSesion, cerrarSesion, getHistorialUsuario, getSesionActiva };
