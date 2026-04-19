const {
  crearRoom,
  obtenerRooms,
  obtenerRoomPorId,
  unirseARoom,
  cerrarRoom,
  obtenerHistorialUsuario,
} = require("./room.service")
const { getRoomSessionState, finalizeRoomSession } = require("../../config/socket")

const getRooms = async (req, res) => {
  try {
    const rooms = await obtenerRooms()
    res.json(rooms)
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
      habilidad: req.body.habilidad,
      capacidad_maxima: req.body.capacidad_maxima ?? req.body.limiteEstudiantes ?? 10,
      mood: req.body.mood || "",
    }
    const room = await crearRoom(payload)
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
    const room = await obtenerRoomPorId(req.params.id)

    if (!room) {
      return res.status(404).json({ error: "Sala no encontrada" })
    }

    if (room.mentor_id !== req.user.id) {
      return res.status(403).json({ error: "Solo el mentor de la sala puede finalizarla" })
    }

    const session = await finalizeRoomSession(req.params.id, "roomClosed")
    const closedRoom = await cerrarRoom(req.params.id)

    res.json({
      message: "Sala finalizada",
      room: closedRoom,
      session,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getRooms, getRoomById, getRoomHistory, createRoom, joinRoom, deleteRoom }
