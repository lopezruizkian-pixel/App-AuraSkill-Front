import React from "react";

function ConfigCard({ titulo, icon: Icon, estadoTexto, estadoColor, btnTexto }) {
  return (
    <div className="neon-card config-card">
      <div className="config-card-header">
        <div className="config-icon-container">
          <Icon size={24} className="config-icon" />
        </div>
        <h3 className="config-titulo">{titulo}</h3>
      </div>
      
      <p className="config-estado">
        Estado: <span style={{ color: estadoColor, fontWeight: "600" }}>{estadoTexto}</span>
      </p>

      <div className="config-card-action">
        <button className="secondary-btn-neon">{btnTexto}</button>
      </div>
    </div>
  );
}

export default ConfigCard;