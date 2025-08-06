/**
 * Configurações do Sistema
 * Centraliza URLs e configurações para facilitar deploy
 */

class Config {
    constructor() {
        // Detecta se está em produção ou desenvolvimento
        this.isProduction = window.location.hostname !== 'localhost' && 
                           !window.location.hostname.includes('127.0.0.1') &&
                           !window.location.hostname.includes('file://');
        
        // URLs da API baseadas no ambiente
        if (this.isProduction) {
            // Em produção, usa o backend do Render
            this.API_BASE_URL = 'https://marcelo-imoveis-api.onrender.com';
        } else {
            // Em desenvolvimento, usa localhost
            this.API_BASE_URL = 'http://localhost:5001';
        }
        
        // URLs específicas
        this.PROPERTIES_API = `${this.API_BASE_URL}/properties`;
        this.AUTH_API = `${this.API_BASE_URL}/auth`;
        
        console.log('🔧 Config inicializada:', {
            isProduction: this.isProduction,
            apiBaseUrl: this.API_BASE_URL,
            hostname: window.location.hostname
        });
    }
    
    // Getter para compatibilidade com código existente
    get apiBaseURL() {
        return this.API_BASE_URL;
    }
    
    // Método para obter URL da API
    getApiUrl(endpoint = '') {
        return `${this.API_BASE_URL}${endpoint}`;
    }
}

// Instância global
window.Config = new Config();

// Export para módulos que precisam
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}
