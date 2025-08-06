from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import re
import os
import json
from datetime import datetime

app = Flask(__name__)
# Configuração CORS mais ampla para produção
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5500", 
    "http://127.0.0.1:5500",
    "http://localhost:8080",
    "https://*.netlify.app",
    "https://netlify.app",
    "https://sitemarcelo.netlify.app",
    "*"  # Temporário para debug
], supports_credentials=True, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

DB_PATH = os.path.join(os.path.dirname(__file__), 'usuarios.db')

def conecta_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    return conn, cursor

def cria_tabela():
    conn, cursor = conecta_db()
    # Tabela de usuários
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios(
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            USERNAME TEXT NOT NULL,
            EMAIL TEXT NOT NULL UNIQUE,
            SENHA TEXT NOT NULL
        );
    ''')
    
    # Tabela de propriedades
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS properties(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            price TEXT NOT NULL,
            location TEXT NOT NULL,
            category TEXT NOT NULL,
            type TEXT,
            area REAL,
            bedrooms INTEGER,
            bathrooms INTEGER,
            parking INTEGER,
            description TEXT,
            features TEXT,
            images TEXT,
            status TEXT DEFAULT 'disponivel',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')
    
    conn.commit()
    conn.close()

@app.route('/health', methods=['GET'])
def health_check():
    try:
        # Verifica se o banco está funcionando
        conn, cursor = conecta_db()
        cursor.execute('SELECT COUNT(*) FROM properties')
        properties_count = cursor.fetchone()[0]
        cursor.execute('SELECT COUNT(*) FROM usuarios')
        users_count = cursor.fetchone()[0]
        conn.close()
        
        return jsonify({
            'status': 'healthy',
            'message': 'Backend funcionando!',
            'service': 'Marcelo Real Estate API',
            'database': 'connected',
            'properties_count': properties_count,
            'users_count': users_count,
            'version': '1.0.0'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Backend com problemas',
            'service': 'Marcelo Real Estate API',
            'database': 'disconnected',
            'error': str(e)
        }), 500

@app.route('/categories', methods=['GET'])
def get_categories():
    """Retorna as categorias disponíveis de imóveis"""
    categories = [
        {
            'id': 'mais-procurados',
            'name': 'Mais Procurados',
            'description': 'Imóveis com maior procura no mercado'
        },
        {
            'id': 'lancamentos', 
            'name': 'Lançamentos',
            'description': 'Novos empreendimentos sendo lançados'
        },
        {
            'id': 'pronto-morar',
            'name': 'Pronto para Morar', 
            'description': 'Imóveis prontos para ocupação imediata'
        },
        {
            'id': 'beira-mar',
            'name': 'Beira Mar',
            'description': 'Imóveis localizados próximos ao mar'
        }
    ]
    
    return jsonify({
        'categories': categories,
        'total': len(categories)
    }), 200

# ENDPOINTS DE PROPRIEDADES
@app.route('/properties', methods=['GET'])
def get_properties():
    try:
        category = request.args.get('category')
        limit = request.args.get('limit', type=int)
        
        conn, cursor = conecta_db()
        
        if category:
            cursor.execute('SELECT * FROM properties WHERE category = ? ORDER BY created_at DESC', (category,))
        else:
            cursor.execute('SELECT * FROM properties ORDER BY created_at DESC')
        
        rows = cursor.fetchall()
        
        # Converte para lista de dicts
        properties = []
        for row in rows:
            property_dict = {
                'id': row[0],
                'title': row[1],
                'price': row[2],
                'location': row[3],
                'category': row[4],
                'type': row[5],
                'area': row[6],
                'bedrooms': row[7],
                'bathrooms': row[8],
                'parking': row[9],
                'description': row[10],
                'features': row[11].split(',') if row[11] else [],
                'images': json.loads(row[12]) if row[12] else [],
                'status': row[13],
                'created_at': row[14],
                'updated_at': row[15]
            }
            properties.append(property_dict)
        
        conn.close()
        
        # Aplica limite se especificado
        if limit:
            properties = properties[:limit]
        
        return jsonify({
            'properties': properties,
            'total': len(properties)
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/properties', methods=['POST'])
def add_property():
    try:
        data = request.get_json()
        
        # Validações básicas
        required_fields = ['title', 'price', 'location', 'category']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'erro': f'Campo {field} é obrigatório'}), 400
        
        conn, cursor = conecta_db()
        
        # Preparar dados
        images_json = json.dumps(data.get('images', []))
        features_str = ','.join(data.get('features', [])) if isinstance(data.get('features'), list) else data.get('features', '')
        
        cursor.execute('''
            INSERT INTO properties 
            (title, price, location, category, type, area, bedrooms, bathrooms, parking, description, features, images, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('title'),
            data.get('price'),
            data.get('location'),
            data.get('category'),
            data.get('type', ''),
            data.get('area', 0),
            data.get('bedrooms', 0),
            data.get('bathrooms', 0),
            data.get('parking', 0),
            data.get('description', ''),
            features_str,
            images_json,
            data.get('status', 'disponivel')
        ))
        
        property_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'mensagem': 'Propriedade adicionada com sucesso!',
            'id': property_id
        }), 201
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/properties/<int:property_id>', methods=['PUT'])
def update_property(property_id):
    try:
        data = request.get_json()
        
        conn, cursor = conecta_db()
        
        # Verificar se propriedade existe
        cursor.execute('SELECT id FROM properties WHERE id = ?', (property_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'erro': 'Propriedade não encontrada'}), 404
        
        # Preparar dados
        images_json = json.dumps(data.get('images', [])) if data.get('images') else None
        features_str = ','.join(data.get('features', [])) if isinstance(data.get('features'), list) else data.get('features', '')
        
        # Atualizar propriedade
        cursor.execute('''
            UPDATE properties 
            SET title = ?, price = ?, location = ?, category = ?, type = ?, 
                area = ?, bedrooms = ?, bathrooms = ?, parking = ?, description = ?, 
                features = ?, images = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            data.get('title'),
            data.get('price'),
            data.get('location'),
            data.get('category'),
            data.get('type'),
            data.get('area', 0),
            data.get('bedrooms', 0),
            data.get('bathrooms', 0),
            data.get('parking', 0),
            data.get('description'),
            features_str,
            images_json,
            data.get('status', 'disponivel'),
            property_id
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'mensagem': 'Propriedade atualizada com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/properties/<int:property_id>', methods=['DELETE'])
def delete_property(property_id):
    try:
        conn, cursor = conecta_db()
        
        # Verificar se propriedade existe
        cursor.execute('SELECT id FROM properties WHERE id = ?', (property_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'erro': 'Propriedade não encontrada'}), 404
        
        # Deletar propriedade
        cursor.execute('DELETE FROM properties WHERE id = ?', (property_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'mensagem': 'Propriedade removida com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

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
