import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Pencil } from 'lucide-react'

export default function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register, user, isLoading: authLoading, enableGuestMode } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState({ message: '', type: '' })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const getPasswordStrength = (password) => {
    if (!password) return ''
    if (password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong'
    if (password.length >= 6) return 'medium'
    return 'weak'
  }

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'register') {
      setIsLogin(false)
    }
  }, [searchParams])

  useEffect(() => {
    if (user) {
      navigate('/chat')
    }
  }, [user, navigate])

  const handleGuestEntry = () => {
    enableGuestMode()
    navigate('/chat')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeedback({ message: '', type: '' })
    setIsLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        navigate('/chat')
      } else {
        await register(formData.name, formData.email, formData.password)
        setIsLogin(true)
        setFormData(prev => ({ ...prev, password: '' }))
        setFeedback({ 
          message: 'Registration successful! Please sign in with your new account.', 
          type: 'success' 
        })
      }
    } catch (err) {
      setFeedback({ 
        message: err.message || 'Authentication failed', 
        type: 'error' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (authLoading) {
    return (
      <div className="auth-page sketch-loading">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    )
  }

  return (
    <div className="auth-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Indie+Flower&display=swap');
        
        :root {
          --ink: #1a1a1a;
          --paper: #fffcf5;
          --sketch-font: 'Architects Daughter', cursive;
          --body-font: 'Indie Flower', cursive;
          --rough-border: 2px solid var(--ink);
        }

        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--paper);
          background-image: 
            radial-gradient(#e5e7eb 1px, transparent 1px),
            url("https://www.transparenttextures.com/patterns/felt.png");
          background-size: 20px 20px, auto;
          color: var(--ink);
          font-family: var(--body-font);
          padding: 24px;
          overflow-x: hidden;
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        .auth-container {
          width: 100%;
          max-width: 440px;
          animation: float 6s ease-in-out infinite;
          position: relative;
        }

        .auth-container::before {
          content: "✎";
          position: absolute;
          top: -40px;
          right: -20px;
          font-size: 40px;
          opacity: 0.2;
          transform: rotate(20deg);
        }

        .auth-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 40px;
          font-family: var(--sketch-font);
          font-size: 32px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .auth-logo:hover {
          transform: scale(1.1) rotate(-2deg);
        }

        .auth-card {
          background: white;
          border: var(--rough-border);
          border-radius: 15px 255px 15px 225px/225px 15px 255px 15px;
          padding: 40px;
          box-shadow: 12px 12px 0px rgba(0,0,0,0.1);
          transition: all 0.3s;
          position: relative;
        }

        .auth-card::after {
          content: "";
          position: absolute;
          bottom: -15px;
          left: 20px;
          right: 20px;
          height: 10px;
          background: rgba(0,0,0,0.05);
          filter: blur(5px);
          z-index: -1;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-header h1 {
          font-family: var(--sketch-font);
          font-size: 36px;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }

        .auth-header p {
          font-size: 19px;
          opacity: 0.8;
        }

        .auth-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 30px;
          background: #f0f0f0;
          padding: 6px;
          border-radius: 50px;
          border: 1px solid #ddd;
        }

        .auth-tab {
          flex: 1;
          padding: 12px;
          background: none;
          border: none;
          border-radius: 50px;
          font-family: var(--sketch-font);
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #666;
        }

        .auth-tab.active {
          background: var(--ink);
          color: var(--paper);
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .form-group {
          margin-bottom: 24px;
          position: relative;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: bold;
          font-size: 17px;
          transition: color 0.2s;
        }

        .form-group:focus-within label {
          color: #3b82f6;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          background: #fdfdfd;
          border: var(--rough-border);
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
          font-family: var(--body-font);
          font-size: 19px;
          outline: none;
          transition: all 0.2s;
        }

        .form-group input:focus {
          background: white;
          box-shadow: 5px 5px 0px rgba(59, 130, 246, 0.2);
          transform: translate(-2px, -2px);
          border-color: #3b82f6;
        }

        .password-container {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          opacity: 0.5;
          transition: opacity 0.2s;
        }

        .password-toggle:hover {
          opacity: 1;
        }

        .auth-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -12px;
          margin-bottom: 24px;
          font-size: 16px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .forgot-password {
          color: var(--ink);
          text-decoration: none;
          font-family: var(--sketch-font);
          font-weight: bold;
          opacity: 0.7;
        }

        .forgot-password:hover {
          opacity: 1;
          text-decoration: underline;
        }

        .auth-submit {
          width: 100%;
          padding: 16px;
          background: var(--ink);
          color: var(--paper);
          border: none;
          border-radius: 100px;
          font-family: var(--sketch-font);
          font-size: 22px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.2s;
          margin-top: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .auth-submit:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .auth-submit:active:not(:disabled) {
          transform: translateY(0px) scale(0.98);
        }

        .auth-footer {
          text-align: center;
          margin-top: 28px;
          font-size: 19px;
        }

        .auth-link {
          background: none;
          border: none;
          color: var(--ink);
          font-weight: bold;
          text-decoration: underline;
          cursor: pointer;
          font-family: var(--sketch-font);
          padding: 0;
          margin-left: 8px;
          transition: color 0.2s;
        }

        .auth-link:hover {
          color: #3b82f6;
        }

        .auth-error {
          color: #d32f2f;
          background: #ffebee;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 24px;
          text-align: center;
          border: 2px solid #d32f2f;
          font-weight: bold;
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        .auth-success {
          color: #2e7d32;
          background: #e8f5e9;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 24px;
          text-align: center;
          border: 2px solid #2e7d32;
          font-weight: bold;
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }

        .guest-divider {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 30px 0;
          color: #999;
          font-family: var(--sketch-font);
          font-weight: bold;
        }

        .guest-divider::before, .guest-divider::after {
          content: "";
          flex: 1;
          height: 2px;
          background: #eee;
          border-radius: 2px;
        }

        .btn-guest {
          width: 100%;
          padding: 14px;
          background: transparent;
          color: var(--ink);
          border: 2px dashed #ccc;
          border-radius: 15px;
          font-family: var(--sketch-font);
          font-size: 19px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-guest:hover {
          border-color: var(--ink);
          background: rgba(0,0,0,0.03);
          transform: translateY(-2px) rotate(-1deg);
        }
        
        .sketch-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: var(--ink);
        }

        .password-strength {
          height: 4px;
          width: 100%;
          background: #eee;
          margin-top: 8px;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-bar {
          height: 100%;
          width: 0%;
          transition: all 0.3s;
        }

        .strength-weak { width: 33%; background: #ff4d4d; }
        .strength-medium { width: 66%; background: #ffa64d; }
        .strength-strong { width: 100%; background: #2ecc71; }
        
        .sketch-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: var(--ink);
        }
      `}</style>

      <div className="auth-container">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <Pencil className="w-7 h-7" />
          <span>VOAV</span>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h1>{isLogin ? 'Hello Again!' : 'Join the Sketch'}</h1>
            <p>{isLogin ? 'Sign in to see your buddies.' : 'Sign up to start sketching.'}</p>
          </div>

          <div className="auth-tabs">
            <button 
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true)
                setFeedback({ message: '', type: '' })
              }}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false)
                setFeedback({ message: '', type: '' })
              }}
            >
              Sign Up
            </button>
          </div>

          {feedback.message && (
            <div className={`auth-${feedback.type}`}>
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label><User size={16} /> Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Your Name" 
                  required 
                  autoFocus
                />
              </div>
            )}

            <div className="form-group">
              <label><Mail size={16} /> Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Email Address" 
                required 
                autoFocus={isLogin}
              />
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Password</label>
              <div className="password-container">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isLogin && formData.password && (
                <div className="password-strength">
                  <div className={`strength-bar strength-${getPasswordStrength(formData.password)}`}></div>
                </div>
              )}
            </div>

            {isLogin && (
              <div className="auth-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
                  Forgot?
                </a>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Join Now'} <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="guest-divider">or skip the sketch</div>

          <button className="btn-guest" onClick={handleGuestEntry}>
            Continue as Guest <ArrowRight size={18} />
          </button>
        </div>

        <p className="auth-footer">
          {isLogin ? "New to the studio?" : "Already a member?"}
          <button onClick={() => {
            setIsLogin(!isLogin)
            setFeedback({ message: '', type: '' })
          }} className="auth-link">
            {isLogin ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
