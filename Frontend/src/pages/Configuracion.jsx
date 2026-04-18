import { useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import { Search, Bell, User, Headphones, Settings, Shield, Trash2, RefreshCw } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import "../Styles/Home.css";
import "../Styles/BuscarHabilidades.css";
import "../Styles/Configuracion.css";

function Configuracion() {
  const [rol] = useState(localStorage.getItem("userRole") || "alumno");
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />

        <main className="home-content">
          <div className="dashboard-header full-header">
            <div className="search-container-neon search-extended">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Buscar ajuste..." className="search-input-neon" />
            </div>
            <div className="header-actions-right">
              <div className="mood-indicator">Mood: Concentrado</div>
              <div className="icon-action bell-icon">
                <Bell size={24} />
                <span className="notification-dot">1</span>
              </div>
              <div className="icon-action user-icon">
                <User size={24} />
              </div>
            </div>
          </div>

          <section className="configuracion-section">
            <h2 className="welcome-title">Configuración</h2>

            <div className="config-grid config-grid-single">
              <div className="neon-card config-card">
                <div>
                  <div className="config-card-header">
                    <div className="config-icon-container">
                      <Headphones size={24} />
                    </div>
                    <h3 className="config-titulo">Spotify</h3>
                  </div>
                  <p className="config-estado">
                    Estado: <span style={{ color: "#00ff00", fontWeight: 600 }}>Vinculado</span>
                  </p>
                </div>
                <div className="config-card-action">
                  <button className="secondary-btn-neon config-btn-center">
                    Desvincular cuenta
                  </button>
                </div>
              </div>
            </div>

            <div className="config-list-section">
              <h3 className="section-subtitle">
                <Settings size={20} className="section-icon" />
                Personalización de sistema
              </h3>

              <div className="neon-card config-list-container">
                <div className="config-list-item">
                  <span>Modo de visualización</span>
                  <select
                    className="config-select"
                    onChange={(e) => setTheme(e.target.value)}
                    value={theme}
                  >
                    <option value="neon">Neón Cyberspace</option>
                    <option value="classic">Aura Clásico</option>
                  </select>
                </div>

                <div className="config-list-item">
                  <span>Tema principal</span>
                  <select className="config-select">
                    <option>Neón Cyberspace</option>
                    <option>Aurora Neon</option>
                    <option>Ocaso Digital</option>
                    <option>Aura Clásico</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="config-list-section">
              <h3 className="section-subtitle">
                <Shield size={20} className="section-icon" />
                Cuenta y Seguridad
              </h3>

              <div className="neon-card config-list-container">
                <div className="config-list-item">
                  <span>Cambiar contraseña</span>
                  <button className="primary-btn-neon-s">
                    <RefreshCw size={14} style={{ marginRight: 8 }} />
                    Actualizar
                  </button>
                </div>

                <div className="config-list-item danger-zone">
                  <span>Eliminar cuenta definitivamente</span>
                  <button className="danger-btn-neon-s">
                    <Trash2 size={14} style={{ marginRight: 8 }} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Configuracion;