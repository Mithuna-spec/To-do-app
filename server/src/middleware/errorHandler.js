/**
 * middleware/errorHandler.js
 * Central error handler — hides stack traces in production.
 */
import { isProd } from '../config/env.js'

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ error: messages.join('. ') })
  }

  // Mongoose duplicate key (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    return res.status(409).json({ error: `${field} already in use` })
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Invalid ID format' })
  }

  const status = err.status || err.statusCode || 500
  const message = isProd && status === 500 ? 'Internal server error' : (err.message || 'Internal server error')

  if (status === 500) {
    console.error('[Error]', err)
  }

  return res.status(status).json({ error: message })
}
