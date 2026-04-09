import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Code,
  Gamepad2,
  Languages,
  Megaphone,
  Music,
  Palette,
  Search,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import HabilidadCard from "../components/HabilidadCard";
import { createSkill, deleteSkill, fetchSkills } from "../services/skillService";
import "../Styles/Home.css";
import "../Styles/BuscarHabilidades.css";

const iconByCategory = {
  Tecnologia: Code,
  Diseno: Palette,
  Negocios: Megaphone,
  Educacion: Languages,
  Arte: Music,
  Entretenimiento: Gamepad2,
};

const defaultForm = {
  nombre: "",
  descripcion: "",
  categoria: "",
  nivel: "basico",
};

function BuscarHabilidades() {
  const [rol] = useState(localStorage.getItem("userRole") || "alumno");
  const navigate = useNavigate();
  const isMentor = rol === "mentor";

  const [searchTerm, setSearchTerm] = useState("");
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(defaultForm);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const summaryText = useMemo(() => {
    if (isLoading) {
      return "Cargando habilidades disponibles...";
    }

    if (searchTerm.trim()) {
      return `${skills.length} resultado(s) para "${searchTerm.trim()}"`;
    }

    return `${skills.length} habilidad(es) disponibles en la plataforma`;
  }, [isLoading, searchTerm, skills.length]);

  useEffect(() => {
    let ignore = false;

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetchSkills(searchTerm);

        if (!ignore) {
          setSkills(response);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "No se pudieron cargar las habilidades.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSkill = async (event) => {
    event.preventDefault();

    try {
      setIsCreating(true);
      setError("");
      const newSkill = await createSkill(formData);
      setSkills((prev) => [newSkill, ...prev].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setFormData(defaultForm);
    } catch (requestError) {
      setError(requestError.message || "No se pudo crear la habilidad.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSkill = async (skill) => {
    const confirmed = window.confirm(`¿Eliminar la habilidad "${skill.nombre}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(skill.id);
      setError("");
      await deleteSkill(skill.id);
      setSkills((prev) => prev.filter((item) => item.id !== skill.id));
    } catch (requestError) {
      setError(requestError.message || "No se pudo eliminar la habilidad.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />

        <main className="home-content">
          <div className="dashboard-header full-header">
            <div className="search-container-neon search-extended">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Buscar habilidad por nombre, categoria o descripcion..."
                className="search-input-neon"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="header-actions-right">
              <div className="mood-indicator">{summaryText}</div>
              <div className="icon-action bell-icon">
                <Bell size={24} />
                <span className="notification-dot">{skills.length}</span>
              </div>
              <div
                className="icon-action user-icon"
                onClick={() => navigate("/perfil")}
                style={{ cursor: "pointer" }}
              >
                <User size={24} />
              </div>
            </div>
          </div>

          <section className="habilidades-section">
            <div className="skills-heading-row">
              <div>
                <h2 className="welcome-title">Habilidades reales de la plataforma</h2>
                <p className="skills-subtitle">
                  Explora habilidades guardadas en la base de datos y encuentra sesiones o mentores afines.
                </p>
              </div>
              <div className="skills-counter-pill">
                <Sparkles size={18} />
                <span>{skills.length} skills</span>
              </div>
            </div>

            {isMentor && (
              <form className="skills-admin-card neon-card" onSubmit={handleCreateSkill}>
                <div className="skills-admin-header">
                  <div>
                    <h3>Crear nueva skill</h3>
                    <p>Disponible solo para mentores. Agrega habilidades nuevas al catalogo compartido.</p>
                  </div>
                  <div className="skills-admin-badge">
                    <Wrench size={16} />
                    <span>Modo mentor</span>
                  </div>
                </div>

                <div className="skills-admin-grid">
                  <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre de la habilidad"
                    className="skill-admin-input"
                    required
                  />
                  <input
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    placeholder="Categoria"
                    className="skill-admin-input"
                    required
                  />
                  <select
                    name="nivel"
                    value={formData.nivel}
                    onChange={handleInputChange}
                    className="skill-admin-input"
                  >
                    <option value="basico">Basico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripcion breve de la habilidad"
                    className="skill-admin-input skill-admin-textarea"
                    required
                  />
                </div>

                <div className="skills-admin-actions">
                  <button type="submit" className="primary-btn-s" disabled={isCreating}>
                    {isCreating ? "Guardando..." : "Crear skill"}
                  </button>
                </div>
              </form>
            )}

            {error && (
              <div className="skills-feedback-card error">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="skills-feedback-card">
                Cargando habilidades desde /api/skills...
              </div>
            ) : skills.length === 0 ? (
              <div className="skills-feedback-card">
                No se encontraron habilidades con ese criterio.
              </div>
            ) : (
              <div className="habilidades-grid">
                {skills.map((skill) => {
                  const IconoComponente = iconByCategory[skill.categoria] || BookOpen;

                  return (
                    <HabilidadCard
                      key={skill.id}
                      skill={skill}
                      IconoComponente={IconoComponente}
                      isMentor={isMentor}
                      onDelete={handleDeleteSkill}
                      isDeleting={deletingId === skill.id}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default BuscarHabilidades;
