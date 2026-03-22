const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initializeSocket } = require('./config/socket');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    const server = http.createServer(app);
    const io = initializeSocket(server);

    app.set('io', io);

    server.listen(PORT, () => {
      console.log(`[Server] AuraSkill API corriendo en puerto ${PORT}`);
      console.log(`[Server] WebSocket configurado en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('[Server] No se pudo iniciar el backend:', error.message);
    process.exit(1);
  }
}

startServer();
