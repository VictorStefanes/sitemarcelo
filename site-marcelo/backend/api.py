from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import re
import os

app = Flask(__name__)
# Configuração CORS mais específica para produção
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5500", 
    "http://127.0.0.1:5500",
    "https://*.netlify.app",
    "https://netlify.app"
], supports_credentials=True)

DB_PATH = os.path.join(os.path.dirname(__file__), 'usuarios.db')

def conecta_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    return conn, cursor

def cria_tabela():
    conn, cursor = conecta_db()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios(
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            USERNAME TEXT NOT NULL,
            EMAIL TEXT NOT NULL UNIQUE,
            SENHA TEXT NOT NULL
        );
    ''')
    conn.commit()
    conn.close()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'Backend funcionando!',
        'service': 'Marcelo Real Estate API'
    }), 200

cria_tabela()

@app.route('/cadastro', methods=['POST'])
def cadastro():
    data = request.get_json()
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    senha = data.get('senha', '')
    confirma_senha = data.get('confirma_senha', '')

    # Validações
    if ' ' in username:
        return jsonify({'erro': 'O nome de usuário não pode conter espaços.'}), 400
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not email or '@' not in email or not re.match(email_regex, email):
        return jsonify({'erro': 'Digite um e-mail válido.'}), 400
    if not username or not email or not senha or not confirma_senha:
        return jsonify({'erro': 'Por favor, preencha todos os campos!'}), 400
    if senha != confirma_senha:
        return jsonify({'erro': 'As senhas não coincidem.'}), 400

    conn, cursor = conecta_db()
    cursor.execute('SELECT * FROM usuarios WHERE EMAIL = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'erro': 'Este e-mail já está cadastrado.'}), 400
    cursor.execute('SELECT * FROM usuarios WHERE USERNAME = ?', (username,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'erro': 'Este nome de usuário já está cadastrado.'}), 400

    senha_hash = hashlib.sha256(senha.encode()).hexdigest()
    cursor.execute('INSERT INTO usuarios (USERNAME, EMAIL, SENHA) VALUES (?, ?, ?)', (username, email, senha_hash))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Usuário cadastrado com sucesso!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    senha = data.get('senha', '')
    if not username or not senha:
        return jsonify({'erro': 'Preencha todos os campos!'}), 400
    
    conn, cursor = conecta_db()
    # Permite login por username ou email
    cursor.execute('SELECT ID, USERNAME, EMAIL, SENHA FROM usuarios WHERE USERNAME = ? OR EMAIL = ?', (username, username))
    resultado = cursor.fetchone()
    conn.close()
    
    if resultado:
        user_id, user_username, user_email, stored_password = resultado
        senha_hash = hashlib.sha256(senha.encode()).hexdigest()
        if senha_hash == stored_password:
            return jsonify({
                'mensagem': 'Login realizado com sucesso!',
                'user': {
                    'id': user_id,
                    'username': user_username,
                    'email': user_email
                }
            }), 200
        else:
            return jsonify({'erro': 'Senha incorreta.'}), 401
    else:
        return jsonify({'erro': 'Usuário não encontrado.'}), 404

if __name__ == '__main__':
    cria_tabela()  # Inicializa o banco
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
