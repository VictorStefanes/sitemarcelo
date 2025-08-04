/**
 * API de Dashboard para Gerenciamento de Propriedades
 * Sistema unificado para adicionar, editar e remover imóveis
 */

class DashboardAPI {
    constructor() {
        this.apiUrl = '/api/properties'; // URL da API real do dashboard
        this.initialized = false;
        this.init();
    }

    async init() {
        // Verifica se a API está disponível
        try {
            await fetch(this.apiUrl + '/health');
            this.initialized = true;
            console.log('Dashboard API conectada');
        } catch (error) {
            console.warn('Dashboard API não disponível, modo offline');
        }
    }

    // Adicionar propriedade
    async addProperty(propertyData) {
        try {
            if (!this.initialized) {
                return this.mockAddProperty(propertyData);
            }

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData)
            });

            if (!response.ok) throw new Error('Erro ao adicionar propriedade');
            
            const result = await response.json();
            this.notifyPageUpdate(propertyData.section);
            return result;

        } catch (error) {
            console.error('Erro ao adicionar propriedade:', error);
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
