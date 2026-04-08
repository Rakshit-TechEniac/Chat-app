const { z } = require('zod');

/**
 * Zod schemas for User-related data validation.
 */

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Please add a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

const loginSchema = z.object({
  email: z.string().email('Please add a valid email'),
  password: z.string().min(1, 'Password is required')
});

const fcmTokenSchema = z.object({
  token: z.string().min(1, 'FCM Token is required')
});

module.exports = {
  registerSchema,
  loginSchema,
  fcmTokenSchema
};
