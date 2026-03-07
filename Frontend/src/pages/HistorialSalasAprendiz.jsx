import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HistorialRow from "../components/HistorialRow";
import { Search, Bell, User } from "lucide-react"; 

import "../Styles/Home.css"; 
import "../Styles/BuscarHabilidades.css"; 
import "../Styles/HistorialSalasAprendiz.css"; 

function HistorialSalasAprendiz() {
  const [rol] = useState(localStorage.getItem("userRole") || "aprendiz");
  const navigate = useNavigate();

  const historialData = [
    { id: 1, fecha: "06 / 02 / 2026", habilidad: "Programación", mood: "Concentrado", mentor: "Juan Lopez", duracion: "1h 30m" },
    ...Array(10).fill({ id: null, fecha: "", habilidad: "", mood: "", mentor: "", duracion: "" })
  ];

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        
        <main className="home-content">
          <div className="dashboard-header full-header">
            <div className="search-container-neon search-extended">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Buscar habilidad..." className="search-input-neon" />
            </div>
            
            <div className="header-actions-right">
              <div className="mood-indicator">Mood: Concentrado</div>
              <div className="icon-action bell-icon">
                <Bell size={24} /><span className="notification-dot">1</span>
              </div>
              <div className="icon-action user-icon" onClick={() => navigate("/perfil")} style={{cursor: 'pointer'}}>
                <User size={24} />
              </div>
            </div>
          </div>

          <section className="historial-section">
            <h2 className="welcome-title">Historial de Sesiones</h2>
            <div className="historial-table-header">
              <div className="header-item-neon">Fecha</div>
              <div className="header-item-neon">Habilidad</div>
              <div className="header-item-neon">Mood</div>
              <div className="header-item-neon">Mentor</div>
              <div className="header-item-neon">Duracion</div>
            </div>
            <div className="historial-list">
              {historialData.map((item, index) => (
                <HistorialRow key={item.id || index} {...item} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default HistorialSalasAprendiz;