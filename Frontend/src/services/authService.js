import { httpClient } from './httpClient';
import { validateEmail, validatePassword } from './validation';

/**
 * Servicio de Autenticación
 * Maneja login, registro y gestión de tokens
 */

export const loginUser = async (correo, password) => {
  // Validación de entrada
  if (!validateEmail(correo)) {
    throw new Error('Email inválido');
  }

  if (!password || password.length === 0) {
    throw new Error('La contraseña es requerida');
  }

  try {
    const data = await httpClient.post('/auth/login', {
      correo,
      password,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  // Validación de entrada
  const { nombre, usuario, correo, password, rol, habilidades } = userData;

  if (!nombre || nombre.trim().length === 0) {
    throw new Error('El nombre es requerido');
  }

  if (!usuario || usuario.trim().length === 0) {
    throw new Error('El usuario es requerido');
  }

  if (!validateEmail(correo)) {
    throw new Error('Email inválido');
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.error);
  }

  try {
    const data = await httpClient.post('/auth/register', {
      nombre: nombre.trim(),
      usuario: usuario.trim(),
      correo,
      password,
      rol,
      habilidades,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Valida si el token es válido
 */
export const validateToken = async () => {
  try {
    const data = await httpClient.get('/auth/profile');
    return data;
  } catch (error) {
    return null;
  }
};

/**
 * Logout del usuario
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
};
