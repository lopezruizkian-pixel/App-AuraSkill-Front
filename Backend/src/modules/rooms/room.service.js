const { pool } = require('../../config/db');

const crearRoom = async (data) => {
  const { nombre, descripcion, mentor_id, skill_id, capacidad_maxima } = data;
  const result = await pool.query(
    `INSERT INTO rooms (nombre, descripcion, mentor_id, skill_id, capacidad_maxima)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nombre, descripcion || '', mentor_id, skill_id, capacidad_maxima || 10]
  );
  return result.rows[0];
};

const obtenerRooms = async () => {
  const result = await pool.query(
    `SELECT r.*, s.nombre AS habilidad, u.nombre AS mentor_nombre, u.usuario AS mentor_usuario
     FROM rooms r
     JOIN users u ON r.mentor_id = u.id
     LEFT JOIN skills s ON r.skill_id = s.id
     WHERE r.estado = 'activa'
     ORDER BY r.id DESC`
  );
  return result.rows;
};

const obtenerRoomPorId = async (id) => {
  const room = await pool.query(
    `SELECT r.*, s.nombre AS habilidad, u.nombre AS mentor_nombre, u.usuario AS mentor_usuario
     FROM rooms r
     JOIN users u ON r.mentor_id = u.id
     LEFT JOIN skills s ON r.skill_id = s.id
     WHERE r.id = $1`,
    [id]
  );
  if (room.rows.length === 0) return null;

  const participants = await pool.query(
    `SELECT u.id, u.nombre, u.usuario FROM users u
     JOIN room_participants rp ON u.id = rp.user_id
     WHERE rp.room_id = $1`,
    [id]
  );
  return { ...room.rows[0], participantes: participants.rows };
};

const unirseARoom = async (roomId, userId) => {
  const room = await pool.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
  if (room.rows.length === 0) throw new Error('Sala no encontrada');

  const already = await pool.query(
    'SELECT * FROM room_participants WHERE room_id = $1 AND user_id = $2',
    [roomId, userId]
  );
  if (already.rows.length > 0) throw new Error('Ya estás en esta sala');

  const count = await pool.query('SELECT COUNT(*) FROM room_participants WHERE room_id = $1', [roomId]);
  if (parseInt(count.rows[0].count) >= room.rows[0].capacidad_maxima) throw new Error('La sala está llena');

  await pool.query('INSERT INTO room_participants (room_id, user_id) VALUES ($1, $2)', [roomId, userId]);
  return obtenerRoomPorId(roomId);
};

const eliminarRoom = async (id) => {
  await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
};

const obtenerHistorialUsuario = async (userId) => {
  const result = await pool.query(
    `SELECT s.id, s.room_id, s.mentor_id, s.mentor_name,
            s.started_at, s.ended_at, s.duration_seconds, s.is_active,
            s.end_reason, s.room_name, s.habilidad, s.mood,
            (SELECT COUNT(*) FROM session_participants sp2 WHERE sp2.session_id = s.id) as participant_count
     FROM sessions s
     WHERE s.mentor_id = $1 OR s.id IN (SELECT session_id FROM session_participants WHERE user_id = $1)
     ORDER BY s.started_at DESC`,
    [userId]
  );
  return result.rows;
};

module.exports = { crearRoom, obtenerRooms, obtenerRoomPorId, unirseARoom, eliminarRoom, obtenerHistorialUsuario };
