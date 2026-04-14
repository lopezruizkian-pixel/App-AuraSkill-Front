import React, { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Phone,
} from 'lucide-react';
import '../Styles/RoomComponents.css';

function RoomControls() {
  const {
    audioEnabled,
    videoEnabled,
    screenSharing,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  } = useContext(RoomContext);

  const handleEndSession = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar la sesión?')) {
      console.log('Cerrando sesión');
      // TODO: Redirigir a home
      window.location.href = '/home';
    }
  };

  return (
    <div className="room-controls">
      {/* Audio */}
      <button
        className={`control-btn ${audioEnabled ? 'active' : 'inactive'}`}
        onClick={toggleAudio}
        aria-label={audioEnabled ? 'Desactivar micrófono' : 'Activar micrófono'}
        title={audioEnabled ? 'Desactivar micrófono' : 'Activar micrófono'}
      >
        {audioEnabled ? (
          <Mic size={20} />
        ) : (
          <MicOff size={20} />
        )}
        <span>{audioEnabled ? 'Micrófono' : 'Sin micrófono'}</span>
      </button>

      {/* Video */}
      <button
        className={`control-btn ${videoEnabled ? 'active' : 'inactive'}`}
        onClick={toggleVideo}
        aria-label={videoEnabled ? 'Desactivar cámara' : 'Activar cámara'}
        title={videoEnabled ? 'Desactivar cámara' : 'Activar cámara'}
      >
        {videoEnabled ? (
          <Video size={20} />
        ) : (
          <VideoOff size={20} />
        )}
        <span>{videoEnabled ? 'Cámara' : 'Sin cámara'}</span>
      </button>

      {/* Screen Share */}
      <button
        className={`control-btn ${screenSharing ? 'active' : 'inactive'}`}
        onClick={toggleScreenShare}
        aria-label={screenSharing ? 'Dejar de compartir' : 'Compartir pantalla'}
        title={screenSharing ? 'Dejar de compartir' : 'Compartir pantalla'}
      >
        <Monitor size={20} />
        <span>{screenSharing ? 'Compartiendo' : 'Compartir'}</span>
      </button>

      {/* End Session */}
      <button
        className="control-btn end-session"
        onClick={handleEndSession}
        aria-label="Finalizar sesión"
        title="Finalizar sesión"
      >
        <Phone size={20} />
        <span>Finalizar</span>
      </button>
    </div>
  );
}

export default RoomControls;
