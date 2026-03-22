import { httpClient } from './httpClient';

/**
 * Servicio de Salas
 * Maneja operaciones CRUD de salas y participantes
 */

const normalizeRoom = (room) => {
  if (!room) {
    return room;
  }

  return {
    ...room,
    id: room.id || room._id,
    _id: room._id || room.id,
    capacidad_maxima: room.capacidad_maxima ?? room.limiteEstudiantes ?? 10,
    limiteEstudiantes: room.limiteEstudiantes ?? room.capacidad_maxima ?? 10,
  };
};

/**
 * Obtener detalles de una sala
 */
export const fetchRoom = async (roomId) => {
  try {
    const response = await httpClient.get(`/rooms/${roomId}`);
    return normalizeRoom(response.room || response);
  } catch (error) {
    console.error('Error al obtener sala:', error);
    throw error;
  }
};

/**
 * Obtener todas las salas activas
 */
export const fetchActiveRooms = async () => {
  try {
    const response = await httpClient.get('/rooms/active');
    return Array.isArray(response) ? response.map(normalizeRoom) : [];
  } catch (error) {
    console.error('Error al obtener salas activas:', error);
    throw error;
  }
};

/**
 * Unirse a una sala
 */
export const joinRoom = async (roomId, userData = {}) => {
  try {
    const response = await httpClient.post(`/rooms/${roomId}/join`, userData);
    return {
      ...response,
      room: normalizeRoom(response.room),
    };
  } catch (error) {
    console.error('Error al unirse a la sala:', error);
    throw error;
  }
};

/**
 * Crear una nueva sala
 */
export const createRoom = async (roomData) => {
  try {
    const payload = {
      ...roomData,
      capacidad_maxima: roomData.capacidad_maxima ?? roomData.limiteEstudiantes,
      descripcion: roomData.descripcion ?? '',
    };

    delete payload.limiteEstudiantes;

    const response = await httpClient.post('/rooms', payload);
    return normalizeRoom(response.room || response);
  } catch (error) {
    console.error('Error al crear sala:', error);
    throw error;
  }
};

/**
 * Actualizar detalles de una sala
 */
export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await httpClient.put(`/rooms/${roomId}`, roomData);
    return normalizeRoom(response.room || response);
  } catch (error) {
    console.error('Error al actualizar sala:', error);
    throw error;
  }
};

/**
 * Cerrar/finalizar una sala
 */
export const closeRoom = async (roomId) => {
  try {
    return await httpClient.delete(`/rooms/${roomId}`);
  } catch (error) {
    console.error('Error al cerrar sala:', error);
    throw error;
  }
};

/**
 * Salir de una sala
 */
export const leaveRoom = async (roomId) => {
  try {
    return await httpClient.post(`/rooms/${roomId}/leave`);
  } catch (error) {
    console.error('Error al salir de la sala:', error);
    throw error;
  }
};

/**
 * Obtener participantes de una sala
 */
export const getRoomParticipants = async (roomId) => {
  try {
    return await httpClient.get(`/rooms/${roomId}/participants`);
  } catch (error) {
    console.error('Error al obtener participantes:', error);
    throw error;
  }
};

/**
 * Obtener historial de salas del usuario
 */
export const getUserRoomHistory = async () => {
  try {
    const response = await httpClient.get('/rooms/history');
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error al obtener historial:', error);
    throw error;
  }
};
