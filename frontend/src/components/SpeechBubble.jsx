import React, { useEffect } from 'react'

export default function SpeechBubble({ text, isLoading }) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
      .loading-dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--text-muted);
        animation: bounce 1.4s infinite ease-in-out;
        margin: 0 2px;
      }
      .loading-dot:nth-child(1) {
        animation-delay: -0.32s;
      }
      .loading-dot:nth-child(2) {
        animation-delay: -0.16s;
      }
      .bubble-pop {
        animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      @keyframes popIn {
        0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
        70% { transform: scale(1.05) rotate(1deg); opacity: 1; }
        100% { transform: scale(1) rotate(-0.8deg); opacity: 1; }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div
      className="bubble-pop"
      style={{
        minHeight: 44,
        padding: '24px 32px',
        borderRadius: '25px 225px 25px 255px/225px 25px 255px 25px',
        background: 'white',
        border: '2px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '85%',
        boxShadow: '12px 12px 0px rgba(0,0,0,0.05)',
        textAlign: 'center',
        position: 'relative',
        transform: 'rotate(-0.8deg)',
        marginBottom: '20px'
      }}
    >
      {/* Speech Bubble Tail */}
      <div style={{
        position: 'absolute',
        bottom: -12,
        left: '20%',
        width: 0,
        height: 0,
        borderLeft: '12px solid transparent',
        borderRight: '12px solid transparent',
        borderTop: '12px solid #1a1a1a',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        bottom: -9,
        left: '20%',
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '10px solid white',
        zIndex: 2
      }} />

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="loading-dot" style={{ background: '#1a1a1a' }} />
          <div className="loading-dot" style={{ background: '#1a1a1a' }} />
          <div className="loading-dot" style={{ background: '#1a1a1a' }} />
        </div>
      ) : (
        <p
          style={{
            margin: 0,
            fontFamily: "'Indie Flower', cursive",
            fontSize: 24,
            color: '#1a1a1a',
            lineHeight: 1.3,
            fontWeight: 500,
          }}
        >
          {text}
        </p>
      )}
    </div>
  )
}
