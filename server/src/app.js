/**
 * app.js — Express application setup.
 * Separated from server.js so tests can import the app without listening.
 */

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import plannerRoutes from './routes/plannerRoutes.js'
import focusRoutes from './routes/focusRoutes.js'

const app = express()

// CORS configuration for local development
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ],
  credentials: true,
}))

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

// Rate-limit authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
})

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/planner', plannerRoutes)
app.use('/api/focus-sessions', focusRoutes)

// Error handler
app.use(errorHandler)

export default app