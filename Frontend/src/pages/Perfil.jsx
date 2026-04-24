import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PerfilStatCard from "../components/PerfilStatCard";
import SkillTag from "../components/SkillTag";
import Notificaciones from "../components/Notificaciones";
import GlobalHeader from "../components/GlobalHeader";
import { User, Edit3, Star, Clock, Video, Award, BookOpen, X, Check, Settings, Shield, Trash2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { httpClient } from "../services/httpClient";
import { fetchMySkills, fetchSkills, assignSkills } from "../services/skillService";
import "../Styles/Home.css";
import "../Styles/Perfil.css";
import "../Styles/Configuracion.css";
import "../Styles/Configuracion.css";

function Perfil() {
  const [rol] = useState(localStorage.getItem("userRole") || "alumno");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [createdSkills, setCreatedSkills] = useState([]);
  // Config states from Configuracion
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ passwordActual: "", passwordNueva: "", confirmar: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Habilidades
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [savingSkills, setSavingSkills] = useState(false);
  const [activeTab, setActiveTab] = useState("mis-skills");

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

      if (rol === "mentor") {
        const [mySkills, catalog] = await Promise.all([
          fetchMySkills(),
          fetchSkills()
        ]);
        setCreatedSkills(mySkills);
        setAllSkills(catalog);
        setSelectedSkills(mySkills.map(s => s.id || s._id));
      }
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

  // Config handlers from Configuracion
  const handleChangePassword = async () => {
    if (!passwordData.passwordActual || !passwordData.passwordNueva || !passwordData.confirmar) { alert("Completa todos los campos"); return; }
    if (passwordData.passwordNueva !== passwordData.confirmar) { alert("Las contraseñas nuevas no coinciden"); return; }
    setPasswordLoading(true);
    try {
      await httpClient.put("/auth/change-password", { passwordActual: passwordData.passwordActual, passwordNueva: passwordData.passwordNueva });
      alert("Contraseña actualizada correctamente");
      setShowPasswordModal(false);
      setPasswordData({ passwordActual: "", passwordNueva: "", confirmar: "" });
    } catch (err) { alert(err.message || "Error al cambiar contraseña"); }
    finally { setPasswordLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { alert("Ingresa tu contraseña para confirmar"); return; }
    if (!window.confirm("¿Estás seguro? Esta acción es irreversible.")) return;
    setDeleteLoading(true);
    try {
      await httpClient.delete("/auth/delete-account", { body: JSON.stringify({ password: deletePassword }), headers: { "Content-Type": "application/json" } });
      localStorage.removeItem('userRole'); // from logout
      alert("Cuenta eliminada"); 
      navigate("/login");
    } catch (err) { alert(err.message || "Error al eliminar cuenta"); }
    finally { setDeleteLoading(false); }
  };

  const handleToggleSkill = (skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const handleSaveSkills = async () => {
    setSavingSkills(true);
    try {
      await assignSkills(selectedSkills);
      const updatedMySkills = await fetchMySkills();
      setCreatedSkills(updatedMySkills);
      alert("Especialidades actualizadas correctamente");
    } catch (err) {
      alert("Error al actualizar especialidades");
    } finally {
      setSavingSkills(false);
    }
  };

  const inputStyle = { background:"#1a1a2e", border:"1px solid #333", borderRadius:"8px", padding:"0.7rem 2.8rem 0.7rem 1rem", color:"#fff", width:"100%", fontSize:"0.95rem", boxSizing:"border-box" };

  if (loading) return <div className="home-container"><p style={{ padding: "2rem" }}>...</p></div>;
  if (!userData) return <div className="home-container"><p style={{ padding: "2rem" }}>...</p></div>;

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.usuario}`;

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        <main className="home-content">
          <GlobalHeader />
          
          <div className="estado-mentor-pill" style={{ marginBottom: "2rem" }}>
            <span>{rol === "mentor" ? "Modo Enseñanza" : "Modo Aprendizaje"}</span>
          </div>

          {/* Profile Header */}
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

            {/* Skills: Solo para Aprendices */}
            {rol !== "mentor" && (
              <>
                <h2 className="section-subtitle-neon">Habilidades que estás aprendiendo</h2>
                <div className="neon-card perfil-skills-card">
                  {userData.habilidades && userData.habilidades.length > 0
                    ? userData.habilidades.map((hab, i) => <SkillTag key={i} nombre={hab} nivel="—" color="#00ffff" />)
                    : <p>No hay habilidades registradas.</p>}
                </div>
              </>
            )}

            {/* Habilidades: Solo para Mentores (Catálogo Global) */}
            {rol === "mentor" && (
              <>
                <div className="perfil-skills-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h2 className="section-subtitle-neon" style={{ margin: 0 }}>Gestión de Especialidades</h2>
                  <div className="skills-tab-switcher">
                    <button className={`tab-btn ${activeTab === "mis-skills" ? "active" : ""}`} onClick={() => setActiveTab("mis-skills")}>Mis Habilidades</button>
                    <button className={`tab-btn ${activeTab === "catalogo" ? "active" : ""}`} onClick={() => setActiveTab("catalogo")}>Catálogo Global</button>
                  </div>
                </div>

                <div className="neon-card perfil-skills-card" style={{ minHeight: "150px" }}>
                  {activeTab === "mis-skills" ? (
                    <div style={{ width: "100%" }}>
                      {createdSkills.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {createdSkills.map((skill, i) => (
                            <SkillTag key={i} nombre={skill.nombre} nivel={skill.nivel || "Pro"} color="#ff00ff" />
                          ))}
                        </div>
                      ) : (
                        <p>No tienes especialidades asignadas. Ve al catálogo para elegir las tuyas.</p>
                      )}
                    </div>
                  ) : (
                    <div style={{ width: "100%" }}>
                      <p style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "1rem" }}>Selecciona las habilidades que dominas para poder crear salas sobre ellas:</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "1.5rem" }}>
                        {allSkills.map((skill) => {
                          const isSelected = selectedSkills.includes(skill.id || skill._id);
                          return (
                            <div 
                              key={skill.id || skill._id} 
                              onClick={() => handleToggleSkill(skill.id || skill._id)}
                              style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "20px",
                                border: isSelected ? "1px solid #ff00ff" : "1px solid #333",
                                background: isSelected ? "rgba(255, 0, 255, 0.1)" : "transparent",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                color: isSelected ? "#ff00ff" : "#ccc",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                boxShadow: isSelected ? "0 0 10px rgba(255, 0, 255, 0.3)" : "none"
                              }}
                            >
                              {skill.nombre}
                              {isSelected && <Check size={14} />}
                            </div>
                          );
                        })}
                      </div>
                      <button 
                        className="primary-btn-neon-s" 
                        onClick={handleSaveSkills} 
                        disabled={savingSkills}
                        style={{ width: "fit-content" }}
                      >
                        <Check size={16} style={{ marginRight: "8px" }} />
                        {savingSkills ? "Guardando..." : "Guardar Especialidades"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {userData.intereses && userData.intereses.length > 0 && (
              <>
                <h2 className="section-subtitle-neon">Intereses</h2>
                <div className="neon-card perfil-skills-card">
                  {userData.intereses.map((int, i) => <SkillTag key={i} nombre={int} nivel="—" color="#ff00ff" />)}
                </div>
              </>
            )}

            {/* Config Sections from Configuracion */}
            <section className="configuracion-section">
              <div className="config-list-section" style={{ marginTop: "1rem" }}>
                <h3 className="section-subtitle"><Settings size={20} className="section-icon" /> Preferencias de la aplicación</h3>
                <div className="neon-card config-list-container">
                  {rol !== "mentor" && (
                    <div className="config-list-item">
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#00ff00", boxShadow: "0 0 8px #00ff00" }}></span>
                        <span>Notificaciones</span>
                      </div>
                      <button className="primary-btn-neon-s" style={{ background: "transparent", border: "1px solid #00ff00", color: "#00ff00", padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                        Desactivar
                      </button>
                    </div>
                  )}
                  <div className="config-list-item">
                    <span>Modo de visualización</span>
                    <select className="config-select" onChange={(e) => setTheme(e.target.value)} value={theme}>
                      <option value="neon">Neón Cyberspace</option>
                      <option value="classic">Aura Clásico</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="config-list-section">
                <h3 className="section-subtitle"><Shield size={20} className="section-icon" /> Cuenta y Seguridad</h3>
                <div className="neon-card config-list-container">
                  <div className="config-list-item">
                    <span>Cambiar contraseña</span>
                    <button className="primary-btn-neon-s" onClick={() => setShowPasswordModal(true)}>
                      <RefreshCw size={14} style={{ marginRight:"8px" }} /> Actualizar
                    </button>
                  </div>
                  <div className="config-list-item danger-zone">
                    <span>Eliminar cuenta definitivamente</span>
                    <button className="danger-btn-neon-s" onClick={() => setShowDeleteModal(true)}>
                      <Trash2 size={14} style={{ marginRight:"8px" }} /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#0d0d1a", border:"1px solid #00ffff", borderRadius:"14px", padding:"2rem", width:"400px", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ color:"#00ffff", margin:0 }}>...</h3>
              <X size={20} style={{ cursor:"pointer", color:"#aaa" }} onClick={() => setShowEditModal(false)} />
            </div>
            {/* ... edit fields ... */}
            <div style={{ display:"flex", gap:"1rem", marginTop:"0.5rem" }}>
              <button className="primary-btn-neon-s" onClick={handleSave} disabled={saving}>
                <Check size={14} style={{ marginRight:"6px" }} />{saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button className="danger-btn-neon-s" onClick={() => setShowEditModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#0d0d1a", border:"1px solid #00ffff", borderRadius:"12px", padding:"2rem", minWidth:"340px", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <h3 style={{ color:"#00ffff", margin:0 }}>...</h3>
            <input type="password" placeholder="Contraseña actual" value={passwordData.passwordActual}
              onChange={(e) => setPasswordData({ ...passwordData, passwordActual: e.target.value })}
              style={inputStyle} />
            <div style={{ position:"relative" }}>
              <input type={showNueva ? "text" : "password"} placeholder="Nueva contraseña" value={passwordData.passwordNueva}
                onChange={(e) => setPasswordData({ ...passwordData, passwordNueva: e.target.value })} style={inputStyle} />
              <span onClick={() => setShowNueva(!showNueva)} style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)", cursor:"pointer", color:"#aaa" }}>
                {showNueva ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            <div style={{ position:"relative" }}>
              <input type={showConfirmar ? "text" : "password"} placeholder="Confirmar nueva contraseña" value={passwordData.confirmar}
                onChange={(e) => setPasswordData({ ...passwordData, confirmar: e.target.value })} style={inputStyle} />
              <span onClick={() => setShowConfirmar(!showConfirmar)} style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)", cursor:"pointer", color:"#aaa" }}>
                {showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            <div style={{ display:"flex", gap:"1rem", marginTop:"0.5rem" }}>
              <button className="primary-btn-neon-s" onClick={handleChangePassword} disabled={passwordLoading}>
                {passwordLoading ? "Guardando..." : "Guardar"}
              </button>
              <button className="danger-btn-neon-s" onClick={() => setShowPasswordModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#0d0d1a", border:"1px solid #ff00ff", borderRadius:"12px", padding:"2rem", minWidth:"340px", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <h3 style={{ color:"#ff00ff", margin:0 }}>...</h3>
            <p style={{ color:"#ccc", margin:0 }}>...</p>
            <input type="password" placeholder="Tu contraseña" value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              style={inputStyle} />
            <div style={{ display:"flex", gap:"1rem", marginTop:"0.5rem" }}>
              <button className="danger-btn-neon-s" onClick={handleDeleteAccount} disabled={deleteLoading}>
                {deleteLoading ? "Eliminando..." : "Confirmar eliminación"}
              </button>
              <button className="primary-btn-neon-s" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;

