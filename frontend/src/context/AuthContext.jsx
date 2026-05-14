import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      fetchUser()
    } else if (localStorage.getItem('guestMode') === 'true') {
      enableGuestMode()
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        logout()
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const register = async (name, email, password) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('guestMode')
    setToken(null)
    setUser(null)
  }

  const enableGuestMode = () => {
    localStorage.setItem('guestMode', 'true')
    setUser({
      id: 'guest',
      name: 'Guest',
      email: 'guest@example.com',
      avatar: {
        skin: '#FAD4A6',
        skinShade: '#F0B07A',
        hair: '#3A2A1A',
        hairStyle: 'long',
        eye: '#2C1A0E',
        lip: '#C0704A',
        acc: 'none',
        theme: 'light',
      },
    })
  }

  const isGuest = () => {
    return localStorage.getItem('guestMode') === 'true' && !token
  }

  const updateAvatar = async (avatarData) => {
    const response = await fetch(`${API_URL}/api/auth/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(avatarData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update avatar')
    }

    setUser((prev) => ({ ...prev, avatar: data.avatar }))
    return data
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateAvatar, enableGuestMode, isGuest }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
