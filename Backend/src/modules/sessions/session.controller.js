const { getHistorialUsuario, getSesionDeSala } = require('./session.service');

const getHistorial = (req, res) => {
  try {
    const userId = req.user.id;
    const historial = getHistorialUsuario(userId);
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSesion = (req, res) => {
  try {
    const { roomId } = req.params;
    const sesion = getSesionDeSala(roomId);
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.json(sesion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getHistorial, getSesion };
