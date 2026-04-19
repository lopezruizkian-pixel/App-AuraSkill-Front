import { httpClient } from './httpClient';
import { validateEmail, validatePassword } from './validation';

export const loginUser = async (correo, password) => {
  if (!validateEmail(correo)) throw new Error('Email inválido');
  if (!password || password.length === 0) throw new Error('La contraseña es requerida');

  const data = await httpClient.post('/auth/login', { correo, password });
  return data;
};

export const registerUser = async (userData) => {
  const { nombre, usuario, correo, password, rol, habilidades } = userData;

  if (!nombre || nombre.trim().length === 0) throw new Error('El nombre es requerido');
  if (!usuario || usuario.trim().length === 0) throw new Error('El usuario es requerido');
  if (!validateEmail(correo)) throw new Error('Email inválido');

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) throw new Error(passwordValidation.error);

  const data = await httpClient.post('/auth/register', {
    nombre: nombre.trim(),
    usuario: usuario.trim(),
    correo,
    password,
    rol,
    habilidades,
  });

  return data;
};

export const validateToken = async () => {
  try {
    return await httpClient.get('/auth/profile');
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
};
