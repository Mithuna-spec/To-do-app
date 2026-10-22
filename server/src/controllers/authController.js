/**
 * controllers/authController.js
 */
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { env } from '../config/env.js'

function signToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
}

function setTokenCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days
    path: '/',
  })
}

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, passwordHash })

    const token = signToken(user._id)
    setTokenCookie(res, token)

    return res.status(201).json({
      user: user.toJSON(),
      token,   // Also in body so frontend can store if needed
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = signToken(user._id)
    setTokenCookie(res, token)

    return res.json({
      user: user.toJSON(),
      token,
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/logout
export async function logout(req, res) {
  res.clearCookie('token', { path: '/' })
  return res.json({ message: 'Logged out' })
}

// GET /api/auth/me
export async function getMe(req, res) {
  return res.json({ user: req.user.toJSON() })
}
