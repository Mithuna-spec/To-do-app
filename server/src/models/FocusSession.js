/**
 * models/FocusSession.js
 * Mongoose schema for focus timer sessions.
 */
import mongoose from 'mongoose'

const VALID_STATUSES = ['active', 'paused', 'completed', 'abandoned']

const focusSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    plannedDurationMinutes: {
      type: Number,
      required: true,
      min: [1, 'Planned duration must be at least 1 minute'],
      default: 25,
    },
    actualDurationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: 'active',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    pausedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

focusSessionSchema.index({ userId: 1, createdAt: -1 })

export const FocusSession = mongoose.model('FocusSession', focusSessionSchema)
