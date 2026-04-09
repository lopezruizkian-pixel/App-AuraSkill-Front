import React from "react";

function PerfilStatCard({ titulo, valor, icon: Icon, color }) {
  return (
    <div className="neon-card stat-card" style={{ '--accent-color': color }}>
      <div className="stat-icon-wrapper" style={{ color: color, boxShadow: `0 0 15px ${color}40` }}>
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <p className="stat-titulo">{titulo}</p>
        <h3 className="stat-valor" style={{ color: color }}>{valor}</h3>
      </div>
    </div>
  );
}

export default PerfilStatCard;