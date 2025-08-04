import sqlite3
import hashlib
import os

def inicializar_banco():
    """Inicializa o banco de dados com um usuário administrador padrão"""
    
    db_path = os.path.join(os.path.dirname(__file__), 'imoveis.db')
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Cria tabela de usuários se não existir
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
    cursor.execute('SELECT id FROM usuarios WHERE username = ?', ('admin',))
    if not cursor.fetchone():
        # Cria usuário administrador padrão
        senha_hash = hashlib.sha256('admin123'.encode()).hexdigest()
        cursor.execute('''
            INSERT INTO usuarios (username, email, senha)
            VALUES (?, ?, ?)
        ''', ('admin', 'admin@marcelo-imoveis.com', senha_hash))
        
        print("✅ Usuário administrador criado:")
        print("   Username: admin")
        print("   Senha: admin123")
        print("   Email: admin@marcelo-imoveis.com")
    else:
        print("ℹ️  Usuário administrador já existe")
    
    conn.commit()
    conn.close()
    
    print(f"✅ Banco de dados inicializado: {db_path}")

if __name__ == '__main__':
    inicializar_banco()
