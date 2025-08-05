@echo off
title Marcelo Imoveis - Backend Server
echo ================================================
echo     MARCELO IMOVEIS - BACKEND SERVER
echo ================================================
echo.
echo [1] Instalando dependencias Python...
pip install flask flask-cors
echo.

echo [2] Inicializando banco de dados...
python init_db.py
echo.

echo [3] Iniciando servidor da API...
echo Servidor rodando em: http://localhost:5001
echo.
echo Para acessar o dashboard: http://localhost:8080/html/dashboard.html
echo Username: admin
echo Senha: admin123
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

python properties_api.py
