import React, { useEffect, useRef } from 'react'

function ChatHistory({ messages }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: '#fffcf5',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/felt.png")',
      }}
    >
      {messages.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            gap: '32px',
            textAlign: 'center',
          }}
        >
          <div style={{ opacity: 0.3, transform: 'rotate(-2deg)' }}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <p style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 24, margin: '8px 0 0 0' }}>
              Your canvas is empty...
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', maxWidth: '500px' }}>
            {['Tell me a story', 'How does AI work?', 'Draw me a poem', 'What can you do?'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => window.dispatchEvent(new CustomEvent('send-prompt', { detail: prompt }))}
                style={{
                  padding: '12px 20px',
                  background: 'white',
                  border: '2px solid #1a1a1a',
                  borderRadius: '15px 225px 15px 255px/225px 15px 255px 15px',
                  fontFamily: "'Indie Flower', cursive",
                  fontSize: 18,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05) rotate(1deg)'; e.target.style.background = '#f0f0f0' }}
                onMouseLeave={(e) => { e.target.style.transform = 'scale(1) rotate(0deg)'; e.target.style.background = 'white' }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        messages.map((message, index) => {
          const isUser = message.role === 'user'
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                width: '100%',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '16px 24px',
                  borderRadius: isUser 
                    ? '15px 15px 5px 15px/15px 15px 5px 15px' 
                    : '15px 15px 15px 5px/15px 15px 15px 5px',
                  background: isUser ? '#1a1a1a' : 'white',
                  color: isUser ? '#fffcf5' : '#1a1a1a',
                  border: isUser ? 'none' : '2px solid #1a1a1a',
                  fontFamily: "'Indie Flower', cursive",
                  fontSize: 22,
                  lineHeight: 1.4,
                  boxShadow: '6px 6px 0px rgba(0,0,0,0.05)',
                  transform: `rotate(${isUser ? '0.5deg' : '-0.5deg'})`,
                }}
              >
                {message.content}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default React.memo(ChatHistory)
