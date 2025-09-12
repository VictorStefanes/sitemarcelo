/**
 * LIMPEZA COMPLETA DO DASHBOARD
 * Execute este script no console do navegador para remover TODOS os dados antigos
 */

console.log('🧹 INICIANDO LIMPEZA COMPLETA DO DASHBOARD...');

// Lista de todas as chaves possíveis de dados
const keysToRemove = [
    // Dashboard principal
    'dashboard_properties',
    'realDashboardData',
    
    // Propriedades por categoria
    'properties_lancamentos',
    'properties_mais-procurados',
    'properties_beira-mar',
    'properties_pronto-morar',
    
    // Dados de vendas
    'dashboard_sales',
    'sales_data',
    
    // Dados de estatísticas
    'dashboard_stats',
    'statistics_data',
    
    // Outros possíveis
    'sample_properties',
    'mock_properties',
    'properties_data',
    'dashboard_data'
];

let removedCount = 0;

// Remove cada chave
keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
        console.log(`🗑️ Removendo: ${key}`);
        localStorage.removeItem(key);
        removedCount++;
    }
});

// Limpa também qualquer chave que contenha 'properties' ou 'dashboard'
Object.keys(localStorage).forEach(key => {
    if (key.includes('properties') || key.includes('dashboard') || key.includes('sales')) {
        console.log(`🗑️ Removendo chave relacionada: ${key}`);
        localStorage.removeItem(key);
        removedCount++;
    }
});

console.log(`✅ LIMPEZA CONCLUÍDA!`);
console.log(`📊 Removidas ${removedCount} chaves de dados`);
console.log('🔄 RECARREGUE A PÁGINA para ver o dashboard limpo');

// Opcional: Recarregar automaticamente
setTimeout(() => {
    console.log('🔄 Recarregando página...');
    window.location.reload();
}, 2000);
