import { Anthropic } from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { OpenAI } from 'openai'

const anthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your-anthropic-api-key'
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== ''
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

/**
 * Generate response using Anthropic Claude
 */
async function generateWithClaude(messages, systemPrompt, options) {
  if (!anthropic) throw new Error('Anthropic API key not configured')
  
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: options.maxTokens || 150,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    temperature: options.temperature || 0.3,
  })

  return response.content[0].text
}

/**
 * Generate response using Google Gemini
 */
async function generateWithGemini(messages, systemPrompt, options) {
  if (!genAI) throw new Error('Gemini API key not configured')
  
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  const chat = model.startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      maxOutputTokens: options.maxTokens || 150,
      temperature: options.temperature || 0.3,
    },
  })

  const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${messages[messages.length - 1].content}`)
  return result.response.text()
}

/**
 * Generate response using OpenAI
 */
async function generateWithOpenAI(messages, systemPrompt, options) {
  if (!openai) throw new Error('OpenAI API key not configured')
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ],
    max_tokens: options.maxTokens || 150,
    temperature: options.temperature || 0.3,
  })

  return response.choices[0].message.content
}

/**
 * Master cloud generator with auto-fallback between cloud providers
 */
export async function generateCloudResponse(messages, systemPrompt, options = {}) {
  const errors = []

  // Try Gemini first (often has free tier)
  if (genAI) {
    try {
      console.log('[Cloud AI] Attempting Gemini...')
      const reply = await generateWithGemini(messages, systemPrompt, options)
      return { reply, provider: 'google-gemini' }
    } catch (error) {
      console.error('[Cloud AI] Gemini failed:', error.message)
      errors.push(`Gemini: ${error.message}`)
    }
  }

  // Try OpenAI
  if (openai) {
    try {
      console.log('[Cloud AI] Attempting OpenAI...')
      const reply = await generateWithOpenAI(messages, systemPrompt, options)
      return { reply, provider: 'openai' }
    } catch (error) {
      console.error('[Cloud AI] OpenAI failed:', error.message)
      errors.push(`OpenAI: ${error.message}`)
    }
  }

  // Try Anthropic
  if (anthropic) {
    try {
      console.log('[Cloud AI] Attempting Anthropic...')
      const reply = await generateWithClaude(messages, systemPrompt, options)
      return { reply, provider: 'anthropic-claude' }
    } catch (error) {
      console.error('[Cloud AI] Anthropic failed:', error.message)
      errors.push(`Anthropic: ${error.message}`)
    }
  }

  throw new Error(`All cloud AI providers failed: ${errors.join(', ')}`)
}

export default {
  generateCloudResponse
}
