import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import FormCrearSala from "../components/FormCrearSala";
import { Bell, User, Circle } from "lucide-react"; 

import "../Styles/Home.css"; 
import "../Styles/BuscarHabilidades.css"; 
import "../Styles/CrearSala.css"; 

function CrearSala() {
  const [rol] = useState(localStorage.getItem("userRole") || "mentor");
  const navigate = useNavigate();

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
              <div className="icon-action bell-icon">
                <Bell size={24} /><span className="notification-dot">1</span>
              </div>
              <div className="icon-action user-icon" onClick={() => navigate("/perfil")} style={{cursor: 'pointer'}}>
                <User size={24} />
              </div>
            </div>
          </div>

          <section className="crear-sala-section">
            <h2 className="welcome-title">Crear nueva sala</h2>
            <FormCrearSala />
          </section>
        </main>
      </div>
    </div>
  );
}

export default CrearSala;