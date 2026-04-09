require('dotenv').config();
const mongoose = require('mongoose');
const { buildConnectionTargets, getMongoSettings } = require('./mongo-config');

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
  console.log(`[DB] Base de datos: ${conn.connection.name || conn.connection.db?.databaseName || 'desconocida'}`);
  console.log(`[DB] Host: ${conn.connection.host}`);

  return conn;
};

const connectDB = async () => {
  const { primaryUri, allowLocalFallback } = getMongoSettings();
  const targets = buildConnectionTargets();

  if (targets.length === 0) {
    throw new Error('No se encontro ninguna URI de MongoDB. Configura MONGO_URI o MONGO_URI_LOCAL.');
  }

  if (primaryUri) {
    console.log(
      `[DB] Estrategia de conexion: ${allowLocalFallback ? 'Atlas primero con fallback local' : 'Atlas primero sin fallback local'}`
    );
  } else {
    console.log('[DB] Estrategia de conexion: usando MongoDB local');
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
