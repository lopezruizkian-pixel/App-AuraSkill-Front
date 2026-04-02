require('dotenv').config();
const { MongoClient } = require('mongodb');
const { buildConnectionTargets } = require('./config/mongo-config');

async function testTarget(target) {
  const client = new MongoClient(target.uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`[Native Test] Probando conexion con driver nativo hacia ${target.label}...`);
  console.log('[Native Test] Timeout: 10 segundos\n');

  const startTime = Date.now();

  try {
    await client.connect();
    const duration = Date.now() - startTime;
    await client.db('admin').command({ ping: 1 });
    console.log(`[Native Test] Conexion exitosa en ${duration}ms`);
    console.log('[Native Test] Base de datos objetivo: AuraSkill');
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error(`[Native Test] Error despues de ${duration}ms`);
    console.error('[Native Test] Codigo:', err.code);
    console.error('[Native Test] Mensaje:', err.message);
    throw err;
  } finally {
    try {
      await client.close();
    } catch (closeError) {
      // Ignorar errores secundarios de cierre
    }
  }
}

async function run() {
  const targets = buildConnectionTargets();

  if (targets.length === 0) {
    throw new Error('No se encontro ninguna URI de MongoDB. Configura MONGO_URI o MONGO_URI_LOCAL.');
  }

  let lastError = null;

  for (const target of targets) {
    try {
      await testTarget(target);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('No fue posible conectar a MongoDB.');
}

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
