const { connectedUsers } = require('../config/socket');

const initializeMoodSocket = (io) => {

  io.on('connection', (socket) => {

    socket.on('updateMood', (data) => {
      const { userId, mood, roomId } = data;

      console.log(`[Mood] Usuario ${userId} cambió mood a: ${mood}`);

      const user = connectedUsers.get(socket.id);
      if (user) {
        user.mood = mood;
        connectedUsers.set(socket.id, user);
      }

      if (roomId) {
        io.to(roomId).emit('moodUpdated', { userId, mood });
      }

      socket.emit('moodConfirmed', { mood });
    });

    socket.on('getMood', () => {
      const user = connectedUsers.get(socket.id);
      socket.emit('currentMood', { mood: user?.mood || 'neutral' });
    });

  });

};

module.exports = { initializeMoodSocket };
