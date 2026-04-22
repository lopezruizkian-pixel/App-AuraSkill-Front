import { useEffect, useContext, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { RoomContext } from '../context/RoomContext';
import { getSocketUrl } from '../services/socketConfig';

const normalizeTimestamp = (value) => {
  if (!value) {
    return new Date();
  }

  if (value instanceof Date) {
    return value;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
};

const normalizeParticipant = (participant) => {
  if (!participant) {
    return participant;
  }

  return {
    ...participant,
    id: participant.id || participant.userId,
    nombre: participant.nombre || participant.userName || 'Usuario',
    avatar: participant.avatar || participant.userAvatar || '👤',
    rolInSala: participant.rolInSala || participant.userRole || 'alumno',
    connectionStatus: participant.connectionStatus || 'conectado',
  };
};

const normalizeMessage = (message) => {
  if (!message) {
    return message;
  }

  return {
    ...message,
    timestamp: normalizeTimestamp(message.timestamp),
  };
};

export const useWebSocket = (roomId, userId, userName, userAvatar, userRole) => {
  const {
    roomData,
    setConnectionStatus,
    setSessionInfo,
    setParticipants,
    addParticipant,
    removeParticipant,
    setMessages,
    addMessage,
    addReaction,
    removeReaction,
    setUserTyping,
    removeUserTyping,
    setError,
  } = useContext(RoomContext);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const leaveCurrentRoom = useCallback(() => {
    if (!socketRef.current) {
      return;
    }

    console.log('[WebSocket] Saliendo manualmente de la sala:', roomId);
    socketRef.current.emit('leaveRoom', { roomId, userId });
    clearTimeout(reconnectTimeoutRef.current);
    socketRef.current.disconnect();
    socketRef.current = null;
    setConnectionStatus('desconectado');
  }, [roomId, userId, setConnectionStatus]);

  const sendMessage = useCallback((messageText) => {
    if (!socketRef.current?.connected) {
      console.warn('[WebSocket] Socket no disponible');
      setError('No estas conectado. Intenta nuevamente.');
      return false;
    }

    if (!messageText.trim()) {
      console.warn('[WebSocket] Mensaje vacio');
      return false;
    }

    socketRef.current.emit('sendMessage', {
      roomId,
      userId,
      userName,
      userAvatar,
      texto: messageText,
      timestamp: Date.now(),
    });

    return true;
  }, [roomId, userId, userName, userAvatar, setError]);

  const sendReaction = useCallback((emoji) => {
    if (!socketRef.current?.connected) {
      console.warn('[WebSocket] Socket no disponible');
      return false;
    }

    if (!emoji || emoji.length === 0) {
      console.warn('[WebSocket] Emoji invalido');
      return false;
    }

    socketRef.current.emit('sendReaction', {
      roomId,
      userId,
      userName,
      userAvatar,
      emoji,
      timestamp: Date.now(),
    });

    return true;
  }, [roomId, userId, userName, userAvatar]);

  const notifyUserTyping = useCallback(() => {
    if (!socketRef.current?.connected) {
      return;
    }

    socketRef.current.emit('userTyping', {
      roomId,
      userName,
      userId,
    });
  }, [roomId, userName, userId]);

  const notifyUserStoppedTyping = useCallback(() => {
    if (!socketRef.current?.connected) {
      return;
    }

    socketRef.current.emit('userStoppedTyping', {
      roomId,
      userName,
      userId,
    });
  }, [roomId, userName, userId]);

  const notifyVideoStatusChanged = useCallback((enabled) => {
    if (!socketRef.current?.connected) {
      return;
    }

    socketRef.current.emit('videoStatusChanged', {
      roomId,
      userId,
      enabled,
    });
  }, [roomId, userId]);

  const notifyAudioStatusChanged = useCallback((enabled) => {
    if (!socketRef.current?.connected) {
      return;
    }

    socketRef.current.emit('audioStatusChanged', {
      roomId,
      userId,
      enabled,
    });
  }, [roomId, userId]);

  useEffect(() => {
    if (!roomId || !userId) {
      console.log('[WebSocket] roomId o userId no validos');
      return undefined;
    }

    console.log('[WebSocket] Conectando a sala:', roomId);
    setConnectionStatus('conectando');

    try {
      const socketURL = getSocketUrl();

      const socket = io(socketURL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        transports: ['websocket', 'polling'],
        query: {
          userId,
          roomId,
        },
      });

      socket.on('connect', () => {
        console.log('[WebSocket] Conectado al servidor');
        setConnectionStatus('conectado');

        socket.emit('joinRoom', {
          roomId,
          userId,
          userName,
          userAvatar,
          userRole,
          roomMeta: {
            nombre: roomData?.nombre,
            habilidad: roomData?.habilidad,
            mood: roomData?.mood,
          },
        });
      });

      socket.on('userJoined', (user) => {
        console.log('[WebSocket] Usuario se unio:', user?.userName);
        if (user && user.id) {
          addParticipant(normalizeParticipant(user));
        }
      });

      socket.on('participantsList', (participants) => {
        console.log('[WebSocket] Lista de participantes:', participants?.length || 0);
        setParticipants((participants || []).map(normalizeParticipant));
      });

      socket.on('roomState', (roomState) => {
        console.log('[WebSocket] Estado inicial de sala recibido');
        setParticipants((roomState?.participants || []).map(normalizeParticipant));
        setMessages((roomState?.messages || []).map(normalizeMessage));
        setSessionInfo(roomState?.sessionInfo || null);
      });

      socket.on('roomSessionUpdated', (sessionInfo) => {
        console.log('[WebSocket] Estado de sesion actualizado');
        setSessionInfo(sessionInfo || null);
      });

      socket.on('userLeft', (leftUserId) => {
        console.log('[WebSocket] Usuario salio:', leftUserId);
        if (leftUserId) {
          removeParticipant(leftUserId);
        }
      });

      socket.on('newMessage', (message) => {
        console.log('[WebSocket] Nuevo mensaje recibido');
        if (message && message.id) {
          addMessage(normalizeMessage(message));
        }
      });

      socket.on('newReaction', (reaction) => {
        console.log('[WebSocket] Nueva reaccion:', reaction?.emoji);
        if (reaction && reaction.id) {
          addReaction({
            ...reaction,
            timestamp: normalizeTimestamp(reaction.timestamp),
          });
        }
      });

      socket.on('reactionRemoved', (reactionId) => {
        console.log('[WebSocket] Reaccion removida:', reactionId);
        if (reactionId) {
          removeReaction(reactionId);
        }
      });

      socket.on('userTyping', (data) => {
        if (data && data.userName) {
          setUserTyping(data.userName);
        }
      });

      socket.on('userStoppedTyping', (data) => {
        if (data && data.userName) {
          removeUserTyping(data.userName);
        }
      });

      socket.on('videoStatusChanged', (data) => {
        console.log('[WebSocket] Video status:', data?.enabled);
      });

      socket.on('audioStatusChanged', (data) => {
        console.log('[WebSocket] Audio status:', data?.enabled);
      });

      socket.on('disconnect', (reason) => {
        console.log('[WebSocket] Desconectado:', reason);
        setConnectionStatus('desconectado');
      });

      socket.on('connect_error', (error) => {
        console.error('[WebSocket] Error de conexion:', error?.message);
        setConnectionStatus('error');
        setError(`Error de conexion: ${error?.message || 'desconocido'}`);
      });

      socket.on('error', (error) => {
        console.error('[WebSocket] Error:', error);
        setError(`Error WebSocket: ${error}`);
      });

      socketRef.current = socket;
    } catch (err) {
      console.error('[WebSocket] Error de inicializacion:', err);
      setConnectionStatus('error');
      setError('Error inicializando conexion en tiempo real');
    }

    return () => {
      console.log('[WebSocket] Limpiando conexion para sala:', roomId);
      leaveCurrentRoom();
    };
  }, [
    roomId,
    userId,
    userName,
    userAvatar,
    userRole,
    setConnectionStatus,
    setSessionInfo,
    setParticipants,
    addParticipant,
    removeParticipant,
    setMessages,
    addMessage,
    addReaction,
    removeReaction,
    setUserTyping,
    removeUserTyping,
    setError,
    leaveCurrentRoom,
  ]);

  return {
    sendMessage,
    sendReaction,
    leaveCurrentRoom,
    notifyUserTyping,
    notifyUserStoppedTyping,
    notifyVideoStatusChanged,
    notifyAudioStatusChanged,
    isConnected: socketRef.current?.connected || false,
  };
};

export default useWebSocket;