import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PerfilStatCard from "../components/PerfilStatCard";
import SkillTag from "../components/SkillTag";
import { Bell, User, Edit3, Star, Clock, Video, Award, BookOpen } from "lucide-react"; 

import "../Styles/Home.css"; 
import "../Styles/Perfil.css"; // Nuevos estilos

function Perfil() {
  // Cambia esto a "alumno" o "mentor" para probar ambas vistas
  const [rol] = useState(localStorage.getItem("userRole") || "mentor");

  // Datos simulados (En la vida real vendrían de una base de datos)
  const userData = {
    nombre: rol === "mentor" ? "Alex Rivera" : "Sam Taylor",
    usuario: rol === "mentor" ? "@alex_dev" : "@sam_learns",
    bio: rol === "mentor" 
      ? "Desarrollador Full Stack apasionado por enseñar React y arquitecturas escalables. ¡Hagamos código limpio!"
      : "Entusiasta del diseño UI/UX y frontend. Aprendiendo a dar vida a las interfaces.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (rol === "mentor" ? "Felix" : "Aneka")
  };

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        
        <main className="home-content">
          {/* HEADER SUPERIOR (Búsqueda/Notificaciones) */}
          <div className="dashboard-header full-header">
            <div className="estado-mentor-pill">
              <span>{rol === "mentor" ? "Modo Enseñanza" : "Modo Aprendizaje"}</span>
            </div>
            
            <div className="header-actions-right">
              <div className="icon-action bell-icon">
                <Bell size={24} />
              </div>
              <div className="icon-action user-icon active-user">
                <User size={24} />
              </div>
            </div>
          </div>

          <section className="perfil-section">
            
            {/* 1. TARJETA PRINCIPAL DEL PERFIL */}
            <div className="neon-card perfil-header-card">
              <div className="perfil-avatar-container">
                <img src={userData.avatarUrl} alt="Avatar" className="perfil-avatar" />
                <div className="avatar-glow"></div>
              </div>
              
              <div className="perfil-info">
                <div className="perfil-title-row">
                  <h1 className="perfil-nombre">{userData.nombre}</h1>
                  <span className={`perfil-rol-badge ${rol}`}>
                    {rol === "mentor" ? "Mentor Expert" : "Aprendiz Aura"}
                  </span>
                </div>
                <h3 className="perfil-usuario">{userData.usuario}</h3>
                <p className="perfil-bio">{userData.bio}</p>
              </div>

              <div className="perfil-actions">
                <button className="primary-btn-neon-s edit-btn">
                  <Edit3 size={16} /> Editar Perfil
                </button>
              </div>
            </div>

            {/* 2. ESTADÍSTICAS DEL USUARIO */}
            <h2 className="section-subtitle-neon">Tus Estadísticas</h2>
            <div className="perfil-stats-grid">
              {rol === "mentor" ? (
                <>
                  <PerfilStatCard titulo="Salas Creadas" valor="42" icon={Video} color="#00ffff" />
                  <PerfilStatCard titulo="Alumnos Ayudados" valor="156" icon={User} color="#ff00ff" />
                  <PerfilStatCard titulo="Calificación" valor="4.9" icon={Star} color="#ffaa00" />
                  <PerfilStatCard titulo="Horas Mentoreando" valor="120h" icon={Clock} color="#00ff00" />
                </>
              ) : (
                <>
                  <PerfilStatCard titulo="Salas Asistidas" valor="28" icon={Video} color="#00ffff" />
                  <PerfilStatCard titulo="Horas de Estudio" valor="45h" icon={Clock} color="#ff00ff" />
                  <PerfilStatCard titulo="Logros Desbloqueados" valor="12" icon={Award} color="#ffaa00" />
                  <PerfilStatCard titulo="Cursos Completados" valor="3" icon={BookOpen} color="#00ff00" />
                </>
              )}
            </div>

            {/* 3. HABILIDADES */}
            <h2 className="section-subtitle-neon">
              {rol === "mentor" ? "Habilidades que dominas" : "Habilidades que estás aprendiendo"}
            </h2>
            <div className="neon-card perfil-skills-card">
              {rol === "mentor" ? (
                <>
                  <SkillTag nombre="React.js" nivel="Experto" color="#00ffff" />
                  <SkillTag nombre="Node.js" nivel="Avanzado" color="#ff00ff" />
                  <SkillTag nombre="UI/UX" nivel="Intermedio" color="#00ff00" />
                  <SkillTag nombre="Python" nivel="Experto" color="#ffaa00" />
                </>
              ) : (
                <>
                  <SkillTag nombre="Figma" nivel="Básico" color="#ff00ff" />
                  <SkillTag nombre="CSS Avanzado" nivel="Intermedio" color="#00ffff" />
                  <SkillTag nombre="JavaScript" nivel="Intermedio" color="#ffaa00" />
                </>
              )}
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}

export default Perfil;