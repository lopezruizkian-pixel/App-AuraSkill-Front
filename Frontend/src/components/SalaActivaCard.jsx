import React from "react";
import { Users, Radio, Wrench, Smile, LogIn, Power } from "lucide-react";

function SalaActivaCard({ titulo, habilidad, mood, inscritos, capacidad, onClose }) {
  return (
    <div className="neon-card sala-activa-card single-card">
      <div className="sala-card-header">
        <div className="title-group">
          <h3 className="sala-titulo">{titulo}</h3>
          <div className="live-badge">
            <Radio size={14} className="live-icon" /> 
            <span>En vivo</span>
          </div>
        </div>
      </div>
      
      <div className="sala-card-body">
        <div className="info-grid">
          <div className="info-item">
            <Wrench size={18} className="sala-info-icon" />
            <div>
              <label>Habilidad</label>
              <p>{habilidad}</p>
            </div>
          </div>
          <div className="info-item">
            <Smile size={18} className="sala-info-icon" />
            <div>
              <label>Mood de la sesión</label>
              <p>{mood}</p>
            </div>
          </div>
          <div className="info-item">
            <Users size={18} className="sala-info-icon" />
            <div>
              <label>Participantes</label>
              <p>{inscritos} / {capacidad}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sala-card-actions full-width-actions">
        {/* Usamos Power para un toque más "tech" de apagado */}
        <button className="danger-btn-neon" onClick={onClose}>
          <Power size={18} />
          Finalizar sesión
        </button>
        <button className="primary-btn-neon">
          <LogIn size={18} />
          Entrar a la sala
        </button>
      </div>
    </div>
  );
}

export default SalaActivaCard;