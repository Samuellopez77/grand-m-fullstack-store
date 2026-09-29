// Express error-handling middleware must take exactly 4 args (err, req, res, next)
// for Express to recognize it as an error handler.
export default function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;
  if (status >= 500) {
    console.error(err.stack || err);
  }

  res.status(status).json({
    error: status >= 500 ? 'Internal Server Error' : err.message || 'Request failed',
  });
}