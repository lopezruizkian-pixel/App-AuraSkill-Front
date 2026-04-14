import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader } from "lucide-react";
import mascotaImg from "../assets/mascota.png";
import "../Styles/Login.css";
import { loginUser } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { validateEmail } from "../services/validation";

function Login() {
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useToast();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!validateEmail(correo)) {
      newErrors.correo = "El correo no es válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser(correo, password);

      // Guardar datos del usuario
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user?.id) {
        localStorage.setItem("userId", data.user.id);
      }

      if (data.user?.nombre) {
        localStorage.setItem("userName", data.user.nombre);
      }

      if (data.user?.rol) {
        localStorage.setItem("userRole", data.user.rol);
      }

      showSuccess("¡Sesión iniciada correctamente!");
      setTimeout(() => navigate("/home"), 500);

    } catch (err) {
      const errorMessage = err.message || "Error al iniciar sesión";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
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

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (errors.correo) setErrors({ ...errors, correo: "" });
                }}
                disabled={isLoading}
                className={errors.correo ? "input-error" : ""}
              />
              {errors.correo && <span className="error-text">{errors.correo}</span>}
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                disabled={isLoading}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button 
              className="primary-btn" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

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