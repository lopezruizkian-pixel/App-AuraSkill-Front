import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Type, Wrench, Smile, Users, AlignLeft, Loader } from "lucide-react";
import { createRoom } from "../services/roomService";
import { useToast } from "../hooks/useToast";
import { validateForm, validators } from "../services/validation";

function FormCrearSala() {
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();

  const [formData, setFormData] = useState({
    nombre: "",
    habilidad: "",
    mood: "",
    limiteEstudiantes: "",
    descripcion: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error al editando
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const { valid, errors: formErrors } = validateForm(formData, validators.crearSalaForm);

    if (!valid) {
      setErrors(formErrors);
      showError("Por favor, completa todos los campos correctamente");
      return;
    }

    setIsLoading(true);

    try {
      const roomData = {
        nombre: formData.nombre.trim(),
        habilidad: formData.habilidad,
        mood: formData.mood,
        capacidad_maxima: parseInt(formData.limiteEstudiantes, 10),
        descripcion: formData.descripcion.trim(),
      };

      const newRoom = await createRoom(roomData);
      localStorage.setItem("salaActiva", JSON.stringify({
        id: newRoom.id || newRoom._id,
        titulo: newRoom.nombre,
        habilidad: newRoom.habilidad,
        mood: newRoom.mood,
        inscritos: Array.isArray(newRoom.participantes) ? newRoom.participantes.length : 0,
        capacidad: newRoom.capacidad_maxima || roomData.capacidad_maxima,
      }));

      showSuccess("¡Sala creada con éxito!");
      
      // Redirigir a la sala creada
      setTimeout(() => {
        navigate(`/sala/${newRoom.id || newRoom._id}`);
      }, 500);

    } catch (err) {
      const errorMessage = err.message || "Error al crear la sala";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const habilidades = [
    { value: "programacion", label: "💻 Programación" },
    { value: "diseno", label: "🎨 Diseño UI/UX" },
    { value: "idiomas", label: "🌍 Idiomas" },
    { value: "matematicas", label: "📐 Matemáticas" },
    { value: "musica", label: "🎵 Música" },
    { value: "otros", label: "✨ Otros" },
  ];

  const moods = [
    { value: "concentrado", label: "🎯 Concentrado", emoji: "🎯" },
    { value: "creativo", label: "🎨 Creativo", emoji: "🎨" },
    { value: "energetico", label: "⚡ Energético", emoji: "⚡" },
    { value: "relajado", label: "☕ Relajado", emoji: "☕" },
  ];

  return (
    <div className="neon-card form-crear-sala-container">
      <form onSubmit={handleSubmit} className="formulario-sala">
        
        <div className="input-group-neon full-width">
          <label>Nombre de la sala</label>
          <div className="input-wrapper">
            <Type className="input-icon" size={18} />
            <input 
              type="text" 
              name="nombre"
              placeholder="Ej. Lógica de Programación en React"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.nombre ? "input-error" : ""}
            />
          </div>
          {errors.nombre && <span className="error-text">{errors.nombre}</span>}
        </div>

        <div className="form-row">
          <div className="input-group-neon">
            <label>Habilidad a enseñar</label>
            <div className="input-wrapper">
              <Wrench className="input-icon" size={18} />
              <select 
                name="habilidad"
                value={formData.habilidad}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.habilidad ? "input-error" : ""}
              >
                <option value="" disabled>Selecciona una habilidad</option>
                {habilidades.map((hab) => (
                  <option key={hab.value} value={hab.value}>
                    {hab.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.habilidad && <span className="error-text">{errors.habilidad}</span>}
          </div>

          <div className="input-group-neon">
            <label>Mood de la sesión</label>
            <div className="input-wrapper">
              <Smile className="input-icon" size={18} />
              <select 
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.mood ? "input-error" : ""}
              >
                <option value="" disabled>Selecciona el ambiente</option>
                {moods.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.mood && <span className="error-text">{errors.mood}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="input-group-neon">
            <label>Límite de estudiantes</label>
            <div className="input-wrapper">
              <Users className="input-icon" size={18} />
              <input 
                type="number" 
                name="limiteEstudiantes"
                min="1" 
                max="50" 
                placeholder="Ej. 10"
                value={formData.limiteEstudiantes}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.limiteEstudiantes ? "input-error" : ""}
              />
            </div>
            {errors.limiteEstudiantes && <span className="error-text">{errors.limiteEstudiantes}</span>}
          </div>
        </div>

        <div className="input-group-neon full-width">
          <label>Descripción rápida (Opcional)</label>
          <div className="input-wrapper textarea-wrapper">
            <AlignLeft className="input-icon" size={18} />
            <textarea 
              name="descripcion"
              placeholder="¿De qué tratará esta sesión?"
              rows="3"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={isLoading}
              maxLength={500}
              className={errors.descripcion ? "input-error" : ""}
            />
          </div>
          <small className="char-count">
            {formData.descripcion.length}/500
          </small>
          {errors.descripcion && <span className="error-text">{errors.descripcion}</span>}
        </div>

        <div className="form-action-right">
          <button 
            type="submit" 
            className="primary-btn-s btn-crear-sala"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size={16} className="spinner" />
                Creando sala...
              </>
            ) : (
              "Crear sala"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormCrearSala;
