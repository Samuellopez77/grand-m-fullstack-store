// Express error-handling middleware must take exactly 4 args (err, req, res, next)
// for Express to recognize it as an error handler.
export default function errorHandler(err, req, res, _next) {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
}