import { User, Circle } from "lucide-react";

function MentorCard({ nombre, habilidad, mood, nombreSala, onJoin, isJoining, isActive }) {
  return (
    <div className="neon-card mentor-card-layout">
      <div className="mentor-card-content">
        <div className="mentor-avatar-container">
          <User className="mentor-avatar-icon" size={32} />
          <Circle 
            className="mentor-status-dot" 
            size={12} 
            fill={isActive ? "#00ff00" : "#ff0000"} 
            stroke={isActive ? "#00ff00" : "#ff0000"} 
            style={{ position: "absolute", bottom: 0, right: 0 }}
          />
        </div>
        <div className="mentor-details">
          <p className="mentor-text"><strong>Mentor:</strong> {nombre}</p>
          <p className="mentor-text"><strong>Sala:</strong> {nombreSala}</p>
          <p className="mentor-text"><strong>Habilidad:</strong> {habilidad}</p>
          <p className="mentor-text"><strong>Mood:</strong> {mood || "—"}</p>
        </div>
      </div>
      <div className="mentor-card-action">
        <button 
          className="primary-btn-s" 
          onClick={onJoin} 
          disabled={isJoining}
          title={!isActive ? "Presiona para verificar si el mentor ya entró" : ""}
        >
          {isJoining ? "Entrando..." : "Entrar a sala"}
        </button>
      </div>
    </div>
  );
}

export default MentorCard;
