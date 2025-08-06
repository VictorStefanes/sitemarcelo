/**
 * TESTE DE CONEXÃO COM BACKEND DO RENDER
 * Execute no console do navegador para testar a conexão
 */

async function testRenderBackend() {
    const url = 'https://marcelo-imoveis-api.onrender.com';
    
    console.log('🔍 Testando conexão com backend do Render...');
    console.log(`📡 URL: ${url}`);
    
    try {
        // Teste 1: Health Check
        console.log('1️⃣ Testando /health...');
        const healthResponse = await fetch(`${url}/health`);
        
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Health Check OK:', healthData);
        } else {
            console.log('⚠️ Health Check falhou:', healthResponse.status);
        }
        
        // Teste 2: Properties endpoint
        console.log('2️⃣ Testando /properties...');
        const propsResponse = await fetch(`${url}/properties`);
        
        if (propsResponse.ok) {
            const propsData = await propsResponse.json();
            console.log('✅ Properties endpoint OK:', propsData);
        } else {
            console.log('⚠️ Properties endpoint falhou:', propsResponse.status);
        }
        
        // Teste 3: Stats endpoint
        console.log('3️⃣ Testando /stats...');
        const statsResponse = await fetch(`${url}/stats`);
        
        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            console.log('✅ Stats endpoint OK:', statsData);
        } else {
            console.log('⚠️ Stats endpoint falhou:', statsResponse.status);
        }
        
        console.log('🎉 Teste concluído!');
        
    } catch (error) {
        console.error('❌ Erro na conexão:', error);
        console.log('💡 O backend pode estar "dormindo" - tente novamente em 1-2 minutos');
    }
}

// Executar teste
testRenderBackend();
