import axios from 'axios'

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi3'

// Healthcare Persona System Prompts - Optimized for phi3 (concise, clear)
const HEALTHCARE_PERSONAS = {
  cardiologist: {
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    prompt: `You are Dr. Sarah Chen, a skeptical cardiologist with 15 years of clinical experience. You are meeting with a pharmaceutical sales representative.

BEHAVIOR RULES:
- Ask evidence-based questions about efficacy, side effects, and contraindications
- Challenge unsupported claims politely but firmly
- Reference major cardiology guidelines (ACC/AHA, ESC) when relevant
- Prioritize patient safety over sales enthusiasm
- Keep responses brief (2-3 sentences) - you are busy
- Show professional skepticism - "What's the real-world evidence?"

EMOINDICATORS: Use [emotion:thinking] when considering clinical data, [emotion:surprised] when hearing bold claims, [emotion:happy] when evidence is strong, [emotion:sad] when safety concerns arise.

Your goal: Determine if this medication truly benefits YOUR patients.`
  },

  oncologist: {
    name: 'Dr. Michael Torres',
    specialty: 'Oncology',
    prompt: `You are Dr. Michael Torres, an experienced oncologist focused on patient outcomes. You are evaluating a new oncology therapy presented by a sales rep.

BEHAVIOR RULES:
- Ask about PFS, OS, biomarker status, and trial populations
- Challenge survival benefit claims - "Is it clinically meaningful?"
- Question toxicity profiles and quality of life impact
- Reference NCCN guidelines and FDA approvals
- Keep responses concise (2-3 sentences) - cancer patients are waiting
- Demand subgroup analysis data

EMOINDICATORS: Use [emotion:thinking] when evaluating trial data, [emotion:surprised] at efficacy claims, [emotion:sad] discussing adverse events, [emotion:happy] for breakthrough therapies.

Your goal: Protect patients from ineffective or overly toxic treatments.`
  },

  neurologist: {
    name: 'Dr. Emily Watson',
    specialty: 'Neurology',
    prompt: `You are Dr. Emily Watson, a detail-oriented neurologist. You are assessing a CNS therapy from a pharmaceutical representative.

BEHAVIOR RULES:
- Ask about mechanism of action, blood-brain barrier penetration, and cognitive effects
- Challenge vague efficacy claims - "Show me the functional outcomes"
- Question titration schedules and discontinuation criteria
- Reference AAN guidelines and real-world evidence
- Keep responses brief (2-3 sentences) - consultations are backed up
- Show skepticism for "me-too" drugs

EMOINDICATORS: Use [emotion:thinking] analyzing MOA, [emotion:surprised] by novel mechanisms, [emotion:sad] discussing progressive diseases, [emotion:happy] for genuine advances.

Your goal: Ensure treatments meaningfully improve neurologic function.`
  },

  pediatrician: {
    name: 'Dr. James Park',
    specialty: 'Pediatrics',
    prompt: `You are Dr. James Park, a cautious pediatrician who prioritizes child safety. You are hearing about a pediatric medication from a sales rep.

BEHAVIOR RULES:
- Ask about pediatric-specific trials, dosing by weight/age, and long-term safety
- Challenge adult-to-pediatric extrapolation claims
- Question formulations appropriate for children
- Reference AAP guidelines and pediatric labeling
- Keep responses warm but brief (2-3 sentences) - kids are in the waiting room
- Show protective instincts - "Would I give this to my own child?"

EMOINDICATORS: Use [emotion:thinking] weighing risk/benefit, [emotion:surprised] by pediatric data gaps, [emotion:happy] for child-friendly formulations, [emotion:sad] discussing chronic pediatric conditions.

Your goal: Protect vulnerable pediatric patients from inadequately tested medications.`
  }
}

// Default assistant persona (non-healthcare mode)
const DEFAULT_SYSTEM_PROMPT = `You are Ava, a friendly AI assistant. Keep responses concise (2-4 sentences). Be warm and conversational.

EMOINDICATORS: Include [emotion:happy] for positive topics, [emotion:thinking] for questions, [emotion:sad] for sympathy, [emotion:surprised] for unexpected facts.`

/**
 * Extract emotion tags from response and clean the text
 * Format: [emotion:happy], [emotion:sad], [emotion:thinking], [emotion:surprised]
 */
function parseEmotionFromResponse(text) {
  const emotionMatch = text.match(/\[emotion:(\w+)\]/i)
  const emotion = emotionMatch ? emotionMatch[1].toLowerCase() : 'neutral'
  const cleanText = text.replace(/\[emotion:\w+\]/gi, '').trim()
  return { emotion, cleanText }
}

/**
 * Build optimized context for phi3 - limit to last 6 messages for speed
 */
function buildPhi3Context(messages, systemPrompt) {
  // Take last 6 messages to keep context small for CPU performance
  const recentMessages = messages.slice(-6)

  let context = `System: ${systemPrompt}\n\n`

  for (const msg of recentMessages) {
    const role = msg.role === 'user' ? 'User' : 'Assistant'
    context += `${role}: ${msg.content}\n`
  }

  context += 'Assistant:'
  return context
}

/**
 * Call Ollama phi3 with streaming support
 */
async function generateWithOllama(prompt, options = {}) {
  const {
    temperature = 0.3,
    maxTokens = 150,
    stream = false,
    onChunk = null
  } = options

  const requestBody = {
    model: OLLAMA_MODEL,
    prompt: prompt,
    stream: stream,
    options: {
      temperature: temperature,
      num_predict: maxTokens,
      top_k: 20,
      top_p: 0.9,
      repeat_penalty: 1.1,
      stop: ['User:', 'System:', 'Assistant:']
    }
  }

  try {
    if (stream && onChunk) {
      // Use native fetch for streaming
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`Ollama HTTP error: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.response) {
              fullText += data.response
              onChunk(data.response, fullText)
            }
            if (data.error) {
              throw new Error(data.error)
            }
          } catch (e) {
            if (e.message.includes('JSON')) continue
            throw e
          }
        }
      }

      return fullText
    } else {
      // Non-streaming mode using axios
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, requestBody, {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.data?.error) {
        throw new Error(response.data.error)
      }

      return response.data?.response || ''
    }
  } catch (error) {
    console.error('[Ollama Service] Error:', error.message)
    throw new Error(`Ollama phi3 failed: ${error.message}`)
  }
}

/**
 * Check if Ollama is available and phi3 is loaded
 */
export async function checkOllamaHealth() {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
      timeout: 5000
    })
    const models = response.data?.models || []
    const phi3Available = models.some(m => m.name.includes('phi3'))

    return {
      available: true,
      phi3Loaded: phi3Available,
      models: models.map(m => m.name)
    }
  } catch (error) {
    return {
      available: false,
      error: error.message
    }
  }
}

/**
 * Generate chat response with persona support
 */
export async function generateChatResponse(messages, options = {}) {
  const {
    persona = null,
    system = null,
    stream = false,
    onChunk = null,
    temperature = 0.3,
    maxTokens = 150
  } = options

  // Get system prompt based on persona
  let systemPrompt
  if (persona && HEALTHCARE_PERSONAS[persona]) {
    systemPrompt = HEALTHCARE_PERSONAS[persona].prompt
  } else if (system) {
    systemPrompt = system
  } else {
    systemPrompt = DEFAULT_SYSTEM_PROMPT
  }

  // Build optimized context for phi3
  const prompt = buildPhi3Context(messages, systemPrompt)

  // Call Ollama
  const rawResponse = await generateWithOllama(prompt, {
    temperature,
    maxTokens,
    stream,
    onChunk
  })

  // Parse emotion tags
  const { emotion, cleanText } = parseEmotionFromResponse(rawResponse)

  return {
    reply: cleanText,
    emotion: emotion,
    raw: rawResponse,
    provider: 'ollama-phi3',
    persona: persona,
    usage: {
      estimated_input_tokens: Math.ceil(prompt.length / 4),
      estimated_output_tokens: Math.ceil(rawResponse.length / 4)
    }
  }
}

/**
 * Generate streaming chat response
 */
export async function generateChatResponseStream(messages, options = {}) {
  const {
    persona = null,
    system = null,
    onChunk,
    temperature = 0.3,
    maxTokens = 150
  } = options

  let systemPrompt
  if (persona && HEALTHCARE_PERSONAS[persona]) {
    systemPrompt = HEALTHCARE_PERSONAS[persona].prompt
  } else if (system) {
    systemPrompt = system
  } else {
    systemPrompt = DEFAULT_SYSTEM_PROMPT
  }

  const prompt = buildPhi3Context(messages, systemPrompt)

  let fullText = ''
  const wrappedOnChunk = (chunk, accumulated) => {
    fullText = accumulated
    if (onChunk) {
      onChunk(chunk, accumulated)
    }
  }

  await generateWithOllama(prompt, {
    temperature,
    maxTokens,
    stream: true,
    onChunk: wrappedOnChunk
  })

  // Parse final emotion
  const { emotion, cleanText } = parseEmotionFromResponse(fullText)

  return {
    reply: cleanText,
    emotion: emotion,
    raw: fullText,
    provider: 'ollama-phi3-streaming',
    persona: persona
  }
}

/**
 * Get available healthcare personas
 */
export function getAvailablePersonas() {
  return Object.entries(HEALTHCARE_PERSONAS).map(([key, data]) => ({
    id: key,
    name: data.name,
    specialty: data.specialty
  }))
}

/**
 * Validate persona selection
 */
export function isValidPersona(persona) {
  return persona === null || HEALTHCARE_PERSONAS.hasOwnProperty(persona)
}

export default {
  generateChatResponse,
  generateChatResponseStream,
  checkOllamaHealth,
  getAvailablePersonas,
  isValidPersona,
  HEALTHCARE_PERSONAS
}
