/**
 * config/db.js
 * Mongoose connection with error handling and event logging.
 */
import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI)
    console.log(`[DB] Connected to MongoDB`)
  } catch (err) {
    console.error('[DB] Connection failed:', err.message)
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] Disconnected from MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('[DB] Error:', err.message)
})
