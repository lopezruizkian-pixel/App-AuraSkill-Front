import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import Notificaciones from "./Notificaciones";
import "../Styles/GlobalHeader.css";

const titles = {
  "/home": "Dashboard",
  "/buscar-habilidades": "Explorar Habilidades",
  "/mentores": "Mentores Disponibles",
  "/historial": "Historial de Sesiones",
  "/salas-activas": "Salas en Vivo",
  "/configuracion": "Configuracion",
  "/perfil": "Mi Perfil",
};

function GlobalHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    if (location.pathname === "/salas-activas") {
      const params = new URLSearchParams(location.search);
      const habilidad = params.get("habilidad");
      return habilidad ? `Salas de ${habilidad}` : "Salas en Vivo";
    }
    return titles[location.pathname] || "AuraSkill";
  };

  return (
    <header className="global-header">
      <h1 className="page-title">{getTitle()}</h1>
      <div className="header-actions-right">
        <Notificaciones />
        <div
          className="header-icon-button user-icon"
          onClick={() => navigate("/perfil")}
          style={{ cursor: "pointer" }}
        >
          <User size={24} />
        </div>
      </div>
    </header>
  );
}

export default GlobalHeader;
