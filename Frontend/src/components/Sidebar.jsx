import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { LayoutDashboard, Search, Users, History, LogOut, Settings, SquarePlus, Video } from "lucide-react";
import "../Styles/Sidebar.css";

function Sidebar({ rol }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-neon">
      <div className="sidebar-header">
        <h2 className="aura-text">AURA <span className="skill-text">SKILL</span></h2>
      </div>

      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${isActive('/home') ? 'active' : ''}`}
          onClick={() => navigate("/home")}
        >
          <LayoutDashboard size={18} className="nav-icon" />
          Dashboard
        </button>
        
        {rol === "mentor" ? (
          <>
            <button 
              className={`nav-item ${isActive('/buscar-habilidades') ? 'active' : ''}`}
              onClick={() => navigate("/buscar-habilidades")}
            >
              <Search size={18} className="nav-icon" />
              Skills
            </button>

            <button 
              className={`nav-item ${isActive('/crear-sala') ? 'active' : ''}`}
              onClick={() => navigate("/crear-sala")}
            >
              <SquarePlus size={18} className="nav-icon" />
              Crear sala
            </button>
            
            <button 
              className={`nav-item ${isActive('/salas-activas') ? 'active' : ''}`}
              onClick={() => navigate("/salas-activas")}
            >
              <Video size={18} className="nav-icon" />
              Sala activa 
            </button>
          </>
        ) : (
          <>
            <button 
              className={`nav-item ${isActive('/buscar-habilidades') ? 'active' : ''}`}
              onClick={() => navigate("/buscar-habilidades")}
            >
              <Search size={18} className="nav-icon" />
              Buscar habilidades
            </button>

            <button 
              className={`nav-item ${isActive('/mentores') ? 'active' : ''}`}
              onClick={() => navigate("/mentores")}
            >
              <Users size={18} className="nav-icon" />
              Mentores
            </button>
          </>
        )}
        
        <button 
          className={`nav-item ${isActive('/historial') ? 'active' : ''}`}
          onClick={() => navigate("/historial")}
        >
          <History size={18} className="nav-icon" />
          Historial
        </button>

        {/* --- BOTÓN DE CONFIGURACIÓN ACTUALIZADO --- */}
        <button 
          className={`nav-item ${isActive('/configuracion') ? 'active' : ''}`}
          onClick={() => navigate("/configuracion")}
        >
          <Settings size={18} className="nav-icon" />
          Configuración
        </button>
        
        <button className="nav-item logout" onClick={handleLogout}>
          <LogOut size={18} className="nav-icon" />
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
