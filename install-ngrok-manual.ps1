# Manual ngrok Installation Script
# No admin rights required!

Write-Host "🔧 ngrok Manual Installation Guide" -ForegroundColor Cyan
Write-Host ""

# Check if ngrok already exists
$ngrokPath = Get-Command ngrok -ErrorAction SilentlyContinue

if ($ngrokPath) {
    Write-Host "✅ ngrok already installed!" -ForegroundColor Green
    Write-Host "Location: $($ngrokPath.Source)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To start ngrok:" -ForegroundColor Cyan
    Write-Host "  ngrok http 3000" -ForegroundColor White
    exit 0
}

Write-Host "📥 ngrok Installation Options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Download Manually (Recommended)" -ForegroundColor Yellow
Write-Host "  1. Visit: https://ngrok.com/download" -ForegroundColor White
Write-Host "  2. Download Windows ZIP" -ForegroundColor White
Write-Host "  3. Extract ngrok.exe to: D:\KKBK-main\ngrok.exe" -ForegroundColor White
Write-Host "  4. Use: .\ngrok.exe http 3000" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Use Render.com (No ngrok needed)" -ForegroundColor Yellow
Write-Host "  1. Deploy to Render.com" -ForegroundColor White
Write-Host "  2. Get service URL" -ForegroundColor White
Write-Host "  3. Set in Exotel Dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Download via PowerShell (if you have admin rights)" -ForegroundColor Yellow
Write-Host "  Invoke-WebRequest -Uri 'https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip' -OutFile 'ngrok.zip'" -ForegroundColor White
Write-Host "  Expand-Archive -Path 'ngrok.zip' -DestinationPath '.'" -ForegroundColor White
Write-Host "  Remove-Item 'ngrok.zip'" -ForegroundColor White
Write-Host ""

# Try to download automatically (no admin needed)
Write-Host "Attempting automatic download..." -ForegroundColor Cyan
try {
    $downloadUrl = "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip"
    $zipFile = "ngrok.zip"
    
    Write-Host "Downloading ngrok..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -ErrorAction Stop
    
    Write-Host "Extracting..." -ForegroundColor Yellow
    Expand-Archive -Path $zipFile -DestinationPath "." -Force
    
    Write-Host "Cleaning up..." -ForegroundColor Yellow
    Remove-Item $zipFile -Force
    
    if (Test-Path "ngrok.exe") {
        Write-Host ""
        Write-Host "✅ ngrok installed successfully!" -ForegroundColor Green
        Write-Host "Location: $PWD\ngrok.exe" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To start ngrok:" -ForegroundColor Cyan
        Write-Host "  .\ngrok.exe http 3000" -ForegroundColor White
    } else {
        Write-Host "⚠️  Download completed but ngrok.exe not found" -ForegroundColor Yellow
        Write-Host "Please download manually from: https://ngrok.com/download" -ForegroundColor White
    }
} catch {
    Write-Host ""
    Write-Host "⚠️  Automatic download failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please download manually:" -ForegroundColor Cyan
    Write-Host "  1. Visit: https://ngrok.com/download" -ForegroundColor White
    Write-Host "  2. Download Windows ZIP" -ForegroundColor White
    Write-Host "  3. Extract ngrok.exe to project folder" -ForegroundColor White
}

