import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Smile, Users, PlusCircle, Video } from "lucide-react";
import { fetchActiveRooms, createRoom } from "../services/roomService";
import { getSocketUrl } from "../services/socketConfig";
import { io } from "socket.io-client";
import "../Styles/Mentores.css";

function HomeMentor() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre: "", habilidad: "", mood: "", limite: 10 });
  const [creating, setCreating] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadRooms();

    const socketURL = getSocketUrl();
    const socket = io(socketURL, { transports: ['websocket', 'polling'] });
    
    socket.on('roomsUpdated', () => {
      console.log('Salas actualizadas, recargando (mentor)...');
      loadRooms();
    });

    return () => {
      socket.disconnect();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCrear = async () => {
    if (!formData.nombre || !formData.habilidad || !formData.mood) {
      alert("Completa todos los campos");
      return;
    }
    setCreating(true);
    try {
      const newRoom = await createRoom({
        nombre: formData.nombre,
        habilidad: formData.habilidad,
        mood: formData.mood,
        capacidad_maxima: formData.limite,
        descripcion: "",
      });
      const room = newRoom.room || newRoom;
      localStorage.setItem("salaActiva", JSON.stringify({
        id: room.id,
        titulo: room.nombre,
        habilidad: room.habilidad,
        mood: room.mood,
        inscritos: 0,
        capacidad: room.capacidad_maxima || 10,
      }));
      alert("¡Sala creada!");
      navigate(`/sala/${room.id}`);
    } catch (err) {
      alert(err.message || "Error al crear sala");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="dashboard-section">
      <div className="dashboard-header full-header" style={{ marginBottom: "2rem" }}>
        <h2 className="welcome-title" style={{ margin: 0 }}>Dashboard del Mentor</h2>
        <div className="estado-mentor-pill">
          <span>Estado: Disponible</span>
          <div className="status-dot online" style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#00ff00", marginLeft: "10px" }}></div>
        </div>
      </div>

      <div className="neon-card main-card" style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <PlusCircle size={24} color="#00ffff" />
          <h3 style={{ margin: 0, color: "#fff" }}>Crear nueva sala de mentoría</h3>
        </div>
        <div className="form-mini">

          <div className="mini-input-group">
            <label>Nombre de la sala</label>
            <input type="text" name="nombre" className="neon-input-s" value={formData.nombre} onChange={handleChange} placeholder="Ej. React Avanzado" />
          </div>

          <div className="mini-row">
            <div className="mini-input-group">
              <label>Habilidad</label>
              <div className="input-wrapper-mini">
                <Wrench size={16} className="mini-icon" />
                <select name="habilidad" className="neon-input-s neon-select-s" value={formData.habilidad} onChange={handleChange}>
                  <option value="" disabled>Selecciona</option>
                  <option value="Programacion">💻 Programación</option>
                  <option value="Diseno">🎨 Diseño UI/UX</option>
                  <option value="Idiomas">🌍 Idiomas</option>
                  <option value="Matematicas">📐 Matemáticas</option>
                  <option value="Musica">🎵 Música</option>
                  <option value="Otros">✨ Otros</option>
                </select>
              </div>
            </div>

            <div className="mini-input-group">
              <label>Mood</label>
              <div className="input-wrapper-mini">
                <Smile size={16} className="mini-icon" />
                <select name="mood" className="neon-input-s neon-select-s" value={formData.mood} onChange={handleChange}>
                  <option value="" disabled>Selecciona</option>
                  <option value="Concentrado">🎯 Concentrado</option>
                  <option value="Creativo">🎨 Creativo</option>
                  <option value="Energetico">⚡ Energético</option>
                  <option value="Relajado">☕ Relajado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mini-row">
            <div className="mini-input-group">
              <label>Límite de estudiantes</label>
              <div className="input-wrapper-mini">
                <Users size={16} className="mini-icon" />
                <input type="number" name="limite" min="1" max="50" className="neon-input-s" value={formData.limite} onChange={handleChange} placeholder="Ej. 10" />
              </div>
            </div>
          </div>

          <button className="primary-btn-s" onClick={handleCrear} disabled={creating} style={{ marginTop: "10px", width: "100%", maxWidth: "200px" }}>
            {creating ? "Creando..." : "Crear e Iniciar sala"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <Video size={24} color="#ff00ff" />
        <h2 className="welcome-title" style={{ margin: 0 }}>Mis salas activas</h2>
      </div>

      {loading ? (
        <p>Cargando salas...</p>
      ) : rooms.length === 0 ? (
        <div className="neon-card empty-sala-state" style={{ padding: "2rem", textAlign: "center", marginTop: "1rem" }}>
          <p>No tienes salas activas aún. Crea una para comenzar a ser mentor.</p>
        </div>
      ) : (
        <div className="mentores-grid">
          {rooms.map((room) => (
            <div key={room.id} className="neon-card mentor-list-card">
              <div className="mentor-item" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="mentor-info">
                  <h4 style={{ margin: "0 0 10px 0", color: "#00ffff" }}>{room.nombre}</h4>
                  <p><strong>Habilidad:</strong> {room.habilidad}</p>
                  <p><strong>Mood:</strong> {room.mood}</p>
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
