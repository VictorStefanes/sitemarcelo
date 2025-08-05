# 🚀 PLANO DE REESTRUTURAÇÃO PARA NETLIFY

## 📁 ESTRUTURA ATUAL VS NETLIFY

### ❌ Estrutura Atual (Problemática)
```
sitemarcelo/
├── site-marcelo/          ← Extra folder
    ├── html/             ← Files in subfolder
    │   ├── index.html
    │   ├── lancamentos.html
    │   ├── dashboard.html
    │   └── ...
    ├── css/
    ├── js/
    ├── assets/
    └── backend/          ← Won't work on Netlify
```

### ✅ Estrutura Ideal para Netlify
```
sitemarcelo/
├── index.html            ← Root level
├── lancamentos.html
├── dashboard.html
├── css/
├── js/
├── assets/
├── _redirects           ← Netlify config
├── netlify.toml         ← Build settings
└── README.md
```

## 🔧 COMANDOS PARA REESTRUTURAÇÃO

### 1. Mover arquivos HTML para raiz:
```bash
mv site-marcelo/html/* ./
```

### 2. Mover pastas de recursos:
```bash
mv site-marcelo/css ./
mv site-marcelo/js ./
mv site-marcelo/assets ./
```

### 3. Corrigir caminhos nos HTML:
```html
<!-- De: -->
<link rel="stylesheet" href="../css/styles.css">

<!-- Para: -->
<link rel="stylesheet" href="css/styles.css">
```

## 🌐 CONFIGURAÇÃO NETLIFY

### Arquivo _redirects:
```
/dashboard/* /dashboard.html 200
/* /index.html 200
```

### Arquivo netlify.toml:
```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/dashboard/*"
  to = "/dashboard.html"
  status = 200
```

## 🔄 BACKEND SEPARATION

### Para o Backend (Heroku/Railway):
1. Criar repositório separado apenas com:
   - backend/
   - requirements.txt
   - Procfile
   - runtime.txt

### Configuração de CORS:
```python
# No backend, configurar domínio do Netlify
CORS(app, origins=[
    "https://seu-site.netlify.app",
    "http://localhost:3000"  # Para desenvolvimento
])
```

## 📝 CHECKLIST DE DEPLOY

### Frontend (Netlify):
- [ ] Mover HTMLs para raiz
- [ ] Corrigir todos os caminhos relativos
- [ ] Configurar _redirects
- [ ] Testar localmente
- [ ] Deploy no Netlify

### Backend (Heroku):
- [ ] Criar repo separado
- [ ] Configurar CORS para Netlify URL
- [ ] Adicionar variáveis de ambiente
- [ ] Deploy no Heroku
- [ ] Atualizar URLs no frontend
