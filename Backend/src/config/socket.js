const { Server } = require('socket.io');

// Almacenar salas activas y usuarios conectados
const activeRooms = new Map();
const connectedUsers = new Map();
const completedSessions = [];

const normalizeRoomMeta = (roomMeta = {}) => ({
  nombre: roomMeta.nombre || roomMeta.roomName || 'Sala de mentoría',
  habilidad: roomMeta.habilidad || 'Habilidad',
  mood: roomMeta.mood || '',
});

const buildSessionPayload = (session) => {
  if (!session) {
    return null;
  }

  return {
    id: session.id,
    roomId: session.roomId,
    mentorId: session.mentorId,
    mentorName: session.mentorName,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    durationSeconds: session.durationSeconds,
    isActive: session.isActive,
    participantIds: [...session.participantIds],
    participantCount: session.participantIds.size,
    roomName: session.roomName,
    habilidad: session.habilidad,
    mood: session.mood,
    endReason: session.endReason || null,
  };
};

const createRoomState = (roomId, roomMeta = {}) => ({
  roomId,
  roomMeta: normalizeRoomMeta(roomMeta),
  participants: [],
  messages: [],
  reactions: [],
  createdAt: Date.now(),
  currentSession: null,
});

const getOrCreateRoomState = (roomId, roomMeta = {}) => {
  if (!activeRooms.has(roomId)) {
    activeRooms.set(roomId, createRoomState(roomId, roomMeta));
  }

  const room = activeRooms.get(roomId);
  room.roomMeta = {
    ...room.roomMeta,
    ...normalizeRoomMeta(roomMeta),
  };

  if (room.currentSession) {
    room.currentSession.roomName = room.roomMeta.nombre;
    room.currentSession.habilidad = room.roomMeta.habilidad;
    room.currentSession.mood = room.roomMeta.mood;
  }

  return room;
};

const startMentorSession = (room, user) => {
  if (room.currentSession?.isActive) {
    room.currentSession.participantIds.add(user.userId);
    return room.currentSession;
  }

  const participantIds = new Set(
    room.participants.map((participant) => participant.userId)
  );
  participantIds.add(user.userId);

  room.currentSession = {
    id: `${room.roomId}-${Date.now()}`,
    roomId: room.roomId,
    mentorId: user.userId,
    mentorName: user.userName,
    startedAt: new Date().toISOString(),
    endedAt: null,
    durationSeconds: 0,
    isActive: true,
    participantIds,
    roomName: room.roomMeta.nombre,
    habilidad: room.roomMeta.habilidad,
    mood: room.roomMeta.mood,
    endReason: null,
  };

  return room.currentSession;
};

const finalizeMentorSession = (room, reason = 'disconnect') => {
  if (!room?.currentSession?.isActive) {
    return null;
  }

  const startedAtMs = new Date(room.currentSession.startedAt).getTime();
  const endedAtMs = Date.now();
  const durationSeconds = Math.max(
    0,
    Math.floor((endedAtMs - startedAtMs) / 1000)
  );

  room.currentSession = {
    ...room.currentSession,
    endedAt: new Date(endedAtMs).toISOString(),
    durationSeconds,
    isActive: false,
    endReason: reason,
  };

  const completedSession = buildSessionPayload(room.currentSession);
  completedSessions.unshift(completedSession);
  room.lastCompletedSession = completedSession;

  return completedSession;
};

const getRoomSessionState = (roomId) => {
  const room = activeRooms.get(roomId);

  return room?.currentSession
    ? buildSessionPayload(room.currentSession)
    : room?.lastCompletedSession || null;
};

const getUserSessionHistory = (userId) => {
  return completedSessions.filter((session) => (
    session.mentorId === userId || session.participantIds.includes(userId)
  ));
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Usuario conectado: ${socket.id}`);

    // ═══════════════════════════════════════════════════
    // ════════════ EVENTOS DE SALA ════════════
    // ═══════════════════════════════════════════════════

    // Unirse a una sala
    socket.on('joinRoom', (data) => {
      const { roomId, userId, userName, userAvatar, userRole, roomMeta } = data;

      console.log(`[Socket] ${userName} uniéndose a sala: ${roomId}`);

      // Guardar info del usuario
      connectedUsers.set(socket.id, {
        userId,
        userName,
        userAvatar,
        userRole,
        roomId,
        socketId: socket.id,
        connectionStatus: 'conectado',
        timestamp: Date.now(),
        roomMeta: normalizeRoomMeta(roomMeta),
      });

      // Unirse al room
      socket.join(roomId);

      const room = getOrCreateRoomState(roomId, roomMeta);
      const newParticipant = {
        id: socket.id,
        userId,
        userName,
        userAvatar,
        userRole,
        nombre: userName,
        avatar: userAvatar,
        rolInSala: userRole,
        connectionStatus: 'conectado',
        joinedAt: Date.now(),
      };

      room.participants = room.participants.filter(
        (participant) => participant.userId !== userId
      );
      room.participants.push(newParticipant);

      if (room.currentSession?.isActive) {
        room.currentSession.participantIds.add(userId);
      }

      if (userRole === 'mentor') {
        startMentorSession(room, newParticipant);
      }

      socket.emit('roomState', {
        participants: room.participants,
        messages: room.messages,
        reactions: room.reactions,
        sessionInfo: getRoomSessionState(roomId),
      });

      io.to(roomId).emit('roomSessionUpdated', getRoomSessionState(roomId));

      // Notificar a todos en la sala que alguien se unió
      io.to(roomId).emit('userJoined', newParticipant);

      // Enviar lista de participantes actualizada
      io.to(roomId).emit('participantsList', room.participants);

      console.log(
        `[Socket] ${room.participants.length} participantes en sala ${roomId}`
      );
    });

    // Salir de una sala
    socket.on('leaveRoom', (data) => {
      const { roomId } = data;
      const user = connectedUsers.get(socket.id);

      if (user) {
        console.log(`[Socket] ${user.userName} saliendo de sala: ${roomId}`);

        const room = activeRooms.get(roomId);
        if (room) {
          room.participants = room.participants.filter(
            (p) => p.userId !== user.userId
          );

          if (user.userRole === 'mentor' && room.currentSession?.mentorId === user.userId) {
            finalizeMentorSession(room, 'leaveRoom');
            io.to(roomId).emit('roomSessionUpdated', getRoomSessionState(roomId));
          }

          io.to(roomId).emit('userLeft', socket.id);
          io.to(roomId).emit('participantsList', room.participants);

          // Si no hay más participantes, eliminar sala
          if (room.participants.length === 0) {
            room.lastEmptyAt = Date.now();
            console.log(`[Socket] Sala ${roomId} eliminada (vacía)`);
          }
        }

        connectedUsers.delete(socket.id);
      }

      socket.leave(roomId);
    });

    // ═══════════════════════════════════════════════════
    // ════════════ EVENTOS DE CHAT ════════════
    // ═══════════════════════════════════════════════════

    socket.on('sendMessage', (data) => {
      const { roomId, userId, userName, userAvatar, texto } = data;

      console.log(
        `[Socket] Mensaje en ${roomId} de ${userName}: "${texto.substring(0, 30)}..."`
      );

      const message = {
        id: Date.now(),
        userId,
        userName,
        userAvatar,
        texto,
        timestamp: new Date(),
      };

      const room = activeRooms.get(roomId);
      if (room) {
        room.messages.push(message);
      }

      // Enviar mensaje a todos en la sala
      io.to(roomId).emit('newMessage', message);
    });

    // ═══════════════════════════════════════════════════
    // ════════════ EVENTOS DE REACCIONES ════════════
    // ═══════════════════════════════════════════════════

    socket.on('sendReaction', (data) => {
      const { roomId, userId, userName, userAvatar, emoji } = data;

      console.log(
        `[Socket] Reacción en ${roomId} de ${userName}: ${emoji}`
      );

      const reaction = {
        id: Date.now(),
        userId,
        userName,
        userAvatar,
        emoji,
        timestamp: Date.now(),
      };

      const room = activeRooms.get(roomId);
      if (room) {
        room.reactions.push(reaction);
      }

      // Enviar reacción a todos en la sala
      io.to(roomId).emit('newReaction', reaction);

      // Limpiar reacciones antiguas después de 3 segundos
      setTimeout(() => {
        if (room) {
          room.reactions = room.reactions.filter((r) => r.id !== reaction.id);
          io.to(roomId).emit('reactionRemoved', reaction.id);
        }
      }, 3000);
    });

    // ═══════════════════════════════════════════════════
    // ════════════ EVENTOS DE ESTADO ════════════
    // ═══════════════════════════════════════════════════

    socket.on('userTyping', (data) => {
      const { roomId, userName } = data;

      io.to(roomId).emit('userTyping', {
        userName,
        isTyping: true,
      });
    });

    socket.on('userStoppedTyping', (data) => {
      const { roomId, userName } = data;

      io.to(roomId).emit('userStoppedTyping', {
        userName,
        isTyping: false,
      });
    });

    socket.on('videoStatusChanged', (data) => {
      const { roomId, enabled } = data;
      const user = connectedUsers.get(socket.id);

      if (user) {
        io.to(roomId).emit('videoStatusChanged', {
          userId: socket.id,
          userName: user.userName,
          enabled,
        });
      }
    });

    socket.on('audioStatusChanged', (data) => {
      const { roomId, enabled } = data;
      const user = connectedUsers.get(socket.id);

      if (user) {
        io.to(roomId).emit('audioStatusChanged', {
          userId: socket.id,
          userName: user.userName,
          enabled,
        });
      }
    });

    // ═══════════════════════════════════════════════════
    // ════════════ EVENTOS DE DESCONEXIÓN ════════════
    // ═══════════════════════════════════════════════════

    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);

      if (user) {
        console.log(
          `[Socket] ${user.userName} desconectado de sala: ${user.roomId}`
        );

        const room = activeRooms.get(user.roomId);
        if (room) {
          room.participants = room.participants.filter(
            (p) => p.userId !== user.userId
          );

          if (user.userRole === 'mentor' && room.currentSession?.mentorId === user.userId) {
            finalizeMentorSession(room, 'disconnect');
            io.to(user.roomId).emit('roomSessionUpdated', getRoomSessionState(user.roomId));
          }

          io.to(user.roomId).emit('userLeft', socket.id);
          io.to(user.roomId).emit('participantsList', room.participants);

          if (room.participants.length === 0) {
            room.lastEmptyAt = Date.now();
            console.log(`[Socket] Sala ${user.roomId} eliminada (vacía)`);
          }
        }

        connectedUsers.delete(socket.id);
      }

      console.log(`[Socket] Usuario desconectado: ${socket.id}`);
    });

    socket.on('error', (error) => {
      console.error(`[Socket] Error en ${socket.id}:`, error);
    });
  });

  return io;
};

module.exports = {
  initializeSocket,
  activeRooms,
  connectedUsers,
  getRoomSessionState,
  getUserSessionHistory,
};
