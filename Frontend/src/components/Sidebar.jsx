import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Users,
  History,
  LogOut,
  Settings,
  PlusSquare,
  Video,
  Menu,
  X,
} from "lucide-react";
import "../Styles/Sidebar.css";

function Sidebar({ rol }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setIsOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        type="button"
        className={`sidebar-mobile-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
        <span>{isOpen ? "Close" : "Menu"}</span>
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      <aside className={`sidebar-neon ${isOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <h2 className="aura-text">
              AURA <span className="skill-text">SKILL</span>
            </h2>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${isActive("/home") ? "active" : ""}`}
            onClick={() => handleNavigate("/home")}
          >
            <LayoutDashboard size={18} className="nav-icon" />
            Dashboard
          </button>

          {rol === "mentor" ? (
            <>

              <button
                className={`nav-item ${isActive("/salas-activas") ? "active" : ""}`}
                onClick={() => handleNavigate("/salas-activas")}
              >
                <Video size={18} className="nav-icon" />
                Salas en Vivo
              </button>
            </>
          ) : (
            <>

              <button
                className={`nav-item ${isActive("/mentores") ? "active" : ""}`}
                onClick={() => handleNavigate("/mentores")}
              >
                <Users size={18} className="nav-icon" />
                Mentores
              </button>
            </>
          )}

          <button
            className={`nav-item ${isActive("/historial") ? "active" : ""}`}
            onClick={() => handleNavigate("/historial")}
          >
            <History size={18} className="nav-icon" />
            Historial
          </button>

          <button
            className={`nav-item ${isActive("/perfil") ? "active" : ""}`}
                onClick={() => handleNavigate("/perfil")}
              >
                <Settings size={18} className="nav-icon" />
                Perfil
          </button>

          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={18} className="nav-icon" />
            Cerrar Sesión
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
