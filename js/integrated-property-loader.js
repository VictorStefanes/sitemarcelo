/**
 * CARREGADOR DE PROPRIEDADES COM INTEGRAÇÃO DASHBOARD
 * Versão integrada que usa dados do dashboard quando disponível
 */

class IntegratedPropertyLoader {
    constructor() {
        this.currentCategory = this.detectCategory();
        this.init();
    }

    init() {
        console.log(`🏠 Carregando ${this.currentCategory}...`);
        
        // Limpa conteúdo inicial
        this.clearInitialContent();
        
        // Carrega propriedades
        this.loadProperties();
    }

    detectCategory() {
        const path = window.location.pathname;
        
        if (path.includes('lancamentos')) return 'lancamentos';
        if (path.includes('mais-procurados')) return 'mais-procurados';
        if (path.includes('beira-mar')) return 'beira-mar';
        if (path.includes('pronto-morar')) return 'pronto-morar';
        
        return 'lancamentos'; // default
    }

    clearInitialContent() {
        const containers = document.querySelectorAll('.properties-grid, .grid, .lancamentos-grid');
        containers.forEach(container => {
            if (container) {
                container.innerHTML = this.getLoadingHTML();
            }
        });
    }

    getLoadingHTML() {
        const categoryName = this.getCategoryDisplayName();
        return `
            <div class="loading-properties" style="display: flex; align-items: center; justify-content: center; min-height: 200px; color: #666; grid-column: 1 / -1;">
                <i class="fas fa-spinner fa-spin" style="margin-right: 10px; color: #d4af37;"></i>
                Carregando ${categoryName.toLowerCase()}...
            </div>
        `;
    }

    getCategoryDisplayName() {
        const names = {
            'lancamentos': 'Lançamentos',
            'mais-procurados': 'Mais Procurados',
            'beira-mar': 'Beira Mar',
            'pronto-morar': 'Pronto para Morar'
        };
        return names[this.currentCategory] || 'Imóveis';
    }

    async loadProperties() {
        try {
            // Primeiro, tenta carregar do dashboard
            let properties = this.loadFromDashboard();
            
            // Se não encontrar no dashboard, tenta API (fallback)
            if (!properties || properties.length === 0) {
                properties = await this.loadFromAPI();
            }
            
            // Se ainda não encontrar, usa propriedades mockadas como última opção
            if (!properties || properties.length === 0) {
                properties = this.loadMockProperties();
            }
            
            this.renderProperties(properties);
            
        } catch (error) {
            console.error('Erro ao carregar propriedades:', error);
            this.renderError();
        }
    }

    // PRIORIDADE 1: Dados do Dashboard (via sincronização)
    loadFromDashboard() {
        try {
            // Primeiro verifica se há dados do dashboard principal
            const dashboardData = localStorage.getItem('marceloImoveisData');
            if (dashboardData) {
                const data = JSON.parse(dashboardData);
                if (data.properties && data.properties.length > 0) {
                    console.log(`🔍 Dashboard principal tem ${data.properties.length} propriedades`);
                    // Filtra propriedades para a categoria atual
                    const filtered = data.properties.filter(p => {
                        return p.categoria === this.currentCategory && p.status === 'disponivel';
                    });
                    if (filtered.length > 0) {
                        console.log(`✅ Carregado ${filtered.length} imóveis do dashboard principal para ${this.currentCategory}`);
                        return filtered;
                    }
                }
            }
            
            // Fallback: verifica dados já sincronizados por categoria
            const categoryKey = `${this.currentCategory}Properties`;
            const stored = localStorage.getItem(categoryKey);
            
            if (stored) {
                const properties = JSON.parse(stored);
                console.log(`✅ Carregado ${properties.length} imóveis sincronizados para ${this.currentCategory}`);
                return properties.filter(p => p.status === 'disponivel'); // Apenas disponíveis
            }
            
            console.log(`❌ Nenhum dado encontrado no dashboard para ${this.currentCategory}`);
            return null;
        } catch (error) {
            console.error('Erro ao carregar do dashboard:', error);
            return null;
        }
    }

    // PRIORIDADE 2: API Backend (fallback)
    async loadFromAPI() {
        try {
            const baseUrl = window.Config ? window.Config.apiBaseURL : 'http://localhost:5001';
            const response = await fetch(`${baseUrl}/properties?category=${this.currentCategory}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Carregado ${data.properties?.length || 0} imóveis da API para ${this.currentCategory}`);
                return data.properties || [];
            }
            
            return null;
        } catch (error) {
            console.error('Erro ao carregar da API:', error);
            return null;
        }
    }

    // PRIORIDADE 3: Mock Properties (última opção)
    loadMockProperties() {
        const mockData = {
            'lancamentos': [
                {
                    id: 'mock_lanc_1',
                    titulo: 'Apartamento Moderno - Centro',
                    preco: 450000,
                    localizacao: 'Centro, Cidade',
                    quartos: 3,
                    banheiros: 2,
                    garagem: 2,
                    area: 85,
                    tipo: 'apartamento',
                    categoria: 'lancamentos',
                    imagens: ['assets/images/fundo.jpg'],
                    status: 'disponivel'
                }
            ],
            'mais-procurados': [
                {
                    id: 'mock_proc_1',
                    titulo: 'Casa Familiar - Bairro Nobre',
                    preco: 680000,
                    localizacao: 'Bairro Nobre, Cidade',
                    quartos: 4,
                    banheiros: 3,
                    garagem: 2,
                    area: 180,
                    tipo: 'casa',
                    categoria: 'mais-procurados',
                    imagens: ['assets/images/fundo.jpg'],
                    status: 'disponivel'
                }
            ],
            'beira-mar': [
                {
                    id: 'mock_mar_1',
                    titulo: 'Terreno Vista para o Mar',
                    preco: 320000,
                    localizacao: 'Orla, Litoral',
                    quartos: 0,
                    banheiros: 0,
                    garagem: 0,
                    area: 500,
                    tipo: 'terreno',
                    categoria: 'beira-mar',
                    imagens: ['assets/images/fundo.jpg'],
                    status: 'disponivel'
                }
            ],
            'pronto-morar': [
                {
                    id: 'mock_pronto_1',
                    titulo: 'Apartamento Pronto para Morar',
                    preco: 380000,
                    localizacao: 'Vila Nova, Cidade',
                    quartos: 2,
                    banheiros: 1,
                    garagem: 1,
                    area: 65,
                    tipo: 'apartamento',
                    categoria: 'pronto-morar',
                    imagens: ['assets/images/fundo.jpg'],
                    status: 'disponivel'
                }
            ]
        };

        const properties = mockData[this.currentCategory] || [];
        console.log(`⚠️ Usando dados mock: ${properties.length} imóveis para ${this.currentCategory}`);
        return properties;
    }

    renderProperties(properties) {
        const container = document.querySelector('.properties-grid, .grid, .lancamentos-grid');
        
        if (!container) {
            console.error('Container de propriedades não encontrado');
            return;
        }

        if (!properties || properties.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        // Renderiza as propriedades
        container.innerHTML = properties.map(property => this.getPropertyCardHTML(property)).join('');
        
        // Aplica filtros se existir sistema de filtros
        if (window.propertyFilter) {
            window.propertyFilter.properties = properties;
            window.propertyFilter.updateFilterOptions();
        }
    }

    getEmptyStateHTML() {
        const categoryName = this.getCategoryDisplayName();
        return `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px; color: #d4af37;">
                    <i class="fas fa-home"></i>
                </div>
                <h3 style="margin-bottom: 10px; color: #333;">Nenhum imóvel encontrado</h3>
                <p>Não há imóveis cadastrados em ${categoryName.toLowerCase()} no momento.</p>
                <p style="font-size: 14px; margin-top: 20px;">
                    💡 Use o <strong>Dashboard</strong> para adicionar novos imóveis
                </p>
            </div>
        `;
    }

    renderError() {
        const container = document.querySelector('.properties-grid, .grid, .lancamentos-grid');
        if (container) {
            container.innerHTML = `
                <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #dc3545;">
                    <div style="font-size: 48px; margin-bottom: 20px;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 style="margin-bottom: 10px;">Erro ao carregar imóveis</h3>
                    <p>Ocorreu um erro ao tentar carregar os imóveis.</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #d4af37; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Tentar Novamente
                    </button>
                </div>
            `;
        }
    }

    getPropertyCardHTML(property) {
        const price = this.formatPrice(property.preco || property.price || 0);
        const location = property.localizacao || property.location || 'Localização não informada';
        const title = property.titulo || property.title || 'Imóvel sem título';
        const image = property.imagens?.[0] || property.images?.[0] || 'assets/images/fundo.jpg';
        
        return `
            <div class="property-card" data-id="${property.id}">
                <div class="property-image">
                    <img src="${image}" alt="${title}" loading="lazy">
                    <div class="property-badge">${this.getPropertyTypeLabel(property.tipo || property.type)}</div>
                </div>
                <div class="property-info">
                    <h3 class="property-title">${title}</h3>
                    <p class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${location}
                    </p>
                    <div class="property-features">
                        ${this.getFeatureHTML('bed', property.quartos || property.bedrooms)}
                        ${this.getFeatureHTML('bath', property.banheiros || property.bathrooms)}
                        ${this.getFeatureHTML('car', property.garagem || property.garage)}
                        ${this.getFeatureHTML('area', property.area)}
                    </div>
                    <div class="property-price">${price}</div>
                    <div class="property-actions">
                        <button class="btn-contact" onclick="this.contactProperty('${property.id}')">
                            <i class="fab fa-whatsapp"></i>
                            Contato
                        </button>
                        <button class="btn-details" onclick="this.viewDetails('${property.id}')">
                            <i class="fas fa-eye"></i>
                            Detalhes
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getFeatureHTML(type, value) {
        if (!value || value === 0) return '';
        
        const icons = {
            bed: 'fa-bed',
            bath: 'fa-bath',
            car: 'fa-car',
            area: 'fa-expand-arrows-alt'
        };
        
        const labels = {
            bed: value === 1 ? 'quarto' : 'quartos',
            bath: value === 1 ? 'banheiro' : 'banheiros',
            car: value === 1 ? 'vaga' : 'vagas',
            area: 'm²'
        };
        
        return `
            <span class="feature">
                <i class="fas ${icons[type]}"></i>
                ${value} ${labels[type]}
            </span>
        `;
    }

    getPropertyTypeLabel(type) {
        const labels = {
            'apartamento': 'Apartamento',
            'casa': 'Casa',
            'terreno': 'Terreno',
            'comercial': 'Comercial',
            'sitio': 'Sítio'
        };
        return labels[type] || 'Imóvel';
    }

    formatPrice(price) {
        if (!price || price === 0) return 'Preço a consultar';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    // Métodos para ações dos botões
    contactProperty(propertyId) {
        const message = `Olá! Tenho interesse no imóvel ID: ${propertyId}. Poderia me enviar mais informações?`;
        const whatsappUrl = `https://wa.me/5582887801260?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    viewDetails(propertyId) {
        // Implementar visualização de detalhes
        console.log('Ver detalhes do imóvel:', propertyId);
        alert(`Visualizando detalhes do imóvel ${propertyId}`);
    }
}

// Auto-inicializa quando a página carrega
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.propertyLoader = new IntegratedPropertyLoader();
    });
} else {
    window.propertyLoader = new IntegratedPropertyLoader();
}

console.log('🔗 Sistema integrado de propriedades ativo (Dashboard + API + Mock)');
