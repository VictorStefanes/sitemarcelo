# 🚀 BACKEND API - SISTEMA DE IMÓVEIS

## 📋 **O que foi criado:**

### **Arquivos do Backend:**
- `backend/api.py` - API principal Flask
- `backend/production_server.py` - Servidor de produção
- `backend/.env` - Configurações de ambiente
- `start_backend.bat` - Script Windows para iniciar
- `start_backend.sh` - Script Linux/Mac para iniciar

### **Banco de Dados:**
- **SQLite**: `backend/properties.db` (criado automaticamente)
- **Tabelas**:
  - `properties` - Propriedades/imóveis
  - `sales` - Registro de vendas

## 🔧 **Como usar:**

### **1. Iniciar o Backend:**
```bash
# Windows
start_backend.bat

# Linux/Mac
chmod +x start_backend.sh
./start_backend.sh

# Manual
cd backend
python api.py
```

### **2. Dashboard conectará automaticamente:**
- ✅ Modo Online: Dados salvos no banco
- ❌ Modo Offline: Dados apenas no navegador

## 🌐 **Endpoints da API:**

### **Propriedades:**
- `GET /properties` - Lista propriedades
- `POST /properties` - Adiciona propriedade
- `PUT /properties/{id}` - Atualiza propriedade
- `DELETE /properties/{id}` - Remove propriedade

### **Vendas:**
- `POST /sales` - Registra venda

### **Estatísticas:**
- `GET /stats` - Estatísticas gerais
- `GET /health` - Status da API

## ✅ **Vantagens do Modo Online:**

1. **Dados Permanentes**: Salvos no banco SQLite
2. **Backup Automático**: Dados não são perdidos
3. **Sincronização**: Dashboard ↔ Páginas em tempo real
4. **Performance**: Melhor que localStorage
5. **Escalabilidade**: Suporta múltiplos usuários

## 🚀 **Status:**
- ✅ Backend funcionando em `http://localhost:5001`
- ✅ Dashboard conectado em modo online
- ✅ Banco de dados inicializado
- ✅ Pronto para uso em produção

**Agora o sistema está completo e funcionando em modo online! 🎉**
