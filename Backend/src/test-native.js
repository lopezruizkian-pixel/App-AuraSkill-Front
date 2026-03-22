require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri =
  process.env.MONGO_URI?.trim() ||
  process.env.MONGO_URI_LOCAL?.trim() ||
  'mongodb://localhost:27017/AuraSkill';

const targetLabel = uri.startsWith('mongodb+srv://') ? 'Mongo Atlas' : 'MongoDB local';

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
});

console.log(`[Native Test] Probando conexion con driver nativo hacia ${targetLabel}...`);
console.log('[Native Test] Timeout: 10 segundos\n');

const startTime = Date.now();

client.connect()
  .then(async () => {
    const duration = Date.now() - startTime;
    await client.db('admin').command({ ping: 1 });
    console.log(`[Native Test] Conexion exitosa en ${duration}ms`);
    console.log('[Native Test] Base de datos objetivo: AuraSkill');
    await client.close();
    process.exit(0);
  })
  .catch(async (err) => {
    const duration = Date.now() - startTime;
    console.error(`[Native Test] Error despues de ${duration}ms`);
    console.error('[Native Test] Codigo:', err.code);
    console.error('[Native Test] Mensaje:', err.message);
    try {
      await client.close();
    } catch (closeError) {
      // Ignorar errores secundarios de cierre
    }
    process.exit(1);
  });
