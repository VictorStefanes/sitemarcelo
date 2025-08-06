"""
API BACKEND FLASK - SISTEMA DE IMÓVEIS
Sistema completo para gerenciamento de propriedades
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Permite requests do frontend

# Configuração do banco de dados
DATABASE = 'properties.db'

def init_db():
    """Inicializa o banco de dados"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Tabela de propriedades
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS properties (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            price REAL NOT NULL,
            location TEXT NOT NULL,
            category TEXT NOT NULL,
            status TEXT DEFAULT 'disponivel',
            bedrooms INTEGER DEFAULT 0,
            bathrooms INTEGER DEFAULT 0,
            area REAL DEFAULT 0,
            type TEXT DEFAULT 'apartamento',
            description TEXT,
            features TEXT,
            images TEXT,
            date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            views INTEGER DEFAULT 0,
            leads INTEGER DEFAULT 0
        )
    ''')
    
    # Tabela de vendas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales (
            id TEXT PRIMARY KEY,
            property_id TEXT,
            sale_price REAL NOT NULL,
            commission REAL DEFAULT 0,
            client_name TEXT,
            sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (property_id) REFERENCES properties (id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Banco de dados inicializado")

def get_db():
    """Conecta ao banco de dados"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Permite acessar por nome da coluna
    return conn

@app.route('/health', methods=['GET'])
def health_check():
    """Verifica se a API está funcionando"""
    return jsonify({
        'status': 'OK',
        'message': 'API Backend funcionando',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/properties', methods=['GET'])
def get_properties():
    """Lista todas as propriedades"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Parâmetros opcionais
        category = request.args.get('category')
        status = request.args.get('status')
        limit = request.args.get('limit', type=int)
        
        query = 'SELECT * FROM properties WHERE 1=1'
        params = []
        
        if category and category != 'all':
            query += ' AND category = ?'
            params.append(category)
        
        if status and status != 'all':
            query += ' AND status = ?'
            params.append(status)
        
        query += ' ORDER BY date_added DESC'
        
        if limit:
            query += ' LIMIT ?'
            params.append(limit)
        
        cursor.execute(query, params)
        properties = []
        
        for row in cursor.fetchall():
            property_data = dict(row)
            # Converte strings JSON de volta para arrays/objetos
            try:
                property_data['features'] = json.loads(property_data['features'] or '[]')
                property_data['images'] = json.loads(property_data['images'] or '[]')
            except:
                property_data['features'] = []
                property_data['images'] = []
            
            properties.append(property_data)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'properties': properties,
            'count': len(properties)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/properties', methods=['POST'])
def add_property():
    """Adiciona nova propriedade"""
    try:
        data = request.get_json()
        
        # Validação básica
        required_fields = ['title', 'price', 'location', 'category']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'error': f'Campo obrigatório: {field}'
                }), 400
        
        # Gera ID único
        property_id = str(uuid.uuid4())
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Converte arrays/objetos para JSON
        features = json.dumps(data.get('features', []))
        images = json.dumps(data.get('images', []))
        
        cursor.execute('''
            INSERT INTO properties (
                id, title, price, location, category, status,
                bedrooms, bathrooms, area, type, description,
                features, images, views, leads
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            property_id,
            data['title'],
            data['price'],
            data['location'],
            data['category'],
            data.get('status', 'disponivel'),
            data.get('bedrooms', 0),
            data.get('bathrooms', 0),
            data.get('area', 0),
            data.get('type', 'apartamento'),
            data.get('description', ''),
            features,
            images,
            data.get('views', 0),
            data.get('leads', 0)
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Propriedade adicionada com sucesso',
            'property_id': property_id
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/properties/<property_id>', methods=['PUT'])
def update_property(property_id):
    """Atualiza propriedade existente"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Verifica se a propriedade existe
        cursor.execute('SELECT id FROM properties WHERE id = ?', (property_id,))
        if not cursor.fetchone():
            return jsonify({
                'success': False,
                'error': 'Propriedade não encontrada'
            }), 404
        
        # Converte arrays/objetos para JSON
        features = json.dumps(data.get('features', []))
        images = json.dumps(data.get('images', []))
        
        cursor.execute('''
            UPDATE properties SET
                title = ?, price = ?, location = ?, category = ?,
                status = ?, bedrooms = ?, bathrooms = ?, area = ?,
                type = ?, description = ?, features = ?, images = ?
            WHERE id = ?
        ''', (
            data.get('title'),
            data.get('price'),
            data.get('location'),
            data.get('category'),
            data.get('status', 'disponivel'),
            data.get('bedrooms', 0),
            data.get('bathrooms', 0),
            data.get('area', 0),
            data.get('type', 'apartamento'),
            data.get('description', ''),
            features,
            images,
            property_id
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Propriedade atualizada com sucesso'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/properties/<property_id>', methods=['DELETE'])
def delete_property(property_id):
    """Remove propriedade"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Verifica se a propriedade existe
        cursor.execute('SELECT id FROM properties WHERE id = ?', (property_id,))
        if not cursor.fetchone():
            return jsonify({
                'success': False,
                'error': 'Propriedade não encontrada'
            }), 404
        
        cursor.execute('DELETE FROM properties WHERE id = ?', (property_id,))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Propriedade removida com sucesso'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/sales', methods=['POST'])
def add_sale():
    """Registra uma venda"""
    try:
        data = request.get_json()
        
        required_fields = ['property_id', 'sale_price']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Campo obrigatório: {field}'
                }), 400
        
        sale_id = str(uuid.uuid4())
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Adiciona venda
        cursor.execute('''
            INSERT INTO sales (id, property_id, sale_price, commission, client_name)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            sale_id,
            data['property_id'],
            data['sale_price'],
            data.get('commission', 0),
            data.get('client_name', '')
        ))
        
        # Atualiza status da propriedade para vendida
        cursor.execute('''
            UPDATE properties SET status = 'vendido' WHERE id = ?
        ''', (data['property_id'],))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Venda registrada com sucesso',
            'sale_id': sale_id
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    """Retorna estatísticas do sistema"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Total de propriedades
        cursor.execute('SELECT COUNT(*) FROM properties')
        total_properties = cursor.fetchone()[0]
        
        # Propriedades por categoria
        cursor.execute('''
            SELECT category, COUNT(*) as count 
            FROM properties 
            GROUP BY category
        ''')
        by_category = dict(cursor.fetchall())
        
        # Propriedades por status
        cursor.execute('''
            SELECT status, COUNT(*) as count 
            FROM properties 
            GROUP BY status
        ''')
        by_status = dict(cursor.fetchall())
        
        # Total de vendas
        cursor.execute('SELECT COUNT(*), SUM(sale_price) FROM sales')
        sales_data = cursor.fetchone()
        total_sales = sales_data[0] or 0
        total_revenue = sales_data[1] or 0
        
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_properties': total_properties,
                'total_sales': total_sales,
                'total_revenue': total_revenue,
                'by_category': by_category,
                'by_status': by_status
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 Iniciando API Backend...")
    init_db()
    print("✅ Servidor rodando em http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
