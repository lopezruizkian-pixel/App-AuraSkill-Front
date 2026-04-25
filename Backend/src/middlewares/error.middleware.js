/**
 * Middleware global para manejo de errores.
 * Captura cualquier error lanzado en los controladores y devuelve una respuesta estandarizada.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);

  // En desarrollo mostramos más info, en producción ocultamos detalles técnicos
  const isProd = process.env.NODE_ENV === 'production';

  const status = err.status || 500;
  const message = (isProd && status === 500) 
    ? 'Lo sentimos, ocurrió un error interno en el servidor.' 
    : err.message;

  res.status(status).json({
    error: message,
    status
  });
};

module.exports = errorHandler;
