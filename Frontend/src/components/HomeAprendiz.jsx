import React from "react";
import { Search } from "lucide-react"; 

function HomeAprendiz() {
  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <div className="search-container-neon">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Buscar habilidad o mentor..." 
            className="search-input-neon"
          />
        </div>
        <div className="mood-indicator">Mood:  Concentrado</div>
        
      </div>

      <h2 className="welcome-title">Mentores disponibles</h2>

      <div className="neon-card mentor-list-card">
        <div className="mentor-item">
          <div className="mentor-info">
            <p><strong>Mentor:</strong> Juan Pérez</p>
            <p><strong>Habilidad:</strong> Programación</p>
            <p><strong>Mood:</strong> </p>
          </div>
          <button className="primary-btn-s">Entrar a sala</button>
        </div>
      </div>
    </section>
  );
}

export default HomeAprendiz;