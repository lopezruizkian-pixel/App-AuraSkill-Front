import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MentorCard from "../components/MentorCard";
import Notificaciones from "../components/Notificaciones";
import { Search, User } from "lucide-react";
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
          <div className="dashboard-header full-header">
            <div className="search-container-neon search-extended">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Buscar mentor o habilidad..." className="search-input-neon"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="header-actions-right">
              <Notificaciones />
              <div className="icon-action user-icon" onClick={() => navigate("/perfil")} style={{ cursor: "pointer" }}>
                <User size={24} />
              </div>
            </div>
          </div>
          <section className="mentores-section">
            <h2 className="welcome-title">Mentores disponibles</h2>
            <div className="filtros-container">
              <select className="filtro-neon" value={filtroHabilidad} onChange={(e) => setFiltroHabilidad(e.target.value)}>
                <option value="">Habilidad</option>
                {habilidades.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            {loading ? <p>Cargando mentores...</p> : filtered.length === 0 ? (
              <div className="neon-card" style={{ padding: "2rem", textAlign: "center" }}>
                <p>No hay mentores disponibles en este momento.</p>
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
