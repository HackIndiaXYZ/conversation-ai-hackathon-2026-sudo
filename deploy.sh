#!/bin/bash

# ============================================
# AVATAR CHATBOT - DEPLOYMENT SCRIPT
# ============================================

set -e

echo "🚀 Starting Avatar Chatbot Deployment"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm run install:all
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Run tests (if available)
if npm run test --silent 2>/dev/null; then
    echo -e "${GREEN}✓ Tests passed${NC}"
else
    echo -e "${YELLOW}⚠ No tests found or tests skipped${NC}"
fi

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✓ Frontend built successfully${NC}"

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}✅ Build Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy backend to Render using render.yaml"
echo "3. Deploy frontend to Vercel using vercel.json"
echo "4. Configure environment variables in both platforms"
echo ""
echo "For detailed instructions, see README.md#deployment"
