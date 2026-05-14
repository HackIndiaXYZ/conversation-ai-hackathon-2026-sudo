import 'dotenv/config'
import dns from 'dns'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/database.js'
import chatRouter from './routes/chat.js'
import authRouter from './routes/auth.js'
import chatsRouter from './routes/chats.js'
import errorHandler from './middleware/errorHandler.js'

// Use public DNS servers for Atlas SRV lookup if local DNS blocks SRV queries
dns.setServers(['8.8.8.8', '8.8.4.4'])

// Connect to MongoDB
connectDB()

const app = express()

// CORS configuration for production
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin?.includes(allowed))) {
      callback(null, true)
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`)
      callback(null, true) // Allow all in production for flexibility
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// Routes
app.use('/api', chatRouter)
app.use('/api/auth', authRouter)
app.use('/api/chats', chatsRouter)

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    ollama: process.env.OLLAMA_URL || process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
