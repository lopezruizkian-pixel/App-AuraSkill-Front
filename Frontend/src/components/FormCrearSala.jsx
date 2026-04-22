import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Type,
  Wrench,
  Smile,
  Users,
  AlignLeft,
  Plus,
  Loader,
} from 'lucide-react';
import { createRoom } from '../services/roomService';
import { fetchMySkills, createSkill } from '../services/skillService';
import { useToast } from '../hooks/useToast';
import { validateForm, validators } from '../services/validation';
import '../Styles/CrearSala.css';

function FormCrearSala({ onCancel }) {
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    habilidad: '',
    mood: '',
    limiteEstudiantes: '',
    descripcion: '',
  });

  const [mySkills, setMySkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkillData, setNewSkillData] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'Tecnologia',
    nivel: 'basico',
  });
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const skills = await fetchMySkills();
      setMySkills(skills);
    } catch (err) {
      console.error('Error al cargar mis habilidades:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNewSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkillData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewSkill = async (e) => {
    e.preventDefault();
    if (!newSkillData.nombre || !newSkillData.descripcion) {
      showError('Por favor completa los campos de la nueva habilidad');
      return;
    }

    setIsCreatingSkill(true);
    try {
      const created = await createSkill(newSkillData);
      showSuccess('Habilidad creada con exito');
      setMySkills((prev) => [...prev, created]);
      setFormData((prev) => ({ ...prev, habilidad: created.id || created._id }));
      setIsModalOpen(false);
      setNewSkillData({ nombre: '', descripcion: '', categoria: 'Tecnologia', nivel: 'basico' });
    } catch (err) {
      showError('No se pudo crear la habilidad');
    } finally {
      setIsCreatingSkill(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, errors: formErrors } = validateForm(formData, validators.crearSalaForm);

    if (!valid) {
      setErrors(formErrors);
      showError('Por favor, completa todos los campos correctamente');
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

      await createRoom(roomData);
      showSuccess('Sala creada con exito');
      navigate('/salas-activas');
    } catch (err) {
      showError(err.message || 'Error al crear la sala');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='form-crear-sala-container neon-card'>
      <div className='crear-sala-shell'>
        <section className='crear-sala-form-card'>
          <form className='formulario-sala' onSubmit={handleSubmit}>
            <div className='input-group-neon'>
              <div className='input-label-row'>
                <label htmlFor='room-name'>Nombre de la sala</label>
              </div>
              <div className='input-wrapper'>
                <Type className='input-icon' size={18} />
                <input
                  id='room-name'
                  type='text'
                  name='nombre'
                  placeholder='Ej. Logica de Programacion para principiantes'
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.nombre ? 'input-error' : ''}
                />
              </div>
              {errors.nombre && <span className='error-text'>{errors.nombre}</span>}
            </div>

            <div className='form-row-flex'>
              <div className='input-group-neon'>
                <div className='input-label-row'>
                  <label htmlFor='room-skill'>Habilidad a ensenar</label>
                </div>
                <div className='skill-selector-row'>
                  <div className='input-wrapper'>
                    <Wrench className='input-icon' size={18} />
                    <select
                      id='room-skill'
                      name='habilidad'
                      value={formData.habilidad}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={errors.habilidad ? 'input-error' : ''}
                    >
                      <option value='' disabled>Selecciona una habilidad</option>
                      {mySkills.map((hab) => (
                        <option key={hab.id || hab._id} value={hab.id || hab._id}>
                          {hab.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type='button'
                    className='add-skill-btn'
                    onClick={() => setIsModalOpen(true)}
                    title='Anadir nueva habilidad'
                    disabled={isLoading}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {errors.habilidad && <span className='error-text'>{errors.habilidad}</span>}
              </div>

              <div className='input-group-neon'>
                <div className='input-label-row'>
                  <label htmlFor='room-limit'>Estudiantes</label>
                </div>
                <div className='input-wrapper'>
                  <Users className='input-icon' size={18} />
                  <input
                    id='room-limit'
                    type='number'
                    name='limiteEstudiantes'
                    placeholder='Max. 10'
                    min='1'
                    max='50'
                    value={formData.limiteEstudiantes}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.limiteEstudiantes ? 'input-error' : ''}
                  />
                </div>
                {errors.limiteEstudiantes && <span className='error-text'>{errors.limiteEstudiantes}</span>}
              </div>
            </div>

            <div className='input-group-neon'>
              <div className='input-label-row'>
                <label htmlFor='room-mood'>Mood de la sesion</label>
                <span className='field-optional'>Opcional</span>
              </div>
              <div className='input-wrapper'>
                <Smile className='input-icon' size={18} />
                <select
                  id='room-mood'
                  name='mood'
                  value={formData.mood}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.mood ? 'input-error' : ''}
                >
                  <option value=''>Selecciona el ambiente</option>
                  <option value='Concentrado'>Concentrado 🧠</option>
                  <option value='Relajado'>Relajado ☕</option>
                  <option value='Energetico'>Energetico 🔥</option>
                  <option value='Creativo'>Creativo 🎨</option>
                  <option value='Chill'>Chill 🌊</option>
                </select>
              </div>
              {errors.mood && <span className='error-text'>{errors.mood}</span>}
            </div>

            <div className='input-group-neon'>
              <div className='input-label-row'>
                <label htmlFor='room-description'>Descripcion breve</label>
                <span className='field-optional'>Opcional</span>
              </div>
              <div className='input-wrapper is-textarea'>
                <AlignLeft className='input-icon' size={18} />
                <textarea
                  id='room-description'
                  name='descripcion'
                  placeholder='Cuenta en una o dos lineas que aprenderan, que nivel esperas y como llevaras la sesion.'
                  value={formData.descripcion}
                  onChange={handleChange}
                  disabled={isLoading}
                  maxLength={500}
                />
              </div>
              <div className='description-meta'>
                <span className='character-counter'>{formData.descripcion.length}/500</span>
              </div>
            </div>

            <div className='crear-sala-actions'>
              {onCancel && (
                <button type='button' className='secondary-btn-s' onClick={onCancel} disabled={isLoading}>
                  Cancelar
                </button>
              )}
              <button type='submit' className='primary-btn-s submit-btn-wide' disabled={isLoading}>
                {isLoading ? (
                  <div className='submit-btn-content'>
                    <Loader className='aura-spinner-mini' size={20} />
                    <span>Lanzando sala...</span>
                  </div>
                ) : 'Lanzar sala'}
              </button>
            </div>
          </form>
        </section>
      </div>

      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className='skill-modal-overlay'>
          <div className='skill-modal-content'>
            <h3 className='skill-modal-title'>Nueva habilidad</h3>
            <div className='formulario-sala'>
              <div className='input-group-neon'>
                <div className='input-label-row'>
                  <label htmlFor='skill-name'>Nombre de la habilidad</label>
                </div>
                <div className='input-wrapper'>
                  <Type className='input-icon' size={18} />
                  <input
                    id='skill-name'
                    name='nombre'
                    value={newSkillData.nombre}
                    onChange={handleNewSkillChange}
                    placeholder='Ej. React Avanzado'
                    disabled={isCreatingSkill}
                  />
                </div>
              </div>

              <div className='input-group-neon'>
                <div className='input-label-row'>
                  <label htmlFor='skill-category'>Categoria</label>
                </div>
                <div className='input-wrapper'>
                  <Wrench className='input-icon' size={18} />
                  <select
                    id='skill-category'
                    name='categoria'
                    value={newSkillData.categoria}
                    onChange={handleNewSkillChange}
                    disabled={isCreatingSkill}
                  >
                    <option value='Tecnologia'>Tecnologia</option>
                    <option value='Diseno'>Diseno</option>
                    <option value='Negocios'>Negocios</option>
                    <option value='Educacion'>Educacion</option>
                    <option value='Arte'>Arte</option>
                    <option value='Entretenimiento'>Entretenimiento</option>
                  </select>
                </div>
              </div>

              <div className='input-group-neon'>
                <div className='input-label-row'>
                  <label htmlFor='skill-description'>Descripcion breve</label>
                </div>
                <div className='input-wrapper is-textarea'>
                  <AlignLeft className='input-icon' size={18} />
                  <textarea
                    id='skill-description'
                    name='descripcion'
                    value={newSkillData.descripcion}
                    onChange={handleNewSkillChange}
                    placeholder='Define los objetivos de esta habilidad...'
                    disabled={isCreatingSkill}
                  />
                </div>
              </div>

              <div className='skill-modal-actions'>
                <button
                  type='button'
                  className='skill-modal-btn skill-btn-cancel'
                  onClick={() => setIsModalOpen(false)}
                  disabled={isCreatingSkill}
                >
                  Cancelar
                </button>
                <button
                  type='button'
                  className='skill-modal-btn skill-btn-save'
                  onClick={handleSaveNewSkill}
                  disabled={isCreatingSkill}
                >
                  {isCreatingSkill ? 'Guardando...' : 'Crear habilidad'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default FormCrearSala;
