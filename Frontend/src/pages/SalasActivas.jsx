import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SalaActivaCard from "../components/SalaActivaCard";
import FormCrearSala from "../components/FormCrearSala";
import GlobalHeader from "../components/GlobalHeader";
import { Bell, User, Circle, VideoOff, PlusCircle, X, RefreshCw } from "lucide-react";
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
  const [showCreateForm, setShowCreateForm] = useState(false);

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
            <GlobalHeader />

            <section className="salas-activas-section">
              {loading ? (
                <div className="loading-global-container" style={{ padding: "2rem" }}>
                  <div className="aura-spinner"></div>
                  <span className="loading-text-neon">Sincronizando</span>
                </div>
              ) : salasFiltered.length === 0 ? (
                <div className="empty-state-centered">
                  <VideoOff size={100} className="empty-icon" style={{ marginBottom: "2rem", opacity: 0.2 }} />
                  <h3 style={{ color: "#fff", fontSize: "2rem", marginBottom: "0.8rem", fontWeight: "700" }}>No hay salas activas</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.2rem" }}>Parece que ningún mentor está enseñando esta habilidad ahora mismo.</p>
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
                            <strong>Habilidad:</strong> {room.habilidad}
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
        <main className="home-content" style={{ display: "flex", flexDirection: "column" }}>
          <GlobalHeader />

          {/* Estado eliminado por redundancia */}
          <section className="salas-activas-section" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "1.5rem" }}>
              {/* Título redundante eliminado */}
              {!salaActiva && !showCreateForm && (
                <button 
                  className="primary-btn-s" 
                  onClick={() => setShowCreateForm(true)}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <PlusCircle size={18} /> Crear nueva sala
                </button>
              )}
            </div>

            <div className="single-sala-container" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: (salaActiva || showCreateForm) ? "flex-start" : "center", alignItems: "center" }}>
              {salaActiva ? (
                <SalaActivaCard {...salaActiva} onClose={handleCloseRoom} onEnter={handleEnterRoom} />
              ) : showCreateForm ? (
                <FormCrearSala onCancel={() => setShowCreateForm(false)} />
              ) : (
                <div className="empty-state-centered">
                  <VideoOff size={100} className="empty-icon" style={{ marginBottom: "2rem", opacity: 0.2 }} />
                  <h3 style={{ color: "#fff", fontSize: "2rem", marginBottom: "0.8rem", fontWeight: "700" }}>No tienes ninguna sala activa</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.2rem", maxWidth: "450px", margin: "0 auto" }}>Crea una sala para empezar a mentorear y compartir tus conocimientos.</p>
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
