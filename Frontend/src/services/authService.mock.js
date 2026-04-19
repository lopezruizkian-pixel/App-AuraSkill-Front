/**
 * Auth Service - MODO MOCK (para testing sin backend)
 * 
 * Para usar este archivo:
 * 1. Renombra authService.js a authService.js.bak
 * 2. Renombra authService.mock.js a authService.js
 * 
 * Para volver al modo real:
 * 1. Renombra authService.js a authService.mock.js
 * 2. Renombra authService.js.bak a authService.js
 */

import { mockLoginUser, mockRegisterUser } from './mockService';
import { validateEmail, validatePassword } from './validation';

/**
 * Servicio de Autenticación (MOCK)
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
    // Usar mock en lugar de httpClient
    const data = await mockLoginUser(correo, password);
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  // Validación de entrada
  const { nombre, correo, password, confirmPassword } = userData;

  if (!nombre || nombre.trim().length === 0) {
    throw new Error('El nombre es requerido');
  }

  if (!validateEmail(correo)) {
    throw new Error('Email inválido');
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.error);
  }

  if (password !== confirmPassword) {
    throw new Error('Las contraseñas no coinciden');
  }

  try {
    const data = await mockRegisterUser({
      nombre,
      correo,
      password,
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
    return { valid: true, token: localStorage.getItem('token') };
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
