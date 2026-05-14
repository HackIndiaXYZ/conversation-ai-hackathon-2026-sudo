import React, { useState, useEffect } from 'react'
import useSpeechRecognition from '../hooks/useSpeechRecognition'

export default function ChatInput({ onSend, isLoading, isSpeaking }) {
  const [value, setValue] = useState('')
  const { isListening, transcript, isSupported, toggle, setTranscript } = useSpeechRecognition()

  const handleSend = (textToSend = value) => {
    if (textToSend.trim() === '' || isLoading || isSpeaking) return
    onSend(textToSend.trim())
    setValue('')
    setTranscript('')
  }

  const handleMicClick = () => {
    if (isListening) {
      // Stop recording — auto-send will fire via the effect below
      toggle()
    } else {
      // Start recording
      setTranscript('')
      setValue('')
      toggle()
    }
  }

  // Auto-send when recognition stops and we have a transcript
  const wasListeningRef = React.useRef(false)
  useEffect(() => {
    if (wasListeningRef.current && !isListening && transcript.trim() !== '') {
      handleSend(transcript)
    }
    wasListeningRef.current = isListening
  }, [isListening, transcript])

  // Listen for suggested prompts from the empty state
  useEffect(() => {
    const handleSuggestedPrompt = (e) => {
      handleSend(e.detail)
    }
    window.addEventListener('send-prompt', handleSuggestedPrompt)
    return () => window.removeEventListener('send-prompt', handleSuggestedPrompt)
  }, [isLoading, isSpeaking])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading && !isSpeaking) {
      handleSend()
    }
  }

  return (
    <div
      className="chat-input-container"
      style={{
        display: 'flex',
        gap: 16,
        padding: '20px 24px',
        background: '#fffcf5',
        borderTop: '2px solid #1a1a1a',
        alignItems: 'center',
      }}
    >
      <input
        type="text"
        className="chat-input-field"
        placeholder={isListening ? 'Listening...' : 'Sketch a message...'}
        value={isListening ? transcript || value : value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading || isListening}
        style={{
          flex: 1,
          padding: '14px 20px',
          border: '2px solid #1a1a1a',
          borderRadius: '15px 225px 15px 255px/225px 15px 255px 15px',
          background: 'white',
          color: '#1a1a1a',
          fontFamily: "'Indie Flower', cursive",
          fontSize: 20,
          outline: 'none',
          transition: 'all 0.2s ease',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.05)',
        }}
        onFocus={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.1)' }}
        onBlur={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '4px 4px 0px rgba(0,0,0,0.05)' }}
      />

      {/* Microphone button */}
      {isSupported && (
        <button
          onClick={handleMicClick}
          disabled={isLoading || isSpeaking}
          title={isListening ? 'Click to stop' : 'Click to speak'}
          className={`chat-input-btn ${isListening ? 'mic-pulse' : ''}`}
          style={{
            width: 52,
            height: 52,
            padding: 0,
            border: '2px solid #1a1a1a',
            borderRadius: '50%',
            background: isListening ? '#ff4d4d' : 'white',
            color: '#1a1a1a',
            cursor: (isLoading || isSpeaking) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '4px 4px 0px rgba(0,0,0,0.05)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      )}

      <button
        onClick={() => handleSend()}
        className="chat-input-btn"
        disabled={isLoading || isSpeaking || value.trim() === ''}
        style={{
          padding: '0 32px',
          height: 52,
          border: 'none',
          borderRadius: '100px',
          background: '#1a1a1a',
          color: '#fffcf5',
          fontFamily: "'Architects Daughter', cursive",
          fontSize: 20,
          fontWeight: 'bold',
          cursor: (isLoading || isSpeaking || value.trim() === '') ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: (isLoading || isSpeaking || value.trim() === '') ? 0.5 : 1,
          flexShrink: 0,
          boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
        }}
      >
        {isLoading ? '...' : 'Send'}
      </button>

      <style>{`
        @keyframes mic-pulse-anim {
          0%   { box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.6); }
          70%  { box-shadow: 0 0 0 14px rgba(255, 77, 77, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 77, 77, 0); }
        }
        .mic-pulse {
          animation: mic-pulse-anim 1.2s infinite;
        }

        @media (max-width: 768px) {
          .chat-input-container {
            padding: 12px !important;
            gap: 8px !important;
          }
          .chat-input-field {
            font-size: 16px !important;
            padding: 10px 14px !important;
          }
          .chat-input-btn {
            width: 44px !important;
            height: 44px !important;
            padding: 0 16px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}
