import React from "react";
import { useNavigate } from "react-router-dom";
import { Type, Wrench, Smile, Users, AlignLeft, PlusSquare } from "lucide-react";

function HomeMentor() {
  const navigate = useNavigate();

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <button className="boton-estadoDispo">Estado: Disponible</button>
      </div>

      <div className="neon-card main-card">
        <h3>Crear nueva sala</h3>
        <div className="form-mini">

          <div className="mini-input-group">
            <label>Nombre de la sala</label>
            <div className="input-wrapper-mini">
              <Type size={16} className="mini-icon" />
              <input type="text" className="neon-input-s" placeholder="Ej. Lógica en React" />
            </div>
          </div>

          <div className="mini-row">
            <div className="mini-input-group">
              <label>Habilidad</label>
              <div className="input-wrapper-mini">
                <Wrench size={16} className="mini-icon" />
                <select className="neon-input-s neon-select-s">
                  <option value="" disabled selected>Selecciona</option>
                  <option value="programacion">💻 Programación</option>
                  <option value="diseno">🎨 Diseño UI/UX</option>
                  <option value="idiomas">🌍 Idiomas</option>
                  <option value="matematicas">📐 Matemáticas</option>
                  <option value="musica">🎵 Música</option>
                  <option value="otros">✨ Otros</option>
                </select>
              </div>
            </div>

            <div className="mini-input-group">
              <label>Mood</label>
              <div className="input-wrapper-mini">
                <Smile size={16} className="mini-icon" />
                <select className="neon-input-s neon-select-s">
                  <option value="" disabled selected>Selecciona</option>
                  <option value="concentrado">🎯 Concentrado</option>
                  <option value="creativo">🎨 Creativo</option>
                  <option value="energetico">⚡ Energético</option>
                  <option value="relajado">☕ Relajado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mini-row">
            <div className="mini-input-group">
              <label>Límite de estudiantes</label>
              <div className="input-wrapper-mini">
                <Users size={16} className="mini-icon" />
                <input type="number" min="1" max="50" className="neon-input-s" placeholder="Ej. 10" />
              </div>
            </div>
          </div>

          <div className="mini-input-group">
            <label>Descripción (opcional)</label>
            <div className="input-wrapper-mini textarea-mini">
              <AlignLeft size={16} className="mini-icon" style={{ marginTop: 3 }} />
              <textarea className="neon-input-s neon-textarea-s" rows={2} placeholder="¿De qué tratará esta sesión?" />
            </div>
          </div>

          <div className="mini-actions">
            <button className="primary-btn-s" onClick={() => navigate("/crear-sala")}>
              <PlusSquare size={15} style={{ marginRight: 6 }} />
              Ir a crear sala completa
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeMentor;