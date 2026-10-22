/**
 * middleware/auth.js
 * JWT authentication middleware.
 * Reads token from HttpOnly cookie (preferred) or Authorization header.
 */
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    // 1. Prefer HttpOnly cookie
    let token = req.cookies?.token

    // 2. Fall back to Authorization header (Bearer scheme)
    if (!token) {
      const header = req.headers.authorization || ''
      if (header.startsWith('Bearer ')) {
        token = header.slice(7)
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    let payload
    try {
      payload = jwt.verify(token, env.JWT_SECRET)
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session expired, please log in again' })
      }
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Attach user (without passwordHash)
    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}
