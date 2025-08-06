# SCRIPT DE SINCRONIZAÇÃO E LIMPEZA - PowerShell
# Copia as versões mais atualizadas para a raiz e remove duplicatas

Write-Host "🔄 SINCRONIZANDO VERSÕES MAIS ATUALIZADAS..." -ForegroundColor Cyan
Write-Host ""

# Backup da estrutura atual
Write-Host "📦 Criando backup..." -ForegroundColor Yellow
$backupName = "backup-sitemarcelo-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item -Path "." -Destination "../$backupName" -Recurse -Force

Write-Host ""
Write-Host "🔍 ANALISANDO DIFERENÇAS..." -ForegroundColor Green

# Verificar qual dashboard é mais recente
if ((Test-Path "site-marcelo\html\dashboard.html") -and (Test-Path "dashboard.html")) {
    Write-Host "📊 Dashboards encontrados em ambos locais" -ForegroundColor Blue
    
    # Verificar se tem location-manager
    $dashboardContent = Get-Content "site-marcelo\html\dashboard.html" -Raw
    if ($dashboardContent -like "*location-manager*") {
        Write-Host "✅ Dashboard do site-marcelo/ tem location-manager (mais atualizado)" -ForegroundColor Green
        Copy-Item "site-marcelo\html\dashboard.html" "dashboard.html" -Force
        Write-Host "📋 Dashboard sincronizado" -ForegroundColor Blue
    }
}

# Verificar outros arquivos HTML
$htmlFiles = @("beira-mar", "mais-procurados", "lancamentos", "pronto-morar")
foreach ($file in $htmlFiles) {
    $source = "site-marcelo\html\$file.html"
    $dest = "$file.html"
    
    if ((Test-Path $source) -and (Test-Path $dest)) {
        $sourceSize = (Get-Item $source).Length
        $destSize = (Get-Item $dest).Length
        
        if ($sourceSize -gt $destSize) {
            Write-Host "📄 $file.html do site-marcelo/ é maior, copiando..." -ForegroundColor Yellow
            Copy-Item $source $dest -Force
        }
    }
}

# Sincronizar CSS se necessário
if (Test-Path "site-marcelo\css") {
    Write-Host "🎨 Sincronizando CSS..." -ForegroundColor Magenta
    Copy-Item "site-marcelo\css\*" "css\" -Recurse -Force
}

# Sincronizar JS se necessário  
if (Test-Path "site-marcelo\js") {
    Write-Host "📜 Sincronizando JavaScript..." -ForegroundColor Yellow
    Copy-Item "site-marcelo\js\*" "js\" -Recurse -Force
}

# Sincronizar Assets
if (Test-Path "site-marcelo\assets") {
    Write-Host "🖼️ Sincronizando Assets..." -ForegroundColor Green
    Copy-Item "site-marcelo\assets\*" "assets\" -Recurse -Force
}

Write-Host ""
Write-Host "🗑️ REMOVENDO ARQUIVOS DUPLICADOS..." -ForegroundColor Red

# Remover pasta site-marcelo após sincronização
if (Test-Path "site-marcelo") {
    Write-Host "📁 Removendo pasta site-marcelo/ (duplicada)" -ForegroundColor Red
    Remove-Item "site-marcelo" -Recurse -Force
}

# Remover arquivos de teste
$testFiles = @(
    "verify-integrity.html",
    "teste-sistema.html", 
    "test-backend.html",
    "template-imoveis.html",
    "check-integrity.js",
    "beira-mar-novo.html",
    "dashboard-clean.html",
    "dashboard-modals.html",
    "formularios.html"
)

foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Write-Host "🗑️ Removendo $file" -ForegroundColor DarkRed
        Remove-Item $file -Force
    }
}

# Remover documentação em excesso (manter apenas README.md)
$docFiles = @(
    "BOTOES_FIXOS_UPDATE.md",
    "CORRECAO_BOTOES_INDEX.md",
    "CORRECAO_TODAS_PAGINAS.md",
    "CORRECAO_WHATSAPP_ESPECIFICA.md",
    "CORREÇAO-FLASH-CARDS.md",
    "CREDENTIALS_INFO.md",
    "DEPLOY-GUIDE.md",
    "DEPLOY-NETLIFY-RENDER.md",
    "DEPLOY-RAPIDO.md",
    "DEPLOY-STEP-BY-STEP.md",
    "DEPLOY_COMPLETO.md",
    "DEPLOY_INSTRUCTIONS.md",
    "DEPLOY_READY.md",
    "netlify-structure-plan.md",
    "NETLIFY_DEPLOY_GUIDE.md",
    "README-Dashboard-Real.md",
    "README-Dashboard.md",
    "RELATORIO-FINAL-SISTEMA.md",
    "RELATORIO-STATUS-SISTEMA.md",
    "STATUS-FINAL.md",
    "VERIFICATION_COMPLETE.md",
    "VERIFICATION_REPORT.md",
    "WHATSAPP_BUTTONS_COMPLETE.md"
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Host "📚 Removendo documentação: $file" -ForegroundColor DarkYellow
        Remove-Item $file -Force
    }
}

# Remover arquivos JS duplicados
$jsDuplicates = @(
    "js\scripts.js",
    "js\sample-properties.js",
    "js\verify-system.js",
    "js\clear-storage.js",
    "js\index-highlights-clean.js",
    "js\auth-system-clean.js"
)

foreach ($file in $jsDuplicates) {
    if (Test-Path $file) {
        Write-Host "📜 Removendo JS duplicado: $file" -ForegroundColor DarkMagenta
        Remove-Item $file -Force
    }
}

# Remover arquivos temporários
if (Test-Path ".netlifyignore") {
    Write-Host "🗑️ Removendo .netlifyignore" -ForegroundColor Red
    Remove-Item ".netlifyignore" -Force
}

if (Test-Path "cleanup-analysis.js") {
    Write-Host "🗑️ Removendo script de análise temporário" -ForegroundColor Red
    Remove-Item "cleanup-analysis.js" -Force
}

Write-Host ""
Write-Host "📊 ESTRUTURA FINAL:" -ForegroundColor Cyan
Write-Host ""
Get-ChildItem -Recurse -Include *.html, *.js, *.css, *.md | Select-Object -First 20 | ForEach-Object { $_.FullName }
Write-Host ""

Write-Host "✅ SINCRONIZAÇÃO E LIMPEZA CONCLUÍDA!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Testar todas as páginas" -ForegroundColor White
Write-Host "2. Verificar links internos" -ForegroundColor White
Write-Host "3. Fazer commit das mudanças" -ForegroundColor White
Write-Host "4. Fazer deploy de teste" -ForegroundColor White
Write-Host ""
