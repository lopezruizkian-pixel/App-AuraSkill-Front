import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import PerfilStatCard from "../components/PerfilStatCard";
import SkillTag from "../components/SkillTag";
import Notificaciones from "../components/Notificaciones";
import GlobalHeader from "../components/GlobalHeader";
import { User, Edit3, Star, Clock, Video, Award, BookOpen, X, Check } from "lucide-react";
import { httpClient } from "../services/httpClient";
import "../Styles/Home.css";
import "../Styles/Perfil.css";

function Perfil() {
  const [rol] = useState(localStorage.getItem("userRole") || "alumno");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const data = await httpClient.get("/auth/profile");
      setUserData(data);
      setEditData({
        nombre: data.nombre || "",
        usuario: data.usuario || "",
        habilidades: (data.habilidades || []).join(", "),
        intereses: (data.intereses || []).join(", "),
      });
    } catch (err) {
      console.error("Error cargando perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData.nombre || !editData.usuario) { alert("Nombre y usuario son obligatorios"); return; }
    setSaving(true);
    try {
      const updated = await httpClient.put("/auth/update-profile", {
        nombre: editData.nombre.trim(),
        usuario: editData.usuario.trim(),
        habilidades: editData.habilidades.split(",").map(h => h.trim()).filter(Boolean),
        intereses: editData.intereses.split(",").map(i => i.trim()).filter(Boolean),
      });
      setUserData(updated);
      localStorage.setItem("userName", updated.nombre);
      setShowEditModal(false);
      alert("Perfil actualizado correctamente");
    } catch (err) {
      alert(err.message || "Error al actualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="home-container"><p style={{ padding: "2rem" }}>Cargando perfil...</p></div>;
  if (!userData) return <div className="home-container"><p style={{ padding: "2rem" }}>Error al cargar perfil.</p></div>;

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.usuario}`;

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        <main className="home-content">
          <GlobalHeader />
          
          <div className="estado-mentor-pill" style={{ marginBottom: "2rem", display: "inline-flex", alignItems: "center" }}>
            <span>{rol === "mentor" ? "Modo Enseñanza" : "Modo Aprendizaje"}</span>
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
                  <span className={`perfil-rol-badge ${rol}`}>{rol === "mentor" ? "Mentor" : "Aprendiz"}</span>
                </div>
                <h3 className="perfil-usuario">@{userData.usuario}</h3>
                <p className="perfil-bio">{userData.correo}</p>
              </div>
              <div className="perfil-actions">
                <button className="primary-btn-neon-s edit-btn" onClick={() => setShowEditModal(true)}>
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
              {userData.habilidades && userData.habilidades.length > 0
                ? userData.habilidades.map((hab, i) => <SkillTag key={i} nombre={hab} nivel="—" color="#00ffff" />)
                : <p>No hay habilidades registradas.</p>}
            </div>

            {userData.intereses && userData.intereses.length > 0 && (
              <>
                <h2 className="section-subtitle-neon">Intereses</h2>
                <div className="neon-card perfil-skills-card">
                  {userData.intereses.map((int, i) => <SkillTag key={i} nombre={int} nivel="—" color="#ff00ff" />)}
                </div>
              </>
            )}
          </section>
        </main>
      </div>

      {showEditModal && (
        <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#0d0d1a", border:"1px solid #00ffff", borderRadius:"14px", padding:"2rem", width:"400px", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ color:"#00ffff", margin:0 }}>Editar perfil</h3>
              <X size={20} style={{ cursor:"pointer", color:"#aaa" }} onClick={() => setShowEditModal(false)} />
            </div>
            {[
              { label: "Nombre", key: "nombre" },
              { label: "Usuario", key: "usuario" },
              { label: "Habilidades (separadas por coma)", key: "habilidades", placeholder: "React, Python..." },
              { label: "Intereses (separados por coma)", key: "intereses", placeholder: "IA, Diseño..." },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={{ color:"#aaa", fontSize:"0.85rem", marginBottom:"4px", display:"block" }}>{label}</label>
                <input type="text" placeholder={placeholder || label} value={editData[key]}
                  onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                  style={{ background:"#1a1a2e", border:"1px solid #333", borderRadius:"8px", padding:"0.65rem 1rem", color:"#fff", width:"100%", fontSize:"0.95rem", boxSizing:"border-box" }} />
              </div>
            ))}
            <div style={{ display:"flex", gap:"1rem", marginTop:"0.5rem" }}>
              <button className="primary-btn-neon-s" onClick={handleSave} disabled={saving}>
                <Check size={14} style={{ marginRight:"6px" }} />{saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button className="danger-btn-neon-s" onClick={() => setShowEditModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
