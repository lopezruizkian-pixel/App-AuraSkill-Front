const {
  crearRoom,
  obtenerRooms,
  obtenerRoomPorId,
  unirseARoom,
  eliminarRoom,
  obtenerHistorialUsuario,
} = require("./room.service")
const { getRoomSessionState, broadcastRoomsUpdated, finalizeMentorSession, activeRooms } = require("../../config/socket")

const getRooms = async (req, res) => {
// ... (rest of the file remains same, adding finishRoom at the end)
  try {
    const rooms = await obtenerRooms()
    const roomsWithSession = rooms.map(room => {
      const sessionInfo = getRoomSessionState(String(room.id))
      return { ...room, sessionInfo }
    })
    res.json(roomsWithSession)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getRoomById = async (req, res) => {
  try {
    const room = await obtenerRoomPorId(req.params.id)
    if (!room) return res.status(404).json({ error: 'Sala no encontrada' })
    const sessionInfo = getRoomSessionState(req.params.id)
    res.json({ ...room, sessionInfo })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getRoomHistory = async (req, res) => {
  try {
    const historial = await obtenerHistorialUsuario(req.user.id)
    res.json(historial)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createRoom = async (req, res) => {
  try {
    const payload = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion?.trim() || "",
      mentor_id: req.user.id,
      skill_id: req.body.skill_id,
      capacidad_maxima: req.body.capacidad_maxima ?? req.body.limiteEstudiantes ?? 10,
      mood: req.body.mood || "",
    }
    const room = await crearRoom(payload)
    broadcastRoomsUpdated()
    res.json({ message: "Sala creada", room })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const joinRoom = async (req, res) => {
  try {
    const room = await unirseARoom(req.params.id, req.user.id)
    res.json({ message: "Te uniste a la sala", room })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteRoom = async (req, res) => {
  try {
    await eliminarRoom(req.params.id)
    broadcastRoomsUpdated()
    res.json({ message: "Sala eliminada" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const finishRoom = async (req, res) => {
  try {
    const roomId = String(req.params.id);
    
    // 1. Marcar como inactiva en la base de datos (Persistencia definitiva)
    await eliminarRoom(roomId);
    
    // 2. Finalizar la sesión en el estado de Sockets (Memoria + Evento roomClosed)
    const room = activeRooms.get(roomId);
    if (room) {
      await finalizeMentorSession(room, 'finalizado_por_mentor');
    }
    
    broadcastRoomsUpdated();
    res.json({ message: "Sala finalizada y archivada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRooms, getRoomById, getRoomHistory, createRoom, joinRoom, deleteRoom, finishRoom }
