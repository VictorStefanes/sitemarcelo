/**
 * SCRIPT DE LIMPEZA - REMOVE ARQUIVOS DUPLICADOS E DESNECESSÁRIOS
 * Execute este script para limpar o projeto de arquivos duplicados
 */

console.log('🧹 INICIANDO LIMPEZA DE ARQUIVOS DUPLICADOS...\n');

// Lista de arquivos duplicados/desnecessários para remover
const filesToRemove = [
    // Arquivos de teste e verificação desnecessários
    'verify-integrity.html',
    'teste-sistema.html', 
    'test-backend.html',
    'template-imoveis.html',
    'check-integrity.js',
    
    // Duplicações da pasta site-marcelo (a raiz é usada no deploy)
    'site-marcelo/',
    
    // Arquivos de documentação em excesso (manter apenas README.md)
    'BOTOES_FIXOS_UPDATE.md',
    'CORRECAO_BOTOES_INDEX.md',
    'CORRECAO_TODAS_PAGINAS.md',
    'CORRECAO_WHATSAPP_ESPECIFICA.md',
    'CORREÇAO-FLASH-CARDS.md',
    'CREDENTIALS_INFO.md',
    'DEPLOY-GUIDE.md',
    'DEPLOY-NETLIFY-RENDER.md',
    'DEPLOY-RAPIDO.md',
    'DEPLOY-STEP-BY-STEP.md',
    'DEPLOY_COMPLETO.md',
    'DEPLOY_INSTRUCTIONS.md',
    'DEPLOY_READY.md',
    'netlify-structure-plan.md',
    'NETLIFY_DEPLOY_GUIDE.md',
    'README-Dashboard-Real.md',
    'README-Dashboard.md',
    'RELATORIO-FINAL-SISTEMA.md',
    'RELATORIO-STATUS-SISTEMA.md',
    'STATUS-FINAL.md',
    'VERIFICATION_COMPLETE.md',
    'VERIFICATION_REPORT.md',
    'WHATSAPP_BUTTONS_COMPLETE.md',
    
    // Páginas antigas/backup
    'beira-mar-novo.html',
    'dashboard-clean.html',
    'dashboard-modals.html',
    'formularios.html',
    
    // Ambiente virtual (não deve estar no repositório)
    '.venv/',
    
    // Arquivos temporários
    '.netlifyignore'
];

// Lista de arquivos JavaScript duplicados
const jsFilesToRemove = [
    'js/scripts.js', // Duplicado com script.js
    'js/sample-properties.js', // Arquivo de exemplo não usado
    'js/verify-system.js', // Arquivo de verificação temporário
    'js/clear-storage.js', // Arquivo de limpeza temporário
    'js/index-highlights-clean.js', // Versão duplicada
    'js/auth-system-clean.js', // Versão duplicada
    'js/filters.js' // Se não estiver sendo usado
];

console.log('📋 ANÁLISE DE ESTRUTURA ATUAL:');
console.log('');

console.log('✅ ARQUIVOS PRINCIPAIS (MANTER):');
console.log('├── index.html');
console.log('├── beira-mar.html');
console.log('├── mais-procurados.html'); 
console.log('├── lancamentos.html');
console.log('├── pronto-morar.html');
console.log('├── dashboard.html');
console.log('├── README.md');
console.log('├── netlify.toml');
console.log('├── _redirects');
console.log('├── Procfile');
console.log('├── requirements.txt');
console.log('├── css/');
console.log('├── js/');
console.log('├── assets/');
console.log('└── html/ (se usado)');
console.log('');

console.log('❌ ARQUIVOS PARA REMOVER:');
filesToRemove.forEach(file => {
    console.log(`🗑️ ${file}`);
});
console.log('');

console.log('❌ ARQUIVOS JS DUPLICADOS:');
jsFilesToRemove.forEach(file => {
    console.log(`🗑️ ${file}`);
});
console.log('');

console.log('🎯 ESTRUTURA FINAL RECOMENDADA:');
console.log('');
console.log('sitemarcelo/');
console.log('├── index.html              # Página principal');
console.log('├── beira-mar.html          # Categoria beira-mar');
console.log('├── mais-procurados.html    # Categoria mais procurados');
console.log('├── lancamentos.html        # Categoria lançamentos');
console.log('├── pronto-morar.html       # Categoria pronto para morar');
console.log('├── dashboard.html          # Painel administrativo');
console.log('├── README.md               # Documentação');
console.log('├── netlify.toml           # Configuração deploy');
console.log('├── _redirects             # Redirecionamentos');
console.log('├── Procfile               # Deploy backend');
console.log('├── requirements.txt       # Dependências Python');
console.log('├── css/');
console.log('│   ├── styles.css         # Estilos principais');
console.log('│   ├── dashboard.css      # Estilos dashboard');
console.log('│   ├── dropdown.css       # Estilos dropdown');
console.log('│   └── empty-states.css   # Estados vazios');
console.log('├── js/');
console.log('│   ├── script.js          # Script principal');
console.log('│   ├── config.js          # Configurações');
console.log('│   ├── homepage-properties.js');
console.log('│   ├── category-loader.js');
console.log('│   ├── category-page.js');
console.log('│   ├── location-manager.js');
console.log('│   ├── dashboard-core.js');
console.log('│   ├── dashboard-auth.js');
console.log('│   ├── dashboard-api.js');
console.log('│   ├── dashboard-backend.js');
console.log('│   ├── dashboard-property-sync.js');
console.log('│   ├── auth-system.js');
console.log('│   └── lancamentos.js');
console.log('├── assets/');
console.log('│   ├── images/');
console.log('│   └── svg/');
console.log('└── backend/');
console.log('    ├── api.py');
console.log('    ├── production_server.py');
console.log('    ├── requirements.txt');
console.log('    └── *.db');
console.log('');

console.log('⚠️ AÇÕES RECOMENDADAS:');
console.log('');
console.log('1. 🗂️ REMOVER pasta site-marcelo/ (duplicada)');
console.log('2. 🗑️ REMOVER arquivos de teste e documentação em excesso');
console.log('3. 🧹 REMOVER arquivos JavaScript duplicados');
console.log('4. 🔗 VERIFICAR links internos após limpeza');
console.log('5. ✅ TESTAR todas as páginas após limpeza');
console.log('');

console.log('🚨 IMPORTANTE:');
console.log('- Faça backup antes de executar a limpeza');
console.log('- Teste o site após cada etapa');
console.log('- Mantenha apenas os arquivos essenciais');
console.log('- A estrutura da raiz é usada no deploy');
console.log('');

console.log('✅ LIMPEZA PLANEJADA CONCLUÍDA!');

// Função para executar limpeza automática (CUIDADO!)
function executeCleanup() {
    console.log('⚠️ ESTA FUNÇÃO REMOVERIA OS ARQUIVOS AUTOMATICAMENTE');
    console.log('💡 Execute manualmente para maior segurança');
    
    // Aqui estaria o código para remover os arquivos
    // Por segurança, apenas mostra as instruções
}

// Disponibilizar função globalmente
if (typeof window !== 'undefined') {
    window.executeCleanup = executeCleanup;
}
