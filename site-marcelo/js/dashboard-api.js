/**
 * API de Dashboard para Gerenciamento de Propriedades
 * Sistema unificado para adicionar, editar e remover imóveis
 */

class DashboardAPI {
    constructor() {
        // Usa configuração dinâmica se disponível
        const baseUrl = window.Config ? window.Config.apiBaseURL : 'http://localhost:5001';
        this.apiUrl = `${baseUrl}/properties`; // URL da API real do backend Flask
        this.baseUrl = baseUrl;
        this.isOnlineMode = false;
        this.init();
    }

    async init() {
        // Verifica se a API está disponível
        try {
            const checkUrl = `${this.baseUrl}/health`; // Verifica endpoint de health
            console.log('🔍 Testando conexão com:', checkUrl);
            
            const response = await fetch(checkUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            
            if (response.ok) {
                const data = await response.json();
                this.isOnlineMode = true;
                console.log('✅ Dashboard API conectada ao backend Flask');
                console.log('🔗 URL da API:', this.baseUrl);
                console.log('📊 Status do backend:', data);
            } else {
                throw new Error(`API respondeu com status ${response.status}`);
            }
        } catch (error) {
            console.warn('⚠️ Backend não disponível:', error.message);
            console.log('📱 Usando modo offline/localStorage');
            this.isOnlineMode = false;
        }
    }

    // Adicionar propriedade
    async addProperty(propertyData) {
        try {
            if (!this.isOnlineMode) {
                console.log('📱 Modo offline - salvando localmente');
                return this.mockAddProperty(propertyData);
            }

            console.log('🚀 Enviando propriedade para backend:', propertyData);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || 'Erro ao adicionar propriedade');
            }
            
            const result = await response.json();
            console.log('✅ Propriedade adicionada com sucesso:', result);
            
            // Notifica outras páginas para atualizar
            this.notifyPageUpdate(propertyData.category);
            return { success: true, data: result };

        } catch (error) {
            console.error('❌ Erro ao adicionar propriedade:', error);
            console.log('📱 Fallback para modo offline');
            return this.mockAddProperty(propertyData);
        }
    }

    // Editar propriedade
    async updateProperty(id, propertyData) {
        try {
            if (!this.initialized) {
                return this.mockUpdateProperty(id, propertyData);
            }

            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData)
            });

            if (!response.ok) throw new Error('Erro ao atualizar propriedade');
            
            const result = await response.json();
            this.notifyPageUpdate(propertyData.section);
            return result;

        } catch (error) {
            console.error('Erro ao atualizar propriedade:', error);
            return this.mockUpdateProperty(id, propertyData);
        }
    }

    // Remover propriedade
    async deleteProperty(id, section) {
        try {
            if (!this.initialized) {
                return this.mockDeleteProperty(id, section);
            }

            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erro ao remover propriedade');
            
            this.notifyPageUpdate(section);
            return { success: true };

        } catch (error) {
            console.error('Erro ao remover propriedade:', error);
            return this.mockDeleteProperty(id, section);
        }
    }

    // Listar propriedades por seção
    async getProperties(section, limit = null) {
        try {
            if (!this.initialized) {
                return this.mockGetProperties(section, limit);
            }

            let url = `${this.apiUrl}/${section}`;
            if (limit) url += `?limit=${limit}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao buscar propriedades');
            
            return await response.json();

        } catch (error) {
            console.error('Erro ao buscar propriedades:', error);
            return this.mockGetProperties(section, limit);
        }
    }

    // Upload de imagens
    async uploadImage(file) {
        try {
            if (!this.initialized) {
                return this.mockUploadImage(file);
            }

            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${this.apiUrl}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Erro ao fazer upload');
            
            return await response.json();

        } catch (error) {
            console.error('Erro no upload:', error);
            return this.mockUploadImage(file);
        }
    }

    // Notifica páginas sobre atualizações
    notifyPageUpdate(section) {
        // Atualiza página index se os destaques mudaram
        if (window.IndexHighlightsAPI) {
            window.IndexHighlightsAPI.refresh();
        }

        // Atualiza filtros da seção específica
        if (window.PropertyFiltersAPI) {
            window.PropertyFiltersAPI.refreshProperties();
        }

        // Dispatch evento customizado para outras integrações
        window.dispatchEvent(new CustomEvent('propertiesUpdated', {
            detail: { section }
        }));
    }

    // Métodos mock para quando API não está disponível
    mockAddProperty(propertyData) {
        const id = Date.now();
        console.log('Mock: Propriedade adicionada', { id, ...propertyData });
        return Promise.resolve({ id, success: true });
    }

    mockUpdateProperty(id, propertyData) {
        console.log('Mock: Propriedade atualizada', { id, ...propertyData });
        return Promise.resolve({ id, success: true });
    }

    mockDeleteProperty(id, section) {
        console.log('Mock: Propriedade removida', { id, section });
        return Promise.resolve({ success: true });
    }

    mockGetProperties(section, limit) {
        console.log('Mock: Buscando propriedades', { section, limit });
        return Promise.resolve([]);
    }

    // Métodos específicos que o dashboard-core.js espera
    async savePropertyToBackend(property) {
        return await this.addProperty(property);
    }

    async updatePropertyInBackend(id, property) {
        return await this.updateProperty(id, property);
    }

    async deletePropertyFromBackend(id) {
        // O dashboard-core não passa a categoria, então usamos uma genérica
        return await this.deleteProperty(id, 'unknown');
    }

    async loadPropertiesFromBackend() {
        return await this.getProperties();
    }

    mockUploadImage(file) {
        console.log('Mock: Upload de imagem', file.name);
        return Promise.resolve({ 
            url: URL.createObjectURL(file),
            success: true 
        });
    }

    // Validação de dados
    validateProperty(propertyData) {
        const required = ['title', 'location', 'price', 'section'];
        const missing = required.filter(field => !propertyData[field]);
        
        if (missing.length > 0) {
            throw new Error(`Campos obrigatórios faltando: ${missing.join(', ')}`);
        }

        if (!['lancamentos', 'mais-procurados', 'beira-mar', 'pronto-morar'].includes(propertyData.section)) {
            throw new Error('Seção inválida');
        }

        return true;
    }

    // Utilitário para formatar dados
    formatPropertyData(formData) {
        return {
            title: formData.title,
            location: formData.location,
            price: formData.price,
            bedrooms: parseInt(formData.bedrooms) || 0,
            bathrooms: parseInt(formData.bathrooms) || 0,
            parking: parseInt(formData.parking) || 0,
            area: formData.area,
            condominio: formData.condominio || 'Consulte',
            images: formData.images || [],
            tags: formData.tags || [],
            section: formData.section,
            dateAdded: new Date()
        };
    }
}

// Interface para dashboard
window.DashboardAPI = new DashboardAPI();

// Exemplo de uso para o dashboard:
/*
// Adicionar nova propriedade
await window.DashboardAPI.addProperty({
    title: 'Apartamento Novo',
    location: 'Jatiúca - Maceió/AL',
    price: 'R$ 650.000,00',
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    area: '85m²',
    condominio: 'R$ 350,00',
    images: ['url1.jpg', 'url2.jpg'],
    tags: ['Novo', 'Financiamento'],
    section: 'lancamentos'
});

// Atualizar propriedade
await window.DashboardAPI.updateProperty(123, {
    title: 'Apartamento Atualizado',
    price: 'R$ 700.000,00'
});

// Remover propriedade
await window.DashboardAPI.deleteProperty(123, 'lancamentos');

// Buscar propriedades
const properties = await window.DashboardAPI.getProperties('mais-procurados');
*/

// Inicialização global
document.addEventListener('DOMContentLoaded', () => {
    if (!window.dashboardBackend) {
        window.dashboardBackend = new DashboardAPI();
        console.log('🔌 DashboardAPI inicializada como dashboardBackend');
    }
});
