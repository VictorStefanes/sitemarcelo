# 🚀 DEPLOY GUIDE - Marcelo Imóveis

## 📋 RESUMO DA REESTRUTURAÇÃO

### ✅ **Status Deploy Anterior**
- **Backend**: Configurado para Heroku (Procfile + requirements.txt)
- **URL Anterior**: Para recuperar, acesse [Heroku Dashboard](https://dashboard.heroku.com/apps)
- **Estrutura**: Preparada com DEPLOY_READY.md

### ✅ **Problemas Corrigidos para Netlify**
1. **Estrutura de Pastas**: ✅ HTMLs movidos para raiz
2. **Caminhos Relativos**: ✅ Corrigidos de `../css/` para `css/`
3. **Configuração Netlify**: ✅ Arquivos `_redirects` e `netlify.toml` criados
4. **Assets**: ✅ Todas as imagens e recursos reorganizados

## 🌐 DEPLOY SEPARADO (Recomendado)

### **FRONTEND → Netlify**
```bash
# 1. Fazer commit das mudanças
git add .
git commit -m "Reestruturação para Netlify"
git push origin main

# 2. No Netlify:
# - Conectar repositório GitHub
# - Build settings: 
#   - Build command: (deixar vazio)
#   - Publish directory: ./
```

### **BACKEND → Heroku/Railway**
```bash
# 1. Criar repositório separado para backend
mkdir marcelo-backend
cd marcelo-backend

# 2. Copiar apenas arquivos do backend
cp -r site-marcelo/backend/* .
cp Procfile .
cp requirements.txt .

# 3. Deploy no Heroku
git init
git add .
git commit -m "Backend inicial"
heroku create marcelo-imoveis-api
git push heroku main
```

## 📁 ESTRUTURA ATUAL (Netlify Ready)

```
✅ ESTRUTURA OTIMIZADA:
sitemarcelo/
├── index.html              ← ✅ Na raiz
├── dashboard.html           ← ✅ Na raiz  
├── lancamentos.html         ← ✅ Na raiz
├── mais-procurados.html     ← ✅ Na raiz
├── css/                     ← ✅ Caminhos corrigidos
├── js/                      ← ✅ Caminhos corrigidos
├── assets/                  ← ✅ Caminhos corrigidos
├── _redirects              ← ✅ Configuração Netlify
├── netlify.toml            ← ✅ Configuração avançada
└── site-marcelo/           ← ⚠️ Pasta original (pode remover)
```

## 🔧 CONFIGURAÇÕES NETLIFY

### **Arquivo `_redirects`:**
```
/dashboard/* /dashboard.html 200
/admin/* /dashboard.html 200
/* /index.html 200
```

### **Arquivo `netlify.toml`:**
- ✅ Headers de segurança
- ✅ Redirecionamentos SPA
- ✅ Build settings otimizadas

## 🔗 CONFIGURAÇÃO CORS (Backend)

Quando fizer deploy do backend, configure o CORS:

```python
# No properties_api.py
CORS(app, origins=[
    "https://seu-site.netlify.app",
    "https://marcelo-imoveis.netlify.app",  # Sua URL
    "http://localhost:3000"  # Para desenvolvimento
])
```

## 📝 CHECKLIST DE DEPLOY

### Frontend (Netlify):
- [x] HTMLs na raiz
- [x] Caminhos corrigidos (`css/`, `js/`, `assets/`)
- [x] Arquivo `_redirects` criado
- [x] Arquivo `netlify.toml` configurado
- [ ] **Deploy no Netlify**

### Backend (Heroku):
- [x] Procfile configurado
- [x] Requirements.txt atualizado
- [ ] **Criar repo separado**
- [ ] **Deploy no Heroku**
- [ ] **Configurar CORS com URL do Netlify**

## 🚀 PRÓXIMOS PASSOS

1. **Deploy Frontend**: 
   - Faça push para GitHub
   - Conecte ao Netlify
   - Configure domínio personalizado

2. **Deploy Backend**:
   - Crie repo separado só com backend
   - Deploy no Heroku/Railway
   - Configure variáveis de ambiente

3. **Configurar URLs**:
   - Atualize `js/config.js` com URL do backend
   - Configure CORS no backend com URL do frontend

## 🎯 RESULTADO ESPERADO

- **Frontend**: `https://marcelo-imoveis.netlify.app`
- **Backend**: `https://marcelo-api.herokuapp.com`
- **Dashboard**: Funcionando em `/dashboard`
- **Responsividade**: 100% funcional

---

### 📞 **Suporte**
Se precisar de ajuda com o deploy, consulte a documentação ou peça assistência!
