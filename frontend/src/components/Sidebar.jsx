import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Plus,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit2,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Sidebar({ currentChatId, onChatSelect, onNewChat }) {
  const navigate = useNavigate()
  const { user, logout, token } = useAuth()
  const [chats, setChats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [editingChat, setEditingChat] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [menuOpen, setMenuOpen] = useState(null)

  useEffect(() => {
    fetchChats()
  }, [token])

  const fetchChats = async () => {
    if (!token) return

    try {
      const response = await fetch(`${API_URL}/api/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setChats(data.chats || [])
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setChats((prev) => prev.filter((c) => c._id !== chatId))
        if (currentChatId === chatId) {
          onNewChat()
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
    setMenuOpen(null)
  }

  const handleUpdateTitle = async (chatId) => {
    if (!editTitle.trim()) {
      setEditingChat(null)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle.trim() }),
      })

      if (response.ok) {
        setChats((prev) =>
          prev.map((c) => (c._id === chatId ? { ...c, title: editTitle.trim() } : c))
        )
      }
    } catch (error) {
      console.error('Failed to update title:', error)
    }
    setEditingChat(null)
    setMenuOpen(null)
  }

  const startEditing = (chat) => {
    setEditingChat(chat._id)
    setEditTitle(chat.title)
    setMenuOpen(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date

    if (diff < 86400000) {
      // Less than 24 hours
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diff < 604800000) {
      // Less than 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <button onClick={onNewChat} className="new-chat-btn">
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span>New chat</span>}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="collapse-btn"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Chat List */}
        <div className="sidebar-content">
          {isLoading ? (
            <div className="sidebar-loading">
              <div className="spinner" />
            </div>
          ) : chats.length === 0 ? (
            <div className="sidebar-empty">
              {!isCollapsed && (
                <>
                  <MessageSquare className="w-12 h-12" />
                  <p>No conversations yet</p>
                </>
              )}
            </div>
          ) : (
            <div className="chat-list">
              {!isCollapsed && <div className="chat-list-header">Recent</div>}
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`chat-item ${currentChatId === chat._id ? 'active' : ''}`}
                  onClick={() => onChatSelect(chat._id)}
                >
                  <MessageSquare className="w-4 h-4 chat-icon" />
                  {!isCollapsed && (
                    <>
                      {editingChat === chat._id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleUpdateTitle(chat._id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateTitle(chat._id)
                            if (e.key === 'Escape') setEditingChat(null)
                          }}
                          className="chat-title-input"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="chat-title">{chat.title}</span>
                      )}
                      <span className="chat-date">{formatDate(chat.updatedAt)}</span>
                      <button
                        className="chat-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setMenuOpen(menuOpen === chat._id ? null : chat._id)
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpen === chat._id && (
                        <div className="chat-menu">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditing(chat)
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteChat(chat._id)
                            }}
                            className="danger"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          {!isCollapsed && user && (
            <div className="user-info">
              <div className="user-avatar">
                <User className="w-5 h-5" />
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
          )}
          <div className="sidebar-actions">
            <button className="action-btn" title="Settings">
              <Settings className="w-5 h-5" />
              {!isCollapsed && <span>Settings</span>}
            </button>
            <button onClick={handleLogout} className="action-btn" title="Log out">
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Log out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(null)} />
      )}

      <style>{`
        .sidebar {
          width: 320px;
          height: 100vh;
          background: var(--paper);
          border-right: var(--rough-border);
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          font-family: var(--body-font);
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar-header {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: var(--rough-border);
        }

        .new-chat-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          background: var(--ink);
          color: var(--paper);
          border: none;
          border-radius: 100px;
          font-family: var(--sketch-font);
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .new-chat-btn:hover {
          transform: translateY(-2px) rotate(-1deg);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          background: #2a2a2a;
        }

        .new-chat-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .sidebar.collapsed .new-chat-btn {
          flex: none;
          width: 48px;
          height: 48px;
          padding: 0;
        }

        .collapse-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: var(--rough-border);
          border-radius: 8px;
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s;
        }

        .collapse-btn:hover {
          transform: scale(1.1);
        }

        .sidebar.collapsed .collapse-btn {
          display: none;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 16px;
        }

        .chat-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-list-header {
          padding: 8px 12px;
          font-family: var(--sketch-font);
          font-size: 14px;
          font-weight: 700;
          color: var(--ink);
          opacity: 0.6;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .chat-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .chat-item:hover {
          background: white;
          border: 2px dashed #ddd;
          transform: rotate(0.5deg);
        }

        .chat-item.active {
          background: white;
          border: var(--rough-border);
          transform: rotate(-0.5deg) scale(1.02);
          box-shadow: 8px 8px 0px rgba(0,0,0,0.05);
          z-index: 1;
        }

        .chat-item.active::after {
          content: '';
          position: absolute;
          inset: -4px;
          border: 2px dashed var(--ink);
          border-radius: 14px;
          opacity: 0.2;
          pointer-events: none;
        }

        .chat-icon {
          color: var(--ink);
          opacity: 0.5;
          flex-shrink: 0;
        }

        .chat-title {
          flex: 1;
          font-size: 18px;
          font-weight: 600;
          color: var(--ink);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-title-input {
          flex: 1;
          padding: 4px 8px;
          border: 1px solid var(--ink);
          border-radius: 6px;
          font-family: var(--body-font);
          font-size: 16px;
          background: white;
          color: var(--ink);
          outline: none;
        }

        .chat-date {
          font-size: 12px;
          font-family: var(--sketch-font);
          color: var(--ink);
          opacity: 0.5;
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding: 24px 20px;
          border-top: var(--rough-border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: white;
          border: 1px solid #eee;
          border-radius: 16px;
          margin-bottom: 4px;
          overflow: hidden;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: var(--ink);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--paper);
        }

        .user-name {
          font-family: var(--sketch-font);
          font-size: 18px;
          font-weight: 700;
          color: var(--ink);
        }

        .user-email {
          font-size: 12px;
          opacity: 0.6;
          color: var(--ink);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: none;
          border: none;
          border-radius: 100px;
          font-family: var(--sketch-font);
          font-size: 18px;
          font-weight: bold;
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .action-btn:hover {
          background: rgba(0,0,0,0.05);
          transform: translateX(4px);
        }

        .sidebar.collapsed .action-btn {
          justify-content: center;
          padding: 10px;
        }

        .sidebar.collapsed .action-btn span {
          display: none;
        }

        .sidebar-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid var(--ink);
          opacity: 0.3;
          border-top-color: var(--ink);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .sidebar-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: var(--ink);
          opacity: 0.4;
          gap: 12px;
        }

        .chat-menu-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          border-radius: 6px;
          color: var(--ink);
          opacity: 0.3;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-item:hover .chat-menu-btn {
          opacity: 1;
        }

        .chat-menu-btn:hover {
          background: #eee;
        }

        .chat-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: var(--rough-border);
          border-radius: 10px;
          box-shadow: 8px 8px 0px rgba(0,0,0,0.1);
          padding: 6px;
          z-index: 1000;
          min-width: 140px;
        }

        .chat-menu button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: none;
          border: none;
          border-radius: 6px;
          font-family: var(--sketch-font);
          font-size: 14px;
          color: var(--ink);
          cursor: pointer;
          transition: background 0.2s;
        }

        .chat-menu button:hover {
          background: #f5f5f5;
        }

        .chat-menu button.danger {
          color: #d32f2f;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: absolute;
            left: 0;
            top: 0;
            width: 280px;
            transform: translateX(0);
            box-shadow: 20px 0 50px rgba(0,0,0,0.1);
          }
          .sidebar.collapsed {
            transform: translateX(-100%);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
