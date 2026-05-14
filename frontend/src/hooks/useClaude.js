import { useState, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function useClaude(systemPrompt, token) {
  const history = useRef([])
  const [isLoading, setIsLoading] = useState(false)

  async function ask(userMessage, chatId = null) {
    setIsLoading(true)
    history.current = [...history.current, { role: 'user', content: userMessage }]

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: history.current,
          system: systemPrompt,
          chatId,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        const error = new Error(data.error || 'Chat request failed')
        error.status = response.status
        throw error
      }

      const reply = data.reply
      history.current = [...history.current, { role: 'assistant', content: reply }]
      setIsLoading(false)
      return data
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  function clearHistory() {
    history.current = []
  }

  return {
    ask,
    history: history.current,
    isLoading,
    clearHistory,
  }
}
