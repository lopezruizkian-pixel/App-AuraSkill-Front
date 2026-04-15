const { getUserSessionHistory, getRoomSessionState } = require('../../config/socket');

const getHistorialUsuario = (userId) => {
  return getUserSessionHistory(userId);
};

const getSesionDeSala = (roomId) => {
  return getRoomSessionState(roomId);
};

module.exports = { getHistorialUsuario, getSesionDeSala };
