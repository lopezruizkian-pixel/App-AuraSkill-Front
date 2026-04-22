import React from "react";

function HistorialRow({ fecha, habilidad, mentor, duracion }) {
  return (
    <div className="historial-row-neon">
      <div className="historial-cell">{fecha}</div>
      <div className="historial-cell" style={{ fontWeight: 600, color: "#fff" }}>{habilidad}</div>
      <div className="historial-cell">{mentor}</div>
      <div className="historial-cell" style={{ color: "#00ffff" }}>{duracion}</div>
    </div>
  );
}

export default HistorialRow;