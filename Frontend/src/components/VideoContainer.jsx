import React, { useContext, useEffect, useRef } from 'react';
import { RoomContext } from '../context/RoomContext';
import '../Styles/RoomComponents.css';

function VideoContainer() {
  const { localStream, participants, videoEnabled } = useContext(RoomContext);
  const localVideoRef = useRef(null);

  // Mostrar video local en el video ref
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div className="video-container">
      {/* Video principal - Mentor */}
      <div className="video-main">
        <div className="video-box">
          {videoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="video-stream"
            />
          ) : (
            <div className="video-disabled">
              <div className="avatar-large">👨‍💼</div>
              <p>Cámara desactivada</p>
            </div>
          )}
          <div className="video-label">Tú (Mentor)</div>
        </div>
      </div>

      {/* Participantes - Grid */}
      <div className="participants-grid">
        {participants.map((participant) =>
          participant.id !== 'you' ? (
            <div key={participant.id} className="participant-card">
              <div className="participant-video">
                <div className="avatar-medium">{participant.avatar}</div>
              </div>
              <div className="participant-info">
                <p className="participant-name">{participant.nombre}</p>
                {participant.isTyping && (
                  <p className="participant-typing">✏️ Escribiendo...</p>
                )}
              </div>
            </div>
          ) : null
        )}

        {/* Placeholder cuando no hay participantes */}
        {participants.length === 0 && (
          <div className="no-participants">
            <p>Esperando participantes...</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoContainer;
