# 🏠 Sistema de Dashboard para Imóveis - Marcelo Augusto

## 📋 Visão Geral

Sistema completo para gerenciamento de propriedades imobiliárias com:
- ✅ **Dashboard premium** com interface moderna
- ✅ **Múltiplas imagens** por propriedade (até 10 imagens)
- ✅ **Carrossel de imagens** nos cards
- ✅ **Backend Python/Flask** com banco SQLite
- ✅ **Modo offline/online** automático
- ✅ **Analytics** e relatórios em tempo real

## 🚀 Como Usar

### 1. Inicialização Rápida
```bash
cd backend
start_server.bat
```

### 2. Acesso ao Sistema
- **Dashboard**: http://localhost:8080/html/dashboard.html
- **Site Principal**: http://localhost:8080/html/index.html
- **API**: http://localhost:5001

### 3. Login no Dashboard
- **Usuário**: `admin`
- **Senha**: `admin123`

## 🔧 Instalação Manual

### Pré-requisitos
- Python 3.8+
- Navegador moderno

### Backend (API)
```bash
cd backend
pip install -r requirements.txt
python init_db.py
python properties_api.py
```

### Frontend
```bash
# Qualquer servidor HTTP, exemplo:
python -m http.server 8080
```

## 📊 Estrutura do Banco de Dados

### ✅ Tabelas Criadas Automaticamente:

1. **`usuarios`** - Autenticação do dashboard
   - id, username, email, senha, created_at

2. **`properties`** - Dados dos imóveis
   - id, title, location, price, category, status
   - bedrooms, bathrooms, area, description, features
   - views, leads, created_at, updated_at

3. **`property_images`** - Múltiplas imagens por imóvel
   - id, property_id, image_path, image_order, is_main

4. **`activity_logs`** - Log de atividades
   - id, activity_type, description, property_id, created_at

### 🖼️ Armazenamento de Imagens

- **Formato**: Base64 convertido para JPG
- **Localização**: `backend/uploads/`
- **Limite**: 10 imagens por propriedade
- **Tamanho máximo**: 5MB por imagem
- **Formatos aceitos**: JPG, PNG, WebP

## 🎯 Funcionalidades

### 📋 Dashboard
- ✅ Visão geral com estatísticas
- ✅ Gerenciar propriedades (CRUD)
- ✅ Upload múltiplas imagens (drag & drop)
- ✅ Carrossel de imagens nos cards
- ✅ Filtros e busca em tempo real
- ✅ Analytics com gráficos (Chart.js)
- ✅ Design responsivo mobile

### 🖼️ Sistema de Imagens
- ✅ **Upload múltiplo**: Até 10 imagens por propriedade
- ✅ **Drag & Drop**: Arrastar imagens para upload
- ✅ **Preview dinâmico**: Visualização em tempo real
- ✅ **Reordenação**: Arrastar para reordenar imagens
- ✅ **Carrossel nos cards**: Navegação com setas e pontos
- ✅ **Validação**: Tamanho e formato automático

### 🌐 Modo Online/Offline
- ✅ **Auto-detecção**: Verifica conexão com backend
- ✅ **Indicador visual**: Status de conexão
- ✅ **Fallback local**: Funciona sem backend
- ✅ **Sincronização**: Dados salvos quando volta online

## 📱 Integração com Site

### Seções Automáticas
- **Lançamentos**: `category = 'lancamentos'`
- **Mais Procurados**: `category = 'mais-procurados'`
- **Beira Mar**: `category = 'beira-mar'`
- **Pronto para Morar**: `category = 'pronto-morar'`

### JavaScript de Integração
```javascript
// Carrega automaticamente do dashboard
<script src="../js/dashboard-api.js"></script>
<script src="../js/index-highlights.js"></script>
```

## 🔒 Segurança

- ✅ Senhas com hash SHA256
- ✅ Validação de dados no backend
- ✅ CORS configurado
- ✅ Sanitização de uploads
- ✅ Validação de tipos de arquivo

## 🛠️ Arquivos Principais

### Backend
- `properties_api.py` - API principal
- `init_db.py` - Inicialização do banco
- `start_server.bat` - Script de inicialização

### Frontend
- `dashboard.html` - Interface do dashboard
- `dashboard-core.js` - Lógica principal
- `dashboard-backend.js` - Integração com API
- `dashboard-animations.css` - Estilos e animações

## 📈 Próximos Passos

1. **Deploy em produção** (Heroku/DigitalOcean)
2. **Autenticação JWT** mais robusta
3. **Notificações push** para novos leads
4. **Backup automático** do banco
5. **Integração WhatsApp** para contatos

## 🆘 Troubleshooting

### Backend não inicia
```bash
# Verificar Python
python --version

# Reinstalar dependências
pip install -r requirements.txt --force-reinstall
```

### Imagens não aparecem
- Verificar se a pasta `uploads` existe
- Verificar permissões de escrita
- Conferir se o servidor está rodando na porta 5001

### Dashboard mostra "Offline"
- Verificar se `properties_api.py` está rodando
- Conferir se a porta 5001 está liberada
- Testar acesso direto: http://localhost:5001/properties

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs no console do navegador (F12)
2. Verificar logs do servidor Python
3. Conferir se todas as dependências estão instaladas

---

**Sistema desenvolvido para Marcelo Augusto - Consultor de Imóveis** 🏠✨
