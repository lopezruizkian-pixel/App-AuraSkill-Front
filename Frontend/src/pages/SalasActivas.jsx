import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SalaActivaCard from "../components/SalaActivaCard";
import { Bell, User, Circle, VideoOff } from "lucide-react";
import { fetchActiveRooms, joinRoom } from "../services/roomService";
import "../Styles/Home.css";
import "../Styles/BuscarHabilidades.css";
import "../Styles/SalasActivas.css";

function SalasActivas() {
  const [rol] = useState(localStorage.getItem("userRole") || "mentor");
  const navigate = useNavigate();
  const location = useLocation();

  // Ver si viene con filtro de habilidad desde BuscarHabilidades
  const params = new URLSearchParams(location.search);
  const habilidadFiltro = params.get("habilidad");

  const [salaActiva] = useState(
    localStorage.getItem("salaActiva") ? JSON.parse(localStorage.getItem("salaActiva")) : null
  );
  const [salasFiltered, setSalasFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(null);

  useEffect(() => {
    if (habilidadFiltro) {
      loadSalasPorHabilidad();
    }
  }, [habilidadFiltro]);

  const loadSalasPorHabilidad = async () => {
    setLoading(true);
    try {
      const all = await fetchActiveRooms();
      const filtered = all.filter((r) =>
        r.habilidad?.toLowerCase().includes(habilidadFiltro.toLowerCase()) ||
        r.nombre?.toLowerCase().includes(habilidadFiltro.toLowerCase())
      );
      setSalasFiltered(filtered);
    } catch (err) {
      console.error("Error cargando salas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (room) => {
    setJoining(room.id);
    try {
      try { await joinRoom(room.id); } catch (err) {
        if (!err.message?.includes("Ya estás en esta sala")) throw err;
      }
      localStorage.setItem("salaActiva", JSON.stringify({
        id: room.id, titulo: room.nombre, habilidad: room.habilidad,
        mood: room.mood, inscritos: 0, capacidad: room.capacidad_maxima || 10,
      }));
      navigate(`/sala/${room.id}`);
    } catch (err) {
      alert(err.message || "Error al unirse");
    } finally {
      setJoining(null);
    }
  };

  const handleEnterRoom = () => {
    if (salaActiva?.id) navigate(`/sala/${salaActiva.id}`);
  };

  const handleCloseRoom = () => {
    localStorage.removeItem("salaActiva");
    window.location.reload();
  };

  // Vista filtrada por habilidad
  if (habilidadFiltro) {
    return (
      <div className="home-container">
        <div className="home-main-layout">
          <Sidebar rol={rol} />
          <main className="home-content">
            <div className="dashboard-header full-header">
              <div className="estado-mentor-pill">
                <span>Salas de: {habilidadFiltro}</span>
              </div>
              <div className="header-actions-right">
                <div className="icon-action bell-icon"><Bell size={24} /><span className="notification-dot">1</span></div>
                <div className="icon-action user-icon" onClick={() => navigate("/perfil")} style={{ cursor: "pointer" }}><User size={24} /></div>
              </div>
            </div>
            <section className="salas-activas-section">
              <h2 className="welcome-title">Salas disponibles — {habilidadFiltro}</h2>
              {loading ? (
                <p>Cargando salas...</p>
              ) : salasFiltered.length === 0 ? (
                <div className="neon-card empty-sala-state">
                  <VideoOff size={48} className="empty-icon" />
                  <h3>No hay salas activas para esta habilidad</h3>
                </div>
              ) : (
                <div className="single-sala-container">
                  {salasFiltered.map((room) => (
                    <div key={room.id} className="neon-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h3 style={{ color: "#00ffff", margin: 0 }}>{room.nombre}</h3>
                          <p style={{ color: "#aaa", margin: "0.5rem 0 0" }}>
                            <strong>Mentor:</strong> {room.mentor_nombre} &nbsp;|&nbsp;
                            <strong>Habilidad:</strong> {room.habilidad} &nbsp;|&nbsp;
                            <strong>Mood:</strong> {room.mood || "—"}
                          </p>
                        </div>
                        <button
                          className="primary-btn-s"
                          onClick={() => handleJoin(room)}
                          disabled={joining === room.id}
                        >
                          {joining === room.id ? "Entrando..." : "Entrar a sala"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    );
  }

  // Vista normal — sala activa del mentor
  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        <main className="home-content">
          <div className="dashboard-header full-header">
            <div className="estado-mentor-pill">
              <span>Estado: Disponible</span>
              <Circle className="status-dot online" size={12} fill="#00ff00" />
            </div>
            <div className="header-actions-right">
              <div className="icon-action bell-icon"><Bell size={24} /><span className="notification-dot">1</span></div>
              <div className="icon-action user-icon" onClick={() => navigate("/perfil")} style={{ cursor: "pointer" }}><User size={24} /></div>
            </div>
          </div>
          <section className="salas-activas-section">
            <h2 className="welcome-title">Tu sala actual</h2>
            <div className="single-sala-container">
              {salaActiva ? (
                <SalaActivaCard {...salaActiva} onClose={handleCloseRoom} onEnter={handleEnterRoom} />
              ) : (
                <div className="neon-card empty-sala-state">
                  <VideoOff size={48} className="empty-icon" />
                  <h3>No tienes ninguna sala activa</h3>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default SalasActivas;
