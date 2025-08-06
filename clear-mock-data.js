/**
 * SCRIPT DE LIMPEZA - Remove todos os dados de exemplo
 * Execute este script no console do navegador para limpar dados antigos
 */

// Limpar localStorage de dados antigos
function clearOldData() {
    console.log('🧹 Limpando dados antigos...');
    
    // Lista de chaves que podem conter dados de exemplo
    const keysToCheck = [
        'properties_lancamentos',
        'properties_mais-procurados', 
        'properties_beira-mar',
        'properties_pronto-morar',
        'dashboard_properties',
        'sample_properties',
        'mock_properties'
    ];
    
    keysToCheck.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                // Se encontrar dados com IDs que começam com 'mock_', remove
                if (Array.isArray(parsed)) {
                    const filtered = parsed.filter(item => !item.id || !item.id.startsWith('mock_'));
                    if (filtered.length !== parsed.length) {
                        console.log(`🗑️ Removendo ${parsed.length - filtered.length} dados mock de ${key}`);
                        localStorage.setItem(key, JSON.stringify(filtered));
                    }
                }
            } catch (e) {
                // Ignora erros de parsing
            }
        }
    });
    
    console.log('✅ Limpeza concluída! Recarregue a página.');
}

// Executar limpeza
clearOldData();
