/**
 * SCRIPT PARA LIMPAR DADOS DE EXEMPLO DO DASHBOARD
 * Execute no console do navegador para limpar dados antigos
 */

console.log('🧹 LIMPANDO DADOS DO DASHBOARD...');

// Limpar localStorage do dashboard
localStorage.removeItem('dashboard_properties');

// Limpar dados por categoria também
const categories = ['lancamentos', 'mais-procurados', 'beira-mar', 'pronto-morar'];
categories.forEach(category => {
    localStorage.removeItem(`properties_${category}`);
});

console.log('✅ DADOS LIMPOS!');
console.log('📋 O dashboard agora iniciará vazio');
console.log('🔄 Recarregue a página para ver o dashboard limpo');

// Opcional: Recarregar automaticamente
// window.location.reload();
