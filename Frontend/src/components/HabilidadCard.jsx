import React from "react";

function HabilidadCard({ titulo, IconoComponente }) {
  return (
    <div className="neon-card habilidad-card">
      <div className="habilidad-icon-container">
        <IconoComponente className="habilidad-icon" size={60} strokeWidth={1.5} />
      </div>
      <h3 className="habilidad-titulo">{titulo}</h3>
      <button className="primary-btn-s btn-explorar">Explorar</button>
    </div>
  );
}

export default HabilidadCard;