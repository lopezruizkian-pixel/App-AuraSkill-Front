import React from "react";
import { Users, Radio, Wrench, LogIn, Power } from "lucide-react";

function SalaActivaCard({ id, titulo, habilidad, inscritos, capacidad, onClose, onEnter }) {
  const handleClose = () => {
    if (window.confirm("¿Seguro que quieres finalizar la sesión?")) {
      onClose();
    }
  };
  return (
    <div className="neon-card sala-activa-card single-card">
      <div className="sala-card-header">
        <div className="title-group">
          <h3 className="sala-titulo">{titulo}</h3>
          <div className="live-badge" title="Sala en vivo">
            <Radio size={14} className="live-icon" /> 
            <span>En vivo</span>
          </div>
        </div>
      </div>
      <div className="sala-card-body">
        <div className="info-grid">
          <div className="info-item">
            <Wrench size={18} className="sala-info-icon" title="Habilidad" />
            <div>
              <label>Habilidad</label>
              <p>{habilidad}</p>
            </div>
          </div>

          <div className="info-item">
            <Users size={18} className="sala-info-icon" title="Participantes" />
            <div>
              <label>Participantes</label>
              <p>{inscritos} / {capacidad}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="sala-card-actions full-width-actions">
        <button className="danger-btn-neon" onClick={handleClose} title="Finalizar sesión">
          <Power size={18} />
          Finalizar sesión
        </button>
        <button className="primary-btn-neon" onClick={onEnter} title="Entrar a la sala">
          <LogIn size={18} />
          Entrar a la sala
        </button>
      </div>
    </div>
  );
}

export default SalaActivaCard;