import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { fetchActiveRooms, joinRoom, fetchRoom } from "../services/roomService";
import { getDashboardSocket } from "../services/socketConfig";

function HomeAprendiz() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [joining, setJoining] = useState(null);
  const [salasVisitadas, setSalasVisitadas] = useState([]);

  useEffect(() => {
    loadRooms();
    
    // Conectar a WebSockets para actualizaciones en tiempo real
    const socket = getDashboardSocket();
    
    const handleUpdate = () => {
      console.log('Salas actualizadas, recargando...');
      loadRooms();
    };
    
    socket.on('roomsUpdated', handleUpdate);

    const historialGuardado = JSON.parse(localStorage.getItem("historialSalas")) || [];
    setSalasVisitadas(historialGuardado);

    return () => {
      socket.off('roomsUpdated', handleUpdate);
    };
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
    console.log(`[DEBUG] handleJoin iniciado para sala ID:`, room.id);
    setJoining(room.id);
    try {
      // Verificar estado actual con el backend para evitar bloqueos por estado obsoleto
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
      // Intentar unirse, si ya está en la sala simplemente entrar
      try {
        await joinRoom(room.id);
        console.log(`[DEBUG] joinRoom exitoso para sala ID:`, room.id);
      } catch (err) {
        console.log(`[DEBUG] Error atrapado en joinRoom:`, err.message);
        // Si el error es que ya está en la sala, ignorarlo y entrar
        if (!err.message?.includes("Ya estás en esta sala")) {
          console.error(`[DEBUG] Error crítico en joinRoom:`, err);
          throw err;
        } else {
          console.log(`[DEBUG] El usuario ya estaba en la sala, continuando a navegación.`);
        }
      }
      
      console.log(`[DEBUG] Guardando historial y navegando a /sala/${room.id}`);
      // Guardamos la sala activa en el historial de visitadas
      const infoSala = {
        id: room.id,
        nombre: room.nombre,
        habilidad: room.habilidad,
        mood: room.mood,
        mentor: room.mentor_nombre || "Sin mentor"
      };
      
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
    <section className="dashboard-section">
      <div className="dashboard-header">
        <div className="search-container-neon">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar habilidad o mentor..."
            className="search-input-neon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mood-indicator">Mood: Concentrado</div>
      </div>

      <h2 className="welcome-title">
        {salasVisitadas.length > 0 ? "Mentores que has visitado" : "Aún no has visitado ninguna sala"}
      </h2>

      {loading ? (
        <p>Cargando salas...</p>
      ) : filtered.length === 0 ? (
        <p>No hay salas disponibles en este momento.</p>
      ) : (
        filtered.map((room) => (
          <div key={room.id} className="neon-card mentor-list-card">
            <div className="mentor-item">
              <div className="mentor-info">
                <p><strong>Sala:</strong> {room.nombre}</p>
                <p>
                  <strong>Mentor:</strong> {room.mentor_nombre || "Sin mentor"}
                  <span style={{ 
                    display: 'inline-block', 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: room.sessionInfo?.isActive ? '#00ff00' : '#ff0000',
                    marginLeft: '8px'
                  }} title={room.sessionInfo?.isActive ? "Mentor activo" : "Mentor inactivo"}></span>
                </p>
                <p><strong>Habilidad:</strong> {room.habilidad}</p>
                <p><strong>Mood:</strong> {room.mood || "—"}</p>
              </div>
              <button
                className="primary-btn-s"
                onClick={() => handleJoin(room)}
                disabled={joining === room.id || !room.sessionInfo?.isActive}
                title={!room.sessionInfo?.isActive ? "El mentor no está activo" : ""}
              >
                {joining === room.id ? "Entrando..." : "Entrar a sala"}
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default HomeAprendiz;
