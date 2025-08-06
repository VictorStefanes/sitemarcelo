#!/bin/bash

# SCRIPT DE SINCRONIZAÇÃO E LIMPEZA
# Copia as versões mais atualizadas para a raiz e remove duplicatas

echo "🔄 SINCRONIZANDO VERSÕES MAIS ATUALIZADAS..."
echo ""

# Backup da estrutura atual
echo "📦 Criando backup..."
cp -r . ../backup-sitemarcelo-$(date +%Y%m%d-%H%M%S)

echo ""
echo "🔍 ANALISANDO DIFERENÇAS..."

# Verificar qual dashboard é mais recente
if [ -f "site-marcelo/html/dashboard.html" ] && [ -f "dashboard.html" ]; then
    echo "📊 Dashboards encontrados em ambos locais"
    
    # Verificar se tem location-manager
    if grep -q "location-manager" site-marcelo/html/dashboard.html; then
        echo "✅ Dashboard do site-marcelo/ tem location-manager (mais atualizado)"
        cp site-marcelo/html/dashboard.html dashboard.html
        echo "📋 Dashboard sincronizado"
    fi
fi

# Verificar outros arquivos HTML
for file in beira-mar mais-procurados lancamentos pronto-morar; do
    if [ -f "site-marcelo/html/${file}.html" ] && [ -f "${file}.html" ]; then
        # Compare file sizes or modification dates
        size1=$(stat -c%s "site-marcelo/html/${file}.html" 2>/dev/null || echo 0)
        size2=$(stat -c%s "${file}.html" 2>/dev/null || echo 0)
        
        if [ "$size1" -gt "$size2" ]; then
            echo "📄 ${file}.html do site-marcelo/ é maior, copiando..."
            cp "site-marcelo/html/${file}.html" "${file}.html"
        fi
    fi
done

# Sincronizar CSS se necessário
if [ -d "site-marcelo/css" ]; then
    echo "🎨 Sincronizando CSS..."
    cp -r site-marcelo/css/* css/
fi

# Sincronizar JS se necessário  
if [ -d "site-marcelo/js" ]; then
    echo "📜 Sincronizando JavaScript..."
    cp -r site-marcelo/js/* js/
fi

# Sincronizar Assets
if [ -d "site-marcelo/assets" ]; then
    echo "🖼️ Sincronizando Assets..."
    cp -r site-marcelo/assets/* assets/
fi

echo ""
echo "🗑️ REMOVENDO ARQUIVOS DUPLICADOS..."

# Remover pasta site-marcelo após sincronização
if [ -d "site-marcelo" ]; then
    echo "📁 Removendo pasta site-marcelo/ (duplicada)"
    rm -rf site-marcelo/
fi

# Remover arquivos de teste
test_files=(
    "verify-integrity.html"
    "teste-sistema.html" 
    "test-backend.html"
    "template-imoveis.html"
    "check-integrity.js"
    "beira-mar-novo.html"
    "dashboard-clean.html"
    "dashboard-modals.html"
    "formularios.html"
)

for file in "${test_files[@]}"; do
    if [ -f "$file" ]; then
        echo "🗑️ Removendo $file"
        rm "$file"
    fi
done

# Remover documentação em excesso (manter apenas README.md)
doc_files=(
    "BOTOES_FIXOS_UPDATE.md"
    "CORRECAO_BOTOES_INDEX.md"
    "CORRECAO_TODAS_PAGINAS.md"
    "CORRECAO_WHATSAPP_ESPECIFICA.md"
    "CORREÇAO-FLASH-CARDS.md"
    "CREDENTIALS_INFO.md"
    "DEPLOY-GUIDE.md"
    "DEPLOY-NETLIFY-RENDER.md"
    "DEPLOY-RAPIDO.md"
    "DEPLOY-STEP-BY-STEP.md"
    "DEPLOY_COMPLETO.md"
    "DEPLOY_INSTRUCTIONS.md"
    "DEPLOY_READY.md"
    "netlify-structure-plan.md"
    "NETLIFY_DEPLOY_GUIDE.md"
    "README-Dashboard-Real.md"
    "README-Dashboard.md"
    "RELATORIO-FINAL-SISTEMA.md"
    "RELATORIO-STATUS-SISTEMA.md"
    "STATUS-FINAL.md"
    "VERIFICATION_COMPLETE.md"
    "VERIFICATION_REPORT.md"
    "WHATSAPP_BUTTONS_COMPLETE.md"
)

for file in "${doc_files[@]}"; do
    if [ -f "$file" ]; then
        echo "📚 Removendo documentação: $file"
        rm "$file"
    fi
done

# Remover arquivos JS duplicados
js_duplicates=(
    "js/scripts.js"
    "js/sample-properties.js"
    "js/verify-system.js"
    "js/clear-storage.js"
    "js/index-highlights-clean.js"
    "js/auth-system-clean.js"
)

for file in "${js_duplicates[@]}"; do
    if [ -f "$file" ]; then
        echo "📜 Removendo JS duplicado: $file"
        rm "$file"
    fi
done

# Remover arquivos temporários
if [ -f ".netlifyignore" ]; then
    echo "🗑️ Removendo .netlifyignore"
    rm ".netlifyignore"
fi

if [ -f "cleanup-analysis.js" ]; then
    echo "🗑️ Removendo script de análise temporário"
    rm "cleanup-analysis.js"
fi

echo ""
echo "📊 ESTRUTURA FINAL:"
echo ""
find . -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.md" | head -20
echo ""

echo "✅ SINCRONIZAÇÃO E LIMPEZA CONCLUÍDA!"
echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "1. Testar todas as páginas"
echo "2. Verificar links internos"
echo "3. Fazer commit das mudanças"
echo "4. Fazer deploy de teste"
echo ""
