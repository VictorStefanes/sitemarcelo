#!/bin/bash

# Script para iniciar o servidor em produção
# Use este script quando fizer deploy da aplicação

echo "🚀 Iniciando Marcelo Real Estate API em modo PRODUÇÃO"
echo "📊 Usando Gunicorn WSGI Server"
echo "🔧 Workers: 4"
echo "🌐 Host: 0.0.0.0"
echo "🚪 Port: 5000"
echo ""

# Instalar dependências se necessário
echo "📦 Verificando dependências..."
pip install -r requirements.txt

echo ""
echo "🎯 Iniciando servidor..."

# Configurar variáveis de ambiente para produção
export FLASK_ENV=production
export PORT=5000

# Iniciar com Gunicorn
gunicorn \
    --workers 4 \
    --bind 0.0.0.0:5000 \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    production_server:app
