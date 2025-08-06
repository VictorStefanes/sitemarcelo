/**
 * SCRIPT FINAL DE VERIFICAÇÃO E LIMPEZA COMPLETA
 * Execute este script para garantir que o sistema está 100% limpo
 */

// Função principal de verificação
function verifyCompleteSystem() {
    console.log('🔍 INICIANDO VERIFICAÇÃO COMPLETA DO SISTEMA...\n');
    
    // 1. Verificar localStorage
    console.log('📱 VERIFICANDO LOCALSTORAGE:');
    checkLocalStorage();
    
    // 2. Verificar API
    console.log('\n🌐 VERIFICANDO API:');
    checkAPI();
    
    // 3. Verificar se há elementos DOM com dados hardcoded
    console.log('\n🏗️ VERIFICANDO DOM:');
    checkDOMElements();
    
    // 4. Limpar qualquer resíduo
    console.log('\n🧹 EXECUTANDO LIMPEZA FINAL:');
    performFinalCleanup();
}

function checkLocalStorage() {
    const allKeys = Object.keys(localStorage);
    const propertyRelatedKeys = allKeys.filter(key => 
        key.toLowerCase().includes('prop') || 
        key.toLowerCase().includes('imoveis') ||
        key.toLowerCase().includes('marcelo') ||
        key.toLowerCase().includes('dash')
    );
    
    if (propertyRelatedKeys.length === 0) {
        console.log('✅ LocalStorage limpo - nenhuma chave relacionada a propriedades');
    } else {
        console.log('⚠️ Encontradas chaves no localStorage:');
        propertyRelatedKeys.forEach(key => {
            const data = localStorage.getItem(key);
            console.log(`   - ${key}: ${data ? data.length + ' chars' : 'null'}`);
        });
    }
}

async function checkAPI() {
    try {
        const response = await fetch('http://localhost:5000/properties');
        if (response.ok) {
            const data = await response.json();
            if (data.properties && data.properties.length === 0) {
                console.log('✅ API limpa - 0 propriedades retornadas');
            } else {
                console.log(`⚠️ API retornou ${data.properties ? data.properties.length : 'dados'} propriedades`);
                console.log('Dados:', data);
            }
        } else {
            console.log('❌ Não foi possível conectar à API');
        }
    } catch (error) {
        console.log('❌ Erro ao verificar API:', error.message);
    }
}

function checkDOMElements() {
    // Verificar se há cards de propriedade no DOM
    const propertyCards = document.querySelectorAll('.property-card, .property-item, .imovel-card');
    const propertyContainers = document.querySelectorAll('.properties-grid, .imoveis-container, .cards-container');
    
    console.log(`Cards de propriedade encontrados: ${propertyCards.length}`);
    console.log(`Containers de propriedade encontrados: ${propertyContainers.length}`);
    
    if (propertyCards.length === 0) {
        console.log('✅ Nenhum card de propriedade no DOM');
    } else {
        console.log('⚠️ Cards encontrados no DOM:');
        propertyCards.forEach((card, index) => {
            console.log(`   Card ${index + 1}:`, card.textContent.substring(0, 100) + '...');
        });
    }
    
    // Verificar se há mensagens de "estado vazio"
    const emptyStates = document.querySelectorAll('.empty-state, .no-properties, .sem-imoveis');
    console.log(`Estados vazios encontrados: ${emptyStates.length}`);
}

function performFinalCleanup() {
    // Lista completa de todas as possíveis chaves
    const allPossibleKeys = [
        // Dashboard
        'dashboard_properties',
        'dashboard_data',
        'dashboard_cache',
        
        // Propriedades gerais
        'properties',
        'imoveis',
        'marcelo_properties',
        'marceloImoveisData',
        'mockProperties',
        'sampleProperties',
        'testProperties',
        
        // Por categoria
        'beira-marProperties', 'beiraMarProperties',
        'mais-procuradosProperties', 'maisProcuradosProperties',
        'lancamentosProperties', 'novosLancamentosProperties',
        'pronto-morarProperties', 'prontoMorarProperties',
        
        // Variações
        'beiramar_properties', 'maisProcurados_properties',
        'lancamentos_properties', 'prontoMorar_properties',
        
        // Cache e backup
        'properties_cache', 'properties_backup',
        'offline_properties', 'temp_properties',
        
        // Dados de página
        'homepage_properties', 'category_properties',
        'filtered_properties', 'search_results'
    ];
    
    let cleanedCount = 0;
    allPossibleKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            cleanedCount++;
            console.log(`🗑️ Removido: ${key}`);
        }
    });
    
    // Procurar por quaisquer outras chaves suspeitas
    const remainingKeys = Object.keys(localStorage).filter(key => 
        key.toLowerCase().includes('prop') || 
        key.toLowerCase().includes('imoveis') ||
        key.toLowerCase().includes('marcelo')
    );
    
    remainingKeys.forEach(key => {
        if (!allPossibleKeys.includes(key)) {
            localStorage.removeItem(key);
            cleanedCount++;
            console.log(`🗑️ Removido (adicional): ${key}`);
        }
    });
    
    if (cleanedCount === 0) {
        console.log('✅ Nenhuma limpeza necessária');
    } else {
        console.log(`✅ Limpeza concluída: ${cleanedCount} itens removidos`);
    }
}

// Executar verificação automaticamente
verifyCompleteSystem();

// Disponibilizar função globalmente
if (typeof window !== 'undefined') {
    window.verifyCompleteSystem = verifyCompleteSystem;
    console.log('\n💡 Use verifyCompleteSystem() para executar verificação novamente');
}

// Forçar recarregamento das páginas de categoria para aplicar mudanças
setTimeout(() => {
    console.log('\n🔄 Sistema verificado. Se ainda houver problemas, recarregue a página.');
}, 1000);
