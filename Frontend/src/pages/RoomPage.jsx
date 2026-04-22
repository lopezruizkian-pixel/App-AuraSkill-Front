import React, { useEffect, useContext, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Clock3, Mic2, ShieldCheck, Users2 } from 'lucide-react';
import { RoomContext } from '../context/RoomContext';
import { useRoom } from '../hooks/useRoom';
import { useWebSocket } from '../hooks/useWebSocket';
import RoomHeader from '../components/RoomHeader';
import ChatRoom from '../components/ChatRoom';
import ParticipantsList from '../components/ParticipantsList';
import ReactionsContainer from '../components/ReactionsContainer';
import '../Styles/RoomPage.css';

const formatSessionDuration = (sessionInfo, currentTime) => {
  if (!sessionInfo) {
    return '00:00:00';
  }

  if (sessionInfo.isActive && sessionInfo.startedAt) {
    const startedAtMs = new Date(sessionInfo.startedAt).getTime();
    const elapsedSeconds = Math.max(0, Math.floor((currentTime - startedAtMs) / 1000));
    const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsedSeconds % 60).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  const safeSeconds = Math.max(0, sessionInfo.durationSeconds || 0);
  const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(safeSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const formatSessionStart = (sessionInfo) => {
  if (!sessionInfo?.startedAt) {
    return 'Se iniciara cuando entre el mentor';
  }

  const date = new Date(sessionInfo.startedAt);

  if (Number.isNaN(date.getTime())) {
    return 'Sesion en preparacion';
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getMentorName = (roomData, sessionInfo, participants) => {
  const mentorParticipant = participants.find((participant) => participant.rolInSala === 'mentor');

  if (mentorParticipant?.nombre) {
    return mentorParticipant.nombre;
  }

  if (sessionInfo?.mentorName) {
    return sessionInfo.mentorName;
  }

  if (typeof roomData?.mentor === 'string') {
    return roomData.mentor;
  }

  if (roomData?.mentor?.nombre) {
    return roomData.mentor.nombre;
  }

  return 'Mentor pendiente';
};

function RoomPage() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const {
    initRoom,
    roomData,
    sessionInfo,
    participants,
    error,
    connectionStatus,
  } = useContext(RoomContext);
  const [now, setNow] = useState(Date.now());
  const [isLeaving, setIsLeaving] = useState(false);

  const userId = localStorage.getItem('userId') || `user-${Date.now()}`;
  const userName = localStorage.getItem('userName') || 'Usuario Anonimo';
  const userRole = localStorage.getItem('userRole') || 'alumno';
  const userAvatar = '👨‍💼';
  const isMentor = userRole === 'mentor';

  const { isLoading: roomLoading } = useRoom(roomId);
  const { sendMessage, sendReaction, leaveCurrentRoom } = useWebSocket(
    roomId,
    userId,
    userName,
    userAvatar,
    userRole
  );

  useEffect(() => {
    if (roomId) {
      initRoom(roomId);
    } else {
      navigate('/home');
    }
  }, [roomId, initRoom, navigate]);

  useEffect(() => {
    if (!sessionInfo?.isActive) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [sessionInfo?.isActive]);

  const mentorName = useMemo(
    () => getMentorName(roomData, sessionInfo, participants),
    [participants, roomData, sessionInfo]
  );

  const sessionSummary = useMemo(() => ([
    {
      id: 'skill',
      icon: BookOpen,
      label: 'Habilidad',
      value: roomData?.habilidad || 'Por definir',
    },
    {
      id: 'mentor',
      icon: Mic2,
      label: 'Mentor al frente',
      value: mentorName,
    },

    {
      id: 'start',
      icon: Clock3,
      label: 'Inicio de la sesion',
      value: formatSessionStart(sessionInfo),
    },
    {
      id: 'access',
      icon: ShieldCheck,
      label: 'Tu acceso',
      value: isMentor ? 'Control total de la sesion' : 'Participacion guiada',
    },
  ]), [isMentor, mentorName, roomData, sessionInfo]);

  const handleLeaveSession = () => {
    if (isLeaving) {
      return;
    }

    setIsLeaving(true);
    leaveCurrentRoom();
    localStorage.removeItem('salaActiva');
    navigate('/home', { replace: true });
  };

  const stageTitle = isMentor
    ? 'Espacio para conversar, resolver dudas y acompanar el proceso.'
    : 'Espacio para seguir la sesion, hacer preguntas y mantener foco.';

  const stageDescription = roomData?.descripcion?.trim()
    ? roomData.descripcion
    : isMentor
      ? 'Usa este espacio para fijar el objetivo de la sesion, compartir contexto y mantener el ritmo de la mentoria en vivo.'
      : 'Sigue las indicaciones del mentor, participa en el chat y aprovecha este espacio para resolver dudas sin cambiar la configuracion de la sala.';

  if (roomLoading) {
    return (
      <div className="room-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando sala...</p>
        </div>
      </div>
    );
  }

  if (error && connectionStatus === 'error') {
    return (
      <div className="room-error">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/home')} className="primary-btn">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="room-page">
      <RoomHeader
        isMentor={isMentor}
        onLeaveSession={handleLeaveSession}
        isLeaving={isLeaving}
      />

      <div className="room-container">
        <section className="room-main-panel">
          {/* Chat con prioridad máxima */}
          <div className="room-chat-area">
            <ChatRoom sendMessage={sendMessage} sendReaction={sendReaction} />
          </div>
        </section>

        <aside className="room-sidebar">
          {/* Card: Identidad y Contexto */}
          <section className="sidebar-section session-sidebar-card context-card-neon">
            <div className="session-sidebar-header">
              <span className="session-sidebar-kicker">Habilidad</span>
              <h3 className="habilidad-highlight">{roomData?.habilidad || 'General'}</h3>
            </div>
            <p className="sidebar-description-text">
              {roomData?.descripcion?.trim() || 'Sin descripción adicional para esta sesión.'}
            </p>
          </section>

          {/* Card: Estado en Vivo */}
          <section className="sidebar-section session-sidebar-card status-card-neon">
            <div className="status-grid-compact">
              <div className="status-item-mini">
                <Clock3 size={14} className="icon-neon" />
                <div className="status-item-info">
                  <span>En vivo</span>
                  <strong>{formatSessionDuration(sessionInfo, now)}</strong>
                </div>
              </div>
              <div className="status-item-mini">
                <Users2 size={14} className="icon-neon" />
                <div className="status-item-info">
                  <span>Capacidad</span>
                  <strong>{participants.length} / {roomData?.capacidad_maxima || 10}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Card: Participantes */}
          <ParticipantsList />
        </aside>
      </div>

      <ReactionsContainer />

      {connectionStatus !== 'conectado' && (
        <div className="connection-status-banner">
          <span className="pulse"></span>
          {connectionStatus === 'conectando'
            ? 'Conectando...'
            : 'Reconectando...'}
        </div>
      )}
    </div>
  );
}

export default RoomPage;
