import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SalaActivaCard from "../components/SalaActivaCard";
import { Bell, User, Circle, VideoOff } from "lucide-react"; 

import "../Styles/Home.css"; 
import "../Styles/BuscarHabilidades.css"; 
import "../Styles/SalasActivas.css";

function SalasActivas() {
  const [rol] = useState(localStorage.getItem("userRole") || "mentor");
  const navigate = useNavigate();
  const [salaActiva, setSalaActiva] = useState(
    localStorage.getItem("salaActiva") 
      ? JSON.parse(localStorage.getItem("salaActiva"))
      : null
  );

  const handleEnterRoom = () => {
    if (salaActiva && salaActiva.id) {
      navigate(`/sala/${salaActiva.id}`);
    }
  };

  const handleCloseRoom = () => {
    localStorage.removeItem("salaActiva");
    setSalaActiva(null);
  };

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        
        <main className="home-content">
          <div className="dashboard-header full-header">
            <div className="estado-mentor-pill">
              <span>Estado: Disponible</span>
              <Circle className="status-dot online" size={12} fill="#00ff00" />
            </div>
            
            <div className="header-actions-right">
              <div className="icon-action bell-icon" title="Notificaciones">
                <Bell size={24} /><span className="notification-dot">1</span>
              </div>
              <div className="icon-action user-icon" onClick={() => navigate("/perfil")} style={{cursor: 'pointer'}} title="Perfil">
                <User size={24} />
              </div>
            </div>
          </div>

          <section className="salas-activas-section">
            <h2 className="welcome-title">Tu sala actual</h2>
            <div className="single-sala-container">
              {salaActiva ? (
                <SalaActivaCard {...salaActiva} onClose={handleCloseRoom} onEnter={handleEnterRoom} />
              ) : (
                <div className="neon-card empty-sala-state">
                  <VideoOff size={48} className="empty-icon" />
                  <h3>No tienes ninguna sala activa</h3>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default SalasActivas;
