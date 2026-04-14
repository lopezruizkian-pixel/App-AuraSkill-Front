const Room = require("./room.model")

const crearRoom = async (data) => {
  const room = new Room(data)
  await room.save()
  return room
}

const obtenerRooms = async () => {
  return await Room.find().populate("mentor", "nombre usuario")
}

const obtenerRoomPorId = async (id) => {
  return await Room.findById(id).populate("mentor", "nombre usuario").populate("participantes", "nombre usuario")
}

const unirseARoom = async (roomId, userId) => {
  const room = await Room.findById(roomId)
  if (!room) throw new Error("Sala no encontrada")
  if (room.participantes.includes(userId)) throw new Error("Ya estás en esta sala")
  if (room.participantes.length >= room.capacidad_maxima) throw new Error("La sala está llena")
  room.participantes.push(userId)
  await room.save()
  return room
}

const eliminarRoom = async (id) => {
  return await Room.findByIdAndDelete(id)
}

module.exports = { crearRoom, obtenerRooms, obtenerRoomPorId, unirseARoom, eliminarRoom }
