import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HistorialRow from "../components/HistorialRow";
import { Search, Bell, User } from "lucide-react";
import { getUserRoomHistory } from "../services/roomService";
import "../Styles/Home.css";
import "../Styles/BuscarHabilidades.css";
import "../Styles/HistorialSalasAprendiz.css";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDuration = (seconds = 0) => {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
};

function HistorialSalasAprendiz() {
  const [rol] = useState(localStorage.getItem("userRole") || "alumno");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        // Combina historial del backend con el guardado localmente
        let backendHistory = [];
        try {
          backendHistory = await getUserRoomHistory();
        } catch {
          backendHistory = [];
        }

        const localRaw = localStorage.getItem("historialSalas");
        const localHistory = localRaw ? JSON.parse(localRaw) : [];

        // Unifica por id, priorizando backend
        const backendIds = new Set(backendHistory.map((s) => s.id));
        const merged = [
          ...backendHistory,
          ...localHistory.filter((s) => !backendIds.has(s.id)),
        ];

        // Ordena por fecha desc
        merged.sort((a, b) => new Date(b.startedAt || b.fecha || 0) - new Date(a.startedAt || a.fecha || 0));

        setHistory(merged);
      } catch {
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  const historialData = useMemo(() => {
    if (isLoading) {
      return [{ id: "loading-row", fecha: "Cargando...", habilidad: "", mood: "", mentor: "", duracion: "" }];
    }
    if (history.length === 0) {
      return [{ id: "empty-row", fecha: "Sin sesiones registradas", habilidad: "", mood: "", mentor: "", duracion: "" }];
    }
    return history.map((item) => ({
      id: item.id,
      // PostgreSQL devuelve snake_case
      fecha: formatDate(item.started_at || item.startedAt || item.fecha),
      habilidad: item.habilidad || item.room_name || item.nombreSala || "—",
      mood: item.mood || "—",
      mentor: item.mentor_name || item.mentor || "—",
      duracion: formatDuration(item.duration_seconds ?? item.duracionSegundos ?? item.duracion ?? 0),
    }));
  }, [history, isLoading]);

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        <main className="home-content">
          <div className="dashboard-header full-header">
            <div className="search-container-neon search-extended">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Buscar habilidad..." className="search-input-neon" />
            </div>
            <div className="header-actions-right">
              <div className="mood-indicator">Mood: Concentrado</div>
              <div className="icon-action bell-icon">
                <Bell size={24} /><span className="notification-dot">1</span>
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

          <section className="historial-section">
            <h2 className="welcome-title">Historial de Sesiones</h2>
            <div className="historial-table-header">
              <div className="header-item-neon">Fecha</div>
              <div className="header-item-neon">Habilidad</div>
              <div className="header-item-neon">Mood</div>
              <div className="header-item-neon">Mentor</div>
              <div className="header-item-neon">Duración</div>
            </div>
            <div className="historial-list">
              {historialData.map((item) => (
                <HistorialRow key={item.id} {...item} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default HistorialSalasAprendiz;