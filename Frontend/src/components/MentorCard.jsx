import React from "react";
import { User } from "lucide-react";

function MentorCard({ nombre, habilidad, mood }) {
  return (
    <div className="neon-card mentor-card-layout">
      <div className="mentor-card-content">
        <div className="mentor-avatar-container">
          <User className="mentor-avatar-icon" size={32} />
        </div>
        
        <div className="mentor-details">
          <p className="mentor-text"><strong>Mentor:</strong> {nombre}</p>
          <p className="mentor-text"><strong>Habilidad:</strong> {habilidad}</p>
          <p className="mentor-text"><strong>Mood:</strong> {mood}</p>
        </div>
      </div>

      <div className="mentor-card-action">
        <button className="primary-btn-s">Entrar a sala</button>
      </div>
    </div>
  );
}

export default MentorCard;