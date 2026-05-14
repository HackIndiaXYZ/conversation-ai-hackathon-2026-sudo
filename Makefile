# ============================================
# AI Healthcare Avatar Platform - Docker Makefile
# Quick commands for development and deployment
# ============================================

.PHONY: help build start stop restart logs shell clean health test pull-phi3

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)AI Healthcare Avatar Platform$(NC)"
	@echo "================================"
	@echo ""
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

# Environment setup
env: ## Create .env file from template
	@if [ ! -f .env ]; then \
		cp .env.docker .env; \
		echo "$(GREEN)✓ Created .env from template$(NC)"; \
		echo "$(YELLOW)⚠ Please edit .env with your configuration$(NC)"; \
	else \
		echo "$(YELLOW)⚠ .env already exists$(NC)"; \
	fi

# Build and start
build: ## Build all Docker images
	docker compose build

start: env ## Start all services (with build)
	@./docker-start.sh || bash docker-start.sh

up: ## Start services without build
	docker compose up -d

dev: ## Start in development mode (attached logs)
	docker compose up

# Stop and cleanup
stop: ## Stop all services
	docker compose down

down: ## Stop and remove containers
	docker compose down

down-volumes: ## Stop and remove all data (including database)
	docker compose down -v

restart: stop start ## Restart all services

# Monitoring
logs: ## View all service logs
	docker compose logs -f

logs-backend: ## View backend logs only
	docker compose logs -f backend

logs-frontend: ## View frontend logs only
	docker compose logs -f frontend

logs-mongodb: ## View MongoDB logs only
	docker compose logs -f mongodb

status: ## Show service status
	docker compose ps

health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(NC)"
	@echo ""
	@echo "Frontend:"
	@curl -s http://localhost/health 2>/dev/null || echo "  $(RED)✗ Not responding$(NC)"
	@echo ""
	@echo "Backend:"
	@curl -s http://localhost:3001/health | jq -r '.status' 2>/dev/null || echo "  $(RED)✗ Not responding$(NC)"
	@echo ""
	@echo "Ollama:"
	@curl -s http://localhost:3001/api/health/ollama | jq -r '.available' 2>/dev/null || echo "  $(RED)✗ Not responding$(NC)"

# Shell access
shell-backend: ## Open shell in backend container
	docker compose exec backend sh

shell-mongodb: ## Open MongoDB shell
	docker compose exec mongodb mongosh avatar_db

# Database
mongo-init: ## Run MongoDB initialization
	docker compose exec mongodb mongosh avatar_db /docker-entrypoint-initdb.d/mongo-init.js

mongo-backup: ## Backup MongoDB data
	@mkdir -p backups
	docker compose exec mongodb mongodump --out /data/backup/$(shell date +%Y%m%d_%H%M%S)
	@echo "$(GREEN)✓ Backup created in container at /data/backup$(NC)"

# Ollama commands
ollama-pull: ## Pull phi3 model into Ollama
	@echo "$(BLUE)Pulling phi3 model...$(NC)"
	@curl -X POST http://localhost:11434/api/pull -d '{"name": "phi3"}'

ollama-list: ## List available Ollama models
	@curl -s http://localhost:11434/api/tags | jq '.models[].name' 2>/dev/null || echo "$(RED)Ollama not accessible$(NC)"

# Testing
test-chat: ## Test chat endpoint
	@echo "$(BLUE)Testing chat endpoint...$(NC)"
	@curl -X POST http://localhost:3001/api/chat \
		-H "Content-Type: application/json" \
		-d '{"messages": [{"role": "user", "content": "Hello"}]}' | jq '.'

test-stream: ## Test streaming endpoint
	@echo "$(BLUE)Testing streaming endpoint...$(NC)"
	@curl -X POST http://localhost:3001/api/chat/stream \
		-H "Content-Type: application/json" \
		-d '{"messages": [{"role": "user", "content": "Hello"}]}'

test-personas: ## Get available personas
	@echo "$(BLUE)Fetching available personas...$(NC)"
	@curl -s http://localhost:3001/api/personas | jq '.'

# Production
prod: ## Start with production configuration
	docker compose -f docker-compose.prod.yml up -d

prod-build: ## Build and start with production configuration
	docker compose -f docker-compose.prod.yml up --build -d

prod-logs: ## View production logs
	docker compose -f docker-compose.prod.yml logs -f

# Cleanup
clean: ## Remove unused Docker resources
	docker system prune -f

clean-all: ## Remove all Docker data (USE WITH CAUTION!)
	@echo "$(RED)This will remove all Docker data!$(NC)"
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v; \
		docker system prune -a -f; \
		echo "$(GREEN)✓ Cleanup complete$(NC)"; \
	fi

# Full reset
reset: down-volumes ## Full reset (stops, removes volumes, restarts)
	docker compose up --build -d
	@echo "$(GREEN)✓ Platform reset complete$(NC)"

# Mobile testing
mobile-url: ## Display URL for mobile testing
	@echo "$(BLUE)Mobile Testing URLs:$(NC)"
	@echo "  Local: http://localhost"
	@IP=$$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr eth0 2>/dev/null || hostname -I | awk '{print $$1}'); \
	if [ ! -z "$$IP" ]; then \
		echo "  Network: http://$$IP"; \
		echo ""; \
		echo "Scan this QR code on your mobile device:"; \
		command -v qrencode >/dev/null 2>&1 && qrencode -t ANSI "http://$$IP" || echo "  (Install qrencode to generate QR codes)"; \
	fi

# Hackathon quick start
hackathon: env ## Quick start for hackathon demos
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  AI Healthcare Avatar Platform$(NC)"
	@echo "$(GREEN)  Hackathon Quick Start$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	@echo ""
	@echo "$(BLUE)Step 1/4: Checking prerequisites...$(NC)"
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)Docker not found. Please install Docker Desktop.$(NC)"; exit 1; }
	@echo "$(GREEN)✓ Docker is available$(NC)"
	@echo ""
	@echo "$(BLUE)Step 2/4: Checking Ollama...$(NC)"
	@if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Ollama is running$(NC)"; \
	else \
		echo "$(YELLOW)⚠ Ollama not detected on localhost:11434$(NC)"; \
		echo "  Please ensure:"; \
		echo "    1. Ollama is installed: https://ollama.com/download"; \
		echo "    2. Model is pulled: ollama pull phi3"; \
		echo "    3. Server is running: ollama serve"; \
	fi
	@echo ""
	@echo "$(BLUE)Step 3/4: Starting containers...$(NC)"
	@docker compose up --build -d
	@sleep 5
	@echo "$(GREEN)✓ Containers started$(NC)"
	@echo ""
	@echo "$(BLUE)Step 4/4: Waiting for health checks...$(NC)"
	@sleep 10
	@echo ""
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  Platform is ready!$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	@echo ""
	@echo "Access your avatar platform at:"
	@echo "  $(BLUE)Frontend: http://localhost$(NC)"
	@echo "  $(BLUE)Backend:  http://localhost:3001$(NC)"
	@echo ""
	@echo "Run $(YELLOW)make health$(NC) to verify all services"
	@echo "Run $(YELLOW)make help$(NC) for more commands"
