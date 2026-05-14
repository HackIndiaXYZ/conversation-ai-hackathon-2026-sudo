# Avatar Chatbot

An interactive avatar chatbot with customizable characters and AI-powered responses.

## ✨ Features
- **Swirl Selection**: Cycle through multiple characters including Human, Cat, and SpongeBob.
- **Dynamic Animations**: Characters react and move when speaking.
- **Glassmorphic UI**: Beautiful, modern interface with Light and Dark mode support.
- **State Persistence**: Your preferences and chat history are saved to your profile automatically.
- **Multi-AI Support**: Seamless fallback between local LLMs (Ollama) and cloud providers.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router Dom
- **Icons**: Lucide React
- **Styling**: Modern CSS (Glassmorphism, Variables, Keyframe Animations)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS for password hashing
- **Validation**: Express Validator

### Database
- **Primary**: MongoDB Atlas (NoSQL)
- **Integration**: Native MongoDB Node.js Driver

### AI Services
- **Local**: Ollama (supports Phi-3, Llama-3, etc.)
- **Cloud (Fallbacks)**: 
  - Anthropic (Claude 3.5 Sonnet)
  - OpenAI (GPT-4o)
  - Google (Gemini 1.5 Flash)

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Ollama (optional for local AI)

### 2. Installation
```bash
# Install all dependencies (root, frontend, backend)
npm run install:all
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory using `.env.example` as a template:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ANTHROPIC_API_KEY=your_anthropic_api_key
# Optional cloud keys
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

### 4. Database Connection
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster and database named `figgy_db`.
3. Get your connection string and replace `<password>` with your actual password.
4. Update the `MONGODB_URI` in your backend `.env`.

### 5. Running the App
```bash
# Start both frontend and backend in development mode
npm run dev
```
