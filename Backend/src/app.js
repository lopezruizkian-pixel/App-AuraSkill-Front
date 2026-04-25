const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error.middleware');

const authRoutes = require('./modules/auth/auth.routes');
const roomRoutes = require('./modules/rooms/room.routes');
const skillRoutes = require('./modules/skills/skill.routes');
const sessionRoutes = require('./modules/sessions/session.routes');

const app = express();

// Seguridad de Headers
app.use(helmet());
app.use(cookieParser());

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:3000',
  'https://auraskills.vercel.app', // Frontend oficial
  process.env.FRONTEND_URL // Dominio dinámico en producción
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Healthcheck para Railway
app.get('/api', (req, res) => {
  res.send('API funcionando 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/sessions', sessionRoutes);

// Manejo de Errores Global (Debe ir al final)
app.use(errorHandler);

module.exports = app;