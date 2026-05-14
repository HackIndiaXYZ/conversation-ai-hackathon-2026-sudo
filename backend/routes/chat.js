import express from 'express'
import { getDb, ObjectId } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import ollamaService from '../services/ollamaService.js'

const router = express.Router()
const chats = () => getDb().collection('chats')

const getUserObjectId = (userId) => {
  if (userId === 'guest') return null
  return ObjectId.isValid(userId) ? new ObjectId(userId) : null
}

const getChatObjectId = (chatId) => ObjectId.isValid(chatId) ? new ObjectId(chatId) : null

// Default system prompt (fallback)
const DEFAULT_SYSTEM =
  'You are a friendly, expressive AI avatar assistant named Ava. Keep responses concise (2-4 sentences). Be warm, clear, and conversational. Show personality!'

/**
 * Health check endpoint for Ollama
 */
router.get('/health/ollama', async (req, res) => {
  try {
    const health = await ollamaService.checkOllamaHealth()
    res.json(health)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get available healthcare personas
 */
router.get('/personas', async (req, res) => {
  try {
    const personas = ollamaService.getAvailablePersonas()
    res.json({ personas })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Chat endpoint with Ollama phi3 integration
router.post('/chat', authenticate, async (req, res, next) => {
  try {
    const { messages, system, chatId, persona, temperature = 0.3, maxTokens = 150 } = req.body

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' })
    }

    // Validate persona if provided
    if (persona && !ollamaService.isValidPersona(persona)) {
      return res.status(400).json({
        error: 'Invalid persona',
        validPersonas: ollamaService.getAvailablePersonas().map(p => p.id)
      })
    }

    // Generate response using Ollama phi3
    const result = await ollamaService.generateChatResponse(messages, {
      system: system || DEFAULT_SYSTEM,
      persona: persona,
      temperature: temperature,
      maxTokens: maxTokens,
      stream: false
    })

    // Save message to database if chatId provided
    if (chatId) {
      const userId = getUserObjectId(req.user.userId)
      const chatObjectId = getChatObjectId(chatId)

      if (userId && chatObjectId) {
        const chat = await chats().findOne({ _id: chatObjectId, userId })
        if (chat) {
          await chats().updateOne(
            { _id: chatObjectId, userId },
            {
              $push: {
                messages: {
                  $each: [
                    { role: 'user', content: messages[messages.length - 1].content, timestamp: new Date() },
                    { role: 'assistant', content: result.reply, emotion: result.emotion, timestamp: new Date() },
                  ],
                },
              },
              $set: { updatedAt: new Date() },
            }
          )
        }
      }
    }

    return res.json({
      reply: result.reply,
      emotion: result.emotion,
      provider: result.provider,
      persona: result.persona,
      usage: result.usage,
    })
  } catch (error) {
    console.error('[Chat Route Error]', error.message)

    if (error.message?.includes('Ollama')) {
      return res.status(503).json({
        error: 'Local AI service unavailable. Please ensure Ollama is running with: ollama run phi3',
      })
    }

    next(error)
  }
})

/**
 * Streaming chat endpoint for real-time avatar responses
 * Returns Server-Sent Events (SSE) stream
 */
router.post('/chat/stream', authenticate, async (req, res, next) => {
  try {
    const { messages, system, chatId, persona, temperature = 0.3, maxTokens = 150 } = req.body

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' })
    }

    // Validate persona
    if (persona && !ollamaService.isValidPersona(persona)) {
      return res.status(400).json({
        error: 'Invalid persona',
        validPersonas: ollamaService.getAvailablePersonas().map(p => p.id)
      })
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    let fullText = ''
    let emotion = 'neutral'

    // Stream the response
    await ollamaService.generateChatResponse(messages, {
      system: system || DEFAULT_SYSTEM,
      persona: persona,
      temperature: temperature,
      maxTokens: maxTokens,
      stream: true,
      onChunk: (chunk, accumulated) => {
        fullText = accumulated
        res.write(`data: ${JSON.stringify({ chunk, accumulated })}\n\n`)
      }
    })

    // Extract emotion from final text
    const emotionMatch = fullText.match(/\[emotion:(\w+)\]/i)
    emotion = emotionMatch ? emotionMatch[1].toLowerCase() : 'neutral'
    const cleanText = fullText.replace(/\[emotion:\w+\]/gi, '').trim()

    // Send final message with metadata
    res.write(`data: ${JSON.stringify({
      done: true,
      reply: cleanText,
      emotion: emotion,
      provider: 'ollama-phi3',
      persona: persona
    })}\n\n`)

    // Save to database if chatId provided
    if (chatId) {
      const userId = getUserObjectId(req.user.userId)
      const chatObjectId = getChatObjectId(chatId)

      if (userId && chatObjectId) {
        const chat = await chats().findOne({ _id: chatObjectId, userId })
        if (chat) {
          await chats().updateOne(
            { _id: chatObjectId, userId },
            {
              $push: {
                messages: {
                  $each: [
                    { role: 'user', content: messages[messages.length - 1].content, timestamp: new Date() },
                    { role: 'assistant', content: cleanText, emotion: emotion, timestamp: new Date() },
                  ],
                },
              },
              $set: { updatedAt: new Date() },
            }
          )
        }
      }
    }

    res.end()
  } catch (error) {
    console.error('[Chat Stream Error]', error.message)
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
    res.end()
  }
})

export default router
