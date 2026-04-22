import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, User, Smile, Radio, Users, Clock, Award, Video } from "lucide-react";
import PerfilStatCard from "./PerfilStatCard";
import { fetchActiveRooms, joinRoom, fetchRoom, getUserRoomHistory } from "../services/roomService";
import { getDashboardSocket } from "../services/socketConfig";
import GlobalHeader from "../components/GlobalHeader";

function HomeAprendiz() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [joining, setJoining] = useState(null);
  const [salasVisitadas, setSalasVisitadas] = useState([]);
  const [stats, setStats] = useState({ salasAsistidas: 0, horasEstudio: 0, cursos: 0 });

  useEffect(() => {
    loadRooms();

    const socket = getDashboardSocket();

    const handleUpdate = () => {
      console.log("Salas actualizadas, recargando...");
      loadRooms();
    };

    socket.on("roomsUpdated", handleUpdate);

    const historialGuardado = JSON.parse(localStorage.getItem("historialSalas")) || [];
    setSalasVisitadas(historialGuardado);

    return () => {
      socket.off("roomsUpdated", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(rooms);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        rooms.filter(
          (r) =>
            r.nombre?.toLowerCase().includes(q) ||
            r.habilidad?.toLowerCase().includes(q) ||
            r.mentor_nombre?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, rooms]);

  const loadRooms = async () => {
    try {
      const data = await fetchActiveRooms();
      setRooms(data);
      setFiltered(data);

      // Cargar estadísticas desde el historial
      const history = await getUserRoomHistory();
      // Filtrar sesiones donde el usuario fue participante (no mentor)
      const userId = localStorage.getItem("userId");
      const myStudySessions = history.filter(s => s.mentor_id !== userId);

      const totalSeconds = myStudySessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);
      const uniqueSkills = new Set(myStudySessions.map(s => s.habilidad).filter(Boolean));

      setStats({
        salasAsistidas: myStudySessions.length,
        horasEstudio: Math.round(totalSeconds / 3600 * 10) / 10,
        cursos: uniqueSkills.size
      });
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
      console.log(`[DEBUG] Obteniendo detalles de la sala...`);
      const roomDetails = await fetchRoom(room.id);
      console.log(`[DEBUG] Detalles obtenidos:`, roomDetails);

      if (!roomDetails.sessionInfo?.isActive) {
        console.log(`[DEBUG] Bloqueado: sessionInfo.isActive es falso o indefinido.`);
        alert("El mentor aun no ha ingresado a esta sala.");
        setJoining(null);
        return;
      }

      console.log(`[DEBUG] sessionInfo.isActive es TRUE. Intentando unirse (joinRoom)...`);
      try {
        await joinRoom(room.id);
        console.log(`[DEBUG] joinRoom exitoso para sala ID:`, room.id);
      } catch (err) {
        console.log(`[DEBUG] Error atrapado en joinRoom:`, err.message);
        if (!err.message?.includes("Ya estas en esta sala")) {
          console.error(`[DEBUG] Error critico en joinRoom:`, err);
          throw err;
        } else {
          console.log(`[DEBUG] El usuario ya estaba en la sala, continuando a navegacion.`);
        }
      }

      console.log(`[DEBUG] Guardando historial y navegando a /sala/${room.id}`);
      const infoSala = {
        id: room.id,
        nombre: room.nombre,
        habilidad: room.habilidad,
        mentor: room.mentor_nombre || "Sin mentor",
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
    <section className="salas-activas-section">
      <GlobalHeader />

      {/* Stats */}
      <div className="perfil-stats-grid" style={{ marginBottom: "2rem" }}>
        <PerfilStatCard titulo="Salas Asistidas" valor={stats.salasAsistidas} icon={Video} color="#00ffff" />
        <PerfilStatCard titulo="Horas de Estudio" valor={`${stats.horasEstudio}h`} icon={Clock} color="#ff00ff" />
        <PerfilStatCard titulo="Cursos" valor={stats.cursos} icon={BookOpen} color="#00ff00" />
      </div>

      <div
        className="search-container-neon"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", marginBottom: "1.5rem" }}
      >
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Buscar habilidad o mentor..."
          className="search-input-neon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-global-container">
          <div className="aura-spinner"></div>
          <span className="loading-text-neon">Buscando salas</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-centered">
          <Users size={100} className="empty-icon-neon" />
          <h3 className="empty-state-title">No hay salas disponibles</h3>
          <p className="empty-state-text">Vuelve mas tarde o explora nuevas habilidades para encontrar mentores activos.</p>
        </div>
      ) : (
        <div className="salas-grid" style={{ alignItems: "stretch" }}>
          {filtered.map((room) => (
            <article key={room.id} className="neon-card mentor-list-card dashboard-room-card dashboard-room-card-student">
              <div className="dashboard-room-card-top">
                <div className="dashboard-room-icon">
                  <BookOpen size={30} strokeWidth={1.7} />
                </div>
                <div className="dashboard-room-badges">
                  <span className={`dashboard-room-badge ${room.sessionInfo?.isActive ? "live" : "offline"}`}>
                    <Radio size={12} />
                    {room.sessionInfo?.isActive ? "Mentor activo" : "Mentor inactivo"}
                  </span>
                </div>
              </div>

              <div className="dashboard-room-content">
                <h3 className="dashboard-room-title">{room.nombre}</h3>
                <div className="dashboard-room-meta">
                  <p>
                    <User size={15} />
                    <span>{room.mentor_nombre || "Sin mentor"}</span>
                  </p>
                  <p>
                    <BookOpen size={15} />
                    <span>{room.habilidad || "Habilidad no definida"}</span>
                  </p>
                  <p>
                    <Smile size={15} />
                    <span>{room.mood || "Sin mood definido"}</span>
                  </p>
                </div>
              </div>

              <div className="dashboard-room-actions">
                <button
                  className="primary-btn-s dashboard-room-btn"
                  onClick={() => handleJoin(room)}
                  disabled={joining === room.id || !room.sessionInfo?.isActive}
                  title={!room.sessionInfo?.isActive ? "El mentor no esta activo" : ""}
                >
                  {joining === room.id ? "Entrando..." : "Entrar a sala"}
                </button>
              </div>
            </article>
          ))}
        </div>

      )}
    </section>
  );
}

export default HomeAprendiz;
