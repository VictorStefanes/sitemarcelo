// 🔧 CONFIGURAÇÃO DE API - ATUALIZAR APÓS DEPLOY

// ⚠️ ATENÇÃO: Após fazer o deploy do backend no Render, 
// você precisa substituir 'YOUR_RENDER_URL' pela URL real do seu backend

// 🎯 EXEMPLO DE URL DO RENDER: https://marcelo-backend-xyz.onrender.com

const API_CONFIG = {
    // 🏠 Local Development
    LOCAL: 'http://localhost:5000',
    
    // 🌐 Production (ATUALIZAR COM SUA URL DO RENDER)
    PRODUCTION: 'YOUR_RENDER_URL', // ← SUBSTITUA AQUI!
    
    // 🔄 Auto detect environment
    get BASE_URL() {
        return window.location.hostname === 'localhost' 
            ? this.LOCAL 
            : this.PRODUCTION;
    }
};

// 📋 ENDPOINTS DISPONÍVEIS
const API_ENDPOINTS = {
    LOGIN: `${API_CONFIG.BASE_URL}/login`,
    CADASTRO: `${API_CONFIG.BASE_URL}/cadastro`,
    HEALTH: `${API_CONFIG.BASE_URL}/health`
};

// 🧪 EXEMPLO DE USO:
// fetch(API_ENDPOINTS.LOGIN, { ... })

console.log('🔧 API Config carregado:', API_CONFIG.BASE_URL);
