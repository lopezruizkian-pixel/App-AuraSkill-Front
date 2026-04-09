require('dotenv').config();

const DEFAULT_LOCAL_URI = 'mongodb://localhost:27017/AuraSkill';
const TRUTHY_VALUES = new Set(['1', 'true', 'yes', 'on']);

const readEnv = (name) => {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
};

const classifyMongoUri = (uri = '') => {
  if (!uri) return 'empty';
  if (uri.includes('atlas-sql') || uri.includes('.query.mongodb.net')) return 'atlas-sql';
  if (uri.startsWith('mongodb+srv://') || uri.includes('.mongodb.net')) return 'atlas';
  if (uri.startsWith('mongodb://localhost') || uri.startsWith('mongodb://127.0.0.1')) return 'local';
  if (uri.startsWith('mongodb://')) return 'mongo';
  return 'unknown';
};

const getMongoLabel = (uri) => {
  const kind = classifyMongoUri(uri);

  if (kind === 'atlas') return 'Mongo Atlas';
  if (kind === 'local') return 'MongoDB local';
  return 'MongoDB configurado';
};

const assertSupportedMongoUri = (uri, envName) => {
  if (classifyMongoUri(uri) !== 'atlas-sql') {
    return;
  }

  throw new Error(
    `[DB] ${envName} parece usar una cadena de Atlas SQL/Federated Database. ` +
      'Para el backend usa la URI de Drivers > Node.js en Atlas, normalmente con formato mongodb+srv://...'
  );
};

const parseFallbackFlag = (value, primaryUri) => {
  if (!value) {
    return !primaryUri;
  }

  return TRUTHY_VALUES.has(value.toLowerCase());
};

const getMongoSettings = () => {
  const primaryUri = readEnv('MONGO_URI');
  const localFallbackUri = readEnv('MONGO_URI_LOCAL') || DEFAULT_LOCAL_URI;
  const fallbackFlag = readEnv('DB_FALLBACK_TO_LOCAL');

  if (primaryUri) {
    assertSupportedMongoUri(primaryUri, 'MONGO_URI');
  }

  if (localFallbackUri) {
    assertSupportedMongoUri(localFallbackUri, 'MONGO_URI_LOCAL');
  }

  return {
    primaryUri,
    localFallbackUri,
    allowLocalFallback: parseFallbackFlag(fallbackFlag, primaryUri),
  };
};

const buildConnectionTargets = () => {
  const { primaryUri, localFallbackUri, allowLocalFallback } = getMongoSettings();
  const targets = [];

  if (primaryUri) {
    targets.push({
      label: getMongoLabel(primaryUri),
      uri: primaryUri,
      source: 'primary',
    });
  }

  if ((!primaryUri || allowLocalFallback) && localFallbackUri && localFallbackUri !== primaryUri) {
    targets.push({
      label: 'MongoDB local',
      uri: localFallbackUri,
      source: primaryUri ? 'fallback' : 'local-only',
    });
  }

  return targets;
};

module.exports = {
  DEFAULT_LOCAL_URI,
  buildConnectionTargets,
  classifyMongoUri,
  getMongoSettings,
};
