const { crearRoom, obtenerRooms, obtenerRoomPorId, unirseARoom, eliminarRoom } = require("./room.service")

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
    if (!room) return res.status(404).json({ error: "Sala no encontrada" })
    res.json(room)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createRoom = async (req, res) => {
  try {
    const room = await crearRoom({ ...req.body, mentor: req.user.id })
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
    res.json({ message: "Sala eliminada" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getRooms, getRoomById, createRoom, joinRoom, deleteRoom }
