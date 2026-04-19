import React from "react";
import { Users, Radio, Wrench, Smile, LogIn, Power } from "lucide-react";

function SalaActivaCard({ id, titulo, habilidad, mood, inscritos, capacidad, onClose, onEnter, isClosing = false }) {
  const handleClose = () => {
    if (isClosing) {
      return;
    }

    if (window.confirm("Seguro que quieres finalizar la sesion?")) {
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
            <Smile size={18} className="sala-info-icon" title="Mood de la sesion" />
            <div>
              <label>Mood de la sesion</label>
              <p>{mood}</p>
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
        <button className="danger-btn-neon" onClick={handleClose} title="Finalizar sesion" disabled={isClosing}>
          <Power size={18} />
          {isClosing ? "Finalizando..." : "Finalizar sesion"}
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
