import { io } from 'socket.io-client';

/**
 * Configuración de Socket.io
 * Usa variables de entorno o la IP local para pruebas en red LAN
 */

export const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:3000`;
  }
  return 'http://localhost:3000';
};

let globalDashboardSocket = null;

export const getDashboardSocket = () => {
  if (!globalDashboardSocket) {
    globalDashboardSocket = io(getSocketUrl(), { transports: ['websocket', 'polling'] });
  }
  return globalDashboardSocket;
};
