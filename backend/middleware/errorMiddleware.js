// middleware/errorMiddleware.js
function notFound(req, res, next) {
  res.status(404);
  res.json({ message: `Not Found - ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack
  });
}

module.exports = { notFound, errorHandler };