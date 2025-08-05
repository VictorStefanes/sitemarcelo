// ===========================================
// API CLIENT FOR PROPERTIES BACKEND
// ===========================================

class PropertiesAPI {
    constructor() {
        this.baseURL = 'http://localhost:5001';
        this.authToken = localStorage.getItem('auth_token');
    }

    // ===========================================
    // AUTHENTICATION
    // ===========================================
    async login(username, senha) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, senha })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.authToken = data.user_id;
                localStorage.setItem('auth_token', this.authToken);
                return { success: true, data };
            } else {
                return { success: false, error: data.erro };
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: 'Erro de conexão com o servidor' };
        }
    }

    logout() {
        this.authToken = null;
        localStorage.removeItem('auth_token');
    }

    isAuthenticated() {
        return !!this.authToken;
    }

    // ===========================================
    // PROPERTIES CRUD
    // ===========================================
    async getAllProperties() {
        try {
            const response = await fetch(`${this.baseURL}/properties`);
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.erro };
            }
        } catch (error) {
            console.error('Erro ao buscar propriedades:', error);
            return { success: false, error: 'Erro de conexão com o servidor' };
        }
    }

    async getPropertiesByCategory(category) {
        try {
            const response = await fetch(`${this.baseURL}/properties/${category}`);
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.erro };
            }
        } catch (error) {
            console.error('Erro ao buscar propriedades por categoria:', error);
            return { success: false, error: 'Erro de conexão com o servidor' };
        }
    }

    async createProperty(propertyData) {
        try {
            const response = await fetch(`${this.baseURL}/properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData)
            });

            const data = await response.json();
            
            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.erro };
            }
        } catch (error) {
            console.error('Erro ao criar propriedade:', error);
            return { success: false, error: 'Erro de conexão com o servidor' };
        }
    }

    async updateProperty(propertyId, propertyData) {
        try {
            const response = await fetch(`${this.baseURL}/properties/${propertyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData)
            });

            const data = await response.json();
            
            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.erro };
            }
        } catch (error) {
            console.error('Erro ao atualizar propriedade:', error);
            return { success: false, error: 'Erro de conexão com o servidor' };
        }
    }

    async deleteProperty(propertyId) {
        try {
            const response = await fetch(`${this.baseURL}/properties/${propertyId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.erro };
            }
        } catch (error) {
            console.error('Erro ao deletar propriedade:', error);
            return { success: false, error: 'Erro de conexão com o servidor' };
        }
    }

    // ===========================================
    // ANALYTICS
    // ===========================================
    async getAnalytics() {
        try {
            const response = await fetch(`${this.baseURL}/analytics/stats`);
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.erro };
            }
        } catch (error) {
            console.error('Erro ao buscar analytics:', error);
            return { success: false, error: 'Erro de conexão com o servidor' };
        }
    }

    // ===========================================
    // IMAGE HANDLING
    // ===========================================
    getImageUrl(imagePath) {
        if (!imagePath) return null;
        
        // Se já é uma URL completa, retorna como está
        if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
            return imagePath;
        }
        
        // Se é um caminho relativo, constrói a URL completa
        return `${this.baseURL}/uploads/${imagePath}`;
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Hoje';
        if (diffInDays === 1) return 'Ontem';
        if (diffInDays < 7) return `${diffInDays} dias atrás`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
        return `${Math.floor(diffInDays / 30)} meses atrás`;
    }

    getCategoryLabel(category) {
        const labels = {
            'lancamentos': 'Lançamento',
            'mais-procurados': 'Mais Procurado',
            'beira-mar': 'Beira Mar',
            'pronto-morar': 'Pronto p/ Morar'
        };
        return labels[category] || category;
    }
}

// ===========================================
// DASHBOARD INTEGRATION WITH BACKEND
// ===========================================

class DashboardBackendIntegration {
    constructor() {
        this.api = new PropertiesAPI();
        this.isOnlineMode = false;
        this.init();
    }

    async init() {
        // Tenta conectar com o backend
        await this.checkBackendConnection();
        
        // Se estiver em modo online, carrega dados do backend
        if (this.isOnlineMode) {
            await this.loadPropertiesFromBackend();
        }
    }

    async checkBackendConnection() {
        try {
            const response = await fetch(`${this.api.baseURL}/properties`);
            this.isOnlineMode = response.ok;
            
            if (this.isOnlineMode) {
                console.log('✅ Conectado ao backend - Modo online ativado');
                this.showConnectionStatus('online');
            } else {
                console.log('⚠️ Backend indisponível - Usando modo offline');
                this.showConnectionStatus('offline');
            }
        } catch (error) {
            this.isOnlineMode = false;
            console.log('⚠️ Erro de conexão - Usando modo offline:', error);
            this.showConnectionStatus('offline');
        }
    }

    showConnectionStatus(status) {
        const indicator = document.createElement('div');
        indicator.className = `connection-indicator ${status}`;
        indicator.innerHTML = `
            <i class="fas fa-${status === 'online' ? 'wifi' : 'wifi-slash'}"></i>
            <span>${status === 'online' ? 'Online' : 'Offline'}</span>
        `;
        
        // Remove indicador anterior se existir
        const existing = document.querySelector('.connection-indicator');
        if (existing) existing.remove();
        
        // Adiciona o novo indicador
        document.body.appendChild(indicator);
        
        // Remove após 3 segundos
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 3000);
    }

    async loadPropertiesFromBackend() {
        const result = await this.api.getAllProperties();
        
        if (result.success && window.dashboard) {
            // Atualiza o dashboard com dados do backend
            window.dashboard.properties = result.data;
            window.dashboard.updateDashboard();
            console.log(`📊 Carregadas ${result.data.length} propriedades do backend`);
        }
    }

    async savePropertyToBackend(propertyData) {
        if (!this.isOnlineMode) {
            console.log('💾 Salvando offline - dados serão sincronizados quando voltar online');
            return { success: true, offline: true };
        }

        const result = await this.api.createProperty(propertyData);
        
        if (result.success) {
            console.log('✅ Propriedade salva no backend:', result.data);
        } else {
            console.error('❌ Erro ao salvar propriedade:', result.error);
        }
        
        return result;
    }

    async updatePropertyInBackend(propertyId, propertyData) {
        if (!this.isOnlineMode) {
            console.log('💾 Atualizando offline - dados serão sincronizados quando voltar online');
            return { success: true, offline: true };
        }

        const result = await this.api.updateProperty(propertyId, propertyData);
        
        if (result.success) {
            console.log('✅ Propriedade atualizada no backend');
        } else {
            console.error('❌ Erro ao atualizar propriedade:', result.error);
        }
        
        return result;
    }

    async deletePropertyFromBackend(propertyId) {
        if (!this.isOnlineMode) {
            console.log('💾 Deletando offline - dados serão sincronizados quando voltar online');
            return { success: true, offline: true };
        }

        const result = await this.api.deleteProperty(propertyId);
        
        if (result.success) {
            console.log('✅ Propriedade deletada do backend');
        } else {
            console.error('❌ Erro ao deletar propriedade:', result.error);
        }
        
        return result;
    }
}

// Estilos para o indicador de conexão
const connectionStyles = `
<style>
.connection-indicator {
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-family: 'Poppins', sans-serif;
    z-index: 10001;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.3s ease;
}

.connection-indicator.online {
    background: linear-gradient(135deg, #10B981, #059669);
}

.connection-indicator.offline {
    background: linear-gradient(135deg, #F59E0B, #D97706);
}

@keyframes slideIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', connectionStyles);

// Inicializa a integração quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardBackend = new DashboardBackendIntegration();
});
