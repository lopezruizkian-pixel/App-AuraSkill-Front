import { useState, useEffect, useRef } from "react";
import { Bell, X, BookOpen, Video } from "lucide-react";
import { fetchActiveRooms } from "../services/roomService";

function Notificaciones() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    loadNotifs();
    // Actualizar cada 30 segundos
    const interval = setInterval(loadNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const loadNotifs = async () => {
    try {
      const rooms = await fetchActiveRooms();
      const nuevas = rooms.map((r) => ({
        id: r.id,
        tipo: "sala",
        titulo: `Sala disponible: ${r.nombre}`,
        descripcion: `${r.mentor_nombre} está enseñando ${r.habilidad}`,
        leida: false,
        tiempo: "Ahora",
      }));
      setNotifs(nuevas);
      setUnread(nuevas.length);
    } catch (err) {
      console.error("Error cargando notificaciones:", err);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open) setUnread(0);
  };

  const handleDismiss = (id) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div ref={ref} className="notifications-root">
      <div className="header-icon-button bell-icon" onClick={handleOpen}>
        <Bell size={24} />
        {unread > 0 && <span className="notification-dot">{unread}</span>}
      </div>

      {open && (
        <div className="notifications-panel">
          <div className="notifications-panel-header">
            <h4>Notificaciones</h4>
            <span>{notifs.length} activas</span>
          </div>

          <div className="notifications-panel-body">
            {notifs.length === 0 ? (
              <div className="notifications-empty">No hay notificaciones</div>
            ) : (
              notifs.map((n) => (
                <div key={n.id} className="notifications-item">
                  <div className="notifications-item-icon">
                    {n.tipo === "sala" ? <Video size={18} /> : <BookOpen size={18} />}
                  </div>
                  <div className="notifications-item-copy">
                    <p className="notifications-item-title">{n.titulo}</p>
                    <p className="notifications-item-description">{n.descripcion}</p>
                  </div>
                  <button className="notifications-dismiss" onClick={() => handleDismiss(n.id)} aria-label="Descartar notificacion">
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {notifs.length > 0 && (
            <div className="notifications-panel-footer">
              <button className="notifications-clear" onClick={() => setNotifs([])}>
                Limpiar todas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notificaciones;
