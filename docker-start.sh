#!/bin/bash
# ============================================
# AI Healthcare Avatar Platform - Docker Starter
# Unix/Linux/macOS Bash Script
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_banner() {
    echo -e "${BLUE}"
    echo "============================================"
    echo "  AI Healthcare Avatar Platform"
    echo "  Docker Quick Start"
    echo "============================================"
    echo -e "${NC}"
}

print_step() {
    echo -e "${BLUE}[Step $1/5]${NC} $2"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Main script
print_banner

# Check if .env exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp .env.docker .env
    echo ""
    echo "${YELLOW}[IMPORTANT]${NC} Please edit .env and configure:"
    echo "  - JWT_SECRET (generate a secure random string)"
    echo "  - MONGODB_URI (if using MongoDB Atlas)"
    echo "  - OLLAMA_URL (verify for your system)"
    echo ""
    read -p "Press Enter to continue after editing .env..."
fi

# Check if Docker is running
print_step 1 "Checking Docker availability..."
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running!"
    echo "Please start Docker Desktop first."
    exit 1
fi
print_success "Docker is running"

# Check Ollama availability
print_step 2 "Checking Ollama availability..."
OLLAMA_URL=${OLLAMA_URL:-http://localhost:11434}
if curl -s "$OLLAMA_URL/api/tags" >/dev/null 2>&1; then
    print_success "Ollama is running at $OLLAMA_URL"
else
    print_warning "Ollama doesn't appear to be running at $OLLAMA_URL"
    echo ""
    echo "Please ensure Ollama is installed and running:"
    echo "  1. Download: https://ollama.com/download"
    echo "  2. Pull model: ollama pull phi3"
    echo "  3. Start: ollama serve"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build and start containers
print_step 3 "Building and starting containers..."
docker compose up --build -d
print_success "Containers started"

# Wait for services
print_step 4 "Waiting for services to be healthy (30s)..."
sleep 10
echo -n "  Checking backend..."
until curl -s http://localhost:3001/health >/dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo " ${GREEN}✓${NC}"

echo -n "  Checking frontend..."
until curl -s http://localhost/ >/dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo " ${GREEN}✓${NC}"

# Check health
print_step 5 "Verifying service health..."
echo ""
docker compose ps

echo ""
echo -e "${GREEN}============================================"
echo "  Platform is ready!"
echo "============================================${NC}"
echo ""
echo "Access points:"
echo "  ${BLUE}Frontend:${NC} http://localhost"
echo "  ${BLUE}Backend:${NC}  http://localhost:3001"
echo "  ${BLUE}MongoDB:${NC}  localhost:27017"
echo ""
echo "Health checks:"
echo "  Backend: curl http://localhost:3001/health"
echo "  Ollama:  curl http://localhost:3001/api/health/ollama"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f    [View logs]"
echo "  docker compose down       [Stop all]"
echo "  docker compose ps         [Check status]"
echo ""
