/**
 * Room Service - MODO MOCK (para testing sin backend)
 */

import { mockGetActiveRooms, mockCreateRoom } from './mockService';

/**
 * Obtener detalles de una sala
 */
export const fetchRoom = async (roomId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: roomId,
        nombre: `Sala: ${roomId}`,
        habilidad: 'programacion',
        limiteEstudiantes: 15,
        descripcion: 'Sesión de mentoría en vivo (Mock)',
      });
    }, 500);
  });
};

/**
 * Obtener todas las salas activas
 */
export const fetchActiveRooms = async () => {
  const rooms = await mockGetActiveRooms();
  return rooms.map(room => ({
    ...room,
    sessionInfo: { isActive: true } // Mock mentor always active
  }));
};

/**
 * Unirse a una sala
 */
export const joinRoom = async (roomId, userData = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, roomId });
    }, 500);
  });
};

/**
 * Crear una nueva sala
 */
export const createRoom = async (roomData) => {
  return mockCreateRoom(roomData);
};

/**
 * Actualizar detalles de una sala
 */
export const updateRoom = async (roomId, roomData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...roomData, id: roomId });
    }, 500);
  });
};

/**
 * Cerrar/finalizar una sala
 */
export const closeRoom = async (roomId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, roomId });
    }, 500);
  });
};

/**
 * Salir de una sala
 */
export const leaveRoom = async (roomId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, roomId });
    }, 500);
  });
};

/**
 * Obtener participantes de una sala
 */
export const getRoomParticipants = async (roomId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', nombre: 'Juan', rol: 'mentor' },
        { id: '2', nombre: 'Carlos', rol: 'alumno' },
      ]);
    }, 500);
  });
};

/**
 * Obtener historial de salas del usuario
 */
export const getUserRoomHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'room-1',
          nombre: 'React Basico',
          fecha: new Date(Date.now() - 86400000),
          duracion: 60,
        },
      ]);
    }, 500);
  });
};
