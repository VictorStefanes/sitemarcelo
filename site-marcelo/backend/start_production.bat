@echo off
REM Script para iniciar o servidor em produção no Windows
REM Use este script quando fizer deploy da aplicação

echo 🚀 Iniciando Marcelo Real Estate API em modo PRODUÇÃO
echo 📊 Usando Gunicorn WSGI Server
echo 🔧 Workers: 4
echo 🌐 Host: 0.0.0.0
echo 🚪 Port: 5000
echo.

REM Instalar dependências se necessário
echo 📦 Verificando dependências...
pip install -r requirements.txt

echo.
echo 🎯 Iniciando servidor...

REM Configurar variáveis de ambiente para produção
set FLASK_ENV=production
set PORT=5000

REM Iniciar com Gunicorn
gunicorn ^
    --workers 4 ^
    --bind 0.0.0.0:5000 ^
    --timeout 120 ^
    --keep-alive 5 ^
    --max-requests 1000 ^
    --max-requests-jitter 100 ^
    --access-logfile - ^
    --error-logfile - ^
    --log-level info ^
    production_server:app

pause
