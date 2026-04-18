import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import PerfilStatCard from "../components/PerfilStatCard";
import SkillTag from "../components/SkillTag";
import { Bell, User, Edit3, Star, Clock, Video, Award, BookOpen } from "lucide-react";
import { httpClient } from "../services/httpClient";
import "../Styles/Home.css";
import "../Styles/Perfil.css";

function Perfil() {
  const [rol] = useState(localStorage.getItem("userRole") || "alumno");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await httpClient.get("/auth/profile");
        setUserData(data);
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="home-container"><p style={{padding:"2rem"}}>Cargando perfil...</p></div>;
  if (!userData) return <div className="home-container"><p style={{padding:"2rem"}}>Error al cargar perfil.</p></div>;

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.usuario}`;

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        <main className="home-content">
          <div className="dashboard-header full-header">
            <div className="estado-mentor-pill">
              <span>{rol === "mentor" ? "Modo Enseñanza" : "Modo Aprendizaje"}</span>
            </div>
            <div className="header-actions-right">
              <div className="icon-action bell-icon"><Bell size={24} /></div>
              <div className="icon-action user-icon active-user"><User size={24} /></div>
            </div>
          </div>

          <section className="perfil-section">
            <div className="neon-card perfil-header-card">
              <div className="perfil-avatar-container">
                <img src={avatarUrl} alt="Avatar" className="perfil-avatar" />
                <div className="avatar-glow"></div>
              </div>
              <div className="perfil-info">
                <div className="perfil-title-row">
                  <h1 className="perfil-nombre">{userData.nombre}</h1>
                  <span className={`perfil-rol-badge ${rol}`}>
                    {rol === "mentor" ? "Mentor" : "Aprendiz"}
                  </span>
                </div>
                <h3 className="perfil-usuario">@{userData.usuario}</h3>
                <p className="perfil-bio">{userData.correo}</p>
              </div>
              <div className="perfil-actions">
                <button className="primary-btn-neon-s edit-btn">
                  <Edit3 size={16} /> Editar Perfil
                </button>
              </div>
            </div>

            <h2 className="section-subtitle-neon">Tus Estadísticas</h2>
            <div className="perfil-stats-grid">
              {rol === "mentor" ? (
                <>
                  <PerfilStatCard titulo="Salas Creadas" valor="—" icon={Video} color="#00ffff" />
                  <PerfilStatCard titulo="Alumnos Ayudados" valor="—" icon={User} color="#ff00ff" />
                  <PerfilStatCard titulo="Calificación" valor="—" icon={Star} color="#ffaa00" />
                  <PerfilStatCard titulo="Horas Mentoreando" valor="—" icon={Clock} color="#00ff00" />
                </>
              ) : (
                <>
                  <PerfilStatCard titulo="Salas Asistidas" valor="—" icon={Video} color="#00ffff" />
                  <PerfilStatCard titulo="Horas de Estudio" valor="—" icon={Clock} color="#ff00ff" />
                  <PerfilStatCard titulo="Logros" valor="—" icon={Award} color="#ffaa00" />
                  <PerfilStatCard titulo="Cursos" valor="—" icon={BookOpen} color="#00ff00" />
                </>
              )}
            </div>

            <h2 className="section-subtitle-neon">
              {rol === "mentor" ? "Habilidades que dominas" : "Habilidades que estás aprendiendo"}
            </h2>
            <div className="neon-card perfil-skills-card">
              {userData.habilidades && userData.habilidades.length > 0 ? (
                userData.habilidades.map((hab, i) => (
                  <SkillTag key={i} nombre={hab} nivel="—" color="#00ffff" />
                ))
              ) : (
                <p>No hay habilidades registradas.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Perfil;
