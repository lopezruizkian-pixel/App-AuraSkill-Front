import React, { useContext, useMemo } from 'react';
import { RoomContext } from '../context/RoomContext';
import { Users, CheckCircle } from 'lucide-react';
import '../Styles/RoomComponents.css';

const ParticipantsList = React.memo(() => {
  const { participants } = useContext(RoomContext);

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      if (a.rolInSala === 'mentor' && b.rolInSala !== 'mentor') return -1;
      if (a.rolInSala !== 'mentor' && b.rolInSala === 'mentor') return 1;
      return a.nombre.localeCompare(b.nombre);
    });
  }, [participants]);

  return (
    <div className="participants-list">
      <div className="participants-header">
        <div>
          <h3>
            <Users size={18} />
            Participantes
          </h3>
          <p className="participants-subtitle">Anfitrion y asistentes conectados ahora</p>
        </div>
        <span className="participants-count-badge">{participants.length}</span>
      </div>

      <div className="participants-content">
        {sortedParticipants.length === 0 ? (
          <div className="no-participants-text">
            <p>No hay participantes aun</p>
          </div>
        ) : (
          <ul className="participants-ul">
            {sortedParticipants.map((participant) => (
              <li
                key={participant.id}
                className={`participant-item ${participant.rolInSala === 'mentor' ? 'mentor-highlight' : ''}`}
              >
                <div className="participant-avatar">{participant.avatar}</div>
                <div className="participant-details">
                  <p className="participant-name">{participant.nombre}</p>
                  <p className="participant-role">
                    {participant.rolInSala === 'mentor'
                      ? 'Mentor anfitrion'
                      : 'Alumno en sesion'}
                  </p>
                </div>
                {participant.connectionStatus === 'conectado' && (
                  <CheckCircle size={16} className="connection-indicator" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

ParticipantsList.displayName = 'ParticipantsList';

export default ParticipantsList;
