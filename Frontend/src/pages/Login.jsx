import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import mascotaImg from "../assets/mascota.png";
import "../Styles/Login.css";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(correo, password);

      // guardar token
      localStorage.setItem("token", data.token);

      // guardar rol si lo envía la API
      if (data.user?.rol) {
        localStorage.setItem("userRole", data.user.rol);
      }

      navigate("/home");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="split-screen-wrapper">
        
        <div className="mascota-side">
          <img src={mascotaImg} alt="Mascota Aura" className="mascota-img" />
        </div>

        <div className="login-box">
          <h2>Iniciar Sesión</h2>

          <div className="input-group">
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="primary-btn" onClick={handleLogin}>
            Iniciar Sesión
          </button>

          <div className="register-link">
            <p>
              ¿No tienes una cuenta? <br />
              <Link to="/registro">¡Regístrate ahora!</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;