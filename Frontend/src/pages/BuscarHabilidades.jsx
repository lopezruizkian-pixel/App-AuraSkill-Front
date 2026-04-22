import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Code, Gamepad2, Languages, Megaphone, Music, Palette, Search, PlusCircle, Wrench } from "lucide-react";
import Sidebar from "../components/Sidebar";
import HabilidadCard from "../components/HabilidadCard";
import GlobalHeader from "../components/GlobalHeader";
import { createSkill, deleteSkill, fetchSkills } from "../services/skillService";
import "../Styles/Home.css";
import "../Styles/BuscarHabilidades.css";
import "../Styles/CrearSala.css";

const iconByCategory = {
  Tecnologia: Code, Diseno: Palette, Negocios: Megaphone,
  Educacion: Languages, Arte: Music, Entretenimiento: Gamepad2,
};

const defaultForm = { nombre: "", descripcion: "", categoria: "", nivel: "basico" };

function BuscarHabilidades() {
  const [rol] = useState(localStorage.getItem("userRole") || "alumno");
  const isMentor = rol === "mentor";
  const [searchTerm, setSearchTerm] = useState("");
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(defaultForm);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const summaryText = useMemo(() => {
    if (isLoading) return "Cargando habilidades disponibles...";
    if (searchTerm.trim()) return `${skills.length} resultado(s) para "${searchTerm.trim()}"`;
    return `${skills.length} habilidad(es) disponibles en la plataforma`;
  }, [isLoading, searchTerm, skills.length]);

  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true); setError("");
        const response = await fetchSkills(searchTerm);
        if (!ignore) setSkills(response);
      } catch (requestError) {
        if (!ignore) setError(requestError.message || "No se pudieron cargar las habilidades.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }, 250);
    return () => { ignore = true; clearTimeout(timer); };
  }, [searchTerm]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSkill = async (event) => {
    event.preventDefault();
    try {
      setIsCreating(true); setError("");
      const newSkill = await createSkill(formData);
      setSkills((prev) => [newSkill, ...prev].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setFormData(defaultForm);
      setShowCreateModal(false);
    } catch (requestError) {
      setError(requestError.message || "No se pudo crear la habilidad.");
    } finally { setIsCreating(false); }
  };

  const handleDeleteSkill = async (skill) => {
    if (!window.confirm(`¿Eliminar la habilidad "${skill.nombre}"?`)) return;
    try {
      setDeletingId(skill.id); setError("");
      await deleteSkill(skill.id);
      setSkills((prev) => prev.filter((item) => item.id !== skill.id));
    } catch (requestError) {
      setError(requestError.message || "No se pudo eliminar la habilidad.");
    } finally { setDeletingId(""); }
  };

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        <main className="home-content">
          <GlobalHeader />

          <div className="dashboard-header full-header">
            <div className="search-container-neon search-extended">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Buscar habilidad por nombre, categoria o descripcion..."
                className="search-input-neon" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            </div>
            <div className="dashboard-actions-right">
              <div className="mood-indicator">{summaryText}</div>
              {isMentor && (
                <button
                  type="button"
                  className="primary-btn-s"
                  onClick={() => setShowCreateModal(true)}
                >
                  <PlusCircle size={18} /> Nueva skill
                </button>
              )}
            </div>
          </div>

          <section className="habilidades-section">
            {error && <div className="skills-feedback-card error">{error}</div>}

            {isLoading ? (
              <div className="skills-feedback-card">Cargando habilidades desde /api/skills...</div>
            ) : skills.length === 0 ? (
              <div className="skills-feedback-card">No se encontraron habilidades con ese criterio.</div>
            ) : (
              <div className="habilidades-grid">
                {skills.map((skill) => {
                  const IconoComponente = iconByCategory[skill.categoria] || BookOpen;
                  return (
                    <HabilidadCard key={skill.id} skill={skill} IconoComponente={IconoComponente}
                      isMentor={isMentor} onDelete={handleDeleteSkill} isDeleting={deletingId === skill.id} />
                  );
                })}
              </div>
            )}
          </section>

          {showCreateModal && typeof document !== "undefined" && createPortal(
            <div className="skill-modal-overlay">
              <div className="skill-modal-content">
                <h3 className="skill-modal-title">Nueva habilidad</h3>
                <p className="skill-modal-subtitle">Crea una skill y agregala al catalogo compartido.</p>
                <form className="formulario-sala" onSubmit={handleCreateSkill}>
                  <div className="input-group-neon">
                    <div className="input-label-row">
                      <label htmlFor="skill-name-modal">Nombre de la habilidad</label>
                    </div>
                    <div className="input-wrapper">
                      <Wrench className="input-icon" size={18} />
                      <input
                        id="skill-name-modal"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ej. React Avanzado"
                        required
                        className="skill-admin-input modal-skill-input"
                      />
                    </div>
                  </div>

                  <div className="skills-admin-grid skills-admin-grid-modal">
                    <div className="input-group-neon">
                      <div className="input-label-row">
                        <label htmlFor="skill-category-modal">Categoria</label>
                      </div>
                      <div className="input-wrapper">
                        <Wrench className="input-icon" size={18} />
                        <input
                          id="skill-category-modal"
                          name="categoria"
                          value={formData.categoria}
                          onChange={handleInputChange}
                          placeholder="Ej. Tecnologia"
                          required
                          className="skill-admin-input modal-skill-input"
                        />
                      </div>
                    </div>

                    <div className="input-group-neon">
                      <div className="input-label-row">
                        <label htmlFor="skill-level-modal">Nivel</label>
                      </div>
                      <div className="input-wrapper">
                        <select
                          id="skill-level-modal"
                          name="nivel"
                          value={formData.nivel}
                          onChange={handleInputChange}
                          className="skill-admin-input modal-skill-input"
                        >
                          <option value="basico">Basico</option>
                          <option value="intermedio">Intermedio</option>
                          <option value="avanzado">Avanzado</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group-neon skills-modal-description">
                      <div className="input-label-row">
                        <label htmlFor="skill-description-modal">Descripcion breve</label>
                      </div>
                      <div className="input-wrapper is-textarea">
                        <textarea
                          id="skill-description-modal"
                          name="descripcion"
                          value={formData.descripcion}
                          onChange={handleInputChange}
                          placeholder="Describe en una o dos lineas esta habilidad."
                          required
                          className="skill-admin-input modal-skill-input skill-admin-textarea"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="skill-modal-actions">
                    <button
                      type="button"
                      className="skill-modal-btn skill-btn-cancel"
                      onClick={() => setShowCreateModal(false)}
                      disabled={isCreating}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="skill-modal-btn skill-btn-save"
                      disabled={isCreating}
                    >
                      {isCreating ? "Guardando..." : "Crear habilidad"}
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body
          )}
        </main>
      </div>
    </div>
  );
}

export default BuscarHabilidades;
