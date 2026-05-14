import { useState, useRef, useCallback } from 'react'

export default function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef(null)
  const transcriptRef = useRef('')

  // Initialize once
  if (!recognitionRef.current && typeof window !== 'undefined') {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = true
      recognition.maxAlternatives = 1
      recognitionRef.current = recognition
      setIsSupported(true)
    }
  }

  const start = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    // Reset transcript for new recording
    transcriptRef.current = ''
    setTranscript('')

    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interimText += result[0].transcript
        }
      }

      const combined = finalText + interimText
      transcriptRef.current = combined
      setTranscript(combined)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // Silence — just stop, don't show error
      } else if (event.error === 'not-allowed') {
        console.warn('Microphone access denied')
      } else {
        console.warn('Speech recognition error:', event.error)
      }
      setIsListening(false)
    }

    try {
      recognition.start()
      setIsListening(true)
    } catch (e) {
      // Already started — ignore
      console.warn('Speech recognition start error:', e.message)
    }
  }, [])

  const stop = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    try {
      recognition.stop()
    } catch (e) {
      // Not started — ignore
    }
    setIsListening(false)
  }, [])

  const toggle = useCallback(() => {
    if (isListening) {
      stop()
    } else {
      start()
    }
  }, [isListening, start, stop])

  return {
    isListening,
    transcript,
    isSupported,
    start,
    stop,
    toggle,
    setTranscript,
  }
}
