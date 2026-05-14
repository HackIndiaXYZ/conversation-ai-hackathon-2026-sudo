# ============================================
# AVATAR CHATBOT - DEPLOYMENT SCRIPT (PowerShell)
# ============================================

Write-Host "🚀 Starting Avatar Chatbot Deployment" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: git is not installed" -ForegroundColor Red
    exit 1
}

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Prerequisites check passed" -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm run install:all
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
Set-Location ..
Write-Host "✓ Frontend built successfully" -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "✅ Build Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Push to GitHub: git push origin main"
Write-Host "2. Deploy backend to Render using render.yaml"
Write-Host "3. Deploy frontend to Vercel using vercel.json"
Write-Host "4. Configure environment variables in both platforms"
Write-Host ""
Write-Host "For detailed instructions, see README.md#deployment"
