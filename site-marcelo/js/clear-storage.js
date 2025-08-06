/**
 * Script para limpar completamente todas as propriedades do localStorage
 * Use este script quando quiser remover todos os dados de propriedades armazenados localmente
 */

function clearAllPropertyData() {
    console.log('🧹 Iniciando limpeza completa do localStorage...');
    
    // Lista de todas as possíveis chaves relacionadas a propriedades
    const propertyKeys = [
        // Chaves principais do dashboard
        'dashboard_properties',
        'marceloImoveisData',
        'mockProperties',
        
        // Chaves por categoria
        'beira-marProperties',
        'mais-procuradosProperties', 
        'lancamentosProperties',
        'pronto-morarProperties',
        
        // Possíveis variações
        'beiraMarProperties',
        'maisProcuradosProperties',
        'novosLancamentosProperties',
        'prontoMorarProperties',
        
        // Chaves de backup
        'properties_backup',
        'properties_cache',
        'offline_properties',
        
        // Dados de desenvolvimento/teste
        'test_properties',
        'dev_properties',
        'sample_properties'
    ];
    
    let removedCount = 0;
    
    // Remove todas as chaves conhecidas
    propertyKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            console.log(`🗑️ Removendo: ${key}`);
            localStorage.removeItem(key);
            removedCount++;
        }
    });
    
    // Procura por chaves que contenham "properties" ou "imoveis"
    const allKeys = Object.keys(localStorage);
    const propertyRelatedKeys = allKeys.filter(key => 
        key.toLowerCase().includes('propert') || 
        key.toLowerCase().includes('imoveis') ||
        key.toLowerCase().includes('marcelo')
    );
    
    propertyRelatedKeys.forEach(key => {
        if (!propertyKeys.includes(key)) {
            console.log(`🗑️ Removendo chave adicional: ${key}`);
            localStorage.removeItem(key);
            removedCount++;
        }
    });
    
    console.log(`✅ Limpeza concluída! ${removedCount} chaves removidas.`);
    console.log('🔄 Recomendado: Recarregue a página para aplicar as mudanças.');
    
    return {
        removedCount,
        remainingKeys: Object.keys(localStorage).filter(key => 
            key.toLowerCase().includes('propert') || 
            key.toLowerCase().includes('imoveis')
        )
    };
}

// Função auxiliar para verificar o que existe no localStorage
function checkPropertyData() {
    console.log('🔍 Verificando dados de propriedades no localStorage...');
    
    const allKeys = Object.keys(localStorage);
    const propertyKeys = allKeys.filter(key => 
        key.toLowerCase().includes('propert') || 
        key.toLowerCase().includes('imoveis') ||
        key.toLowerCase().includes('marcelo')
    );
    
    if (propertyKeys.length === 0) {
        console.log('✅ Nenhum dado de propriedade encontrado no localStorage');
        return;
    }
    
    console.log(`📋 Encontradas ${propertyKeys.length} chaves relacionadas a propriedades:`);
    
    propertyKeys.forEach(key => {
        const data = localStorage.getItem(key);
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                console.log(`  📦 ${key}: ${parsed.length} itens`);
            } else if (parsed && parsed.properties) {
                console.log(`  📦 ${key}: ${parsed.properties.length} propriedades`);
            } else {
                console.log(`  📦 ${key}: objeto (${Object.keys(parsed).length} chaves)`);
            }
        } catch (e) {
            console.log(`  📦 ${key}: string (${data.length} caracteres)`);
        }
    });
}

// Executar automaticamente quando o script for carregado
if (typeof window !== 'undefined') {
    // Adicionar funções ao objeto global para uso no console
    window.clearAllPropertyData = clearAllPropertyData;
    window.checkPropertyData = checkPropertyData;
    
    console.log('🛠️ Ferramentas de limpeza carregadas!');
    console.log('💡 Use: clearAllPropertyData() para limpar tudo');
    console.log('💡 Use: checkPropertyData() para verificar dados existentes');
}

// Executar limpeza automaticamente
clearAllPropertyData();
