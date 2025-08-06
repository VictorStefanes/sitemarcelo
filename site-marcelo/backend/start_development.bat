@echo off
REM Script para desenvolvimento - inicia o servidor Flask
REM Use apenas para desenvolvimento local

echo 🛠️ Iniciando Marcelo Real Estate API em modo DESENVOLVIMENTO
echo ⚠️ ESTE SERVIDOR É APENAS PARA DESENVOLVIMENTO
echo 🔧 Debug: Ativado
echo 🌐 Host: localhost
echo 🚪 Port: 5000
echo.

REM Configurar variáveis de ambiente para desenvolvimento
set FLASK_ENV=development
set PORT=5000

REM Iniciar servidor de desenvolvimento
echo 🎯 Iniciando servidor de desenvolvimento...
python api.py

pause
