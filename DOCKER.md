# 🐳 AI Healthcare Avatar Platform - Docker Deployment

Complete Docker containerization for production deployment and hackathon demos.

## 🚀 Quick Start

```bash
# 1. Copy environment configuration
cp .env.docker .env

# 2. Start all services
docker compose up

# 3. Access the platform
# Frontend: http://localhost
# Backend API: http://localhost:3001
```

## 📋 Prerequisites

### Required
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac/Linux)
- [Ollama](https://ollama.com/) installed on host machine

### Optional
- phi3 model: `ollama pull phi3` (for local LLM)
- GPU support (NVIDIA Docker runtime for GPU acceleration)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │  Frontend   │◄──►│   Backend   │◄──►│    MongoDB      │  │
│  │  (Nginx)    │    │  (Express)  │    │   (Database)    │  │
│  │   Port 80   │    │  Port 3001  │    │   Port 27017    │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│         │                  │                                 │
│         └──────────────────┘                                 │
│                   │                                          │
│              ┌────┴────┐                                     │
│              │ Ollama  │  (On Host or Container)             │
│              │ Port 11434                                    │
│              └─────────┘                                     │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration

### Environment Variables

Copy `.env.docker` to `.env` and customize:

| Variable | Default | Description |
|------------|---------|-------------|
| `FRONTEND_PORT` | 80 | Port to access the UI |
| `BACKEND_PORT` | 3001 | API server port |
| `MONGODB_PORT` | 27017 | MongoDB port |
| `VITE_API_URL` | http://localhost:3001 | Frontend → Backend connection |
| `MONGODB_URI` | mongodb://mongodb:27017/avatar_db | Database connection |
| `OLLAMA_URL` | http://host.docker.internal:11434 | Ollama endpoint |
| `OLLAMA_MODEL` | phi3 | LLM model name |
| `JWT_SECRET` | (required) | JWT signing secret |

### Ollama Connection Options

#### Option 1: Host Machine (Recommended for Hackathons)

Run Ollama on your host machine outside Docker:

```bash
# Install Ollama
# macOS: brew install ollama
# Windows: Download from https://ollama.com

# Pull phi3 model
ollama pull phi3

# Start Ollama server
ollama serve
```

Set in `.env`:
```env
OLLAMA_URL=http://host.docker.internal:11434   # macOS/Windows
OLLAMA_URL=http://172.17.0.1:11434             # Linux (check your docker0 IP)
```

#### Option 2: Docker Container (Advanced)

Uncomment the `ollama` service in `docker-compose.yml`:

```yaml
ollama:
  image: ollama/ollama:latest
  ports:
    - "11434:11434"
  volumes:
    - ollama_data:/root/.ollama
```

Then:
```bash
docker compose exec ollama ollama pull phi3
```

## 📦 Services

### Frontend (Nginx)
- **Build**: Multi-stage Node.js + Nginx Alpine
- **Features**: Production-optimized, gzip compression, caching
- **Size**: ~25MB
- **Health Check**: HTTP check on port 80

### Backend (Express.js)
- **Build**: Node.js Alpine with security hardening
- **Features**: Non-root user, health checks, graceful shutdown
- **Size**: ~150MB
- **Health Check**: `/health` endpoint

### MongoDB
- **Image**: Official MongoDB 7 (Jammy)
- **Features**: Persistent volume, indexes, initialization script
- **Data**: Stored in named volume `mongodb_data`

## 🎯 Common Commands

```bash
# Build and start all services
docker compose up --build

# Start in detached mode (background)
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend

# Stop all services
docker compose down

# Stop and remove all data (including database)
docker compose down -v

# Restart a specific service
docker compose restart backend

# Scale backend (if needed)
docker compose up -d --scale backend=2

# Execute commands in containers
docker compose exec backend sh
docker compose exec mongodb mongosh

# Check service health
docker compose ps
docker compose top
```

## 🔍 Troubleshooting

### Check if Ollama is accessible

```bash
# From host
curl http://localhost:11434/api/tags

# From inside backend container
docker compose exec backend sh
curl http://host.docker.internal:11434/api/tags
```

### Verify service health

```bash
# Frontend
curl http://localhost/health

# Backend
curl http://localhost:3001/health

# MongoDB
docker compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Reset everything

```bash
docker compose down -v
docker system prune -a
docker compose up --build
```

### Common Issues

**Issue**: Backend can't connect to Ollama
```
Error: Ollama phi3 failed: connect ECONNREFUSED
```
**Fix**: Ensure Ollama is running on host and `OLLAMA_URL` is correct for your OS.

**Issue**: MongoDB connection fails
```
Error: MongoNetworkError
```
**Fix**: Wait for MongoDB to fully start, or check `MONGODB_URI`.

**Issue**: Port already in use
```
Error: Bind for 0.0.0.0:80 failed
```
**Fix**: Change `FRONTEND_PORT` in `.env` to a different port (e.g., 8080).

## 📱 Mobile Browser Compatibility

The Docker deployment includes:
- ✅ HTTPS redirect headers (when behind SSL proxy)
- ✅ Responsive viewport meta tags (in frontend)
- ✅ Touch-friendly nginx timeouts
- ✅ CORS headers for mobile apps
- ✅ Streaming support for slow connections

For production HTTPS deployment, add a reverse proxy (nginx, traefik, or cloud load balancer).

## 🏥 Healthcare Features Preserved

All healthcare platform features work in Docker:
- ✅ **Streaming Responses**: Nginx proxy buffering disabled for SSE
- ✅ **Speech-to-Text**: Web Speech API (browser-based)
- ✅ **Text-to-Speech**: Web Speech API (browser-based)
- ✅ **Healthcare Personas**: Loaded from `ollamaService.js`
- ✅ **Emotion Tagging**: Parsed and returned in API responses
- ✅ **HCP Interactions**: Cardiologist, Oncologist, Neurologist, Pediatrician
- ✅ **Avatar Animations**: React state preserved

## 🔐 Security Considerations

Production hardening included:
- Non-root user in backend container
- Security headers in nginx
- No sensitive data in images (use `.env`)
- Health checks on all services
- Resource limits configurable

## 📊 Resource Usage

Typical usage for hackathon demo:
- **Frontend**: 50MB RAM
- **Backend**: 100MB RAM
- **MongoDB**: 200MB RAM
- **Ollama (host)**: 2-4GB RAM (phi3 model)

**Total**: ~3GB RAM recommended

## 🎓 Hackathon Checklist

Before your demo:

- [ ] `cp .env.docker .env` and configure
- [ ] Ollama installed and `ollama pull phi3` completed
- [ ] `docker compose up -d` successful
- [ ] http://localhost loads the UI
- [ ] Test chat with avatar
- [ ] Test persona switching
- [ ] Test streaming responses
- [ ] Test on mobile browser
- [ ] `docker compose ps` shows all healthy

## 🔗 Useful Links

- [Docker Docs](https://docs.docker.com/)
- [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [MongoDB Docker](https://hub.docker.com/_/mongo)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

---

**Built for hackathon success! 🚀**
