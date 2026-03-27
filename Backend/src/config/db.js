require('dotenv').config();
const mongoose = require('mongoose');

const DEFAULT_LOCAL_URI = 'mongodb://localhost:27017/AuraSkill';
const primaryUri = process.env.MONGO_URI?.trim();
const localFallbackUri = process.env.MONGO_URI_LOCAL?.trim() || DEFAULT_LOCAL_URI;
const allowLocalFallback = process.env.DB_FALLBACK_TO_LOCAL !== 'false';

const buildConnectionTargets = () => {
  const targets = [];

  if (primaryUri) {
    targets.push({
      label: primaryUri.startsWith('mongodb+srv://') ? 'Mongo Atlas' : 'MongoDB configurado',
      uri: primaryUri,
    });
  }

  if ((!primaryUri || allowLocalFallback) && localFallbackUri && localFallbackUri !== primaryUri) {
    targets.push({
      label: 'MongoDB local',
      uri: localFallbackUri,
    });
  }

  return targets;
};

const connectWithUri = async ({ uri, label }) => {
  console.log(`[DB] Intentando conectar a ${label}...`);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  console.log(`[DB] Conexion exitosa a ${label}`);
  console.log(`[DB] Base de datos: ${conn.connection.db.name}`);
  console.log(`[DB] Host: ${conn.connection.host}`);

  return conn;
};

const connectDB = async () => {
  const targets = buildConnectionTargets();

  if (targets.length === 0) {
    throw new Error('No se encontro ninguna URI de MongoDB. Configura MONGO_URI o MONGO_URI_LOCAL.');
  }

  let lastError = null;

  for (const target of targets) {
    try {
      return await connectWithUri(target);
    } catch (error) {
      lastError = error;
      console.error(`[DB] Error conectando a ${target.label}: ${error.message}`);

      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    }
  }

  throw lastError || new Error('No fue posible conectar a MongoDB.');
};

mongoose.connection.on('connected', () => {
  console.log('[DB] Mongoose conectado al servidor MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('[DB] Error en conexion Mongoose:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] Mongoose desconectado de MongoDB');
});

module.exports = connectDB;
