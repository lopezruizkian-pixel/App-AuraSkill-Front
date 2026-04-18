const { Server } = require('socket.io');
const { pool } = require('./db');

const activeRooms = new Map();
const connectedUsers = new Map();

const normalizeRoomMeta = (roomMeta = {}) => ({
  nombre: roomMeta.nombre || roomMeta.roomName || 'Sala de mentoría',
  habilidad: roomMeta.habilidad || 'Habilidad',
  mood: roomMeta.mood || '',
});

const buildSessionPayload = (session) => {
  if (!session) return null;
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

const getOrCreateRoomState = (roomId, roomMeta = {}) => {
  if (!activeRooms.has(roomId)) {
    activeRooms.set(roomId, {
      roomId,
      roomMeta: normalizeRoomMeta(roomMeta),
      participants: [],
      messages: [],
      reactions: [],
      createdAt: Date.now(),
      currentSession: null,
    });
  }
  const room = activeRooms.get(roomId);
  room.roomMeta = { ...room.roomMeta, ...normalizeRoomMeta(roomMeta) };
  return room;
};

const persistSession = async (session) => {
  try {
    const existing = await pool.query(
      'SELECT id FROM sessions WHERE room_id = $1 AND mentor_id = $2 AND started_at = $3',
      [session.roomId, session.mentorId, session.startedAt]
    );

    let dbSessionId;
    if (existing.rows.length === 0) {
      const res = await pool.query(
        `INSERT INTO sessions (room_id, mentor_id, mentor_name, room_name, habilidad, mood, started_at, ended_at, duration_seconds, is_active, end_reason)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
        [session.roomId, session.mentorId, session.mentorName, session.roomName,
         session.habilidad, session.mood, session.startedAt, session.endedAt,
         session.durationSeconds, session.isActive, session.endReason]
      );
      dbSessionId = res.rows[0].id;
    } else {
      dbSessionId = existing.rows[0].id;
      await pool.query(
        `UPDATE sessions SET ended_at=$1, duration_seconds=$2, is_active=$3, end_reason=$4 WHERE id=$5`,
        [session.endedAt, session.durationSeconds, session.isActive, session.endReason, dbSessionId]
      );
    }

    // Guardar TODOS los participantes incluyendo alumnos
    for (const participantId of session.participantIds) {
      await pool.query(
        `INSERT INTO session_participants (session_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [dbSessionId, participantId]
      );
    }
  } catch (err) {
    console.error('[Socket] Error persistiendo sesión:', err.message);
  }
};

const startMentorSession = (room, user) => {
  if (room.currentSession?.isActive) {
    room.currentSession.participantIds.add(user.userId);
    return room.currentSession;
  }

  const participantIds = new Set(room.participants.map((p) => p.userId));
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

const finalizeMentorSession = async (room, reason = 'disconnect') => {
  if (!room?.currentSession?.isActive) return null;

  const endedAtMs = Date.now();
  const durationSeconds = Math.max(
    0,
    Math.floor((endedAtMs - new Date(room.currentSession.startedAt).getTime()) / 1000)
  );

  room.currentSession = {
    ...room.currentSession,
    endedAt: new Date(endedAtMs).toISOString(),
    durationSeconds,
    isActive: false,
    endReason: reason,
  };

  await persistSession(room.currentSession);
  room.lastCompletedSession = buildSessionPayload(room.currentSession);
  return room.lastCompletedSession;
};

const getRoomSessionState = (roomId) => {
  const room = activeRooms.get(roomId);
  return room?.currentSession
    ? buildSessionPayload(room.currentSession)
    : room?.lastCompletedSession || null;
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

    socket.on('joinRoom', (data) => {
      const { roomId, userId, userName, userAvatar, userRole, roomMeta } = data;
      connectedUsers.set(socket.id, { userId, userName, userAvatar, userRole, roomId, socketId: socket.id });

      socket.join(roomId);
      const room = getOrCreateRoomState(roomId, roomMeta);

      const newParticipant = {
        id: socket.id, userId, userName, userAvatar, userRole,
        nombre: userName, avatar: userAvatar, rolInSala: userRole,
        connectionStatus: 'conectado', joinedAt: Date.now(),
      };

      room.participants = room.participants.filter((p) => p.userId !== userId);
      room.participants.push(newParticipant);

      // Si hay sesión activa, agregar al participante (alumno o mentor)
      if (room.currentSession?.isActive) {
        room.currentSession.participantIds.add(userId);
        console.log(`[Socket] ${userName} agregado a sesión activa en sala ${roomId}`);
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
      io.to(roomId).emit('userJoined', newParticipant);
      io.to(roomId).emit('participantsList', room.participants);
    });

    socket.on('leaveRoom', async (data) => {
      const { roomId } = data;
      const user = connectedUsers.get(socket.id);
      if (user) {
        const room = activeRooms.get(roomId);
        if (room) {
          room.participants = room.participants.filter((p) => p.userId !== user.userId);
          if (user.userRole === 'mentor' && room.currentSession?.mentorId === user.userId) {
            await finalizeMentorSession(room, 'leaveRoom');
            io.to(roomId).emit('roomSessionUpdated', getRoomSessionState(roomId));
          }
          io.to(roomId).emit('userLeft', socket.id);
          io.to(roomId).emit('participantsList', room.participants);
        }
        connectedUsers.delete(socket.id);
      }
      socket.leave(roomId);
    });

    socket.on('sendMessage', (data) => {
      const { roomId, userId, userName, userAvatar, texto } = data;
      const message = { id: Date.now(), userId, userName, userAvatar, texto, timestamp: new Date() };
      const room = activeRooms.get(roomId);
      if (room) room.messages.push(message);
      io.to(roomId).emit('newMessage', message);
    });

    socket.on('sendReaction', (data) => {
      const { roomId, userId, userName, userAvatar, emoji } = data;
      const reaction = { id: Date.now(), userId, userName, userAvatar, emoji, timestamp: Date.now() };
      const room = activeRooms.get(roomId);
      if (room) room.reactions.push(reaction);
      io.to(roomId).emit('newReaction', reaction);
      setTimeout(() => {
        if (room) {
          room.reactions = room.reactions.filter((r) => r.id !== reaction.id);
          io.to(roomId).emit('reactionRemoved', reaction.id);
        }
      }, 3000);
    });

    socket.on('userTyping', (data) => {
      io.to(data.roomId).emit('userTyping', { userName: data.userName, isTyping: true });
    });

    socket.on('userStoppedTyping', (data) => {
      io.to(data.roomId).emit('userStoppedTyping', { userName: data.userName, isTyping: false });
    });

    socket.on('videoStatusChanged', (data) => {
      const user = connectedUsers.get(socket.id);
      if (user) io.to(data.roomId).emit('videoStatusChanged', { userId: socket.id, userName: user.userName, enabled: data.enabled });
    });

    socket.on('audioStatusChanged', (data) => {
      const user = connectedUsers.get(socket.id);
      if (user) io.to(data.roomId).emit('audioStatusChanged', { userId: socket.id, userName: user.userName, enabled: data.enabled });
    });

    socket.on('disconnect', async () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        const room = activeRooms.get(user.roomId);
        if (room) {
          room.participants = room.participants.filter((p) => p.userId !== user.userId);
          if (user.userRole === 'mentor' && room.currentSession?.mentorId === user.userId) {
            await finalizeMentorSession(room, 'disconnect');
            io.to(user.roomId).emit('roomSessionUpdated', getRoomSessionState(user.roomId));
          }
          io.to(user.roomId).emit('userLeft', socket.id);
          io.to(user.roomId).emit('participantsList', room.participants);
        }
        connectedUsers.delete(socket.id);
      }
      console.log(`[Socket] Usuario desconectado: ${socket.id}`);
    });

    socket.on('error', (error) => console.error(`[Socket] Error en ${socket.id}:`, error));
  });

  return io;
};

module.exports = { initializeSocket, activeRooms, connectedUsers, getRoomSessionState };
