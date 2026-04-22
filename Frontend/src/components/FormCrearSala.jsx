import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Type, Wrench, Users, AlignLeft, Loader } from "lucide-react";
import { createRoom } from "../services/roomService";
import { useToast } from "../hooks/useToast";
import { validateForm, validators } from "../services/validation";
import { fetchMySkills, createSkill } from "../services/skillService";

function FormCrearSala() {
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();

  const [formData, setFormData] = useState({
    nombre: "",
    habilidad: "",
    limiteEstudiantes: "",
    descripcion: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [misHabilidades, setMisHabilidades] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [newSkillData, setNewSkillData] = useState({ nombre: "", categoria: "Programacion", nivel: "basico", descripcion: "Creada desde formulario de sala" });
  const [creatingSkill, setCreatingSkill] = useState(false);

  const loadSkills = async () => {
    try {
      const data = await fetchMySkills();
      setMisHabilidades(data);
    } catch (err) {
      console.error("Error al cargar habilidades", err);
    } finally {
      setLoadingSkills(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

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
        capacidad_maxima: parseInt(formData.limiteEstudiantes, 10),
        descripcion: formData.descripcion.trim(),
      };

      const newRoom = await createRoom(roomData);
      localStorage.setItem("salaActiva", JSON.stringify({
        id: newRoom.id || newRoom._id,
        titulo: newRoom.nombre,
        habilidad: newRoom.habilidad,
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

  const handleCreateSkillInline = async (e) => {
    e.preventDefault();
    if (!newSkillData.nombre.trim()) {
      showError("El nombre de la habilidad es requerido");
      return;
    }
    setCreatingSkill(true);
    try {
      const newSkill = await createSkill(newSkillData);
      showSuccess("Habilidad creada y añadida a tu lista");
      setShowSkillForm(false);
      setNewSkillData({ nombre: "", categoria: "Programacion", nivel: "basico", descripcion: "Creada desde formulario de sala" });
      await loadSkills(); // Recargar la lista
      // Seleccionar la nueva habilidad automáticamente
      setFormData(prev => ({ ...prev, habilidad: newSkill.nombre }));
    } catch (err) {
      showError(err.message || "Error al crear la habilidad");
    } finally {
      setCreatingSkill(false);
    }
  };

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
                disabled={isLoading || loadingSkills || misHabilidades.length === 0}
                className={errors.habilidad ? "input-error" : ""}
              >
                <option value="" disabled>Selecciona una habilidad</option>
                {misHabilidades.map((hab) => (
                  <option key={hab.id} value={hab.nombre}>
                    {hab.nombre} ({hab.categoria})
                  </option>
                ))}
              </select>
            </div>
            {errors.habilidad && <span className="error-text">{errors.habilidad}</span>}
            {!loadingSkills && misHabilidades.length === 0 && !showSkillForm && (
              <small style={{ color: "#ffaa00", display: "block", marginTop: "5px" }}>
                No tienes habilidades registradas. Crea una a continuación.
              </small>
            )}
            
            <div style={{ marginTop: "10px" }}>
              <button 
                type="button" 
                onClick={() => setShowSkillForm(!showSkillForm)}
                className="secondary-btn-s"
                style={{ fontSize: "0.85rem", padding: "5px 10px" }}
              >
                {showSkillForm ? "Cancelar creación de habilidad" : "+ Agregar nueva habilidad"}
              </button>
            </div>

            {showSkillForm && (
              <div className="neon-card" style={{ padding: "15px", marginTop: "15px", border: "1px solid #00ffff" }}>
                <h4 style={{ color: "#00ffff", margin: "0 0 10px 0" }}>Nueva Habilidad</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input 
                    type="text" 
                    placeholder="Nombre (ej: React Avanzado)" 
                    className="neon-input-s"
                    value={newSkillData.nombre}
                    onChange={(e) => setNewSkillData({...newSkillData, nombre: e.target.value})}
                  />
                  <select 
                    className="neon-input-s neon-select-s"
                    value={newSkillData.categoria}
                    onChange={(e) => setNewSkillData({...newSkillData, categoria: e.target.value})}
                  >
                    <option value="Programacion">Programación</option>
                    <option value="Diseno">Diseño</option>
                    <option value="Idiomas">Idiomas</option>
                    <option value="Musica">Música</option>
                    <option value="Matematicas">Matemáticas</option>
                    <option value="Otros">Otros</option>
                  </select>
                  <button 
                    type="button" 
                    className="primary-btn-s" 
                    onClick={handleCreateSkillInline}
                    disabled={creatingSkill}
                  >
                    {creatingSkill ? "Guardando..." : "Guardar habilidad"}
                  </button>
                </div>
              </div>
            )}
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