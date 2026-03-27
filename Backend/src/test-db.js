require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  process.env.MONGO_URI?.trim() ||
  process.env.MONGO_URI_LOCAL?.trim() ||
  'mongodb://localhost:27017/AuraSkill';

const targetLabel = uri.startsWith('mongodb+srv://') ? 'Mongo Atlas' : 'MongoDB local';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 10000,
});

async function run() {
  try {
    console.log(`[DB Test] Intentando conectar a ${targetLabel}...`);
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log(`[DB Test] Conexion exitosa a ${targetLabel}`);
    console.log('[DB Test] Base de datos objetivo: AuraSkill');
  } finally {
    await client.close();
  }
}

run().catch((error) => {
  console.error('[DB Test] Error de conexion:', error.message);
  process.exit(1);
});
