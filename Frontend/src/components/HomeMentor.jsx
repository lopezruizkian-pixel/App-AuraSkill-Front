import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchActiveRooms, createRoom } from "../services/roomService";

function HomeMentor() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre: "", habilidad: "", mood: "" });
  const [creating, setCreating] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadRooms();
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
        capacidad_maxima: 10,
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
      <div className="dashboard-header">
        <button className="boton-estadoDispo">Estado: Disponible</button>
      </div>

      <div className="neon-card main-card">
        <h3>Crear nueva sala</h3>
        <div className="form-mini">
          <div className="mini-input-group">
            <label>Nombre de la sala</label>
            <input type="text" name="nombre" className="neon-input-s" value={formData.nombre} onChange={handleChange} placeholder="Ej. React Avanzado" />
          </div>
          <div className="mini-input-group">
            <label>Habilidad</label>
            <input type="text" name="habilidad" className="neon-input-s" value={formData.habilidad} onChange={handleChange} placeholder="Ej. Programación" />
          </div>
          <div className="mini-input-group">
            <label>Mood de la sesión</label>
            <input type="text" name="mood" className="neon-input-s" value={formData.mood} onChange={handleChange} placeholder="Ej. Concentrado" />
          </div>
          <button className="primary-btn-s" onClick={handleCrear} disabled={creating}>
            {creating ? "Creando..." : "Crear sala"}
          </button>
        </div>
      </div>

      <h2 className="welcome-title">Mis salas activas</h2>
      {loading ? (
        <p>Cargando salas...</p>
      ) : rooms.length === 0 ? (
        <p>No tienes salas activas aún.</p>
      ) : (
        rooms.map((room) => (
          <div key={room.id} className="neon-card mentor-list-card">
            <div className="mentor-item">
              <div className="mentor-info">
                <p><strong>Sala:</strong> {room.nombre}</p>
                <p><strong>Habilidad:</strong> {room.habilidad}</p>
                <p><strong>Mood:</strong> {room.mood}</p>
              </div>
              <button className="primary-btn-s" onClick={() => navigate(`/sala/${room.id}`)}>
                Entrar
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default HomeMentor;
