import { useNavigate, Link } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import mascotaImg from "../assets/mascota.png"; 
import "../Styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("userRole", "alumno");
    navigate("/home");
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
            <input type="text" placeholder="Usuario" />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Contraseña" />
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