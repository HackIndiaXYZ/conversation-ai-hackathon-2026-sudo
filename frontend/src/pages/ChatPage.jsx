import React, { useReducer, useEffect, useCallback, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import avatarReducer, { initialState } from '../state/avatarReducer'
import useClaude from '../hooks/useClaude'
import useSpeech from '../hooks/useSpeech'
import useAvatarBlink from '../hooks/useAvatarBlink'
import detectSentiment, { getSentimentLabel } from '../utils/sentiment'
import AvatarSVG from '../components/AvatarSVG'
import CatAvatar from '../components/CatAvatar'
import SpongeAvatar from '../components/SpongeAvatar'
import ChibiAvatar from '../components/ChibiAvatar'
import CustomizerPanel from '../components/CustomizerPanel'
import SpeechBubble from '../components/SpeechBubble'
import ChatHistory from '../components/ChatHistory'
import ChatInput from '../components/ChatInput'
import Sidebar from '../components/Sidebar'

const SYSTEM_PROMPT = "You are a friendly, expressive AI avatar assistant named Ava. Keep responses concise (2-4 sentences). Be warm, clear, and conversational. Show personality! Use varied vocabulary to express emotions naturally."

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ChatPage() {
  const navigate = useNavigate()
  const { user, token, logout } = useAuth()
  const [state, dispatch] = useReducer(avatarReducer, initialState)
  const [currentChatId, setCurrentChatId] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)
  const greetedRef = React.useRef(false)

  const { ask, isLoading, clearHistory } = useClaude(SYSTEM_PROMPT, token)
  const { speak, stop, voices, selectedVoice, setVoice, isSupported } = useSpeech(dispatch, state.avatarType)
  useAvatarBlink(dispatch)

  // Redirect if not authenticated
  useEffect(() => {
    if (!token && !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  // Load user avatar preferences
  useEffect(() => {
    if (user?.avatar) {
      dispatch({ type: 'LOAD_SAVED', payload: user.avatar })
    }
  }, [user])

  // Save appearance changes to backend
  useEffect(() => {
    const saveAvatar = async () => {
      if (!token) return

      const appearance = {
        skin: state.skin,
        hair: state.hair,
        eye: state.eye,
        lip: state.lip,
        acc: state.acc,
        hairStyle: state.hairStyle,
        theme: state.theme,
        avatarType: state.avatarType,
      }

      try {
        await fetch(`${API_URL}/api/auth/avatar`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(appearance),
        })
      } catch (error) {
        console.error('Failed to save avatar:', error)
      }
    }

    const timeoutId = setTimeout(saveAvatar, 500)
    return () => clearTimeout(timeoutId)
  }, [state.skin, state.hair, state.eye, state.lip, state.acc, state.hairStyle, state.theme, state.avatarType, token])

  // Sync voices
  useEffect(() => {
    dispatch({ type: 'SET_VOICES', payload: voices })
    dispatch({ type: 'SET_VOICE', payload: selectedVoice })
  }, [voices, selectedVoice])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  const handleStart = useCallback(() => {
    setHasStarted(true)
    if (!isSupported || greetedRef.current) return
    greetedRef.current = true
    const GREETING = `Hi ${user?.name || 'there'}! I am Ava, your AI avatar assistant. How can I help you today?`
    dispatch({ type: 'SET_BUBBLE', payload: GREETING })
    dispatch({ type: 'SET_EXPR', payload: 'happy' })
    speak(GREETING, {
      onEnd: () => {
        dispatch({ type: 'SET_EXPR', payload: 'neutral' })
        dispatch({ type: 'SET_STATUS', payload: 'Ready' })
        setTimeout(() => {
          dispatch({ type: 'SET_BUBBLE', payload: 'Ask me anything — I am listening!' })
        }, 2000)
      },
    })
  }, [isSupported, speak, user])

  const createNewChat = async () => {
    if (!token) return

    try {
      const response = await fetch(`${API_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: 'New Chat' }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentChatId(data.chat._id)
        dispatch({ type: 'CLEAR_CHAT' })
        clearHistory()
      }
    } catch (error) {
      console.error('Failed to create chat:', error)
    }
  }

  const loadChat = async (chatId) => {
    if (!token) return

    setCurrentChatId(chatId)

    try {
      const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'CLEAR_CHAT' })
        data.chat.messages.forEach((msg) => {
          dispatch({ type: 'ADD_MESSAGE', payload: msg })
        })
      }
    } catch (error) {
      console.error('Failed to load chat:', error)
    }
  }

  const handleSend = useCallback(async (text) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', content: text } })
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_EXPR', payload: 'thinking' })
    dispatch({ type: 'SET_STATUS', payload: 'Thinking...' })
    dispatch({ type: 'SET_BUBBLE', payload: '...' })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const data = await ask(text, currentChatId)
      const reply = data.reply
      const sentiment = data.emotion || detectSentiment(reply)
      
      dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', content: reply } })
      dispatch({ type: 'SET_BUBBLE', payload: reply })
      dispatch({ type: 'SET_STATUS', payload: `${getSentimentLabel(reply)} (${data.provider || 'AI'})` })
      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({ type: 'SET_EXPR', payload: sentiment })

      if (isSupported) {
        speak(reply, {
          emotion: sentiment,
          onStart: () => {},
          onEnd: () => {
            dispatch({ type: 'SET_EXPR', payload: 'neutral' })
            dispatch({ type: 'SET_STATUS', payload: 'Ready' })
          },
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      dispatch({ type: 'SET_EXPR', payload: 'sad' })
      dispatch({ type: 'SET_LOADING', payload: false })

      let errorMessage = 'Oops, something went wrong. Please try again.'
      let statusMessage = 'Error'

      if (error.message?.includes('Rate limit') || error.message?.includes('quota') || error.message?.includes('Quota')) {
        errorMessage = "API quota exceeded. Please check your API key billing or add a new key in backend/.env"
        statusMessage = 'Quota exceeded'
      } else if (error.message?.includes('All AI providers failed')) {
        errorMessage = `All AI providers failed: ${error.message}`
        statusMessage = 'All providers failed'
      } else if (error.message?.includes('Connection') || error.name === 'TypeError') {
        errorMessage = 'Connection issue. Please check your internet and try again.'
        statusMessage = 'Connection error'
      } else {
        errorMessage = `Error: ${error.message}`
      }

      dispatch({ type: 'SET_BUBBLE', payload: errorMessage })
      dispatch({ type: 'SET_STATUS', payload: statusMessage })
      dispatch({ type: 'SET_ERROR', payload: true })

      setTimeout(() => {
        dispatch({ type: 'SET_EXPR', payload: 'neutral' })
        dispatch({ type: 'SET_STATUS', payload: 'Ready' })
        dispatch({ type: 'SET_ERROR', payload: null })
      }, 2000)
    }
  }, [ask, speak, isSupported, currentChatId])

  const avatarProps = {
    skin: state.skin,
    skinShade: state.skinShade,
    hair: state.hair,
    eye: state.eye,
    lip: state.lip,
    acc: state.acc,
    hairStyle: state.hairStyle,
    expr: state.expr,
    blinking: state.blinking,
    speaking: state.speaking,
  }

  return (
    <div className="chat-page">
      <Sidebar
        currentChatId={currentChatId}
        onChatSelect={loadChat}
        onNewChat={createNewChat}
      />

      <main className="chat-main">
        {/* Welcome overlay */}
        {!hasStarted && (
          <div className="welcome-overlay" onClick={handleStart}>
            <div className="welcome-content">
              <div className="welcome-avatar">
                {state.avatarType === 'cat' ? (
                  <CatAvatar speaking={false} expr="neutral" blinking={state.blinking} />
                ) : state.avatarType === 'spongebob' ? (
                  <SpongeAvatar speaking={false} />
                ) : state.avatarType === 'chibi' ? (
                  <ChibiAvatar speaking={false} expr="neutral" blinking={false} />
                ) : (
                  <AvatarSVG {...avatarProps} />
                )}
              </div>
              <h1>Welcome back, {user?.name || 'friend'}! 👋</h1>
              <p>Meet Ava, your AI avatar assistant</p>
              <div className="welcome-btn">
                ▶ Click anywhere to start
              </div>
            </div>
          </div>
        )}

        {state.isCustomizing ? (
          <CustomizerView
            state={state}
            dispatch={dispatch}
            avatarProps={avatarProps}
            speak={speak}
            stop={stop}
          />
        ) : (
          <ChatView
            state={state}
            dispatch={dispatch}
            avatarProps={avatarProps}
            onSend={handleSend}
            isLoading={isLoading}
          />
        )}
      </main>

      <style>{`
        :root {
          --ink: #1a1a1a;
          --paper: #fffcf5;
          --sketch-font: 'Architects Daughter', cursive;
          --body-font: 'Indie Flower', cursive;
          --rough-border: 2px solid var(--ink);
        }

        .chat-page {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: var(--paper);
          font-family: var(--body-font);
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .welcome-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: var(--paper);
          background-image: 
            radial-gradient(#e5e7eb 1px, transparent 1px),
            url("https://www.transparenttextures.com/patterns/felt.png");
          background-size: 20px 20px, auto;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .welcome-content {
          text-align: center;
          color: var(--ink);
          max-width: 500px;
          padding: 40px;
          background: white;
          border: var(--rough-border);
          border-radius: 15px 225px 15px 255px/225px 15px 255px 15px;
          box-shadow: 12px 12px 0px rgba(0,0,0,0.1);
          transform: rotate(-1deg);
        }

        .welcome-avatar {
          transform: scale(3.0);
          margin-bottom: 60px;
          filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.1));
        }

        .welcome-content h1 {
          font-family: var(--sketch-font);
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }

        .welcome-content p {
          font-family: var(--body-font);
          font-size: 24px;
          color: var(--ink);
          opacity: 0.8;
          margin-bottom: 40px;
        }

        .welcome-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 40px;
          background: var(--ink);
          color: var(--paper);
          border: none;
          border-radius: 100px;
          font-family: var(--sketch-font);
          font-weight: bold;
          font-size: 22px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }

        .welcome-overlay:hover .welcome-btn {
          transform: scale(1.05) rotate(1deg);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  )
}

// Character intro lines & voice settings for the selection screen
const CHARACTER_INTROS = {
  cat:       { text: "Meow! Hi there! I'm your cat companion, purr-fectly ready to chat!",  avatarType: 'cat' },
  spongebob: { text: "Hi hi hi! I'm SpongeBob SquarePants! Are you ready, kids?",            avatarType: 'spongebob' },
  chibi:     { text: "Hiii! I'm Chibi! So nice to meet you! Tee-hee!",                       avatarType: 'chibi' },
  human:     { text: "Hello there! I'm your human avatar, ready to assist you!",             avatarType: 'human' },
}

function CustomizerView({ state, dispatch, avatarProps, speak, stop }) {
  // Skip intro on the very first render (only play when user actively slides)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    // Stop any current speech, then speak the character intro
    if (stop) stop()
    const intro = CHARACTER_INTROS[state.avatarType]
    if (intro && speak) {
      // Small delay so the slide animation plays first
      const timer = setTimeout(() => {
        speak(intro.text, { avatarType: intro.avatarType })
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [state.avatarType]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="customizer-view">
      <div className="customizer-content">
        {/* Avatar Stage */}
        <div className="avatar-stage">
          <div className="stage-glow-bg" />

          {/* Single avatar — outer div scales, inner div animates (no conflict) */}
          <div className={`char-scale char-scale--${state.avatarType}`}>
            <div key={state.avatarType} className="avatar-slide-in">
              {state.avatarType === 'cat' ? (
                <CatAvatar 
                  speaking={state.speaking} 
                  expr={state.expr} 
                  blinking={state.blinking} 
                  furColor={state.catFur} 
                  eyeColor={state.catEyes} 
                />
              ) : state.avatarType === 'spongebob' ? (
                <SpongeAvatar 
                  speaking={state.speaking} 
                  expr={state.expr} 
                  bodyColor={state.spongeBody} 
                  pantsColor={state.spongePants} 
                />
              ) : state.avatarType === 'chibi' ? (
                <ChibiAvatar 
                  speaking={state.speaking} 
                  expr={state.expr} 
                  blinking={state.blinking} 
                  skinColor={state.chibiSkin} 
                  hairColor={state.chibiHair} 
                  eyeColor={state.chibiEyes} 
                />
              ) : (
                <AvatarSVG {...avatarProps} />
              )}
            </div>
          </div>

          <div className="avatar-pedestal" />
          <p className="avatar-label">{state.avatarType.toUpperCase()}</p>
          <p className="avatar-hint">Use arrows to switch characters</p>

          <button 
            className="nav-arrow left" 
            onClick={() => {
              const types = ['human', 'cat', 'spongebob', 'chibi']
              const idx = types.indexOf(state.avatarType)
              dispatch({ type: 'SET_AVATAR_TYPE', payload: types[(idx - 1 + types.length) % types.length] })
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <button 
            className="nav-arrow right" 
            onClick={() => {
              const types = ['human', 'cat', 'spongebob', 'chibi']
              const idx = types.indexOf(state.avatarType)
              dispatch({ type: 'SET_AVATAR_TYPE', payload: types[(idx + 1) % types.length] })
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        {/* Customizer Panel */}
        <CustomizerPanel state={state} dispatch={dispatch} />

        {/* Done Button */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_CUSTOMIZE', payload: false })}
          className="done-btn"
        >
          ✓ Done
        </button>
      </div>

      <style>{`
        .customizer-view {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          gap: 60px;
          background: var(--bg-primary);
          background-image:
            radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.08) 0%, transparent 40%);
          overflow: auto;
        }

        .customizer-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 60px;
          width: 100%;
          max-width: 1200px;
        }

        .avatar-stage {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 100%;
          min-height: 500px;
          padding-bottom: 80px;
          overflow: visible;
        }

        .stage-glow-bg {
          position: absolute;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        /* Avatar slides in from right on forward, from left on backward */
        .avatar-slide-in {
          position: relative;
          z-index: 5;
          animation: slideInRight 0.45s cubic-bezier(0.25, 1, 0.5, 1) both;
        }

        /* Per-character scaling */
        .char-scale--human     { transform: scale(2.0); }
        .char-scale--cat       { transform: scale(1.5); }
        .char-scale--spongebob { transform: scale(1.4) translateY(-15px); }
        .char-scale--chibi     { transform: scale(1.8); }

        @keyframes slideInRight {
          0%   { opacity: 0; transform: translateX(80px) scale(0.85); }
          100% { opacity: 1; transform: translateX(0)   scale(1); }
        }

        /* Per-character scaling (repeated for specificity after keyframe) */
          position: fixed;
          inset: 0;
          display: flex;
          background: #fffcf5;
          background-image: url("https://www.transparenttextures.com/patterns/felt.png");
          z-index: 1000;
          padding: 24px;
          gap: 24px;
          overflow: hidden;
          animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .customizer-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: white;
          border: 2px solid #1a1a1a;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          transition: all 0.2s ease;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.05);
        }

        .nav-arrow:hover {
          background: #1a1a1a;
          color: #fffcf5;
          transform: translateY(-50%) scale(1.1) rotate(5deg);
        }

        .nav-arrow.left  { left: 32px; }
        .nav-arrow.right { right: 32px; }

        .carousel-window {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-track {
          display: flex;
          width: 400%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          align-items: center;
        }

        .carousel-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.6s ease;
          opacity: 0.1;
          transform: scale(0.6);
        }

        .carousel-item.active {
          opacity: 1;
          transform: scale(1);
        }

        .avatar-container {
          position: relative;
          z-index: 5;
          width: 200px;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-item:nth-child(1) .avatar-container { transform: scale(2.2); }
        .carousel-item:nth-child(2) .avatar-container { transform: scale(2.2); }
        .carousel-item:nth-child(3) .avatar-container { transform: scale(1.6) translateY(-20px); }
        .carousel-item:nth-child(4) .avatar-container { transform: scale(2.2); }

        .pedestal-glow {
          position: absolute;
          width: 300px;
          height: 80px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.05) 0%, transparent 70%);
          z-index: 0;
          bottom: 25%;
          left: 50%;
          transform: translate(-50%, 0);
          opacity: 1;
        }

        .avatar-label {
          position: absolute;
          bottom: 12%;
          font-family: var(--sketch-font);
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 0.1em;
          color: #1a1a1a;
          margin: 0;
          z-index: 10;
        }

        .avatar-hint {
          position: absolute;
          bottom: 7%;
          font-family: var(--body-font);
          font-size: 16px;
          color: #1a1a1a;
          opacity: 0.4;
          margin: 0;
          z-index: 10;
        }

        .done-btn {
          position: absolute;
          top: 32px;
          right: 32px;
          padding: 12px 32px;
          border-radius: 100px;
          background: #1a1a1a;
          color: #fffcf5;
          border: none;
          font-family: var(--sketch-font);
          font-weight: bold;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 8px 8px 0px rgba(0,0,0,0.1);
          z-index: 1100;
          transition: all 0.2s ease;
        }

        .done-btn:hover {
          transform: translateY(-2px) rotate(-1deg);
          box-shadow: 10px 10px 0px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  )
}

function ChatView({ state, dispatch, avatarProps, onSend, isLoading }) {
  return (
    <div className="chat-view">
      <div className="chat-container">
        {/* Avatar Header */}
        <div className="avatar-header">
          <div
            className="avatar-wrapper"
            onClick={() => dispatch({ type: 'TOGGLE_CUSTOMIZE', payload: true })}
          >
            {state.avatarType === 'cat' ? (
              <CatAvatar speaking={state.speaking} expr={state.expr} blinking={state.blinking} />
            ) : state.avatarType === 'spongebob' ? (
              <SpongeAvatar speaking={state.speaking} expr={state.expr} />
            ) : state.avatarType === 'chibi' ? (
              <ChibiAvatar speaking={state.speaking} expr={state.expr} blinking={state.blinking} />
            ) : (
              <AvatarSVG {...avatarProps} />
            )}
            <div className="avatar-edit-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
          </div>
          <SpeechBubble text={state.bubble} isLoading={isLoading} />
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          <ChatHistory messages={state.messages} />
          <ChatInput onSend={onSend} isLoading={isLoading} isSpeaking={!!state.speaking} />
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <p className="status-text" style={{ color: state.error ? '#ff4444' : 'var(--text-muted)' }}>
            {state.status}
          </p>
          <p className="version">VOAV v1.0</p>
        </div>
      </div>

      <style>{`
        .chat-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 24px;
          overflow: hidden;
          background: var(--paper);
        }

        .chat-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 16px;
        }

        .avatar-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          position: relative;
          padding: 50px 0 20px 0;
        }

        .avatar-wrapper {
          position: relative;
          cursor: pointer;
          transition: transform 0.2s;
          transform: scale(1.6);
          z-index: 10;
          margin-bottom: 20px;
          filter: drop-shadow(8px 8px 0px rgba(0,0,0,0.05));
        }

        .avatar-wrapper:hover {
          transform: scale(2.6);
        }

        .avatar-edit-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--paper);
          border: 3px solid var(--paper);
          transform: scale(0.5) rotate(-15deg);
          box-shadow: 6px 6px 0px rgba(0,0,0,0.1);
        }

        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 15px;
          border: var(--rough-border);
          overflow: hidden;
          box-shadow: 12px 12px 0px rgba(0,0,0,0.05);
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 12px;
        }

        .status-text {
          font-family: var(--sketch-font);
          font-size: 14px;
          margin: 0;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .version {
          font-family: var(--sketch-font);
          font-size: 12px;
          margin: 0;
          color: var(--ink);
          opacity: 0.5;
        }

        @media (max-width: 1024px) {
          .chat-view {
            padding: 16px;
          }
          .avatar-header {
            padding: 40px 0 20px 0;
          }
          .avatar-wrapper {
            transform: scale(1.3);
          }
        }

        @media (max-width: 768px) {
          .chat-view {
            padding: 12px;
          }
          .avatar-header {
            padding: 30px 0 10px 0;
            gap: 16px;
          }
          .avatar-wrapper {
            transform: scale(1.1);
          }
          .status-bar {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
