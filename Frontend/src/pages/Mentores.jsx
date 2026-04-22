import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MentorCard from "../components/MentorCard";
import Notificaciones from "../components/Notificaciones";
import GlobalHeader from "../components/GlobalHeader";
import { Search, User, Users, RefreshCw } from "lucide-react";
import { fetchActiveRooms, joinRoom, fetchRoom } from "../services/roomService";
import { getDashboardSocket } from "../services/socketConfig";
import "../Styles/Mentores.css";

function Mentores() {
  const [rol] = useState(localStorage.getItem("userRole") || "alumno");
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroHabilidad, setFiltroHabilidad] = useState("");
  const [joining, setJoining] = useState(null);

  const load = async () => {
    try {
      const data = await fetchActiveRooms();
      setRooms(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error cargando mentores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    
    const socket = getDashboardSocket();
    
    const handleUpdate = () => {
      console.log('Salas actualizadas, recargando...');
      load();
    };
    
    socket.on('roomsUpdated', handleUpdate);

    return () => {
      socket.off('roomsUpdated', handleUpdate);
    };
  }, []);
  useEffect(() => {
    let result = rooms;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.mentor_nombre?.toLowerCase().includes(q) ||
        r.habilidad?.toLowerCase().includes(q)
      );
    }
    if (filtroHabilidad) result = result.filter((r) => r.habilidad === filtroHabilidad);
    setFiltered(result);
  }, [search, filtroHabilidad, rooms]);

  const habilidades = [...new Set(rooms.map((r) => r.habilidad).filter(Boolean))];

  const handleJoin = async (room) => {
    console.log(`[DEBUG] Mentores.jsx - handleJoin iniciado para sala ID:`, room.id);
    setJoining(room.id);
    try {
      console.log(`[DEBUG] Obteniendo detalles de la sala...`);
      const roomDetails = await fetchRoom(room.id);
      console.log(`[DEBUG] Detalles obtenidos:`, roomDetails);

      if (!roomDetails.sessionInfo?.isActive) {
        console.log(`[DEBUG] Bloqueado: sessionInfo.isActive es falso o indefinido.`);
        alert("El mentor aún no ha ingresado a esta sala.");
        setJoining(null);
        return;
      }

      console.log(`[DEBUG] sessionInfo.isActive es TRUE. Intentando unirse (joinRoom)...`);
      try { 
        await joinRoom(room.id); 
        console.log(`[DEBUG] joinRoom exitoso para sala ID:`, room.id);
      } catch (err) {
        console.log(`[DEBUG] Error atrapado en joinRoom:`, err.message);
        if (!err.message?.includes("Ya estás en esta sala")) {
          console.error(`[DEBUG] Error crítico en joinRoom:`, err);
          throw err;
        } else {
          console.log(`[DEBUG] El usuario ya estaba en la sala, continuando a navegación.`);
        }
      }

      console.log(`[DEBUG] Guardando historial y navegando a /sala/${room.id}`);
      const infoSala = { id: room.id, nombre: room.nombre, habilidad: room.habilidad, mood: room.mood, mentor: room.mentor_nombre || "Sin mentor" };
      const visitadas = JSON.parse(localStorage.getItem("historialSalas")) || [];
      if (!visitadas.some((s) => s.id === room.id)) {
        localStorage.setItem("historialSalas", JSON.stringify([infoSala, ...visitadas]));
      }

      navigate(`/sala/${room.id}`);
    } catch (err) {
      console.error("[DEBUG] Error general en handleJoin:", err);
      alert("Error al intentar unirte a la sala: " + (err.message || "Error desconocido"));
    } finally {
      console.log(`[DEBUG] handleJoin finalizado. Restableciendo estado joining.`);
      setJoining(null);
    }
  };

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        <main className="home-content">
          <GlobalHeader />

          <div className="search-container-neon search-extended">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Buscar mentor o habilidad..." className="search-input-neon"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <section className="mentores-section">
            {/* Título redundante eliminado */}
            <div className="filtros-container">
              <select className="filtro-neon" value={filtroHabilidad} onChange={(e) => setFiltroHabilidad(e.target.value)}>
                <option value="">Habilidad</option>
                {habilidades.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            {loading ? (
              <div className="loading-global-container">
                <div className="aura-spinner"></div>
                <span className="loading-text-neon">Buscando mentores</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state-centered">
                <Users size={100} className="empty-icon" style={{ marginBottom: "2rem", opacity: 0.15 }} />
                <h3 style={{ color: "#fff", fontSize: "2rem", marginBottom: "0.8rem", fontWeight: "700" }}>No hay mentores activos</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.2rem", maxWidth: "450px", margin: "0 auto" }}>En este momento no hay mentores enseñando esta habilidad. ¡Sé el primero en crear una sala!</p>
              </div>
            ) : (
              <div className="mentores-grid">
                {filtered.map((room) => (
                  <MentorCard key={room.id} id={room.id} nombre={room.mentor_nombre || "Mentor"}
                    habilidad={room.habilidad} nombreSala={room.nombre}
                    isActive={room.sessionInfo?.isActive}
                    onJoin={() => handleJoin(room)} isJoining={joining === room.id} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Mentores;
