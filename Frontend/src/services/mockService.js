/**
 * Mock Service para testing sin backend
 * Descomenta import en authService.js para usar
 */

const mockUsers = [
  {
    id: '1',
    nombre: 'Juan Mentor',
    correo: 'mentor@example.com',
    password: 'Mentor123',
    rol: 'mentor',
  },
  {
    id: '2',
    nombre: 'Carlos Alumno',
    correo: 'alumno@example.com',
    password: 'Alumno123',
    rol: 'alumno',
  },
];

/**
 * Mock Login - Simula respuesta del backend
 */
export const mockLoginUser = async (correo, password) => {
  return new Promise((resolve, reject) => {
    // Simular delay de red
    setTimeout(() => {
      const user = mockUsers.find(u => u.correo === correo);

      if (!user) {
        reject(new Error('Usuario no encontrado'));
        return;
      }

      if (user.password !== password) {
        reject(new Error('Contraseña incorrecta'));
        return;
      }

      resolve({
        token: `mock-token-${user.id}-${Date.now()}`,
        user: {
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
        },
      });
    }, 1000);
  });
};

/**
 * Mock Register - Simula registro
 */
export const mockRegisterUser = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        id: String(mockUsers.length + 1),
        nombre: userData.nombre,
        correo: userData.correo,
        password: userData.password,
        rol: 'alumno',
      };

      mockUsers.push(newUser);

      resolve({
        token: `mock-token-${newUser.id}-${Date.now()}`,
        user: {
          id: newUser.id,
          nombre: newUser.nombre,
          correo: newUser.correo,
          rol: newUser.rol,
        },
      });
    }, 1000);
  });
};

/**
 * Mock Create Room
 */
export const mockCreateRoom = async (roomData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `room-${Date.now()}`,
        _id: `room-${Date.now()}`,
        ...roomData,
        createdAt: new Date(),
        participantes: [],
      });
    }, 800);
  });
};

/**
 * Mock Get Rooms
 */
export const mockGetActiveRooms = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'room-1',
          nombre: 'React Avanzado',
          habilidad: 'programacion',
          mood: 'concentrado',
          limiteEstudiantes: 10,
          participantes: 5,
        },
        {
          id: 'room-2',
          nombre: 'Diseño UI Moderno',
          habilidad: 'diseno',
          mood: 'creativo',
          limiteEstudiantes: 8,
          participantes: 3,
        },
      ]);
    }, 600);
  });
};

console.log('%c🧪 Mock Service Habilitado', 'color: #FFD700; font-size: 14px; font-weight: bold');
console.log(
  '%cCredenciales disponibles:\n' +
  '📧 mentor@example.com - Contraseña: Mentor123\n' +
  '📧 alumno@example.com - Contraseña: Alumno123',
  'color: #00FF00; font-size: 12px'
);
