/**
 * Generic middleware to validate request data against a Zod schema.
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Collect all error messages
    const message = result.error.errors.map(err => err.message).join(', ');
    
    // Pass to the global error handler with a 400 status
    const error = new Error(message);
    error.statusCode = 400;
    return next(error);
  }

  // Replace req.body with the sanitized/validated data
  req.body = result.data;
  next();
};

module.exports = validate;
