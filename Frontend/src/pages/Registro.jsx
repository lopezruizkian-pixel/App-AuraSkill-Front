import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import mascotaImg from "../assets/mascota.png";
import "../Styles/Registro.css";

function Registro() {
  const [rol, setRol] = useState("alumno");
  const navigate = useNavigate();

  const handleRegistro = () => {
    localStorage.setItem("userRole", rol);
    navigate("/home");
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
            <input type="text" placeholder="Ingresa tu nombre" />
          </div>

          <div className="input-group">
            <label>Usuario</label>
            <input type="text" placeholder="Crea un usuario" />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" placeholder="Crea una contraseña" />
          </div>

          <div className="role-section">
            <label className="role-title">Escoge tu Rol</label>
            <div className="role-options">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="rol" 
                  value="mentor" 
                  checked={rol === "mentor"}
                  onChange={(e) => setRol(e.target.value)}
                />
                <span>Mentor</span>
              </label>

              <label className="radio-label">
                <input 
                  type="radio" 
                  name="rol" 
                  value="alumno" 
                  checked={rol === "alumno"}
                  onChange={(e) => setRol(e.target.value)}
                />
                <span>Alumno</span>
              </label>
            </div>
          </div>

          {rol === "mentor" && (
            <div className="input-group skill-input-animate">
              <label>Habilidades</label>
              <input type="text" placeholder="Ejem: React, Python, UI/UX..." />
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