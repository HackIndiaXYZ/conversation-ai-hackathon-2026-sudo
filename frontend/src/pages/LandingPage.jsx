import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MessageCircle, Sparkles, Zap, Shield, ArrowRight, Bot, Mic, Palette, Pencil } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const { enableGuestMode } = useAuth()

  const handleGuestMode = () => {
    enableGuestMode()
    navigate('/chat')
  }

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'Interactive Avatars',
      description: 'Your chatbots are no longer just text boxes. They talk, blink, and react with expressive hand-drawn animations.',
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Deep Customization',
      description: 'Build your bot, then style it. Change fur, eyes, clothes, and more to create a truly unique AI companion.',
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: 'Real-Time Voice',
      description: 'Experience natural interactions. Your avatars listen and speak back in their own unique character voices.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Smart AI Engines',
      description: 'Power your avatars with advanced LLMs. They are as intelligent as they are visually engaging.',
    },
  ]

  return (
    <div className="landing-page">
      {/* Import Hand-Drawn Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Indie+Flower&display=swap');
        
        :root {
          --ink: #1a1a1a;
          --paper: #fffcf5;
          --sketch-font: 'Architects Daughter', cursive;
          --body-font: 'Indie Flower', cursive;
          --rough-border: 2px solid var(--ink);
        }

        .landing-page {
          min-height: 100vh;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--body-font);
          background-image: url("https://www.transparenttextures.com/patterns/felt.png"); /* Subtle paper texture */
          overflow-x: hidden;
        }

        .sketch-box {
          border: var(--rough-border);
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          z-index: 10;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--sketch-font);
          font-size: 24px;
          font-weight: bold;
        }

        .nav-btn {
          padding: 8px 20px;
          background: var(--ink);
          color: var(--paper);
          border: none;
          border-radius: 100px;
          font-family: var(--sketch-font);
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .nav-btn:hover {
          transform: rotate(-2deg) scale(1.05);
        }

        .hero-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          padding-bottom: 60px;
        }

        .hero-title {
          font-family: var(--sketch-font);
          font-size: 82px;
          margin: 0 0 10px 0;
          line-height: 0.9;
          transform: rotate(-1deg);
        }

        .hero-subtitle {
          font-size: 28px;
          margin-bottom: 30px;
          color: #444;
          max-width: 700px;
        }

        .hero-image-container {
          margin: 20px 0;
          position: relative;
          width: 100%;
          max-width: 800px;
        }

        .hero-image {
          width: 100%;
          height: auto;
          filter: contrast(1.1) brightness(1.05);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.5deg); }
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }

        .btn-draw {
          padding: 16px 40px;
          font-family: var(--sketch-font);
          font-size: 22px;
          background: transparent;
          border: var(--rough-border);
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-draw.primary {
          background: var(--ink);
          color: var(--paper);
        }

        .btn-draw:hover {
          transform: scale(1.05) rotate(1deg);
          box-shadow: 4px 4px 0px var(--ink);
        }

        .features {
          padding: 80px 40px;
          border-top: var(--rough-border);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
          max-width: 1200px;
          margin: 40px auto;
        }

        .feature-card {
          padding: 30px;
          text-align: left;
          background: white;
          transition: transform 0.3s;
        }
        
        .feature-card:hover {
          transform: rotate(1deg) translateY(-5px);
        }

        .feature-title {
          font-family: var(--sketch-font);
          font-size: 24px;
          margin: 15px 0 10px;
        }

        .guest-link {
          margin-top: 20px;
          background: none;
          border: none;
          text-decoration: underline;
          font-family: var(--sketch-font);
          cursor: pointer;
          font-size: 18px;
          opacity: 0.7;
        }

        .ink-decoration {
          position: absolute;
          opacity: 0.1;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 48px; }
          .hero-subtitle { font-size: 20px; }
          .cta-buttons { flex-direction: column; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero">
        <nav className="nav">
          <div className="logo">
            <Pencil className="w-6 h-6" />
            <span>VOAV</span>
          </div>
          <div className="nav-links">
            <button onClick={() => navigate('/login')} className="nav-btn">Sign In</button>
          </div>
        </nav>

        <div className="hero-content">
          <h1 className="hero-title">Build Interactive Avatar Chatbots</h1>
          <p className="hero-subtitle">
            Create characters that don't just chat—they interact. Customize looks, pick voices, and bring your AI to life.
          </p>

          <div className="hero-image-container">
            <img 
              src="/artifacts/doodle_avatars_hero_1778739564772.png" 
              alt="Doodle Avatars" 
              className="hero-image"
            />
          </div>

          <div className="cta-buttons">
            <button onClick={() => navigate('/login?tab=register')} className="btn-draw primary">
              Start Sketching <ArrowRight />
            </button>
            <button onClick={handleGuestMode} className="btn-draw">
              Try it Out
            </button>
          </div>
          
          <button onClick={handleGuestMode} className="guest-link">
            Skip login and continue as guest
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--sketch-font)', fontSize: 42 }}>Built with Ink & AI</h2>
        </div>
        
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card sketch-box">
              <div style={{ color: 'var(--ink)' }}>{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p style={{ fontSize: 18, lineHeight: 1.4 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 60, textAlign: 'center', borderTop: 'var(--rough-border)' }}>
        <p style={{ fontSize: 20, fontFamily: 'var(--sketch-font)' }}>VOAV — Built for Interactive AI</p>
        <p style={{ opacity: 0.5 }}>© 2025 VOAV. All sketches reserved.</p>
      </footer>
    </div>
  )
}
