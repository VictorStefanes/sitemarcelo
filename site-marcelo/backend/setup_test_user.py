#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import hashlib
import os

def create_test_user():
    """Cria um usuário de teste no banco de dados"""
    
    # Caminho para o banco de dados
    db_path = 'properties.db'
    
    # Conecta ao banco
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Dados do usuário de teste
    username = 'admin'
    email = 'admin@marceloimoveis.com'
    password = 'admin123'
    
    # Hash da senha
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    try:
        # Verifica se o usuário já existe
        cursor.execute("SELECT id FROM usuarios WHERE username = ? OR email = ?", (username, email))
        if cursor.fetchone():
            print(f"❌ Usuário '{username}' já existe no banco de dados!")
            return False
        
        # Insere o usuário
        cursor.execute("""
            INSERT INTO usuarios (username, email, password_hash, role, created_at)
            VALUES (?, ?, ?, 'admin', datetime('now'))
        """, (username, email, password_hash))
        
        conn.commit()
        print(f"✅ Usuário de teste criado com sucesso!")
        print(f"   Username: {username}")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Role: admin")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário: {e}")
        return False
        
    finally:
        conn.close()

def list_users():
    """Lista todos os usuários no banco"""
    
    db_path = 'properties.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id, username, email, role, created_at FROM usuarios")
        users = cursor.fetchall()
        
        if users:
            print("\n📋 Usuários no banco de dados:")
            print("-" * 60)
            for user in users:
                print(f"ID: {user[0]} | Username: {user[1]} | Email: {user[2]} | Role: {user[3]} | Criado: {user[4]}")
        else:
            print("\n📭 Nenhum usuário encontrado no banco de dados.")
            
    except Exception as e:
        print(f"❌ Erro ao listar usuários: {e}")
        
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔧 Setup do Sistema de Autenticação")
    print("=" * 50)
    
    # Lista usuários existentes
    list_users()
    
    # Cria usuário de teste
    print("\n🔨 Criando usuário de teste...")
    create_test_user()
    
    # Lista usuários novamente
    list_users()
    
    print("\n🎯 Teste o login em: http://localhost/site-marcelo/html/index.html")
    print("   Clique no ícone de login no header e use as credenciais acima.")
