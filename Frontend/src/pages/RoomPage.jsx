import React, { useEffect, useContext, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Clock3, Mic2, ShieldCheck, Sparkles, Users2 } from 'lucide-react';
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
      id: 'mood',
      icon: Sparkles,
      label: isMentor ? 'Mood de la sesion' : 'Mood definido por mentor',
      value: roomData?.mood || sessionInfo?.mood || 'Sin mood',
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
          <div className="session-stage-card">
            <div className="session-stage-copy">
              <span className="session-stage-kicker">
                {isMentor ? 'Sesion guiada' : 'Sesion en curso'}
              </span>
              <h2>{stageTitle}</h2>
              <p>{stageDescription}</p>
            </div>

            <div className="session-stage-stats">
              <div className="stage-stat-card">
                <span className="stage-stat-label">Mentor</span>
                <strong>{mentorName}</strong>
              </div>
              <div className="stage-stat-card">
                <span className="stage-stat-label">Duracion activa</span>
                <strong>{formatSessionDuration(sessionInfo, now)}</strong>
              </div>
              <div className="stage-stat-card">
                <span className="stage-stat-label">
                  {isMentor ? 'Participando ahora' : 'Tu experiencia'}
                </span>
                <strong>
                  {isMentor
                    ? `${participants.length} persona(s)`
                    : 'Vista guiada por el mentor'}
                </strong>
              </div>
            </div>
          </div>

          <div className="room-chat-area">
            <ChatRoom sendMessage={sendMessage} sendReaction={sendReaction} />
          </div>
        </section>

        <aside className="room-sidebar">
          <section className="sidebar-section session-sidebar-card">
            <div className="session-sidebar-header">
              <div>
                <span className="session-sidebar-kicker">Contexto rapido</span>
                <h3>{isMentor ? 'Resumen de la sesion' : 'Resumen para alumno'}</h3>
              </div>
              <div className="session-sidebar-badge">
                <Users2 size={16} />
                <span>{participants.length} conectados</span>
              </div>
            </div>

            <p className="session-sidebar-note">
              {isMentor
                ? 'Desde aqui puedes seguir el contexto general y cerrar la sesion cuando termines.'
                : 'Esta vista es de acompanamiento: puedes participar en la conversacion, pero la configuracion de la sala la mantiene el mentor.'}
            </p>

            <div className="session-summary-grid">
              {sessionSummary.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.id} className="session-summary-item">
                    <div className="session-summary-icon">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="session-summary-label">{item.label}</p>
                      <strong className="session-summary-value">{item.value}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

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
