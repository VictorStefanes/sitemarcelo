# 🚀 GUIA COMPLETO DE DEPLOY - NETLIFY + RENDER

## 📁 Estrutura do Projeto

```
sitemarcelo/
├── 🌐 FRONTEND (para Netlify)
│   ├── index.html
│   ├── dashboard.html
│   ├── lancamentos.html
│   ├── mais-procurados.html
│   ├── beira-mar.html
│   ├── pronto-morar.html
│   ├── dashboard-modals.html
│   ├── _redirects
│   ├── netlify.toml
│   ├── css/
│   ├── js/
│   └── assets/
│
└── 🐍 BACKEND (para Render)
    └── site-marcelo/backend/
        ├── properties_api.py
        ├── requirements.txt
        └── Procfile (na raiz)
```

---

## 🌐 PARTE 1: DEPLOY FRONTEND NO NETLIFY

### 1️⃣ Preparação dos Arquivos

**Arquivos que devem estar na RAIZ do projeto:**
- ✅ `index.html`
- ✅ `dashboard.html`
- ✅ `lancamentos.html`
- ✅ `mais-procurados.html`
- ✅ `beira-mar.html`
- ✅ `pronto-morar.html`
- ✅ `dashboard-modals.html`
- ✅ `_redirects`
- ✅ `netlify.toml`
- ✅ Pastas: `css/`, `js/`, `assets/`

### 2️⃣ Deploy no Netlify

#### Opção A: Deploy Manual (Recomendado)
1. **Acesse**: https://netlify.com
2. **Login** na sua conta
3. **Clique**: "Add new site" > "Deploy manually"
4. **Arraste**: A pasta `sitemarcelo` inteira para o Netlify
5. **Aguarde**: O deploy será feito automaticamente

#### Opção B: Deploy via Git
1. **Acesse**: https://netlify.com
2. **Login** na sua conta
3. **Clique**: "Add new site" > "Import from Git"
4. **Conecte**: GitHub repository `VictorStefanes/sitemarcelo`
5. **Configurações**:
   - **Branch**: `main`
   - **Build command**: deixe vazio
   - **Publish directory**: `/` (raiz)
   - **Deploy**: Clique em "Deploy site"

### 3️⃣ Configurações Netlify
- **Site name**: `marcelo-imoveis` (ou escolha outro)
- **Custom domain**: Configure se tiver domínio próprio
- **HTTPS**: Habilitado automaticamente
- **Forms**: Não necessário

---

## 🐍 PARTE 2: DEPLOY BACKEND NO RENDER

### 1️⃣ Verificar Arquivos do Backend

**Na pasta `site-marcelo/backend/`:**
```
✅ properties_api.py - API Flask principal
✅ requirements.txt - Dependências Python
```

**Na raiz do projeto:**
```
✅ Procfile - Comando de inicialização
```

### 2️⃣ Deploy no Render

1. **Acesse**: https://render.com
2. **Login** na sua conta
3. **Clique**: "New" > "Web Service"
4. **Conecte**: GitHub repository `VictorStefanes/sitemarcelo`

### 3️⃣ Configurações do Render

**Basic Settings:**
- **Name**: `marcelo-imoveis-api`
- **Environment**: `Python 3`
- **Region**: `Oregon (US West)` ou `Frankfurt (EU)`
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `pip install -r site-marcelo/backend/requirements.txt`
- **Start Command**: `cd site-marcelo/backend && python properties_api.py`

**Environment Variables:**
- `PYTHON_VERSION`: `3.11.0`
- `PORT`: `10000` (automático)

### 4️⃣ Clique em "Create Web Service"

---

## 🔗 PARTE 3: CONECTAR FRONTEND E BACKEND

### 1️⃣ Obter URL do Backend
Após deploy no Render, você receberá uma URL como:
```
https://marcelo-imoveis-api.onrender.com
```

### 2️⃣ Atualizar Frontend
Edite o arquivo `js/api-config.js` ou `js/config.js`:

```javascript
// Configuração da API
const API_BASE_URL = 'https://marcelo-imoveis-api.onrender.com';

// ou se estiver em config.js:
window.Config = {
    apiBaseURL: 'https://marcelo-imoveis-api.onrender.com'
};
```

### 3️⃣ Configurar CORS no Backend
No arquivo `site-marcelo/backend/properties_api.py`, certifique-se que tem:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://seu-site.netlify.app",  # Substitua pela sua URL Netlify
    "https://seudominio.com.br",    # Se tiver domínio próprio
    "http://localhost:3000"         # Para desenvolvimento local
])
```

### 4️⃣ Redesploy no Netlify
Após alterar a configuração da API:
1. Faça upload novamente no Netlify
2. Ou se estiver conectado ao Git, faça commit e push

---

## ✅ PARTE 4: VERIFICAÇÕES PÓS-DEPLOY

### 🌐 Frontend (Netlify)
Teste a URL do seu site (ex: `https://marcelo-imoveis.netlify.app`):

- ✅ **Página inicial carrega**
- ✅ **Navegação funciona**: lançamentos, mais-procurados, etc.
- ✅ **Dashboard acessível**: `/dashboard`
- ✅ **Login funciona**: `marcelo` / `marcelo123!`
- ✅ **WhatsApp buttons funcionam**
- ✅ **Scroll to top funciona**
- ✅ **Mobile responsivo**

### 🐍 Backend (Render)
Teste a URL da API (ex: `https://marcelo-imoveis-api.onrender.com`):

- ✅ **Health check**: `GET /health` retorna 200
- ✅ **Properties endpoint**: `GET /api/properties`
- ✅ **CORS headers presentes**

### 📱 Dashboard com Dados Reais
No dashboard, teste:

- ✅ **Inicia com zeros** (não dados fictícios)
- ✅ **Botão "📍 Adicionar Propriedade"** abre modal
- ✅ **Botão "💰 Registrar Venda"** funciona
- ✅ **Botão "👤 Novo Lead"** adiciona
- ✅ **Botão "👁️ +1 Visualização"** incrementa
- ✅ **Gráficos atualizam** após ações
- ✅ **Dados persistem** no localStorage

---

## 🛠️ SOLUÇÃO DE PROBLEMAS

### Frontend não carrega
```
❌ Problema: Página em branco
✅ Solução: Verificar console do navegador por erros 404
✅ Verificar se _redirects está funcionando
```

### Dashboard não funciona
```
❌ Problema: Botões não respondem
✅ Solução: Verificar se real-dashboard-data.js carregou
✅ Verificar se dashboard-modals.html está acessível
```

### Backend não responde
```
❌ Problema: API retorna erro
✅ Solução: Verificar logs no painel do Render
✅ Verificar se requirements.txt está correto
✅ Verificar se Procfile aponta para arquivo correto
```

### CORS errors
```
❌ Problema: Blocked by CORS policy
✅ Solução: Atualizar origins no Flask com URL real do Netlify
✅ Verificar se Flask-CORS está instalado
```

---

## 📋 CHECKLIST FINAL

### Antes do Deploy
- [ ] ✅ Arquivos na estrutura correta
- [ ] ✅ `_redirects` e `netlify.toml` na raiz
- [ ] ✅ `Procfile` aponta para backend correto
- [ ] ✅ `requirements.txt` completo

### Durante o Deploy
- [ ] ✅ Netlify deploy sem erros
- [ ] ✅ Render build successful
- [ ] ✅ URLs funcionais obtidas

### Após Deploy
- [ ] ✅ Site carrega corretamente
- [ ] ✅ API responde
- [ ] ✅ Dashboard funciona
- [ ] ✅ CORS configurado
- [ ] ✅ Mobile otimizado

---

## 🎯 URLs FINAIS

Após o deploy, você terá:

### 🌐 Frontend
- **Site principal**: `https://marcelo-imoveis.netlify.app`
- **Dashboard**: `https://marcelo-imoveis.netlify.app/dashboard`

### 🐍 Backend
- **API**: `https://marcelo-imoveis-api.onrender.com`
- **Health**: `https://marcelo-imoveis-api.onrender.com/health`

---

## 🚀 RESUMO DOS PASSOS

1. **📤 Upload pasta completa** no Netlify
2. **🔗 Conectar repositório** no Render
3. **⚙️ Configurar build commands** no Render
4. **🔄 Atualizar API URL** no frontend
5. **✅ Testar tudo** funcionando

**🎉 Site e API prontos para produção!**
