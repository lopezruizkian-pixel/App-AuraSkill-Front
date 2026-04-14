const {
  crearRoom,
  obtenerRooms,
  obtenerRoomPorId,
  unirseARoom,
  eliminarRoom,
} = require("./room.service")
const { getRoomSessionState, getUserSessionHistory } = require("../../config/socket")

const getRooms = async (req, res) => {
  try {
    const rooms = await obtenerRooms()
    res.json(rooms)
  } catch (error) {
    console.log('[Room Controller] Error obteniendo salas, usando datos mock:', error.message)
    res.json([
      {
        id: 'sala-demo-1',
        nombre: 'Sala Demo 1',
        habilidad: 'React',
        mentor: 'Mentor Demo',
        estado: 'activo',
      },
    ])
  }
}

const normalizeRoomResponse = (room, roomId) => {
  const sessionInfo = getRoomSessionState(roomId)

  if (!room) {
    return {
      id: roomId,
      nombre: `Sala: ${roomId}`,
      habilidad: 'Mentoria en vivo',
      mentor: 'Mentor Anonimo',
      descripcion: 'Sesion de mentoria en tiempo real',
      estado: 'activo',
      participantes: 1,
      createdAt: new Date().toISOString(),
      sessionInfo,
    }
  }

  const roomData = room.toObject ? room.toObject() : room

  return {
    ...roomData,
    sessionInfo,
  }
}

const getRoomById = async (req, res) => {
  try {
    const room = await obtenerRoomPorId(req.params.id)

    if (!room) {
      return res.json(normalizeRoomResponse(null, req.params.id))
    }

    res.json(normalizeRoomResponse(room, req.params.id))
  } catch (error) {
    console.log('[Room Controller] Error, usando datos mock:', error.message)
    res.json(normalizeRoomResponse(null, req.params.id))
  }
}

const getRoomHistory = async (req, res) => {
  try {
    const history = await Promise.all(getUserSessionHistory(req.user.id).map(async (session) => {
      let room = null

      try {
        room = await obtenerRoomPorId(session.roomId)
      } catch (error) {
        room = null
      }

      return {
        id: session.id,
        roomId: session.roomId,
        fecha: session.startedAt,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        habilidad: session.habilidad || room?.habilidad || 'Habilidad',
        mood: session.mood || room?.mood || 'Sin mood',
        mentor: session.mentorName || room?.mentor?.nombre || 'Mentor Anonimo',
        mentorId: session.mentorId,
        duracionSegundos: session.durationSeconds || 0,
        duracion: session.durationSeconds || 0,
        nombreSala: session.roomName || room?.nombre || `Sala ${session.roomId}`,
        participantCount: session.participantCount || 0,
      }
    }))

    res.json(history)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createRoom = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      mentor: req.user.id,
      descripcion: req.body.descripcion?.trim() || "",
      capacidad_maxima: req.body.capacidad_maxima ?? req.body.limiteEstudiantes,
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
    await eliminarRoom(req.params.id)
    res.json({ message: "Sala eliminada" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getRooms,
  getRoomById,
  getRoomHistory,
  createRoom,
  joinRoom,
  deleteRoom,
}
