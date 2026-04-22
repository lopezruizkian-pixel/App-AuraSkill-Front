import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RoomContext } from '../context/RoomContext';
import { Clock, DoorOpen, Signal, Sparkles, Users } from 'lucide-react';
import '../Styles/RoomComponents.css';

const formatDuration = (totalSeconds = 0) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(safeSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
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

function RoomHeader({ isMentor = false, onLeaveSession, isLeaving = false }) {
  const { roomData, participants, connectionStatus, sessionInfo } = useContext(RoomContext);
  const [now, setNow] = useState(Date.now());

  const isSessionActive = Boolean(sessionInfo?.isActive && sessionInfo?.startedAt);

  useEffect(() => {
    if (!isSessionActive) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isSessionActive]);

  const elapsedSeconds = useMemo(() => {
    if (!sessionInfo) {
      return 0;
    }

    if (sessionInfo.isActive && sessionInfo.startedAt) {
      const startedAtMs = new Date(sessionInfo.startedAt).getTime();
      return Math.max(0, Math.floor((now - startedAtMs) / 1000));
    }

    return sessionInfo.durationSeconds || 0;
  }, [now, sessionInfo]);

  const mentorName = useMemo(
    () => getMentorName(roomData, sessionInfo, participants),
    [participants, roomData, sessionInfo]
  );

  const getStatusColor = () => {
    if (isSessionActive) {
      return '#00ff88';
    }

    switch (connectionStatus) {
      case 'conectando':
        return '#ffaa00';
      case 'error':
        return '#ff0055';
      case 'conectado':
        return '#00ffff';
      default:
        return '#808080';
    }
  };

  const getStatusText = () => {
    if (isSessionActive) {
      return 'Sesion en vivo';
    }

    switch (connectionStatus) {
      case 'conectando':
        return 'Conectando...';
      case 'error':
        return 'Error de conexion';
      case 'conectado':
        return 'Lista para comenzar';
      default:
        return 'Desconectado';
    }
  };

  return (
    <div className="room-header-compact">
      <div className="room-header-left">
        <h1 className="room-title-compact">{roomData?.nombre || 'Sala de mentoria'}</h1>
        <div className="room-subtitle-compact">
          <Sparkles size={12} />
          <span>{roomData?.habilidad}</span>
          <span className="divider">|</span>
          <span>Mentor: {mentorName}</span>
        </div>
      </div>

      <div className="room-header-right">
        <div className="room-header-badges">
          <div className="room-info-badge primary">
            <Signal size={16} style={{ color: getStatusColor() }} />
            <span>{getStatusText()}</span>
          </div>

          <div className="room-info-badge">
            <Users size={16} />
            <span>{participants.length}/{roomData?.capacidad_maxima || 15}</span>
          </div>

          <div className="room-info-badge">
            <Clock size={16} />
            <span>{formatDuration(elapsedSeconds)}</span>
          </div>
        </div>

        <button
          type="button"
          className={`room-action-btn ${isMentor ? 'mentor' : 'student'}`}
          onClick={onLeaveSession}
          disabled={isLeaving}
        >
          <DoorOpen size={16} />
          <span>
            {isLeaving
              ? 'Saliendo...'
              : isMentor
                ? 'Finalizar sesion'
                : 'Salir de la sala'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default RoomHeader;
