/**
 * Sistema Unificado de Filtros para Imóveis
 * Suporta: Lançamentos, Mais Procurados, Beira Mar
 */

class PropertyFilters {
    constructor(section = null) {
        // Auto-detecta a seção baseada na URL se não fornecida
        this.section = section || this.detectSectionFromURL();
        this.properties = [];
        this.filteredProperties = [];
        this.filters = {
            finalidade: '',
            tipo: [],
            precoMin: 50000,
            precoMax: 2000000,
            quartos: '',
            suites: '',
            banheiros: '',
            vagas: '',
            estado: 'AL',
            cidade: 'Maceió',
            bairro: ''
        };
        
        this.init();
    }

    detectSectionFromURL() {
        const path = window.location.pathname;
        if (path.includes('lancamentos')) return 'lancamentos';
        if (path.includes('mais-procurados')) return 'mais-procurados';
        if (path.includes('beira-mar')) return 'beira-mar';
        return 'lancamentos'; // default
    }

    init() {
        this.setupEventListeners();
        this.updateSectionIndicator();
        this.loadProperties();
        this.initializePriceRange();
    }

    setupEventListeners() {
        // Toggle filtros em mobile
        const toggleBtn = document.querySelector('.filter-toggle');
        const filtersContainer = document.querySelector('.filters-container');
        
        if (toggleBtn && filtersContainer) {
            toggleBtn.addEventListener('click', () => {
                filtersContainer.classList.toggle('show');
            });
            
            // Fecha filtros quando clica fora (mobile)
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !filtersContainer.contains(e.target) && 
                    !toggleBtn.contains(e.target)) {
                    filtersContainer.classList.remove('show');
                }
            });
        }

        // Finalidade
        document.querySelectorAll('input[name="finalidade"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.filters.finalidade = e.target.value;
                this.applyFilters();
            });
        });

        // Tipo de imóvel
        document.querySelectorAll('input[name="tipo"]').forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.filters.tipo.push(e.target.value);
                } else {
                    this.filters.tipo = this.filters.tipo.filter(t => t !== e.target.value);
                }
                this.applyFilters();
            });
        });

        // Selects
        ['quartos', 'suites', 'banheiros', 'vagas', 'estado', 'cidade', 'bairro'].forEach(field => {
            const select = document.querySelector(`select[name="${field}"]`);
            if (select) {
                select.addEventListener('change', (e) => {
                    this.filters[field] = e.target.value;
                    this.applyFilters();
                });
            }
        });

        // Botões
        const applyBtn = document.getElementById('aplicarFiltros');
        const clearBtn = document.getElementById('limparFiltros');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
    }

    initializePriceRange() {
        const precoMinRange = document.getElementById('precoMin');
        const precoMaxRange = document.getElementById('precoMax');
        const valorMinSpan = document.getElementById('valorMin');
        const valorMaxSpan = document.getElementById('valorMax');

        if (precoMinRange && precoMaxRange) {
            precoMinRange.addEventListener('input', (e) => {
                this.filters.precoMin = parseInt(e.target.value);
                if (valorMinSpan) {
                    valorMinSpan.textContent = this.formatPrice(this.filters.precoMin);
                }
                this.applyFilters();
            });

            precoMaxRange.addEventListener('input', (e) => {
                this.filters.precoMax = parseInt(e.target.value);
                if (valorMaxSpan) {
                    valorMaxSpan.textContent = this.formatPrice(this.filters.precoMax);
                }
                this.applyFilters();
            });
        }
    }

    updateSectionIndicator() {
        const indicator = document.querySelector('.section-indicator');
        if (indicator) {
            const sectionNames = {
                'lancamentos': 'Lançamentos',
                'mais-procurados': 'Mais Procurados',
                'beira-mar': 'Beira Mar'
            };
            indicator.textContent = sectionNames[this.section] || this.section;
        }
    }

    // Simula carregamento de propriedades - será substituído pela API do dashboard
    async loadProperties() {
        this.showLoading(true);
        
        try {
            // Aqui você conectará com o dashboard/API
            this.properties = await this.fetchPropertiesFromDashboard(this.section);
            this.filteredProperties = [...this.properties];
            this.renderProperties();
            this.updatePropertiesCount();
        } catch (error) {
            console.error('Erro ao carregar propriedades:', error);
            this.showError();
        } finally {
            this.showLoading(false);
        }
    }

    // Método que será conectado ao dashboard
    async fetchPropertiesFromDashboard(section) {
        try {
            // Aqui você conectará com a API real do dashboard
            const response = await fetch(`/api/properties/${section}`);
            if (!response.ok) throw new Error('Erro ao carregar propriedades');
            return await response.json();
        } catch (error) {
            console.warn('API não disponível, usando dados de exemplo');
            // Dados de exemplo - será removido quando API estiver pronta
            return this.getMockProperties(section);
        }
    }

    getMockProperties(section) {
        // Dados de exemplo - remover quando conectar com dashboard real
        const mockProperties = {
            'lancamentos': [
                {
                    id: 1,
                    title: 'Apartamento Residencial Sunset',
                    location: 'Jatiúca - Maceió/AL',
                    price: 'R$ 850.000,00',
                    bedrooms: 3,
                    bathrooms: 2,
                    parking: 2,
                    area: '85m²',
                    condominio: 'R$ 350,00',
                    images: ['../assets/images/edifício.jpg'],
                    tags: ['Lançamento', 'Financiamento'],
                    section: 'lancamentos',
                    dateAdded: new Date('2024-12-01')
                },
                {
                    id: 2,
                    title: 'Cobertura Ocean View',
                    location: 'Ponta Verde - Maceió/AL',
                    price: 'R$ 1.200.000,00',
                    bedrooms: 4,
                    bathrooms: 3,
                    parking: 3,
                    area: '120m²',
                    condominio: 'R$ 480,00',
                    images: ['../assets/images/edifício.jpg'],
                    tags: ['Lançamento', 'Vista mar'],
                    section: 'lancamentos',
                    dateAdded: new Date('2024-12-02')
                }
            ],
            'mais-procurados': [
                {
                    id: 3,
                    title: 'Apartamento Centro Histórico',
                    location: 'Centro - Maceió/AL',
                    price: 'R$ 650.000,00',
                    bedrooms: 2,
                    bathrooms: 2,
                    parking: 1,
                    area: '70m²',
                    condominio: 'R$ 280,00',
                    images: ['../assets/images/edifício.jpg'],
                    tags: ['Mais procurado', 'Centro'],
                    section: 'mais-procurados',
                    dateAdded: new Date('2024-12-03')
                }
            ],
            'beira-mar': [
                {
                    id: 4,
                    title: 'Flat Beira Mar Premium',
                    location: 'Pajuçara - Maceió/AL',
                    price: 'R$ 980.000,00',
                    bedrooms: 2,
                    bathrooms: 2,
                    parking: 1,
                    area: '65m²',
                    condominio: 'R$ 420,00',
                    images: ['../assets/images/edifício.jpg'],
                    tags: ['Beira mar', 'Vista mar'],
                    section: 'beira-mar',
                    dateAdded: new Date('2024-12-04')
                }
            ]
        };

        return mockProperties[section] || [];
    }

    applyFilters() {
        this.filteredProperties = this.properties.filter(property => {
            // Filtro por finalidade
            if (this.filters.finalidade && property.finalidade !== this.filters.finalidade) {
                return false;
            }

            // Filtro por tipo
            if (this.filters.tipo.length > 0 && !this.filters.tipo.includes(property.tipo)) {
                return false;
            }

            // Filtro por preço
            if (property.preco < this.filters.precoMin || property.preco > this.filters.precoMax) {
                return false;
            }

            // Filtros numéricos
            if (this.filters.quartos && property.quartos < parseInt(this.filters.quartos)) {
                return false;
            }

            if (this.filters.suites && property.suites < parseInt(this.filters.suites)) {
                return false;
            }

            if (this.filters.banheiros && property.banheiros < parseInt(this.filters.banheiros)) {
                return false;
            }

            if (this.filters.vagas && property.vagas < parseInt(this.filters.vagas)) {
                return false;
            }

            // Filtro por bairro
            if (this.filters.bairro && property.bairro !== this.filters.bairro) {
                return false;
            }

            return true;
        });

        this.renderProperties();
        this.updatePropertiesCount();
    }

    clearFilters() {
        // Reset filters
        this.filters = {
            finalidade: '',
            tipo: [],
            precoMin: 50000,
            precoMax: 2000000,
            quartos: '',
            suites: '',
            banheiros: '',
            vagas: '',
            estado: 'AL',
            cidade: 'Maceió',
            bairro: ''
        };

        // Reset form
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.checked = false;
        });
        
        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });

        // Reset price range
        const precoMinRange = document.getElementById('precoMin');
        const precoMaxRange = document.getElementById('precoMax');
        if (precoMinRange) precoMinRange.value = 50000;
        if (precoMaxRange) precoMaxRange.value = 2000000;

        this.updatePriceDisplay();
        this.applyFilters();
    }

    renderProperties() {
        const container = document.querySelector('.properties-grid');
        if (!container) return;

        if (this.filteredProperties.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        container.innerHTML = this.filteredProperties.map(property => 
            this.getPropertyCardHTML(property)
        ).join('');
    }

    getPropertyCardHTML(property) {
        return `
            <div class="property-card" data-section="${this.section}" data-property-id="${property.id}">
                <button class="nav-arrow prev" aria-label="Slide anterior">‹</button>
                <button class="nav-arrow next" aria-label="Próximo slide">›</button>
                <div class="property-image">
                    ${property.images.map((image, index) => `
                        <div class="property-slide" aria-hidden="${index === 0 ? 'false' : 'true'}" ${index > 0 ? 'style="display:none"' : ''}>
                            <img src="${image}" alt="${property.title}">
                        </div>
                    `).join('')}
                    <div class="dots-container" role="tablist">
                        ${property.images.map((_, index) => `
                            <button class="dot ${index === 0 ? 'active' : ''}" role="tab" 
                                aria-selected="${index === 0}" aria-controls="slide${index + 1}"></button>
                        `).join('')}
                    </div>
                </div>
                <div class="property-content">
                    <div class="location">
                        <h2>${property.location}</h2>
                        <span>#${property.id}</span>
                    </div>
                    <div class="property-title">
                        <h3>${property.title}</h3>
                    </div>
                    <div class="property-features">
                        <div class="feature">
                            <i class="fas fa-bed"></i>
                            <span>${property.bedrooms}</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-bath"></i>
                            <span>${property.bathrooms}</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-car"></i>
                            <span>${property.parking}</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-vector-square"></i>
                            <span>${property.area}</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-building"></i>
                            <span>${property.condominio}</span>
                        </div>
                    </div>
                    <div class="property-price">
                        <h3>${property.price}</h3>
                    </div>
                    <div class="property-tags">
                        ${property.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <i class="fas fa-star icon"></i>
                </div>
            </div>
        `;
    }

    getSectionBadge() {
        const badges = {
            'lancamentos': 'Novo',
            'mais-procurados': 'Destaque',
            'beira-mar': 'Praia'
        };
        return badges[this.section] || '';
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <h3>Nenhum imóvel encontrado</h3>
                <p>Tente ajustar os filtros para encontrar mais opções.</p>
            </div>
        `;
    }

    updatePropertiesCount() {
        const countElement = document.querySelector('.properties-count');
        if (countElement) {
            const total = this.properties.length;
            const filtered = this.filteredProperties.length;
            countElement.textContent = `${filtered} de ${total} imóveis`;
        }
    }

    updatePriceDisplay() {
        const valorMinSpan = document.getElementById('valorMin');
        const valorMaxSpan = document.getElementById('valorMax');
        
        if (valorMinSpan) {
            valorMinSpan.textContent = this.formatPrice(this.filters.precoMin);
        }
        if (valorMaxSpan) {
            valorMaxSpan.textContent = this.formatPrice(this.filters.precoMax);
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR').format(price);
    }

    showLoading(show) {
        const container = document.querySelector('.properties-grid');
        if (!container) return;

        if (show) {
            container.innerHTML = '<div class="loading">Carregando imóveis...</div>';
        }
    }

    showError() {
        const container = document.querySelector('.properties-grid');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Erro ao carregar imóveis</h3>
                    <p>Tente novamente em alguns instantes.</p>
                </div>
            `;
        }
    }
}

// Função para detectar a seção atual e inicializar
function initializeFilters() {
    // Inicializa o sistema de filtros com detecção automática
    window.propertyFilters = new PropertyFilters();
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeFilters);

// Expõe funções globais para uso em dashboard
window.PropertyFiltersAPI = {
    addProperty: (sectionName, propertyData) => {
        if (window.propertyFilters && window.propertyFilters.section === sectionName) {
            window.propertyFilters.properties.push(propertyData);
            window.propertyFilters.applyFilters();
        }
    },
    
    removeProperty: (sectionName, propertyId) => {
        if (window.propertyFilters && window.propertyFilters.section === sectionName) {
            window.propertyFilters.properties = window.propertyFilters.properties.filter(
                p => p.id !== propertyId
            );
            window.propertyFilters.applyFilters();
        }
    },
    
    updateProperty: (sectionName, propertyId, propertyData) => {
        if (window.propertyFilters && window.propertyFilters.section === sectionName) {
            const index = window.propertyFilters.properties.findIndex(p => p.id === propertyId);
            if (index !== -1) {
                window.propertyFilters.properties[index] = { ...propertyData, id: propertyId };
                window.propertyFilters.applyFilters();
            }
        }
    },
    
    refreshProperties: () => {
        if (window.propertyFilters) {
            window.propertyFilters.loadProperties();
        }
    }
};
