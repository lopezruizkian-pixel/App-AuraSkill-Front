import React, { useState } from "react";
import { Type, Wrench, Smile, Users, AlignLeft } from "lucide-react";

function FormCrearSala() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Sala creada con éxito!");
  };
  const [habilidad, setHabilidad] = useState("");
  const [mood, setMood] = useState("");

  const handleHabilidadChange = (e) => {
    setHabilidad(e.target.value);
  };

  const handleMoodChange = (e) => {
    setMood(e.target.value);
  };

  return (
    <div className="neon-card form-crear-sala-container">
      <form onSubmit={handleSubmit} className="formulario-sala">
        
        <div className="input-group-neon full-width">
          <label htmlFor="nombreSala">Nombre de la sala</label>
          <div className="input-wrapper">


            <Type className="input-icon" size={18} />
            <input type="text" placeholder="Ej. Lógica de Programación en React" required />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group-neon">
            <label htmlFor="habilidad">Habilidad a enseñar</label>
            <div className="input-wrapper">
              <Wrench className="input-icon" size={18} />
              <select id="habilidad" value={habilidad} onChange={handleHabilidadChange} required>
                <option value="" disabled selected>Selecciona una habilidad</option>
                <option value="programacion">Programación</option>
                <option value="diseno">Diseño UI/UX</option>
                <option value="idiomas">Idiomas</option>
                <option value="matematicas">Matemáticas</option>
              </select>
          </div>

            <label>Mood de la sesión</label>
            <div className="input-wrapper">
              <Smile className="input-icon" size={18} />
              <select required>
                <option value="" disabled selected>Selecciona el ambiente</option>
                <option value="concentrado">🎯 Concentrado</option>
                <option value="creativo">🎨 Creativo</option>
                <option value="energetico">⚡ Energético</option>
                <option value="relajado">☕ Relajado</option>
              </select>
            </div>

          </div>
        </div>

        <div className="form-row">
          <div className="input-group-neon">
            <label htmlFor="limiteEstudiantes">Límite de estudiantes</label>
            <div className="input-wrapper">
              <Users className="input-icon" size={18} />
              <input type="number" min="1" max="50" placeholder="Ej. 10" required />
            </div>
          </div>
        </div>

        <div className="input-group-neon full-width">
          <label>Descripción rápida (Opcional)</label>
          <div className="input-wrapper textarea-wrapper">
            <AlignLeft className="input-icon" size={18} />
            <textarea placeholder="¿De qué tratará esta sesión?" rows="3"></textarea>
          </div>
        </div>

        <div className="form-action-right">
          <button type="submit" className="primary-btn-s btn-crear-sala">
            Crear sala
          </button>
        </div>
      </form>
    </div>
  );
}


export default FormCrearSala;