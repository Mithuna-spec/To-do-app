/**
 * validators/taskValidator.js
 * Zod schemas for task create/update bodies.
 */
import { z } from 'zod'
import { validate } from './authValidator.js'

const CATEGORIES = ['Study', 'Coding', 'Personal', 'Other']
const PRIORITIES = ['Low', 'Medium', 'High']

const taskBase = z.object({
  title: z.string().min(1, 'Title is required').max(200).trim(),
  description: z.string().max(2000).trim().default(''),
  category: z.enum(CATEGORIES).default('Personal'),
  priority: z.enum(PRIORITIES).default('Medium'),
  importance: z.number().int().min(1).max(5).default(3),
  estimatedMinutes: z.number().int().min(1).default(30),
  dueDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dueDate must be YYYY-MM-DD')
    .nullable()
    .optional()
    .transform(v => v || null),
  completed: z.boolean().optional(),
})

export const createTaskSchema = taskBase

export const updateTaskSchema = taskBase.partial()

export const validateTask = validate(createTaskSchema)
export const validateTaskUpdate = validate(updateTaskSchema)
