from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import hashlib
import re
import os
import uuid
import base64
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Permite requisições de outros domínios

# Configurações
DB_PATH = os.path.join(os.path.dirname(__file__), 'imoveis.db')
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

# Cria a pasta de uploads se não existir
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def conecta_db():
    """Conecta ao banco de dados SQLite"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    return conn, cursor

def cria_tabelas():
    """Cria as tabelas necessárias para o sistema de imóveis"""
    conn, cursor = conecta_db()
    
    # Tabela de usuários (para autenticação do dashboard)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')
    
    # Tabela de propriedades/imóveis
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS properties(
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'disponivel',
            bedrooms INTEGER,
            bathrooms INTEGER,
            area REAL,
            description TEXT,
            features TEXT,
            views INTEGER DEFAULT 0,
            leads INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')
    
    # Tabela de imagens dos imóveis
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS property_images(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            property_id TEXT NOT NULL,
            image_path TEXT NOT NULL,
            image_order INTEGER DEFAULT 0,
            is_main BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
        );
    ''')
    
    # Tabela de logs/atividades (para o dashboard)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS activity_logs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            activity_type TEXT NOT NULL,
            description TEXT NOT NULL,
            property_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE SET NULL
        );
    ''')
    
    conn.commit()
    conn.close()
    print("Tabelas criadas com sucesso!")

# Inicializa as tabelas
cria_tabelas()

def salvar_imagem_base64(base64_data, property_id, order):
    """Salva uma imagem em base64 no disco e retorna o caminho"""
    try:
        # Remove o prefixo data:image/...;base64,
        if ',' in base64_data:
            base64_data = base64_data.split(',')[1]
        
        # Decodifica a imagem
        image_data = base64.b64decode(base64_data)
        
        # Gera um nome único para a imagem
        filename = f"{property_id}_{order}_{uuid.uuid4().hex[:8]}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # Salva a imagem
        with open(filepath, 'wb') as f:
            f.write(image_data)
        
        return filename
    except Exception as e:
        print(f"Erro ao salvar imagem: {e}")
        return None

def registrar_atividade(activity_type, description, property_id=None):
    """Registra uma atividade no log"""
    conn, cursor = conecta_db()
    cursor.execute('''
        INSERT INTO activity_logs (activity_type, description, property_id)
        VALUES (?, ?, ?)
    ''', (activity_type, description, property_id))
    conn.commit()
    conn.close()

# ===========================================
# ROTAS DE AUTENTICAÇÃO
# ===========================================

@app.route('/auth/login', methods=['POST'])
def login():
    """Autenticação de usuário para o dashboard"""
    data = request.get_json()
    username = data.get('username', '').strip()
    senha = data.get('senha', '')
    
    if not username or not senha:
        return jsonify({'erro': 'Preencha todos os campos!'}), 400
    
    conn, cursor = conecta_db()
    cursor.execute('SELECT id, senha FROM usuarios WHERE username = ?', (username,))
    resultado = cursor.fetchone()
    conn.close()
    
    if resultado:
        senha_hash = hashlib.sha256(senha.encode()).hexdigest()
        if senha_hash == resultado[1]:
            return jsonify({
                'mensagem': 'Login realizado com sucesso!',
                'user_id': resultado[0]
            }), 200
        else:
            return jsonify({'erro': 'Senha incorreta.'}), 401
    else:
        return jsonify({'erro': 'Usuário não encontrado.'}), 404

# ===========================================
# ROTAS DE PROPRIEDADES
# ===========================================

@app.route('/properties', methods=['GET'])
def listar_propriedades():
    """Lista propriedades com filtros opcionais por categoria e limite"""
    conn, cursor = conecta_db()
    
    # Obtém parâmetros da query string
    category = request.args.get('category')
    limit = request.args.get('limit')
    
    # Constrói a query SQL baseada nos parâmetros
    if category:
        query = '''
            SELECT p.*, GROUP_CONCAT(pi.image_path ORDER BY pi.image_order) as images
            FROM properties p
            LEFT JOIN property_images pi ON p.id = pi.property_id
            WHERE p.category = ?
            GROUP BY p.id
            ORDER BY p.created_at DESC
        '''
        params = [category]
    else:
        query = '''
            SELECT p.*, GROUP_CONCAT(pi.image_path ORDER BY pi.image_order) as images
            FROM properties p
            LEFT JOIN property_images pi ON p.id = pi.property_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        '''
        params = []
    
    # Adiciona LIMIT se especificado
    if limit:
        try:
            limit_int = int(limit)
            query += ' LIMIT ?'
            params.append(limit_int)
        except ValueError:
            pass  # Ignora limit inválido
    
    cursor.execute(query, params)
    
    properties = []
    for row in cursor.fetchall():
        property_data = {
            'id': row[0],
            'title': row[1],
            'location': row[2],
            'price': row[3],
            'category': row[4],
            'status': row[5],
            'bedrooms': row[6],
            'bathrooms': row[7],
            'area': row[8],
            'description': row[9],
            'features': json.loads(row[10]) if row[10] else [],
            'views': row[11],
            'leads': row[12],
            'created_at': row[13],
            'updated_at': row[14],
            'images': row[15].split(',') if row[15] else []
        }
        properties.append(property_data)
    
    conn.close()
    return jsonify({'properties': properties}), 200

@app.route('/properties/<category>', methods=['GET'])
def listar_propriedades_por_categoria(category):
    """Lista propriedades de uma categoria específica"""
    conn, cursor = conecta_db()
    
    cursor.execute('''
        SELECT p.*, GROUP_CONCAT(pi.image_path ORDER BY pi.image_order) as images
        FROM properties p
        LEFT JOIN property_images pi ON p.id = pi.property_id
        WHERE p.category = ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
    ''', (category,))
    
    properties = []
    for row in cursor.fetchall():
        property_data = {
            'id': row[0],
            'title': row[1],
            'location': row[2],
            'price': row[3],
            'category': row[4],
            'status': row[5],
            'bedrooms': row[6],
            'bathrooms': row[7],
            'area': row[8],
            'description': row[9],
            'features': json.loads(row[10]) if row[10] else [],
            'views': row[11],
            'leads': row[12],
            'created_at': row[13],
            'updated_at': row[14],
            'images': row[15].split(',') if row[15] else []
        }
        properties.append(property_data)
    
    conn.close()
    return jsonify(properties), 200

@app.route('/properties', methods=['POST'])
def criar_propriedade():
    """Cria uma nova propriedade com imagens"""
    data = request.get_json()
    
    # Gera ID único
    property_id = str(uuid.uuid4())
    
    # Dados da propriedade
    title = data.get('title')
    location = data.get('location')
    price = data.get('price')
    category = data.get('category')
    status = data.get('status', 'disponivel')
    bedrooms = data.get('bedrooms', 0)
    bathrooms = data.get('bathrooms', 0)
    area = data.get('area', 0)
    description = data.get('description', '')
    features = json.dumps(data.get('features', []))
    images = data.get('images', [])
    
    # Validações básicas
    if not all([title, location, price, category]):
        return jsonify({'erro': 'Campos obrigatórios: title, location, price, category'}), 400
    
    conn, cursor = conecta_db()
    
    try:
        # Insere a propriedade
        cursor.execute('''
            INSERT INTO properties (id, title, location, price, category, status, 
                                  bedrooms, bathrooms, area, description, features)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (property_id, title, location, price, category, status, 
              bedrooms, bathrooms, area, description, features))
        
        # Processa e salva as imagens
        for i, image_data in enumerate(images):
            if image_data:
                filename = salvar_imagem_base64(image_data, property_id, i)
                if filename:
                    cursor.execute('''
                        INSERT INTO property_images (property_id, image_path, image_order, is_main)
                        VALUES (?, ?, ?, ?)
                    ''', (property_id, filename, i, i == 0))
        
        conn.commit()
        
        # Registra atividade
        registrar_atividade('property_created', f'Nova propriedade criada: {title}', property_id)
        
        conn.close()
        return jsonify({
            'mensagem': 'Propriedade criada com sucesso!',
            'property_id': property_id
        }), 201
        
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'erro': f'Erro ao criar propriedade: {str(e)}'}), 500

@app.route('/properties/<property_id>', methods=['PUT'])
def atualizar_propriedade(property_id):
    """Atualiza uma propriedade existente"""
    data = request.get_json()
    
    conn, cursor = conecta_db()
    
    try:
        # Atualiza dados da propriedade
        cursor.execute('''
            UPDATE properties SET
                title = ?, location = ?, price = ?, category = ?, status = ?,
                bedrooms = ?, bathrooms = ?, area = ?, description = ?, features = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            data.get('title'), data.get('location'), data.get('price'),
            data.get('category'), data.get('status'),
            data.get('bedrooms'), data.get('bathrooms'), data.get('area'),
            data.get('description'), json.dumps(data.get('features', [])),
            property_id
        ))
        
        # Se há novas imagens, remove as antigas e adiciona as novas
        if 'images' in data:
            # Remove imagens antigas
            cursor.execute('DELETE FROM property_images WHERE property_id = ?', (property_id,))
            
            # Adiciona novas imagens
            for i, image_data in enumerate(data['images']):
                if image_data:
                    filename = salvar_imagem_base64(image_data, property_id, i)
                    if filename:
                        cursor.execute('''
                            INSERT INTO property_images (property_id, image_path, image_order, is_main)
                            VALUES (?, ?, ?, ?)
                        ''', (property_id, filename, i, i == 0))
        
        conn.commit()
        
        # Registra atividade
        registrar_atividade('property_updated', f'Propriedade atualizada: {data.get("title")}', property_id)
        
        conn.close()
        return jsonify({'mensagem': 'Propriedade atualizada com sucesso!'}), 200
        
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'erro': f'Erro ao atualizar propriedade: {str(e)}'}), 500

@app.route('/properties/<property_id>', methods=['DELETE'])
def deletar_propriedade(property_id):
    """Deleta uma propriedade e suas imagens"""
    conn, cursor = conecta_db()
    
    try:
        # Busca as imagens para deletar os arquivos
        cursor.execute('SELECT image_path FROM property_images WHERE property_id = ?', (property_id,))
        images = cursor.fetchall()
        
        # Deleta arquivos de imagem
        for (image_path,) in images:
            filepath = os.path.join(UPLOAD_FOLDER, image_path)
            if os.path.exists(filepath):
                os.remove(filepath)
        
        # Deleta propriedade (CASCADE deleta as imagens automaticamente)
        cursor.execute('DELETE FROM properties WHERE id = ?', (property_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'erro': 'Propriedade não encontrada'}), 404
        
        conn.commit()
        
        # Registra atividade
        registrar_atividade('property_deleted', f'Propriedade deletada: {property_id}')
        
        conn.close()
        return jsonify({'mensagem': 'Propriedade deletada com sucesso!'}), 200
        
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'erro': f'Erro ao deletar propriedade: {str(e)}'}), 500

# ===========================================
# ROTAS DE IMAGENS
# ===========================================

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve arquivos de imagem"""
    return send_from_directory(UPLOAD_FOLDER, filename)

# ===========================================
# ROTAS DE ANALYTICS
# ===========================================

@app.route('/analytics/stats', methods=['GET'])
def estatisticas():
    """Retorna estatísticas para o dashboard"""
    conn, cursor = conecta_db()
    
    # Conta propriedades por status
    cursor.execute('SELECT status, COUNT(*) FROM properties GROUP BY status')
    status_counts = dict(cursor.fetchall())
    
    # Conta propriedades por categoria
    cursor.execute('SELECT category, COUNT(*) FROM properties GROUP BY category')
    category_counts = dict(cursor.fetchall())
    
    # Total de visualizações e leads
    cursor.execute('SELECT SUM(views), SUM(leads) FROM properties')
    total_views, total_leads = cursor.fetchone()
    
    # Atividades recentes
    cursor.execute('''
        SELECT activity_type, description, created_at 
        FROM activity_logs 
        ORDER BY created_at DESC 
        LIMIT 10
    ''')
    recent_activities = [
        {
            'type': row[0],
            'description': row[1],
            'date': row[2]
        }
        for row in cursor.fetchall()
    ]
    
    conn.close()
    
    return jsonify({
        'status_counts': status_counts,
        'category_counts': category_counts,
        'total_views': total_views or 0,
        'total_leads': total_leads or 0,
        'recent_activities': recent_activities
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
