import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Notificaciones from "../components/Notificaciones";
import GlobalHeader from "../components/GlobalHeader";
import { User, Settings, Shield, Trash2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { httpClient } from "../services/httpClient";
import { logoutUser } from "../services/authService";
import "../Styles/Home.css";
import "../Styles/BuscarHabilidades.css";
import "../Styles/Configuracion.css";

function Configuracion() {
  const [rol] = useState(localStorage.getItem("userRole") || "alumno");
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
      logoutUser(); alert("Cuenta eliminada"); navigate("/login");
    } catch (err) { alert(err.message || "Error al eliminar cuenta"); }
    finally { setDeleteLoading(false); }
  };

  const inputStyle = { background:"#1a1a2e", border:"1px solid #333", borderRadius:"8px", padding:"0.7rem 2.8rem 0.7rem 1rem", color:"#fff", width:"100%", fontSize:"0.95rem", boxSizing:"border-box" };

  return (
    <div className="home-container">
      <div className="home-main-layout">
        <Sidebar rol={rol} />
        <main className="home-content">
          <GlobalHeader />

          <section className="configuracion-section">
            {/* Título redundante eliminado */}
            <div className="config-list-section" style={{ marginTop: "1rem" }}>
              <h3 className="section-subtitle"><Settings size={20} className="section-icon" /> Preferencias de la aplicación</h3>
              <div className="neon-card config-list-container">
                <div className="config-list-item">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#00ff00", boxShadow: "0 0 8px #00ff00" }}></span>
                    <span>Notificaciones</span>
                  </div>
                  <button className="primary-btn-neon-s" style={{ background: "transparent", border: "1px solid #00ff00", color: "#00ff00", padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                    Desactivar
                  </button>
                </div>
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
              {/* Título redundante eliminado */}
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
        </main>
      </div>

      {showPasswordModal && (
        <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#0d0d1a", border:"1px solid #00ffff", borderRadius:"12px", padding:"2rem", minWidth:"340px", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <h3 style={{ color:"#00ffff", margin:0 }}>Cambiar contraseña</h3>
            <input type="password" placeholder="Contraseña actual" value={passwordData.passwordActual}
              onChange={(e) => setPasswordData({ ...passwordData, passwordActual: e.target.value })}
              style={{ ...inputStyle, paddingRight:"1rem" }} />
            <div style={{ position:"relative", width:"100%" }}>
              <input type={showNueva ? "text" : "password"} placeholder="Nueva contraseña" value={passwordData.passwordNueva}
                onChange={(e) => setPasswordData({ ...passwordData, passwordNueva: e.target.value })} style={inputStyle} />
              <span onClick={() => setShowNueva(!showNueva)} style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)", cursor:"pointer", color:"#aaa", display:"flex" }}>
                {showNueva ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            <div style={{ position:"relative", width:"100%" }}>
              <input type={showConfirmar ? "text" : "password"} placeholder="Confirmar nueva contraseña" value={passwordData.confirmar}
                onChange={(e) => setPasswordData({ ...passwordData, confirmar: e.target.value })} style={inputStyle} />
              <span onClick={() => setShowConfirmar(!showConfirmar)} style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)", cursor:"pointer", color:"#aaa", display:"flex" }}>
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

      {showDeleteModal && (
        <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#0d0d1a", border:"1px solid #ff00ff", borderRadius:"12px", padding:"2rem", minWidth:"340px", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <h3 style={{ color:"#ff00ff", margin:0 }}>⚠️ Eliminar cuenta</h3>
            <p style={{ color:"#ccc", margin:0 }}>Esta acción es irreversible. Ingresa tu contraseña para confirmar.</p>
            <input type="password" placeholder="Tu contraseña" value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              style={{ ...inputStyle, paddingRight:"1rem" }} />
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

export default Configuracion;
