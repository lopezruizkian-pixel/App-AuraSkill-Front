require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { buildConnectionTargets } = require('./config/mongo-config');

async function testTarget(target) {
  const client = new MongoClient(target.uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 10000,
  });

  try {
    console.log(`[DB Test] Intentando conectar a ${target.label}...`);
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log(`[DB Test] Conexion exitosa a ${target.label}`);
    console.log('[DB Test] Base de datos objetivo: AuraSkill');
  } finally {
    await client.close();
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
      console.error(`[DB Test] Error conectando a ${target.label}: ${error.message}`);
    }
  }

  throw lastError || new Error('No fue posible conectar a MongoDB.');
}

run().catch((error) => {
  console.error('[DB Test] Error de conexion:', error.message);
  process.exit(1);
});
