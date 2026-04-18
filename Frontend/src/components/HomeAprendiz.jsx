import React, { useEffect, useState } from "react";
import { Search, Radio, Wrench, Smile, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HomeAprendiz() {
  const navigate = useNavigate();
  const [salasVisitadas, setSalasVisitadas] = useState([]);

  useEffect(() => {
    try {
      const historial = JSON.parse(localStorage.getItem("historialSalas") || "[]");
      const mentoresVistos = historial.reduce((acc, sesion) => {
        const key = sesion.mentorId;
        if (!key) return acc;
        if (!acc[key]) {
          acc[key] = {
            mentorId: key,
            mentor: sesion.mentor,
            habilidad: sesion.habilidad,
            mood: sesion.mood,
            roomId: sesion.roomId,
            nombreSala: sesion.nombreSala,
          };
        }
        return acc;
      }, {});
      setSalasVisitadas(Object.values(mentoresVistos));
    } catch {
      setSalasVisitadas([]);
    }
  }, []);

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <div className="search-container-neon">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar habilidad o mentor..."
            className="search-input-neon"
          />
        </div>
        <div className="mood-indicator">Mood: Concentrado</div>
      </div>

      <h2 className="welcome-title">
        {salasVisitadas.length > 0 ? "Mentores que has visitado" : "Aún no has visitado ninguna sala"}
      </h2>

      {salasVisitadas.length === 0 ? (
        <div className="neon-card" style={{ padding: "30px", textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
          <p>Explora las salas activas y únete a una sesión para ver tus mentores aquí.</p>
          <button
            className="primary-btn-s"
            style={{ marginTop: 16 }}
            onClick={() => navigate("/mentores")}
          >
            Ver mentores disponibles
          </button>
        </div>
      ) : (
        <div className="neon-card mentor-list-card">
          {salasVisitadas.map((sala) => (
            <div key={sala.mentorId} className="mentor-item">
              <div className="mentor-info">
                <p><strong>Mentor:</strong> {sala.mentor}</p>
                <p><strong>Habilidad:</strong> {sala.habilidad}</p>
                <p><strong>Mood:</strong> {sala.mood}</p>
              </div>
              <button
                className="primary-btn-s"
                onClick={() => navigate(`/sala/${sala.roomId}`)}
              >
                <LogIn size={15} style={{ marginRight: 6 }} />
                Entrar a sala
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomeAprendiz;