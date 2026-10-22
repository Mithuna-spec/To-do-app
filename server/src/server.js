/**
 * server.js — Entry point. Connects DB then starts listening.
 */
import app from './app.js'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'

async function start() {
  await connectDB()

  app.listen(env.PORT, () => {
    console.log(`[Server] TaskFlow API running on port ${env.PORT} (${env.NODE_ENV})`)
  })
}

start()
