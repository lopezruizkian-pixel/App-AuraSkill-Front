/**
 * Configuración de API
 * Usa variables de entorno para diferentes entornos
 */

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:3000/api`;
  }
  return 'http://localhost:3000/api';
};

export const API_URL = getApiUrl();

export default API_URL;