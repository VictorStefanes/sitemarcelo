/**
 * Category Page Manager
 * Gerencia as páginas específicas de cada categoria (Lançamentos, Mais Procurados, etc.)
 */

class CategoryPageManager {
    constructor(category) {
        this.category = category;
        this.apiUrl = window.Config ? window.Config.apiBaseURL : 'http://localhost:5000';
        this.properties = [];
        this.filteredProperties = [];
        this.currentFilters = {};
        this.init();
    }

    async init() {
        try {
            console.log(`🏠 Carregando página da categoria: ${this.category}`);
            await this.loadProperties();
            this.setupFilters();
            this.renderProperties();
            this.updatePageTitle();
        } catch (error) {
            console.error('❌ Erro ao carregar página:', error);
            this.showErrorState();
        }
    }

    async loadProperties() {
        try {
            const response = await fetch(`${this.apiUrl}/properties?category=${this.category}`);
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar propriedades: ${response.status}`);
            }

            const data = await response.json();
            this.properties = data.properties || [];
            this.filteredProperties = [...this.properties];

            console.log(`📋 ${this.properties.length} propriedades carregadas para ${this.category}`);
            
        } catch (error) {
            console.warn(`⚠️ Erro ao carregar propriedades:`, error.message);
            this.properties = [];
            this.filteredProperties = [];
        }
    }

    renderProperties() {
        const container = document.getElementById('properties-grid') || 
                         document.querySelector('.properties-grid') ||
                         document.querySelector('.grid');
        
        if (!container) {
            console.error('❌ Container de propriedades não encontrado');
            return;
        }

        if (this.filteredProperties.length === 0) {
            this.showEmptyState(container);
            return;
        }

        // Limpa o container
        container.innerHTML = '';
        container.className = 'properties-grid';

        // Renderiza as propriedades
        this.filteredProperties.forEach(property => {
            const card = this.createPropertyCard(property);
            container.appendChild(card);
        });

        // Atualiza contador se existir
        this.updateResultsCounter();
    }

    createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card';
        
        // Formatar preço
        const price = this.formatPrice(property.price);
        
        // Primeira imagem ou placeholder
        const imageUrl = property.images && property.images.length > 0 
            ? property.images[0] 
            : '../assets/images/placeholder-property.svg';

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${property.title}" onerror="this.src='../assets/images/placeholder-property.svg'">
                <div class="card-badge">${this.getCategoryBadge(property.category)}</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${property.title}</h3>
                <p class="card-location">📍 ${property.location}</p>
                
                ${property.description ? `<p class="card-description">${property.description.substring(0, 100)}${property.description.length > 100 ? '...' : ''}</p>` : ''}
                
                <div class="card-details">
                    ${property.bedrooms ? `<span>🛏️ ${property.bedrooms} ${property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>` : ''}
                    ${property.bathrooms ? `<span>🚿 ${property.bathrooms} ${property.bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>` : ''}
                    ${property.area ? `<span>📐 ${property.area}m²</span>` : ''}
                    ${property.parking ? `<span>🚗 ${property.parking} ${property.parking === 1 ? 'vaga' : 'vagas'}</span>` : ''}
                </div>
                
                <div class="card-price">R$ ${price}</div>
                
                <div class="card-actions">
                    <button class="btn-primary" onclick="openPropertyDetails(${property.id})">Ver Detalhes</button>
                    <button class="btn-secondary" onclick="contactWhatsApp('${property.title}', '${property.location}', 'R$ ${price}')">💬 Tenho Interesse</button>
                </div>
            </div>
        `;

        return card;
    }

    formatPrice(price) {
        if (!price) return 'Consulte';
        
        const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.')) : price;
        
        if (isNaN(numPrice)) return 'Consulte';
        
        return numPrice.toLocaleString('pt-BR');
    }

    getCategoryBadge(category) {
        const badges = {
            'mais-procurados': '⭐ Mais Procurado',
            'lancamentos': '🚀 Lançamento',
            'pronto-morar': '🏡 Pronto para Morar',
            'beira-mar': '🌊 Beira Mar'
        };
        
        return badges[category] || '🏠 Imóvel';
    }

    showEmptyState(container) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏠</div>
                <h3>Nenhum imóvel encontrado</h3>
                <p>Não há imóveis disponíveis nesta categoria no momento.</p>
                <p>Que tal verificar outras categorias ou entrar em contato conosco?</p>
                <div class="empty-actions" style="margin-top: 20px;">
                    <button class="btn-primary" onclick="window.location.href='index.html'">Voltar ao Início</button>
                    <button class="btn-secondary" onclick="contactWhatsApp('Consulta Geral', '', '')">💬 Falar Conosco</button>
                </div>
            </div>
        `;
    }

    showErrorState() {
        const container = document.getElementById('properties-grid') || 
                         document.querySelector('.properties-grid') ||
                         document.querySelector('.grid');
        
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h3>Erro ao carregar imóveis</h3>
                    <p>Não foi possível conectar ao servidor.</p>
                    <button class="btn-primary" onclick="location.reload()">Tentar Novamente</button>
                </div>
            `;
        }
    }

    updatePageTitle() {
        const categoryNames = {
            'lancamentos': 'Lançamentos',
            'mais-procurados': 'Mais Procurados',
            'pronto-morar': 'Pronto para Morar',
            'beira-mar': 'Beira Mar'
        };

        const categoryName = categoryNames[this.category] || this.category;
        
        // Atualiza o título da página
        document.title = `${categoryName} - Marcelo Imóveis`;
        
        // Atualiza o h1 se existir
        const pageTitle = document.querySelector('h1.page-title') || document.querySelector('.page-header h1');
        if (pageTitle) {
            pageTitle.textContent = categoryName;
        }
    }

    updateResultsCounter() {
        const counter = document.querySelector('.results-counter');
        if (counter) {
            const total = this.filteredProperties.length;
            counter.textContent = `${total} ${total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`;
        }
    }

    setupFilters() {
        // Setup de filtros básicos
        this.setupPriceFilter();
        this.setupBedroomsFilter();
        this.setupLocationFilter();
        this.setupTypeFilter();
    }

    setupPriceFilter() {
        const priceFilter = document.getElementById('price-filter');
        if (priceFilter) {
            priceFilter.addEventListener('change', () => {
                this.currentFilters.priceRange = priceFilter.value;
                this.applyFilters();
            });
        }
    }

    setupBedroomsFilter() {
        const bedroomsFilter = document.getElementById('bedrooms-filter');
        if (bedroomsFilter) {
            bedroomsFilter.addEventListener('change', () => {
                this.currentFilters.bedrooms = bedroomsFilter.value;
                this.applyFilters();
            });
        }
    }

    setupLocationFilter() {
        const locationFilter = document.getElementById('location-filter');
        if (locationFilter) {
            locationFilter.addEventListener('input', () => {
                this.currentFilters.location = locationFilter.value.toLowerCase();
                this.applyFilters();
            });
        }
    }

    setupTypeFilter() {
        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.currentFilters.type = typeFilter.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.filteredProperties = this.properties.filter(property => {
            // Filtro de preço
            if (this.currentFilters.priceRange) {
                const price = parseFloat(property.price?.toString().replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
                const [min, max] = this.currentFilters.priceRange.split('-').map(Number);
                if (max && (price < min || price > max)) return false;
                if (!max && price < min) return false;
            }

            // Filtro de quartos
            if (this.currentFilters.bedrooms && property.bedrooms != this.currentFilters.bedrooms) {
                return false;
            }

            // Filtro de localização
            if (this.currentFilters.location && !property.location?.toLowerCase().includes(this.currentFilters.location)) {
                return false;
            }

            // Filtro de tipo
            if (this.currentFilters.type && property.type !== this.currentFilters.type) {
                return false;
            }

            return true;
        });

        this.renderProperties();
    }
}

// Funções globais
window.openPropertyDetails = function(propertyId) {
    console.log('Ver detalhes do imóvel:', propertyId);
    alert('Funcionalidade de detalhes será implementada em breve!');
};

window.contactWhatsApp = function(propertyTitle, location = '', price = '') {
    const phoneNumber = '5582999999999'; // Substitua pelo número real
    let message = `Olá! Tenho interesse no imóvel: ${propertyTitle}`;
    if (location) message += `\nLocalização: ${location}`;
    if (price) message += `\nPreço: ${price}`;
    message += `\n\nGostaria de mais informações.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

// Função para detectar a categoria da página atual
function getCurrentCategory() {
    const path = window.location.pathname;
    if (path.includes('lancamentos')) return 'lancamentos';
    if (path.includes('mais-procurados')) return 'mais-procurados';
    if (path.includes('pronto-morar')) return 'pronto-morar';
    if (path.includes('beira-mar')) return 'beira-mar';
    return null;
}

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    const category = getCurrentCategory();
    
    if (category) {
        // Aguarda um pouco para garantir que o Config.js foi carregado
        setTimeout(() => {
            new CategoryPageManager(category);
        }, 100);
    }
});
