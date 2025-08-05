#!/usr/bin/env python3
"""
Script para iniciar o servidor do backend facilmente
Instala dependências automaticamente se necessário
"""

import subprocess
import sys
import os

def install_dependencies():
    """Instala as dependências necessárias"""
    dependencies = [
        'flask',
        'flask-cors',
        'hashlib'
    ]
    
    print("🔧 Instalando dependências...")
    for dep in dependencies:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', dep])
            print(f"✅ {dep} instalado com sucesso")
        except subprocess.CalledProcessError:
            print(f"❌ Erro ao instalar {dep}")
        except Exception as e:
            print(f"❌ Erro: {e}")

def create_test_user():
    """Cria um usuário de teste no banco"""
    import sqlite3
    import hashlib
    
    print("👤 Criando usuário de teste...")
    
    try:
        # Conecta ao banco
        conn = sqlite3.connect('imoveis.db')
        cursor = conn.cursor()
        
        # Cria as tabelas se não existirem
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS usuarios(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                senha TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')
        
        # Verifica se já existe o usuário admin
        cursor.execute('SELECT username FROM usuarios WHERE username = ?', ('admin',))
        if cursor.fetchone():
            print("✅ Usuário admin já existe")
        else:
            # Cria usuário admin
            senha_hash = hashlib.sha256('admin123'.encode()).hexdigest()
            cursor.execute('''
                INSERT INTO usuarios (username, email, senha) 
                VALUES (?, ?, ?)
            ''', ('admin', 'admin@localhost.com', senha_hash))
            print("✅ Usuário admin criado: admin/admin123")
        
        # Verifica se já existe o usuário marcelo
        cursor.execute('SELECT username FROM usuarios WHERE username = ?', ('marcelo',))
        if cursor.fetchone():
            print("✅ Usuário marcelo já existe")
        else:
            # Cria usuário marcelo
            senha_hash = hashlib.sha256('marcelo123'.encode()).hexdigest()
            cursor.execute('''
                INSERT INTO usuarios (username, email, senha) 
                VALUES (?, ?, ?)
            ''', ('marcelo', 'marcelo@localhost.com', senha_hash))
            print("✅ Usuário marcelo criado: marcelo/marcelo123")
        
        conn.commit()
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário: {e}")

def start_server():
    """Inicia o servidor Flask"""
    print("🚀 Iniciando servidor...")
    print("📍 Servidor rodará em: http://localhost:5001")
    print("🔑 Credenciais de teste:")
    print("   👤 admin / admin123")
    print("   👤 marcelo / marcelo123")
    print("\n⏹️ Para parar o servidor, pressione Ctrl+C")
    print("-" * 50)
    
    try:
        # Inicia o servidor Flask
        os.system('python properties_api.py')
    except KeyboardInterrupt:
        print("\n🛑 Servidor parado.")
    except Exception as e:
        print(f"❌ Erro ao iniciar servidor: {e}")

if __name__ == "__main__":
    print("=" * 50)
    print("🏠 MARCELO IMÓVEIS - BACKEND SERVER")
    print("=" * 50)
    
    # Instala dependências
    install_dependencies()
    
    # Cria usuário de teste
    create_test_user()
    
    # Inicia servidor
    start_server()
