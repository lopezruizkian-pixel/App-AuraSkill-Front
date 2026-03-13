import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MentorCard from "../components/MentorCard";
import { Search, Bell, User } from "lucide-react"; 
import "../Styles/Mentores.css";

function Mentores() {
  const [rol] = useState(localStorage.getItem("userRole") || "aprendiz");
  const navigate = useNavigate();

  const mentoresData = [
    { id: 1, nombre: "Juan Pérez", habilidad: "Programación", mood: "⚡ 🎯" },
    { id: 2, nombre: "Marcela Treviño", habilidad: "Geografía", mood: "⚡ 🎯" },
    { id: 3, nombre: "Monica Gómez", habilidad: "Musica", mood: "⚡ 🎯" },
    { id: 4, nombre: "Fabiola Gonzales", habilidad: "Diseño", mood: "⚡ 🎯" },
    { id: 5, nombre: "Luis Lopez", habilidad: "Literatura", mood: "⚡ 🎯" },
    { id: 6, nombre: "Marco Torres", habilidad: "Calculo diferencial", mood: "⚡ 🎯" },
  ];

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        
        <main className="home-content">
          <div className="dashboard-header full-header">
            <div className="search-container-neon search-extended">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Buscar mentor..." className="search-input-neon" />
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

          <section className="mentores-section">
            <h2 className="welcome-title">Mentores disponibles</h2>
            <div className="filtros-container">
              <select className="filtro-neon"><option value="">Habilidad</option></select>
              <select className="filtro-neon"><option value="">Mood</option></select>
            </div>
            <div className="mentores-grid">
              {mentoresData.map((m) => (<MentorCard key={m.id} {...m} />))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Mentores;