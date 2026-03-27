import React, { createContext, useReducer, useCallback } from 'react';

export const RoomContext = createContext();

const initialState = {
  roomId: null,
  roomData: null,
  sessionInfo: null,
  participants: [],
  messages: [],
  reactions: [],
  localUser: null,
  connectionStatus: 'desconectado', // 'conectando', 'conectado', 'error'
  isLoading: false,
  error: null,
  usersTyping: [],
};

const roomReducer = (state, action) => {
  switch (action.type) {
    // Inicializar sala
    case 'INIT_ROOM':
      return {
        ...state,
        roomId: action.payload.roomId,
        isLoading: true,
        error: null,
      };

    // Datos de sala cargados
    case 'SET_ROOM_DATA':
      return {
        ...state,
        roomData: action.payload,
        isLoading: false,
      };

    case 'SET_SESSION_INFO':
      return {
        ...state,
        sessionInfo: action.payload,
      };

    case 'SET_PARTICIPANTS':
      return {
        ...state,
        participants: action.payload,
      };

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };

    // Usuario local
    case 'SET_LOCAL_USER':
      return {
        ...state,
        localUser: action.payload,
      };

    // Estado de conexión
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        connectionStatus: action.payload,
      };

    // Agregar participante
    case 'ADD_PARTICIPANT':
      const exists = state.participants.some(p => p.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        participants: [...state.participants, action.payload],
      };

    // Remover participante
    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== action.payload),
      };

    // Agregar mensaje
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    // Borrar mensajes (cuando sale de sala)
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      };

    // Agregar reacción
    case 'ADD_REACTION':
      return {
        ...state,
        reactions: [...state.reactions, action.payload],
      };

    // Remover reacción
    case 'REMOVE_REACTION':
      return {
        ...state,
        reactions: state.reactions.filter((r) => r.id !== action.payload),
      };

    // Usuario escribiendo
    case 'SET_USER_TYPING':
      const typingUsers = state.usersTyping.filter((u) => u !== action.payload);
      return {
        ...state,
        usersTyping: [...typingUsers, action.payload],
      };

    // Usuario paró de escribir
    case 'REMOVE_USER_TYPING':
      return {
        ...state,
        usersTyping: state.usersTyping.filter((u) => u !== action.payload),
      };

    // Limpiar reacciones
    case 'CLEAR_REACTIONS':
      return {
        ...state,
        reactions: [],
      };

    // Error
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    // Reset sala
    case 'RESET_ROOM':
      return initialState;

    default:
      return state;
  }
};

export const RoomProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roomReducer, initialState);

  // Acciones
  const initRoom = useCallback((roomId) => {
    dispatch({ type: 'INIT_ROOM', payload: { roomId } });
  }, []);

  const setRoomData = useCallback((data) => {
    dispatch({ type: 'SET_ROOM_DATA', payload: data });
  }, []);

  const setSessionInfo = useCallback((sessionInfo) => {
    dispatch({ type: 'SET_SESSION_INFO', payload: sessionInfo });
  }, []);

  const setParticipants = useCallback((participants) => {
    dispatch({ type: 'SET_PARTICIPANTS', payload: participants });
  }, []);

  const setMessages = useCallback((messages) => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
  }, []);

  const setLocalUser = useCallback((user) => {
    dispatch({ type: 'SET_LOCAL_USER', payload: user });
  }, []);

  const setConnectionStatus = useCallback((status) => {
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: status });
  }, []);

  const addParticipant = useCallback((participant) => {
    dispatch({ type: 'ADD_PARTICIPANT', payload: participant });
  }, []);

  const removeParticipant = useCallback((participantId) => {
    dispatch({ type: 'REMOVE_PARTICIPANT', payload: participantId });
  }, []);

  const addMessage = useCallback((message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const addReaction = useCallback((reaction) => {
    dispatch({ type: 'ADD_REACTION', payload: reaction });
  }, []);

  const removeReaction = useCallback((reactionId) => {
    dispatch({ type: 'REMOVE_REACTION', payload: reactionId });
  }, []);

  const setUserTyping = useCallback((userName) => {
    dispatch({ type: 'SET_USER_TYPING', payload: userName });
  }, []);

  const removeUserTyping = useCallback((userName) => {
    dispatch({ type: 'REMOVE_USER_TYPING', payload: userName });
  }, []);

  const clearReactions = useCallback(() => {
    dispatch({ type: 'CLEAR_REACTIONS' });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const value = {
    // Estado
    ...state,
    // Acciones
    initRoom,
    setRoomData,
    setSessionInfo,
    setParticipants,
    setMessages,
    setLocalUser,
    setConnectionStatus,
    addParticipant,
    removeParticipant,
    addMessage,
    clearMessages,
    addReaction,
    removeReaction,
    setUserTyping,
    removeUserTyping,
    clearReactions,
    setError,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
