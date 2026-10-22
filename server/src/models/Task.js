/**
 * models/Task.js
 * Mongoose schema for user tasks.
 */
import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title must be 200 characters or fewer'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Description must be 2000 characters or fewer'],
    },
    category: {
      type: String,
      enum: ['Study', 'Coding', 'Personal', 'Other'],
      default: 'Personal',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    importance: {
      type: Number,
      min: [1, 'Importance must be at least 1'],
      max: [5, 'Importance must be at most 5'],
      default: 3,
    },
    estimatedMinutes: {
      type: Number,
      min: [1, 'Estimated time must be at least 1 minute'],
      default: 30,
    },
    dueDate: {
      type: String,   // Stored as YYYY-MM-DD string for timezone-safe comparison
      default: null,
      validate: {
        validator: v => !v || /^\d{4}-\d{2}-\d{2}$/.test(v),
        message: 'dueDate must be in YYYY-MM-DD format',
      },
    },
    completed: {
      type: Boolean,
      default: false,
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

// Compound index for efficient user-scoped queries
taskSchema.index({ userId: 1, createdAt: -1 })
taskSchema.index({ userId: 1, dueDate: 1 })

export const Task = mongoose.model('Task', taskSchema)
