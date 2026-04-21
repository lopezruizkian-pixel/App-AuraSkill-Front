import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

function HabilidadCard({ skill, IconoComponente, isMentor = false, onDelete, isDeleting = false }) {
  const navigate = useNavigate();

  const handleExplorar = () => {
    navigate(`/salas-activas?habilidad=${encodeURIComponent(skill.nombre)}`);
  };

  return (
    <article className="neon-card habilidad-card">
      <div className="habilidad-card-top">
        <div className="habilidad-icon-container">
          <IconoComponente className="habilidad-icon" size={52} strokeWidth={1.5} />
        </div>
        <div className="habilidad-badges">
          <span className="habilidad-badge categoria">{skill.categoria}</span>
          <span className="habilidad-badge nivel">{skill.nivel}</span>
        </div>
      </div>
      <div className="habilidad-content">
        <h3 className="habilidad-titulo">{skill.nombre}</h3>
        <p className="habilidad-descripcion">{skill.descripcion}</p>
      </div>
      <div className="habilidad-actions">
        <button className="primary-btn-s btn-explorar" type="button" onClick={handleExplorar}>
          Explorar
        </button>
        {isMentor && (
          <button
            type="button"
            className="danger-btn-s btn-eliminar-skill"
            onClick={() => onDelete?.(skill)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? "Eliminando..." : "Eliminar"}</span>
          </button>
        )}
      </div>
    </article>
  );
}

export default HabilidadCard;
