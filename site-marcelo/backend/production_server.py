"""
Configuração de Servidor de Produção para Marcelo Real Estate API
Este arquivo configura o servidor para uso em produção usando Gunicorn
"""

import os
import sys
from api import app

# Configurações de produção
class ProductionConfig:
    DEBUG = False
    TESTING = False
    # Adicione outras configurações de produção aqui

# Configurações de desenvolvimento
class DevelopmentConfig:
    DEBUG = True
    TESTING = False

# Seleciona a configuração baseada na variável de ambiente
config_name = os.environ.get('FLASK_ENV', 'development')

if config_name == 'production':
    app.config.from_object(ProductionConfig)
else:
    app.config.from_object(DevelopmentConfig)

if __name__ == '__main__':
    # Para produção, use: gunicorn -w 4 -b 0.0.0.0:5000 production_server:app
    # Para desenvolvimento, use: python production_server.py
    
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    if config_name == 'production':
        print("⚠️  AVISO: Para produção, use 'gunicorn -w 4 -b 0.0.0.0:5000 production_server:app'")
        print("🔧 Executando em modo desenvolvimento...")
    
    print(f"🚀 Servidor iniciando em {host}:{port}")
    print(f"📊 Modo: {config_name}")
    print(f"🔧 Debug: {app.config.get('DEBUG', False)}")
    
    app.run(
        host=host,
        port=port,
        debug=app.config.get('DEBUG', False)
    )
