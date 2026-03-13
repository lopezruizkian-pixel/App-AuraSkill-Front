import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar
import Sidebar from "../components/Sidebar";
import HabilidadCard from "../components/HabilidadCard";
import { Search, Bell, User, Code, Palette, Megaphone, Languages, Music, Gamepad2 } from "lucide-react"; 
import "../Styles/Home.css"; 
import "../Styles/BuscarHabilidades.css"; 

function BuscarHabilidades() {
  const [rol] = useState(localStorage.getItem("userRole") || "aprendiz");
  const navigate = useNavigate(); // Inicializar

  const habilidades = [
    { id: 1, titulo: "Programación", icono: Code },
    { id: 2, titulo: "Diseño", icono: Palette },
    { id: 3, titulo: "Marketing", icono: Megaphone },
    { id: 4, titulo: "Idiomas", icono: Languages },
    { id: 5, titulo: "Musica", icono: Music },
    { id: 6, titulo: "Gaming", icono: Gamepad2 },
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
                <Bell size={24} />
                <span className="notification-dot">1</span>
              </div>
              {/* Evento onClick añadido */}
              <div className="icon-action user-icon" onClick={() => navigate("/perfil")} style={{cursor: 'pointer'}}>
                <User size={24} />
              </div>
            </div>
          </div>

          <section className="habilidades-section">
            <h2 className="welcome-title">Habilidades del momento</h2>
            <div className="habilidades-grid">
              {habilidades.map((hab) => (
                <HabilidadCard key={hab.id} titulo={hab.titulo} IconoComponente={hab.icono} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default BuscarHabilidades;