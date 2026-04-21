import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MentorCard from "../components/MentorCard";
import Notificaciones from "../components/Notificaciones";
import { Search, User } from "lucide-react";
import { fetchActiveRooms, joinRoom } from "../services/roomService";
import "../Styles/Mentores.css";

function Mentores() {
  const [rol] = useState(localStorage.getItem("userRole") || "alumno");
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroHabilidad, setFiltroHabilidad] = useState("");
  const [filtroMood, setFiltroMood] = useState("");
  const [joining, setJoining] = useState(null);

  useEffect(() => {
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
    load();
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
    if (filtroMood) result = result.filter((r) => r.mood === filtroMood);
    setFiltered(result);
  }, [search, filtroHabilidad, filtroMood, rooms]);

  const habilidades = [...new Set(rooms.map((r) => r.habilidad).filter(Boolean))];
  const moods = [...new Set(rooms.map((r) => r.mood).filter(Boolean))];

  const handleJoin = async (room) => {
    if (!room.sessionInfo?.isActive) {
      alert("El mentor aún no ha ingresado a esta sala.");
      return;
    }
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
              <div className="mood-indicator">Mood: Concentrado</div>
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
              <select className="filtro-neon" value={filtroMood} onChange={(e) => setFiltroMood(e.target.value)}>
                <option value="">Mood</option>
                {moods.map((m) => <option key={m} value={m}>{m}</option>)}
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
                    habilidad={room.habilidad} mood={room.mood} nombreSala={room.nombre}
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
