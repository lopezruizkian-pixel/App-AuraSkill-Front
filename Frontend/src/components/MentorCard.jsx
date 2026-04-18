import { User } from "lucide-react";

function MentorCard({ nombre, habilidad, mood, nombreSala, onJoin, isJoining }) {
  return (
    <div className="neon-card mentor-card-layout">
      <div className="mentor-card-content">
        <div className="mentor-avatar-container">
          <User className="mentor-avatar-icon" size={32} />
        </div>
        <div className="mentor-details">
          <p className="mentor-text"><strong>Mentor:</strong> {nombre}</p>
          <p className="mentor-text"><strong>Sala:</strong> {nombreSala}</p>
          <p className="mentor-text"><strong>Habilidad:</strong> {habilidad}</p>
          <p className="mentor-text"><strong>Mood:</strong> {mood || "—"}</p>
        </div>
      </div>
      <div className="mentor-card-action">
        <button className="primary-btn-s" onClick={onJoin} disabled={isJoining}>
          {isJoining ? "Entrando..." : "Entrar a sala"}
        </button>
      </div>
    </div>
  );
}

export default MentorCard;
