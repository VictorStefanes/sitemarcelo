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
            // Em produção, assume que a API está na mesma origem
            this.API_BASE_URL = window.location.origin;
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
        
        // Limpeza única do localStorage - remover dados antigos
        this.clearOldStorageData();
    }
    
    clearOldStorageData() {
        const propertyKeys = [
            'dashboard_properties',
            'marceloImoveisData', 
            'mockProperties',
            'beira-marProperties',
            'mais-procuradosProperties',
            'lancamentosProperties', 
            'pronto-morarProperties',
            'beiraMarProperties',
            'maisProcuradosProperties',
            'novosLancamentosProperties',
            'prontoMorarProperties'
        ];
        
        let cleaned = false;
        propertyKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                cleaned = true;
            }
        });
        
        if (cleaned) {
            console.log('🧹 LocalStorage limpo - dados antigos removidos');
        }
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
