import PrimaryButton from "../components/PrimaryButton"
import "../Styles/Landing.css"

function Landing() {
  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1 className="hero-logo-text">
          AURA <span className="hero-skill-text">SKILL</span>
        </h1>
        <p className="hero-subtitle">Conecta, Aprende, Evoluciona</p>
      </div>

      <div className="bottom-content">
        <div className="cards-section">
          <div className="info-card">
            <h3>¿Quiénes somos?</h3>
            <p>
              Somos una plataforma que conecta mentores y alumnos
              mediante tecnología en tiempo real.
            </p>
          </div>

          <div className="info-card">
            <h3>¿Qué es AuraSkill?</h3>
            <p>
              Es una app web donde se crean salas interactivas
              para compartir conocimiento dinámicamente.
            </p>
          </div>

          <div className="info-card">
            <h3>Redes Sociales</h3>
            <p>
              Síguenos para conocer nuevas funcionalidades
              y eventos especiales.
            </p>
          </div>
        </div>

        <div className="landing-button-container">
          <PrimaryButton 
            text="¡Comienza Ahora!"
            to="/login"
            className="landing-btn-action" 
          />
        </div>
      </div>

    </div>
  )
}

export default Landing ;
