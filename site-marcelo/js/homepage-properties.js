/**
 * Homepage Properties Manager
 * Carrega os 4 últimos imóveis de cada categoria para exibir na página inicial
 */

class HomepagePropertiesManager {
    constructor() {
        this.apiUrl = window.Config ? window.Config.apiBaseURL : 'http://localhost:5000';
        this.init();
    }

    async init() {
        try {
            console.log('🏠 Carregando imóveis para a homepage...');
            await this.loadAllSections();
        } catch (error) {
            console.error('❌ Erro ao carregar imóveis da homepage:', error);
            this.showEmptyStates();
        }
    }

    async loadAllSections() {
        // Carrega os 4 últimos imóveis de cada categoria
        await Promise.all([
            this.loadSectionProperties('mais-procurados', 'mais-procurados'),
            this.loadSectionProperties('lancamentos', 'lancamentos'),
            this.loadSectionProperties('pronto-morar', 'pronto-para-morar')
        ]);
    }

    async loadSectionProperties(category, sectionId) {
        try {
            const response = await fetch(`${this.apiUrl}/properties?category=${category}&limit=4`);
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar ${category}: ${response.status}`);
            }

            const data = await response.json();
            const properties = data.properties || [];

            console.log(`📋 ${category}: ${properties.length} imóveis carregados`);
            
            this.renderProperties(properties, sectionId);
            
        } catch (error) {
            console.warn(`⚠️ Erro ao carregar ${category}:`, error.message);
            this.showEmptyState(sectionId, category);
        }
    }

    renderProperties(properties, sectionId) {
        const container = this.getCardsContainer(sectionId);
        
        if (!container) {
            console.error(`❌ Container não encontrado para seção: ${sectionId}`);
            return;
        }

        if (properties.length === 0) {
            this.showEmptyState(sectionId, sectionId);
            return;
        }

        // Limpa o container
        container.innerHTML = '';

        // Adiciona os cards
        properties.forEach(property => {
            const card = this.createPropertyCard(property);
            container.appendChild(card);
        });

        // Inicializa o carousel se existir
        this.initializeCarousel(sectionId);
    }

    getCardsContainer(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return null;

        // Busca diferentes possíveis containers
        return section.querySelector('.carousel-cards') || 
               section.querySelector('.grid') ||
               section.querySelector('.cards-container');
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
                <div class="card-details">
                    ${property.bedrooms ? `<span>🛏️ ${property.bedrooms}</span>` : ''}
                    ${property.bathrooms ? `<span>🚿 ${property.bathrooms}</span>` : ''}
                    ${property.area ? `<span>📐 ${property.area}m²</span>` : ''}
                </div>
                <div class="card-price">R$ ${price}</div>
                <div class="card-actions">
                    <button class="btn-primary" onclick="openPropertyDetails(${property.id})">Ver Detalhes</button>
                    <button class="btn-secondary" onclick="contactWhatsApp('${property.title}')">💬 Contato</button>
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

    showEmptyState(sectionId, category) {
        const container = this.getCardsContainer(sectionId);
        if (!container) return;

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏠</div>
                <h3>Nenhum imóvel encontrado</h3>
                <p>Não há imóveis na categoria "${category}" no momento.</p>
            </div>
        `;
    }

    showEmptyStates() {
        ['mais-procurados', 'Lançamento', 'pronto-para-morar'].forEach(sectionId => {
            this.showEmptyState(sectionId, sectionId);
        });
    }

    initializeCarousel(sectionId) {
        // Implementa navegação do carousel se necessário
        const section = document.getElementById(sectionId);
        if (!section) return;

        const leftArrow = section.querySelector('.custom-arrow.left');
        const rightArrow = section.querySelector('.custom-arrow.right');
        const cardsContainer = section.querySelector('.carousel-cards');

        if (!leftArrow || !rightArrow || !cardsContainer) return;

        // Remove listeners antigos
        leftArrow.replaceWith(leftArrow.cloneNode(true));
        rightArrow.replaceWith(rightArrow.cloneNode(true));

        // Adiciona novos listeners
        const newLeftArrow = section.querySelector('.custom-arrow.left');
        const newRightArrow = section.querySelector('.custom-arrow.right');

        newLeftArrow.addEventListener('click', () => this.scrollCarousel(cardsContainer, -1));
        newRightArrow.addEventListener('click', () => this.scrollCarousel(cardsContainer, 1));
    }

    scrollCarousel(container, direction) {
        const cardWidth = container.querySelector('.property-card')?.offsetWidth || 300;
        const scrollAmount = cardWidth * direction;
        
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Funções globais para os botões dos cards
window.openPropertyDetails = function(propertyId) {
    // Redireciona para página de detalhes (pode ser implementada depois)
    console.log('Ver detalhes do imóvel:', propertyId);
    alert('Funcionalidade de detalhes será implementada em breve!');
};

window.contactWhatsApp = function(propertyTitle) {
    const phoneNumber = '5582987654321'; // Número do Marcelo Augusto
    const message = `Olá! Tenho interesse no imóvel: ${propertyTitle}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Aguarda um pouco para garantir que o Config.js foi carregado
    setTimeout(() => {
        new HomepagePropertiesManager();
    }, 100);
});
