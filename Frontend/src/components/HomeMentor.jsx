import React from "react";

function HomeMentor() {
  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <button className="boton-estadoDispo">Estado: Disponible </button>
      </div>

      <div className="neon-card main-card">
        <h3>Crear nueva sala</h3>
        <div className="form-mini">
          <div className="mini-input-group">
            <label>Nombre de la sala</label>
            <input type="text" className="neon-input-s" />
          </div>
          <div className="mini-input-group">
            <label>Habilidad</label>
            <input type="text" className="neon-input-s" />
          </div>
          <div className="mini-input-group">
            <label>Mood de la sesión</label>
            <input type="text" className="neon-input-s" />
          </div>
          <button className="primary-btn-s">Crear sala</button>
        </div>
      </div>
    </section>
  );
}

export default HomeMentor;