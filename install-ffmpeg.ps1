# FFmpeg Installation Script for Windows
# Run this script as Administrator

Write-Host "🔧 FFmpeg Installation Script" -ForegroundColor Cyan
Write-Host ""

# Check if Chocolatey is installed
$chocoInstalled = Get-Command choco -ErrorAction SilentlyContinue

if ($chocoInstalled) {
    Write-Host "✅ Chocolatey found. Installing FFmpeg..." -ForegroundColor Green
    choco install ffmpeg -y
    Write-Host ""
    Write-Host "✅ FFmpeg installation complete!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Chocolatey not found." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Install Chocolatey first, then run this script again" -ForegroundColor Cyan
    Write-Host "  Run this command in PowerShell (as Administrator):" -ForegroundColor White
    Write-Host "  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Manual Installation" -ForegroundColor Cyan
    Write-Host "  1. Download from: https://www.gyan.dev/ffmpeg/builds/" -ForegroundColor White
    Write-Host "  2. Extract to C:\ffmpeg" -ForegroundColor White
    Write-Host "  3. Add C:\ffmpeg\bin to PATH environment variable" -ForegroundColor White
    Write-Host "  4. Restart terminal" -ForegroundColor White
    Write-Host ""
}

# Verify installation
Write-Host "Verifying FFmpeg installation..." -ForegroundColor Cyan
$ffmpegInstalled = Get-Command ffmpeg -ErrorAction SilentlyContinue

if ($ffmpegInstalled) {
    Write-Host "✅ FFmpeg is installed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Version:" -ForegroundColor Cyan
    ffmpeg -version | Select-Object -First 1
} else {
    Write-Host "❌ FFmpeg not found in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install FFmpeg manually or add it to PATH" -ForegroundColor Yellow
}

