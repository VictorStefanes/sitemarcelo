# 🚀 DEPLOY STEP-BY-STEP: NETLIFY + RENDER

## 🎯 OVERVIEW RÁPIDO

**Estrutura atual**: ✅ Pronta para deploy  
**Frontend**: Netlify (gratuito)  
**Backend**: Render (gratuito)  
**Tempo estimado**: 15-20 minutos  

---

## 📋 PRÉ-REQUISITOS

- [x] ✅ Conta GitHub (já tem)
- [x] ✅ Repositório `sitemarcelo` (já tem)
- [ ] 🆕 Conta Netlify (criar se não tiver)
- [ ] 🆕 Conta Render (criar se não tiver)

---

## 🌐 PASSO 1: DEPLOY FRONTEND (NETLIFY)

### 1.1 Criar conta Netlify
1. Acesse: **https://netlify.com**
2. Clique **"Sign up"**
3. **"Sign up with GitHub"** (recomendado)
4. Autorize a conexão

### 1.2 Deploy do projeto
1. **Dashboard Netlify** → **"Add new site"**
2. **"Import from Git"**
3. **"GitHub"** → Autorize se necessário
4. **Selecione**: `VictorStefanes/sitemarcelo`

### 1.3 Configurações de build
```
Site name: marcelo-imoveis (ou outro nome)
Branch to deploy: main
Build command: (deixe vazio - frontend apenas)
Publish directory: / (raiz)
```

**IMPORTANTE**: O Netlify é apenas para o frontend (HTML/CSS/JS). Não precisa instalar Python!

### 1.4 Deploy
1. **"Deploy site"**
2. ⏳ Aguarde 2-3 minutos
3. ✅ **URL gerada**: `https://marcelo-imoveis.netlify.app`

---

## 🐍 PASSO 2: DEPLOY BACKEND (RENDER)

### 2.1 Criar conta Render
1. Acesse: **https://render.com**
2. **"Get Started"**
3. **"GitHub"** → Autorize conexão

### 2.2 Criar Web Service
1. **Dashboard Render** → **"New +"**
2. **"Web Service"**
3. **"Connect repository"** → `VictorStefanes/sitemarcelo`

### 2.3 Configurações do serviço
```
Name: marcelo-imoveis-api
Environment: Python 3
Region: Oregon (US West)
Branch: main

Build Command:
pip install -r site-marcelo/backend/requirements.txt

Start Command:
cd site-marcelo/backend && gunicorn --bind 0.0.0.0:$PORT properties_api:app
```

**IMPORTANTE**: Usar Gunicorn para produção (não o servidor de desenvolvimento Flask)

### 2.4 Environment Variables (opcional)
```
PYTHON_VERSION: 3.11.0
```

### 2.5 Deploy
1. **"Create Web Service"**
2. ⏳ Aguarde 5-10 minutos (build inicial demora mais)
3. ✅ **URL gerada**: `https://marcelo-imoveis-api.onrender.com`

---

## 🔗 PASSO 3: VERIFICAR FUNCIONAMENTO

### 3.1 Testar Frontend
1. **Acesse**: `https://marcelo-imoveis.netlify.app`
2. ✅ **Página inicial** carrega
3. ✅ **Navegação** funciona: Lançamentos, Mais Procurados, etc.
4. ✅ **Dashboard** acessível: `/dashboard`

### 3.2 Testar Login
1. **Acesse**: `https://marcelo-imoveis.netlify.app/dashboard`
2. **Login**: `marcelo`
3. **Senha**: `marcelo123!`
4. ✅ **Dashboard** carrega com zeros reais

### 3.3 Testar Backend (opcional)
1. **Acesse**: `https://marcelo-imoveis-api.onrender.com/health`
2. ✅ **Resposta**: `{"status": "ok", "message": "API funcionando"}`

### 3.4 Testar Integração Completa
1. **No dashboard**: Adicione uma propriedade
   - Título: "Apartamento Teste"
   - Tipo: "apartamento"
   - Preço: 350000
   - Localização: "Centro, Maceió"
   - Quartos: 2, Banheiros: 1, Garagem: 1
2. **Navegue para**: `/lancamentos`
3. ✅ **Propriedade aparece** na listagem
4. ✅ **Filtros funcionam**

---

## 🎨 PASSO 4: PERSONALIZAR (OPCIONAL)

### 4.1 Netlify - Personalizar URL
1. **Site settings** → **Site details**
2. **"Change site name"**
3. Digite: `marcelo-imoveis` (se disponível)
4. **Save**

### 4.2 Netlify - Domínio customizado (se tiver)
1. **Domain settings** → **"Add custom domain"**
2. Digite seu domínio: `marceloimoveis.com.br`
3. Configure DNS conforme instruções

---

## 🔧 TROUBLESHOOTING

### ❌ Problema: Erro Pillow no Netlify
**Erro**: `KeyError: '__version__'` durante build do Pillow
**Solução**: 
- O Netlify é apenas para frontend, não precisa de Python
- Remover `requirements.txt` da raiz do projeto
- Manter apenas `site-marcelo/backend/requirements.txt` para o Render

### ❌ Problema: Site não carrega
**Solução**: 
- Verificar logs no Netlify
- Confirmar se `_redirects` e `netlify.toml` estão na raiz

### ❌ Problema: Dashboard em branco
**Solução**:
- Abrir Console (F12) → verificar erros
- Confirmar se JavaScript carregou

### ❌ Problema: Warning "development server" no Render
**Aviso**: `WARNING: This is a development server. Do not use it in a production deployment.`
**Solução**: 
- Atualizar Procfile para usar Gunicorn: `gunicorn --bind 0.0.0.0:$PORT properties_api:app`
- Fazer redeploy no Render
- ✅ Gunicorn é o servidor WSGI recomendado para produção

### ❌ Problema: Backend não responde
**Solução**:
- Verificar logs no Render
- Confirmar se `Procfile` está correto
- Aguardar build completo (pode demorar)

### ❌ Problema: Propriedades não aparecem
**Solução**:
- Aguardar 30 segundos (sincronização automática)
- Recarregar página
- Verificar localStorage no navegador

---

## 📊 MONITORAMENTO

### Netlify
- **Analytics**: Visualizações automáticas
- **Deploy log**: Histórico de deploys
- **Forms**: Se implementar formulários

### Render
- **Metrics**: CPU, Memória, Response time
- **Logs**: Logs em tempo real da aplicação
- **Events**: Histórico de deploys e restarts

---

## 💰 CUSTOS

### Netlify (Gratuito)
- ✅ **100GB** largura de banda/mês
- ✅ **300 minutos** de build/mês
- ✅ **HTTPS** automático
- ✅ **Deploy** automático via Git

### Render (Gratuito)
- ✅ **750 horas** de runtime/mês
- ✅ **Hibernação** após 15min inativo
- ✅ **512MB RAM**
- ⏱️ **Cold start**: ~30 segundos

---

## 🎯 URLs FINAIS

Após deploy completo:

### 🌐 Site Principal
**URL**: `https://marcelo-imoveis.netlify.app`

**Páginas**:
- `/` - Página inicial
- `/dashboard` - Dashboard administrativo
- `/lancamentos` - Lançamentos
- `/mais-procurados` - Mais procurados
- `/beira-mar` - Beira mar
- `/pronto-morar` - Pronto para morar

### 🔗 API Backend
**URL**: `https://marcelo-imoveis-api.onrender.com`

**Endpoints**:
- `/health` - Status da API
- `/api/properties` - Lista de propriedades

---

## 🎉 CHECKLIST FINAL

### Antes do Deploy
- [x] ✅ Código testado localmente
- [x] ✅ Arquivos de configuração prontos
- [x] ✅ Sistema de autenticação funcionando
- [x] ✅ Dashboard com dados reais

### Durante o Deploy
- [ ] 🔄 Netlify build sem erros
- [ ] 🔄 Render build sem erros
- [ ] 🔄 URLs geradas anotadas

### Após o Deploy
- [ ] ✅ Site carrega corretamente
- [ ] ✅ Login funciona
- [ ] ✅ Dashboard operacional
- [ ] ✅ Propriedades sincronizam
- [ ] ✅ Filtros funcionais
- [ ] ✅ Mobile responsivo

---

## 🚀 RESULTADO ESPERADO

**Sistema 100% funcional na web!**

O corretor Marcelo terá:
- ✅ **Site profissional** com suas propriedades
- ✅ **Dashboard administrativo** para gestão
- ✅ **Sistema real** sem dados fictícios
- ✅ **Sincronização automática** entre seções
- ✅ **Acesso seguro** com login protegido

**🎯 Pronto para receber clientes!**
