import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Users, PlusCircle, Video } from "lucide-react";
import { fetchActiveRooms, createRoom } from "../services/roomService";
import { getDashboardSocket } from "../services/socketConfig";
import { RefreshCw } from "lucide-react";
import GlobalHeader from "../components/GlobalHeader";
import "../Styles/Mentores.css";

function HomeMentor() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadRooms();

    const socket = getDashboardSocket();
    
    const handleUpdate = () => {
      console.log('Salas actualizadas, recargando (mentor)...');
      loadRooms();
    };
    
    socket.on('roomsUpdated', handleUpdate);

    return () => {
      socket.off('roomsUpdated', handleUpdate);
    };
  }, []);

  const loadRooms = async () => {
    try {
      const data = await fetchActiveRooms();
      // Solo salas del mentor actual
      const myRooms = data.filter((r) => r.mentor_id === userId);
      setRooms(myRooms);
    } catch (err) {
      console.error("Error cargando salas:", err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <section className="dashboard-page">
      <GlobalHeader />
      
      {/* Estado eliminado por redundancia */}



      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <Video size={24} color="#ff00ff" />
        <h2 className="welcome-title" style={{ margin: 0 }}>Mis salas activas</h2>
      </div>

      {loading ? (
        <div className="loading-global-container">
          <div className="aura-spinner" style={{ borderTopColor: "#ff00ff", filter: "drop-shadow(0 0 10px rgba(255, 0, 255, 0.3))" }}></div>
          <span className="loading-text-neon" style={{ color: "#ff00ff" }}>Actualizando</span>
        </div>
      ) : rooms.length === 0 ? (
        <div className="neon-card empty-sala-state" style={{ padding: "2rem", textAlign: "center", marginTop: "1rem" }}>
          <p>No tienes salas activas aún. Crea una para comenzar a ser mentor.</p>
        </div>
      ) : (
        <div className="mentores-grid" style={{ alignItems: "stretch" }}>
          {rooms.map((room) => (
            <div key={room.id} className="neon-card mentor-list-card">
              <div className="mentor-item" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="mentor-info">
                  <h4 style={{ margin: "0 0 10px 0", color: "#00ffff" }}>{room.nombre}</h4>
                  <p><strong>Habilidad:</strong> {room.habilidad}</p>
                  <p><strong>Participantes:</strong> {room.sessionInfo?.participantCount || 0} / {room.capacidad_maxima || 10}</p>
                </div>
                <button className="primary-btn-s" onClick={() => navigate(`/sala/${room.id}`)} style={{ alignSelf: 'flex-start' }}>
                  Entrar a mi sala
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomeMentor;
