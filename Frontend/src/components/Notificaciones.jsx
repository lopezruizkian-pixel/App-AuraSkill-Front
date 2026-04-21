import { useState, useEffect, useRef } from "react";
import { Bell, BellOff, X, Video } from "lucide-react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000";

function Notificaciones() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [activas, setActivas] = useState(() =>
    localStorage.getItem("notificaciones") !== "false"
  );
  const ref = useRef(null);
  const socketRef = useRef(null);
  const vistasRef = useRef(new Set(JSON.parse(localStorage.getItem("notifs_vistas") || "[]")));

  // Escuchar cambios desde Configuracion
  useEffect(() => {
    const handleChanged = () => {
      const nuevo = localStorage.getItem("notificaciones") !== "false";
      setActivas(nuevo);
      if (!nuevo) { setNotifs([]); setUnread(0); }
    };
    window.addEventListener("notificaciones-changed", handleChanged);
    return () => window.removeEventListener("notificaciones-changed", handleChanged);
  }, []);

  // Conectar socket y escuchar evento de mentor activo
  useEffect(() => {
    if (!activas) {
      socketRef.current?.disconnect();
      return;
    }

    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("mentor_sala_activa", (data) => {
      const { roomId, roomNombre, mentorNombre, habilidad, mood } = data;

      // No mostrar si ya la vimos
      if (vistasRef.current.has(roomId)) return;

      const nuevaNotif = {
        id: `${roomId}-${Date.now()}`,
        titulo: `¡Sala activa: ${roomNombre}!`,
        descripcion: `${mentorNombre} está enseñando ${habilidad}`,
        mood: mood || "—",
        roomId,
      };

      setNotifs((prev) => [nuevaNotif, ...prev]);
      setUnread((prev) => prev + 1);
      vistasRef.current.add(roomId);
      localStorage.setItem("notifs_vistas", JSON.stringify([...vistasRef.current]));
    });

    return () => socket.disconnect();
  }, [activas]);

  // Cerrar al click afuera
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setOpen(!open);
    if (!open) setUnread(0);
  };

  const handleDismiss = (id) => setNotifs((prev) => prev.filter((n) => n.id !== id));
  const handleLimpiar = () => { setNotifs([]); setUnread(0); };

  if (!activas) {
    return (
      <div className="icon-action bell-icon" style={{ opacity: 0.4 }}>
        <BellOff size={24} />
      </div>
    );
  }

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
            <span style={{ color: "#aaa", fontSize: "0.8rem" }}>{notifs.length} nuevas</span>
          </div>

          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {notifs.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>
                No hay notificaciones nuevas
              </div>
            ) : (
              notifs.map((n) => (
                <div key={n.id} style={{
                  padding: "0.85rem 1.25rem", borderBottom: "1px solid #1a1a2e",
                  display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "#0d0d1a",
                }}>
                  <div style={{ marginTop: "2px", color: "#00ffff" }}>
                    <Video size={18} />
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
              <button onClick={handleLimpiar}
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
