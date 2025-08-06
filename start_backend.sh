#!/bin/bash

echo "🚀 INICIANDO BACKEND EM MODO DE PRODUÇÃO..."
echo ""

cd backend
echo "📁 Entrando na pasta backend..."

echo "📦 Instalando dependências..."
pip install flask flask-cors gunicorn

echo ""
echo "🔧 Iniciando servidor de produção..."
python production_server.py
