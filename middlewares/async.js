/**
 * Middleware to wrap async controller functions and catch errors,
 * passing them to the next error handling middleware.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
