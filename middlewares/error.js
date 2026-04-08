const ErrorResponse = require('../utils/ErrorResponse');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err.stack || err.message);

  // Mongoose bad ObjectID
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  // Determine if we should send JSON or render a Page
  const isApiRequest = req.xhr || req.headers.accept.includes('application/json') || req.path.startsWith('/api') || req.path === '/save-token';

  if (isApiRequest) {
    return res.status(statusCode).json({
      success: false,
      message: message
    });
  }

  // Map common paths to their error views
  const viewMap = {
    '/login': 'login',
    '/register': 'register'
  };

  const view = viewMap[req.path] || 'error'; // Default to an 'error' or 'chat' view

  // For PUG views, we render the page with the error message
  res.status(statusCode).render(view, {
    error: message,
    user: req.user // Pass user if available
  });
};

module.exports = errorHandler;
