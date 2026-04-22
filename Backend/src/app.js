const express = require('express');
const cors = require('cors');
const authRoutes = require('./modules/auth/auth.routes');
const roomRoutes = require('./modules/rooms/room.routes');
const skillRoutes = require('./modules/skills/skill.routes');
const sessionRoutes = require('./modules/sessions/session.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck para Railway
app.get('/api', (req, res) => {
  res.send('API funcionando 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/sessions', sessionRoutes);

module.exports = app;