# 🏠 Marcelo Real Estate API

API backend para o sistema de imóveis do Marcelo Augusto.

## 🚀 Como Executar

### 📋 Pré-requisitos

- Python 3.8+
- pip (gerenciador de pacotes Python)

### 📦 Instalação

```bash
pip install -r requirements.txt
```

### ⚡ Execução Rápida

#### Para Desenvolvimento (localhost):
```bash
# Windows
start_development.bat

# Linux/Mac
python api.py
```

#### Para Produção:
```bash
# Windows
start_production.bat

# Linux/Mac
bash start_production.sh
```

### 🔧 Configurações Detalhadas

#### Servidor de Desenvolvimento
- ⚠️ **APENAS para desenvolvimento local**
- 🔧 Debug ativado
- 🌐 Host: localhost
- 🚪 Port: 5000
- 📝 Logs detalhados

```bash
python api.py
```

#### Servidor de Produção
- ✅ **Para uso em produção**
- 🏭 Gunicorn WSGI Server
- 🔧 4 workers
- 🌐 Host: 0.0.0.0
- 🚪 Port: 5000
- 📊 Logs otimizados

```bash
# Usando Gunicorn diretamente
gunicorn --workers 4 --bind 0.0.0.0:5000 production_server:app

# Ou usando o script
./start_production.sh
```

## 📋 Endpoints da API

### 🏠 Propriedades

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/properties` | Lista todas as propriedades |
| GET | `/properties?category=beira-mar` | Filtra por categoria |
| GET | `/properties?limit=4` | Limita resultados |
| POST | `/properties` | Adiciona nova propriedade |
| PUT | `/properties/{id}` | Atualiza propriedade |
| DELETE | `/properties/{id}` | Remove propriedade |

### 👤 Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/cadastro` | Cadastra novo usuário |
| POST | `/login` | Autentica usuário |

### ℹ️ Sistema

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status do sistema |
| GET | `/categories` | Lista categorias disponíveis |

## 🗂️ Categorias de Imóveis

- `mais-procurados` - Mais Procurados
- `lancamentos` - Lançamentos  
- `pronto-morar` - Pronto para Morar
- `beira-mar` - Beira Mar

## 💾 Banco de Dados

- **SQLite** para desenvolvimento
- **PostgreSQL** recomendado para produção
- Arquivos: `imoveis.db`, `usuarios.db`

## 🔐 Segurança

- Senhas criptografadas com SHA-256
- Validação de email
- CORS configurado
- Headers de segurança

## 📁 Estrutura de Arquivos

```
backend/
├── api.py                 # API principal
├── production_server.py   # Configuração de produção
├── requirements.txt       # Dependências
├── Procfile              # Deploy Heroku/Render
├── start_production.bat  # Script produção (Windows)
├── start_production.sh   # Script produção (Linux/Mac)
├── start_development.bat # Script desenvolvimento
├── imoveis.db           # Banco de propriedades
└── usuarios.db          # Banco de usuários
```

## 🌐 Deploy

### Heroku
```bash
git push heroku main
```

### Render
- Conecte o repositório
- Use o comando: `gunicorn production_server:app`

### VPS
```bash
# Clone o projeto
git clone <repo>
cd backend

# Instale dependências
pip install -r requirements.txt

# Execute em produção
bash start_production.sh
```

## 🐛 Resolução de Problemas

### "WARNING: This is a development server"
- ✅ **Normal** - Aparece ao usar `python api.py`
- 🔧 **Solução** - Use `start_production.bat` para produção

### Erro de porta ocupada
```bash
# Encontrar processo na porta 5000
netstat -ano | findstr :5000

# Matar processo (Windows)
taskkill /PID <PID> /F
```

### Banco de dados não encontrado
- O banco é criado automaticamente na primeira execução
- Verifique permissões de escrita na pasta

## 📞 Suporte

- 📧 Email: admin@marcelo-imoveis.com
- 🔧 Issues: GitHub Issues
- 📱 WhatsApp: 5582987654321

---

## ⚠️ Notas Importantes

1. **Desenvolvimento vs Produção**:
   - Use `api.py` apenas para desenvolvimento
   - Use `production_server.py` + Gunicorn para produção

2. **Performance**:
   - Servidor de desenvolvimento: 1 thread
   - Servidor de produção: 4 workers

3. **Logs**:
   - Desenvolvimento: Logs detalhados no terminal
   - Produção: Logs otimizados para monitoramento

4. **CORS**:
   - Configurado para aceitar requisições do frontend
   - Ajuste as origens conforme necessário
