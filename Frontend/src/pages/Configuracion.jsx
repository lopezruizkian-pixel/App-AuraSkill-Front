import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ConfigCard from "../components/ConfigCard";
import { Search, Bell, User, Headphones, Settings, Shield, Globe, Trash2, RefreshCw } from "lucide-react"; 

import "../Styles/Home.css"; 
import "../Styles/BuscarHabilidades.css"; 
import "../Styles/Configuracion.css";

function Configuracion() {
  const [rol] = useState(localStorage.getItem("userRole") || "aprendiz");

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
              <div className="mood-indicator">Mood:  Concentrado</div>
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

            <div className="config-grid">
              <ConfigCard 
                titulo="Spotify"
                icon={Headphones}
                estadoTexto="Vinculado"
                estadoColor="#00ff00"
                btnTexto="Desvincular"
              />
              <ConfigCard 
                titulo="Notificaciones"
                icon={Bell}
                estadoTexto="Activado"
                estadoColor="#00ff00"
                btnTexto="Desactivar"
              />
            </div>

            <div className="config-list-section">
              <h3 className="section-subtitle">
                <Settings size={20} className="section-icon" />
                Personalización de sistema
              </h3>
              
              <div className="neon-card config-list-container">
                <div className="config-list-item">
                  <span>Modo de visualización</span>
                  <select className="config-select">
                    <option>Modo Oscuro</option>
                    <option>Automático</option>
                    <option>Modo Claro (Próximamente)</option>
                  </select>
                </div>
                
                <div className="config-list-item">
                  <span>Tema principal</span>
                  <select className="config-select">
                    <option>Neón Cyberspace (Actual)</option>
                    <option>Aura Clásico</option>
                  </select>
                </div>

                <div className="config-list-item">
                  <span><Globe size={16} className="inline-icon"/> Idioma</span>
                  <select className="config-select">
                    <option>Español (Latinoamérica)</option>
                    <option>English (US)</option>
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
                  {/* Botón primario neón cian */}
                  <button className="primary-btn-neon-s">
                    <RefreshCw size={14} style={{marginRight: '8px'}}/>
                    Actualizar
                  </button>
                </div>
                
                <div className="config-list-item danger-zone">
                  <span>Eliminar cuenta definitivamente</span>
                  {/* Botón de peligro neón magenta */}
                  <button className="danger-btn-neon-s">
                    <Trash2 size={14} style={{marginRight: '8px'}}/>
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