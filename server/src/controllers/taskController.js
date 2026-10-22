/**
 * controllers/taskController.js
 * All task queries are scoped to req.user._id.
 */
import { Task } from '../models/Task.js'
import mongoose from 'mongoose'

// Validate ObjectId helper
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

// GET /api/tasks
export async function listTasks(req, res, next) {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 })
    return res.json({ tasks: tasks.map(t => t.toJSON()) })
  } catch (err) {
    next(err)
  }
}

// POST /api/tasks
export async function createTask(req, res, next) {
  try {
    const task = await Task.create({ ...req.body, userId: req.user._id })
    return res.status(201).json({ task: task.toJSON() })
  } catch (err) {
    next(err)
  }
}

// GET /api/tasks/:id
export async function getTask(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task ID' })
    }
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id })
    if (!task) return res.status(404).json({ error: 'Task not found' })
    return res.json({ task: task.toJSON() })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/tasks/:id
export async function updateTask(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task ID' })
    }
    // Prevent userId override via mass assignment
    const { userId, _id, ...updates } = req.body
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    )
    if (!task) return res.status(404).json({ error: 'Task not found' })
    return res.json({ task: task.toJSON() })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/tasks/:id/complete
export async function toggleComplete(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task ID' })
    }
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id })
    if (!task) return res.status(404).json({ error: 'Task not found' })

    task.completed = !task.completed
    await task.save()
    return res.json({ task: task.toJSON() })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/tasks/:id
export async function deleteTask(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task ID' })
    }
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!task) return res.status(404).json({ error: 'Task not found' })
    return res.json({ message: 'Task deleted' })
  } catch (err) {
    next(err)
  }
}
