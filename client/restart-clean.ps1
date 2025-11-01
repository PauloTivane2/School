# Script para reiniciar o cliente com cache limpo

Write-Host "🧹 Limpando cache do Vite..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue

Write-Host "🧹 Limpando cache do navegador..." -ForegroundColor Yellow
Write-Host "Por favor, no navegador pressione: Ctrl + Shift + R (ou Ctrl + F5)" -ForegroundColor Cyan

Write-Host "`n✅ Cache limpo! Iniciando servidor..." -ForegroundColor Green
npm run dev
