import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { fetchActiveRooms, joinRoom } from "../services/roomService";

function HomeAprendiz() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [joining, setJoining] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(rooms);
    } else {
      const q = search.toLowerCase();
      setFiltered(rooms.filter((r) =>
        r.nombre?.toLowerCase().includes(q) ||
        r.habilidad?.toLowerCase().includes(q) ||
        r.mentor_nombre?.toLowerCase().includes(q)
      ));
    }
  }, [search, rooms]);

  const loadRooms = async () => {
    try {
      const data = await fetchActiveRooms();
      setRooms(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error cargando salas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (room) => {
    setJoining(room.id);
    try {
      // Intentar unirse, si ya está en la sala simplemente entrar
      try {
        await joinRoom(room.id);
      } catch (err) {
        // Si el error es que ya está en la sala, ignorarlo y entrar
        if (!err.message?.includes("Ya estás en esta sala")) {
          throw err;
        }
      }

      localStorage.setItem("salaActiva", JSON.stringify({
        id: room.id,
        titulo: room.nombre,
        habilidad: room.habilidad,
        mood: room.mood,
        inscritos: 0,
        capacidad: room.capacidad_maxima || 10,
      }));
      navigate(`/sala/${room.id}`);
    } catch (err) {
      alert(err.message || "Error al unirse a la sala");
    } finally {
      setJoining(null);
    }
  };

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <div className="search-container-neon">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search skill or mentor..."
            className="search-input-neon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mood-indicator">Mood: Concentrado</div>
      </div>

      <h2 className="welcome-title">Available Mentors</h2>

      {loading ? (
        <p>Loading rooms...</p>
      ) : filtered.length === 0 ? (
        <p>No rooms available right now.</p>
      ) : (
        filtered.map((room) => (
          <div key={room.id} className="neon-card mentor-list-card">
            <div className="mentor-item">
              <div className="mentor-info">
                <p><strong>Room:</strong> {room.nombre}</p>
                <p><strong>Mentor:</strong> {room.mentor_nombre || "No mentor"}</p>
                <p><strong>Skill:</strong> {room.habilidad}</p>
                <p><strong>Mood:</strong> {room.mood || "—"}</p>
              </div>
              <button
                className="primary-btn-s"
                onClick={() => handleJoin(room)}
                disabled={joining === room.id}
              >
                {joining === room.id ? "Joining..." : "Enter Room"}
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default HomeAprendiz;
