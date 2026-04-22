import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mascotaImg from "../assets/mascota.png";
import "../Styles/Registro.css";
import { registerUser } from "../services/authService";

function Registro() {
  const [rol, setRol] = useState("alumno");
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async () => {
    if (!nombre || !usuario || !correo || !password) {
      alert("Todos los campos son obligatorios");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const userData = {
        nombre,
        usuario,
        correo,
        password,
        rol,
        habilidades: rol === "mentor"
          ? habilidades.split(",").map((h) => h.trim()).filter(Boolean)
          : [],
      };
      await registerUser(userData);
      alert("Registro exitoso");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="registro-container">
      <div className="split-screen-wrapper">
        <div className="mascota-side">
          <img src={mascotaImg} alt="Mascota Aura" className="mascota-img" />
        </div>
        <div className="registro-box-extended">
          <div className="input-group">
            <label>Nombre</label>
            <input type="text" placeholder="Ingresa tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Usuario</label>
            <input type="text" placeholder="Elige un nombre de usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Correo</label>
            <input type="email" placeholder="Ingresa tu correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" placeholder="Crea una contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <input type="password" placeholder="Confirma tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <div className="role-section">
            <label className="role-title">Escoge tu Rol</label>
            <div className="role-options">
              <label className="radio-label">
                <input type="radio" name="rol" value="mentor" checked={rol === "mentor"} onChange={(e) => setRol(e.target.value)} />
                <span>Mentor</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="rol" value="alumno" checked={rol === "alumno"} onChange={(e) => setRol(e.target.value)} />
                <span>Alumno</span>
              </label>
            </div>
          </div>
          {rol === "mentor" && (
            <div className="input-group skill-input-animate">
              <label>Habilidades</label>
              <input type="text" placeholder="React, Python..." value={habilidades} onChange={(e) => setHabilidades(e.target.value)} />
            </div>
          )}
          <button className="primary-btn" onClick={handleRegistro}>
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Registro;
