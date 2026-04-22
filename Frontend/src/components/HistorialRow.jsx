import React from "react";

function HistorialRow({ fecha, habilidad, mentor, duracion }) {
  return (
    <div className="historial-row-neon">
      <div className="historial-cell">{fecha}</div>
      <div className="historial-cell">{habilidad}</div>
      <div className="historial-cell">{mentor}</div>
      <div className="historial-cell">{duracion}</div>
    </div>
  );
}

export default HistorialRow;