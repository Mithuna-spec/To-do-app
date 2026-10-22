/**
 * validators/authValidator.js
 * Zod schemas for auth request bodies.
 */
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80).trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
})

/** Middleware factory: validates req.body against a Zod schema */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message).join('. ')
      return res.status(400).json({ error: messages })
    }
    req.body = result.data  // Use parsed/coerced data
    next()
  }
}
