/**
 * controllers/focusController.js
 * Focus session CRUD with validated state transitions.
 */
import { FocusSession } from '../models/FocusSession.js'
import { Task } from '../models/Task.js'
import mongoose from 'mongoose'

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

// GET /api/focus-sessions
export async function listSessions(req, res, next) {
  try {
    const sessions = await FocusSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('taskId', 'title category')
    return res.json({ sessions: sessions.map(s => s.toJSON()) })
  } catch (err) {
    next(err)
  }
}

// POST /api/focus-sessions
export async function startSession(req, res, next) {
  try {
    const { taskId, plannedDurationMinutes = 25 } = req.body

    if (!taskId || !isValidId(taskId)) {
      return res.status(400).json({ error: 'Valid taskId is required' })
    }
    if (plannedDurationMinutes < 1 || plannedDurationMinutes > 120) {
      return res.status(400).json({ error: 'Duration must be 1-120 minutes' })
    }

    // Verify task ownership
    const task = await Task.findOne({ _id: taskId, userId: req.user._id })
    if (!task) return res.status(404).json({ error: 'Task not found' })

    // Prevent starting while another session is active/paused
    const existing = await FocusSession.findOne({
      userId: req.user._id,
      status: { $in: ['active', 'paused'] },
    })
    if (existing) {
      return res.status(409).json({ error: 'A focus session is already in progress', sessionId: existing._id })
    }

    const session = await FocusSession.create({
      userId: req.user._id,
      taskId,
      plannedDurationMinutes,
      status: 'active',
      startedAt: new Date(),
    })

    return res.status(201).json({ session: session.toJSON() })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/focus-sessions/:id
export async function updateSession(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid session ID' })
    }

    const session = await FocusSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
    if (!session) return res.status(404).json({ error: 'Session not found' })

    const { action } = req.body
    const validActions = ['pause', 'resume', 'complete', 'abandon']
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: `action must be one of: ${validActions.join(', ')}` })
    }

    // State transition validation
    const allowed = {
      active:    ['pause', 'complete', 'abandon'],
      paused:    ['resume', 'complete', 'abandon'],
      completed: [],
      abandoned: [],
    }

    if (!allowed[session.status]?.includes(action)) {
      return res.status(400).json({
        error: `Cannot ${action} a session that is ${session.status}`,
      })
    }

    const now = new Date()

    if (action === 'pause') {
      // Calculate elapsed so far and accumulate
      if (session.startedAt) {
        const pauseRef = session.pausedAt || session.startedAt
        const elapsed = Math.round((now - new Date(session.startedAt)) / 1000)
        // Keep cumulative — use actualDurationSeconds as running total up to this point
        session.actualDurationSeconds = elapsed
      }
      session.status = 'paused'
      session.pausedAt = now
    }

    if (action === 'resume') {
      // Shift startedAt forward so elapsed calc stays accurate
      // The actual duration so far is stored; new reference point = now
      session.status = 'active'
      session.startedAt = new Date(now.getTime() - session.actualDurationSeconds * 1000)
      session.pausedAt = null
    }

    if (action === 'complete' || action === 'abandon') {
      if (session.status === 'active' && session.startedAt) {
        session.actualDurationSeconds = Math.round((now - new Date(session.startedAt)) / 1000)
      }
      // If paused, actualDurationSeconds is already set from the pause action
      session.status = action === 'complete' ? 'completed' : 'abandoned'
      session.completedAt = now
    }

    await session.save()
    return res.json({ session: session.toJSON() })
  } catch (err) {
    next(err)
  }
}
