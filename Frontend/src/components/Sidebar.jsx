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
                className={`nav-item ${isActive("/buscar-habilidades") ? "active" : ""}`}
                onClick={() => handleNavigate("/buscar-habilidades")}
              >
                <Search size={18} className="nav-icon" />
                Skills
              </button>

              <button
                className={`nav-item ${isActive("/crear-sala") ? "active" : ""}`}
                onClick={() => handleNavigate("/crear-sala")}
              >
                <PlusSquare size={18} className="nav-icon" />
                Create Room
              </button>

              <button
                className={`nav-item ${isActive("/salas-activas") ? "active" : ""}`}
                onClick={() => handleNavigate("/salas-activas")}
              >
                <Video size={18} className="nav-icon" />
                Live Room
              </button>
            </>
          ) : (
            <>
              <button
                className={`nav-item ${isActive("/buscar-habilidades") ? "active" : ""}`}
                onClick={() => handleNavigate("/buscar-habilidades")}
              >
                <Search size={18} className="nav-icon" />
                Search Skills
              </button>

              <button
                className={`nav-item ${isActive("/mentores") ? "active" : ""}`}
                onClick={() => handleNavigate("/mentores")}
              >
                <Users size={18} className="nav-icon" />
                Mentors
              </button>
            </>
          )}

          <button
            className={`nav-item ${isActive("/historial") ? "active" : ""}`}
            onClick={() => handleNavigate("/historial")}
          >
            <History size={18} className="nav-icon" />
            History
          </button>

          <button
            className={`nav-item ${isActive("/configuracion") ? "active" : ""}`}
            onClick={() => handleNavigate("/configuracion")}
          >
            <Settings size={18} className="nav-icon" />
            Settings
          </button>

          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={18} className="nav-icon" />
            Log Out
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
