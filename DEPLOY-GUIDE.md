# 🚀 Guia de Deploy - Marcelo Imóveis

## 📁 Estrutura Final do Projeto

```
sitemarcelo/
├── 🌐 FRONTEND (Netlify)
│   ├── index.html
│   ├── lancamentos.html
│   ├── mais-procurados.html
│   ├── beira-mar.html
│   ├── pronto-morar.html (se existir)
│   ├── dashboard.html
│   ├── dashboard-modals.html
│   ├── _redirects
│   ├── netlify.toml
│   ├── css/
│   │   ├── styles.css
│   │   ├── dashboard.css
│   │   ├── dashboard-animations.css
│   │   ├── real-dashboard.css
│   │   └── (outros CSS)
│   ├── js/
│   │   ├── real-dashboard-data.js ⭐ NOVO
│   │   ├── real-dashboard-charts.js ⭐ NOVO
│   │   ├── dashboard-*.js
│   │   └── (outros JS)
│   └── assets/
│       └── images/
│
└── 🐍 BACKEND (Render)
    └── site-marcelo/backend/
        ├── properties_api.py
        ├── app.py
        ├── imoveis.db
        ├── requirements.txt
        └── Procfile
```

## 🌐 Deploy Frontend (Netlify)

### 1️⃣ Preparação
```bash
# Na pasta raiz do projeto (sitemarcelo/)
# Verificar se todos os arquivos estão na raiz:
✅ index.html
✅ dashboard.html  
✅ dashboard-modals.html
✅ _redirects
✅ netlify.toml
✅ css/ (pasta)
✅ js/ (pasta)
✅ assets/ (pasta)
```

### 2️⃣ Netlify Deploy
1. **Login no Netlify**: https://netlify.com
2. **New site from Git** ou **Deploy manually**
3. **Opção Manual**:
   - Arraste a pasta `sitemarcelo/` inteira
   - Ou faça zip da pasta raiz
4. **Opção Git**:
   - Conecte ao repositório GitHub
   - Branch: `main`
   - Build command: deixe vazio
   - Publish directory: `/` (raiz)

### 3️⃣ Configurações Netlify
- **Site name**: `marcelo-imoveis` (ou personalizado)
- **Custom domain**: Configure seu domínio
- **HTTPS**: Habilitado automaticamente
- **Forms**: Não necessário

### 4️⃣ Variáveis de Ambiente
No painel Netlify > Site settings > Environment variables:
```
API_URL = https://seu-backend.onrender.com
```

## 🐍 Deploy Backend (Render)

### 1️⃣ Preparação do Backend
Verifique se existe na pasta `site-marcelo/backend/`:
```bash
✅ properties_api.py
✅ requirements.txt
✅ Procfile (na raiz do projeto)
```

### 2️⃣ Requirements.txt
Conteúdo correto:
```pip
Flask==2.3.3
Flask-CORS==4.0.0
Pillow==10.0.1
```

### 3️⃣ Procfile
Conteúdo correto:
```bash
web: cd site-marcelo/backend && python properties_api.py
```

### 4️⃣ Render Deploy
1. **Login no Render**: https://render.com
2. **New > Web Service**
3. **Connect Repository**: GitHub (mesmo repo)
4. **Configurações**:
   - **Name**: `marcelo-imoveis-api`
   - **Environment**: `Python 3`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd site-marcelo/backend && python properties_api.py`

### 5️⃣ Variáveis de Ambiente Render
No painel Render > Environment:
```
PYTHON_VERSION = 3.11.0
PORT = 10000 (automático)
```

## 🔗 Configuração de CORS

### Frontend (JavaScript)
No arquivo `js/api-config.js` ou similar:
```javascript
// URL do backend no Render
const API_BASE_URL = 'https://marcelo-imoveis-api.onrender.com';

// Configuração de requisições
const apiConfig = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
};
```

### Backend (Flask)
No `properties_api.py`:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://marcelo-imoveis.netlify.app",  # Seu domínio Netlify
    "https://seudominio.com.br",           # Seu domínio personalizado
    "http://localhost:3000",               # Para desenvolvimento local
])
```

## ⚙️ Verificações Pós-Deploy

### ✅ Frontend (Netlify)
1. **Acesse**: `https://marcelo-imoveis.netlify.app`
2. **Teste navegação**:
   - ✅ Página inicial carrega
   - ✅ Links funcionam (lançamentos, mais-procurados, etc.)
   - ✅ WhatsApp buttons funcionam
   - ✅ Scroll to top funciona
3. **Teste dashboard**:
   - ✅ `/dashboard` redireciona para dashboard.html
   - ✅ Login funciona (marcelo/marcelo123!)
   - ✅ Botões de ação aparecem
   - ✅ Modais abrem corretamente

### ✅ Backend (Render)
1. **Acesse**: `https://marcelo-imoveis-api.onrender.com`
2. **Teste endpoints**:
   - ✅ `GET /health` retorna 200
   - ✅ `GET /api/properties` retorna lista
   - ✅ CORS headers presentes

### ✅ Dashboard com Dados Reais
1. **Acesse dashboard**
2. **Teste funcionalidades**:
   - ✅ Contadores iniciam em 0
   - ✅ "📍 Adicionar Propriedade" funciona
   - ✅ "💰 Registrar Venda" funciona
   - ✅ "👤 Novo Lead" funciona
   - ✅ "👁️ +1 Visualização" funciona
   - ✅ Gráficos atualizam automaticamente
   - ✅ Dados persistem no localStorage

## 🐛 Troubleshooting

### Frontend não carrega
```bash
# Verificar no console do navegador:
- Erros 404 para CSS/JS?
- Caminhos corretos?
- _redirects funcionando?
```

### Dashboard não funciona
```bash
# Verificar console:
- real-dashboard-data.js carregou?
- dashboard-modals.html carregou?
- Sem erros JavaScript?
```

### Backend não responde
```bash
# Verificar logs no Render:
- Flask iniciou corretamente?
- Porta 10000 configurada?
- requirements.txt instalado?
```

### CORS errors
```bash
# No backend Flask:
- CORS configurado para domínio correto?
- Headers sendo enviados?
- Preflight requests permitidos?
```

## 📱 URLs Finais

### 🌐 Frontend (Netlify)
- **Principal**: `https://marcelo-imoveis.netlify.app`
- **Dashboard**: `https://marcelo-imoveis.netlify.app/dashboard`
- **Lançamentos**: `https://marcelo-imoveis.netlify.app/lancamentos`

### 🐍 Backend (Render)
- **API**: `https://marcelo-imoveis-api.onrender.com`
- **Health**: `https://marcelo-imoveis-api.onrender.com/health`

## 🎯 Checklist Final

### Antes do Deploy
- [ ] ✅ Dados fictícios removidos
- [ ] ✅ Scripts de demo removidos
- [ ] ✅ Caminhos relativos corretos
- [ ] ✅ CORS configurado
- [ ] ✅ Arquivos na raiz

### Após Deploy
- [ ] ✅ Site carrega corretamente
- [ ] ✅ Dashboard funciona
- [ ] ✅ Dados reais funcionam
- [ ] ✅ Mobile responsivo
- [ ] ✅ WhatsApp integration
- [ ] ✅ SSL habilitado

---

## 🏆 Resultado Final

✅ **Frontend**: Site estático otimizado no Netlify  
✅ **Backend**: API Flask no Render  
✅ **Dashboard**: Sistema de dados 100% reais  
✅ **Mobile**: Totalmente responsivo  
✅ **Performance**: Carregamento rápido  
✅ **Segurança**: HTTPS + headers de segurança  

**🎉 Site pronto para produção!**
