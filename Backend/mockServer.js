/**
 * MOCK BACKEND - CON SOCKET.IO
 * Express + Socket.IO para soporte WebSocket
 */

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middlewares
app.use(cors());
app.use(express.json());

// ═════════════════════════════════════════════════════════
// DATOS EN MEMORIA - WEBSOCKET
// ═════════════════════════════════════════════════════════

const activeConnections = new Map(); // userId -> socket
const roomConnections = new Map(); // roomId -> [userId, userId, ...]

const users = [
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

const rooms = [];
const tokens = new Map();

// ═════════════════════════════════════════════════════════
// SOCKET.IO - EVENTOS EN TIEMPO REAL
// ═════════════════════════════════════════════════════════

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  const roomId = socket.handshake.query.roomId;

  console.log(`🔌 [SOCKET] Usuario ${userId} conectado a sala ${roomId}`);
  activeConnections.set(userId, socket);

  // ─────────────────────────────────
  // Unirse a sala
  // ─────────────────────────────────
  socket.on('joinRoom', (data) => {
    const { roomId, userId, userName } = data;
    
    if (!roomConnections.has(roomId)) {
      roomConnections.set(roomId, []);
    }
    
    roomConnections.get(roomId).push({
      userId,
      userName,
      socketId: socket.id,
    });

    socket.join(`room-${roomId}`);
    
    console.log(`👤 [ROOM] ${userName} se unió a la sala ${roomId}`);
    
    // Notificar a todos en la sala
    io.to(`room-${roomId}`).emit('userJoined', {
      userId,
      userName,
      participants: roomConnections.get(roomId),
    });
  });

  // ─────────────────────────────────
  // Enviar mensaje
  // ─────────────────────────────────
  socket.on('sendMessage', (data) => {
    const { roomId, userId, userName, texto, userAvatar } = data;
    
    console.log(`💬 [MSG] ${userName}: ${texto}`);
    
    io.to(`room-${roomId}`).emit('receiveMessage', {
      userId,
      userName,
      userAvatar,
      texto,
      timestamp: Date.now(),
    });
  });

  // ─────────────────────────────────
  // Enviar reacción
  // ─────────────────────────────────
  socket.on('sendReaction', (data) => {
    const { roomId, emoji } = data;
    
    io.to(`room-${roomId}`).emit('receiveReaction', {
      emoji,
      userName: data.userName,
      timestamp: Date.now(),
    });
  });

  // ─────────────────────────────────
  // Usuario escribiendo
  // ─────────────────────────────────
  socket.on('userTyping', (data) => {
    const { roomId, userName } = data;
    
    socket.to(`room-${roomId}`).emit('userIsTyping', {
      userName,
    });
  });

  socket.on('userStoppedTyping', (data) => {
    const { roomId, userName } = data;
    
    socket.to(`room-${roomId}`).emit('userStoppedTypingEvent', {
      userName,
    });
  });

  // ─────────────────────────────────
  // Cambio de estado de video
  // ─────────────────────────────────
  socket.on('videoStatusChanged', (data) => {
    const { roomId, userId, enabled } = data;
    
    io.to(`room-${roomId}`).emit('videoStatusUpdate', {
      userId,
      enabled,
    });
  });

  // ─────────────────────────────────
  // Cambio de estado de audio
  // ─────────────────────────────────
  socket.on('audioStatusChanged', (data) => {
    const { roomId, userId, enabled } = data;
    
    io.to(`room-${roomId}`).emit('audioStatusUpdate', {
      userId,
      enabled,
    });
  });

  // ─────────────────────────────────
  // Desconectar
  // ─────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`🔌 [SOCKET] Usuario ${userId} desconectado`);
    activeConnections.delete(userId);
    
    // Limpiar salas
    for (const [roomId, participants] of roomConnections.entries()) {
      const filtered = participants.filter(p => p.userId !== userId);
      if (filtered.length > 0) {
        roomConnections.set(roomId, filtered);
        io.to(`room-${roomId}`).emit('userLeft', {
          userId,
          participants: filtered,
        });
      } else {
        roomConnections.delete(roomId);
      }
    }
  });
});

// ═════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═════════════════════════════════════════════════════════

function generateToken(userId) {
  const token = `mock-token-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  tokens.set(token, { userId, createdAt: Date.now() });
  return token;
}

function validateToken(token) {
  return tokens.has(token);
}

function getUserFromToken(token) {
  const data = tokens.get(token);
  if (!data) return null;
  return users.find(u => u.id === data.userId);
}

// ═════════════════════════════════════════════════════════
// MIDDLEWARE - VALIDAR TOKEN
// ═════════════════════════════════════════════════════════

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || !validateToken(token)) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  req.user = getUserFromToken(token);
  next();
};

// ═════════════════════════════════════════════════════════
// RUTAS - AUTENTICACIÓN
// ═════════════════════════════════════════════════════════

/**
 * POST /api/auth/login
 */
app.post('/api/auth/login', (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({
      message: 'Correo y contraseña son requeridos',
    });
  }

  const user = users.find(u => u.correo === correo && u.password === password);

  if (!user) {
    return res.status(401).json({
      message: 'Credenciales inválidas',
    });
  }

  const token = generateToken(user.id);

  console.log(`✅ [AUTH] Login: ${user.nombre}`);

  res.json({
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    },
  });
});

/**
 * POST /api/auth/register
 */
app.post('/api/auth/register', (req, res) => {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({
      message: 'Todos los campos son requeridos',
    });
  }

  const userExists = users.find(u => u.correo === correo);
  if (userExists) {
    return res.status(409).json({
      message: 'El usuario ya existe',
    });
  }

  const newUser = {
    id: String(users.length + 1),
    nombre,
    correo,
    password,
    rol: 'alumno',
  };

  users.push(newUser);
  const token = generateToken(newUser.id);

  console.log(`✅ [AUTH] Registro: ${newUser.nombre}`);

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      nombre: newUser.nombre,
      correo: newUser.correo,
      rol: newUser.rol,
    },
  });
});

/**
 * GET /api/auth/validate
 */
app.get('/api/auth/validate', requireAuth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ═════════════════════════════════════════════════════════
// RUTAS - SALAS
// ═════════════════════════════════════════════════════════

/**
 * GET /api/rooms/active
 */
app.get('/api/rooms/active', (req, res) => {
  const activeRooms = rooms.map(room => ({
    ...room,
    participantes: room.participantes?.length || 0,
  }));

  console.log(`📋 [ROOMS] Salas activas: ${activeRooms.length}`);

  res.json(activeRooms);
});

/**
 * GET /api/rooms/:roomId
 */
app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.find(r => r.id === roomId);

  if (!room) {
    return res.json({
      id: roomId,
      nombre: `Sala: ${roomId}`,
      habilidad: 'Mentoría en vivo',
      mood: 'concentrado',
      limiteEstudiantes: 15,
      descripcion: 'Sesión de mentoría en vivo',
    });
  }

  res.json(room);
});

/**
 * POST /api/rooms
 */
app.post('/api/rooms', requireAuth, (req, res) => {
  const { nombre, habilidad, mood, limiteEstudiantes, descripcion } = req.body;

  if (!nombre || !habilidad || !mood) {
    return res.status(400).json({
      message: 'Campos requeridos: nombre, habilidad, mood',
    });
  }

  const newRoom = {
    id: `room-${Date.now()}`,
    _id: `room-${Date.now()}`,
    nombre,
    habilidad,
    mood,
    limiteEstudiantes: parseInt(limiteEstudiantes) || 15,
    descripcion: descripcion || '',
    mentor: req.user.nombre,
    mentorId: req.user.id,
    createdAt: new Date(),
    participantes: [req.user.id],
  };

  rooms.push(newRoom);

  console.log(`✅ [ROOMS] Sala creada: ${newRoom.nombre} por ${req.user.nombre}`);

  res.status(201).json(newRoom);
});

/**
 * POST /api/rooms/:roomId/join
 */
app.post('/api/rooms/:roomId/join', requireAuth, (req, res) => {
  const { roomId } = req.params;
  const room = rooms.find(r => r.id === roomId);

  if (!room) {
    return res.status(404).json({ message: 'Sala no encontrada' });
  }

  if (!room.participantes.includes(req.user.id)) {
    room.participantes.push(req.user.id);
  }

  console.log(`👤 [ROOMS] ${req.user.nombre} se unió a ${room.nombre}`);

  res.json({ success: true, room });
});

/**
 * POST /api/rooms/:roomId/leave
 */
app.post('/api/rooms/:roomId/leave', requireAuth, (req, res) => {
  const { roomId } = req.params;
  const room = rooms.find(r => r.id === roomId);

  if (!room) {
    return res.status(404).json({ message: 'Sala no encontrada' });
  }

  room.participantes = room.participantes.filter(id => id !== req.user.id);

  console.log(`👋 [ROOMS] ${req.user.nombre} salió de ${room.nombre}`);

  res.json({ success: true });
});

/**
 * DELETE /api/rooms/:roomId
 */
app.delete('/api/rooms/:roomId', requireAuth, (req, res) => {
  const { roomId } = req.params;
  const roomIndex = rooms.findIndex(r => r.id === roomId);

  if (roomIndex === -1) {
    return res.status(404).json({ message: 'Sala no encontrada' });
  }

  const roomName = rooms[roomIndex].nombre;
  rooms.splice(roomIndex, 1);

  console.log(`🗑️  [ROOMS] Sala eliminada: ${roomName}`);

  res.json({ success: true });
});

/**
 * GET /api/rooms/:roomId/participants
 */
app.get('/api/rooms/:roomId/participants', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.find(r => r.id === roomId);

  if (!room) {
    return res.json([]);
  }

  const participants = room.participantes
    .map(userId => users.find(u => u.id === userId))
    .filter(Boolean)
    .map(u => ({ id: u.id, nombre: u.nombre, rol: u.rol }));

  res.json(participants);
});

/**
 * GET /api/rooms/history
 */
app.get('/api/rooms/history', requireAuth, (req, res) => {
  const userRooms = rooms.filter(r => r.participantes.includes(req.user.id));
  res.json(userRooms);
});

// ═════════════════════════════════════════════════════════
// HEALTH CHECK
// ═════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ═════════════════════════════════════════════════════════
// ERROR HANDLER
// ═════════════════════════════════════════════════════════

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ═════════════════════════════════════════════════════════
// INICIAR SERVIDOR
// ═════════════════════════════════════════════════════════

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🚀 MOCK BACKEND INICIADO`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`📍 Dirección: http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`\n📧 Usuarios de prueba:`);
  console.log(`   Email: mentor@example.com`);
  console.log(`   Contraseña: Mentor123`);
  console.log(`   Rol: mentor`);
  console.log(`\n   Email: alumno@example.com`);
  console.log(`   Contraseña: Alumno123`);
  console.log(`   Rol: alumno`);
  console.log(`${'═'.repeat(60)}\n`);
});
