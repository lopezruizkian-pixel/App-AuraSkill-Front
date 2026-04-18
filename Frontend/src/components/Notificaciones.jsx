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
        mood: r.mood || "—",
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
    <div ref={ref} style={{ position: "relative" }}>
      <div className="icon-action bell-icon" onClick={handleOpen} style={{ cursor: "pointer" }}>
        <Bell size={24} />
        {unread > 0 && <span className="notification-dot">{unread}</span>}
      </div>

      {open && (
        <div style={{
          position: "absolute", top: "3rem", right: 0, width: "320px",
          background: "#0d0d1a", border: "1px solid #00ffff", borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,255,255,0.2)", zIndex: 999, overflow: "hidden",
        }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1a1a2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ color: "#00ffff", margin: 0 }}>Notificaciones</h4>
            <span style={{ color: "#aaa", fontSize: "0.8rem" }}>{notifs.length} activas</span>
          </div>

          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {notifs.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>
                No hay notificaciones
              </div>
            ) : (
              notifs.map((n) => (
                <div key={n.id} style={{
                  padding: "0.85rem 1.25rem", borderBottom: "1px solid #1a1a2e",
                  display: "flex", gap: "0.75rem", alignItems: "flex-start",
                  background: "#0d0d1a", transition: "background 0.2s",
                }}>
                  <div style={{ marginTop: "2px", color: "#00ffff" }}>
                    {n.tipo === "sala" ? <Video size={18} /> : <BookOpen size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#fff", margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>{n.titulo}</p>
                    <p style={{ color: "#aaa", margin: "2px 0 0", fontSize: "0.8rem" }}>{n.descripcion}</p>
                    <p style={{ color: "#ff00ff", margin: "2px 0 0", fontSize: "0.75rem" }}>Mood: {n.mood}</p>
                  </div>
                  <X size={16} style={{ color: "#aaa", cursor: "pointer", flexShrink: 0 }}
                    onClick={() => handleDismiss(n.id)} />
                </div>
              ))
            )}
          </div>

          {notifs.length > 0 && (
            <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid #1a1a2e", textAlign: "center" }}>
              <button onClick={() => setNotifs([])}
                style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: "0.85rem" }}>
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
