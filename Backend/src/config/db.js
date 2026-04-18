require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('[DB] Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('[DB] Error en PostgreSQL:', err.message);
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('[DB] Conexion exitosa a PostgreSQL');
    client.release();
  } catch (error) {
    console.error('[DB] Error conectando a PostgreSQL:', error.message);
    throw error;
  }
};

module.exports = { connectDB, pool };
