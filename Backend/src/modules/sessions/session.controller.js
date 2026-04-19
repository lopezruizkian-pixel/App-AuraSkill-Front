const { getHistorialUsuario, getSesionActiva } = require('./session.service');

const getHistorial = async (req, res) => {
  try {
    const historial = await getHistorialUsuario(req.user.id);
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSesion = async (req, res) => {
  try {
    const sesion = await getSesionActiva(req.params.roomId);
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.json(sesion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getHistorial, getSesion };
