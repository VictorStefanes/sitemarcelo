/**
 * Sistema de Destaques para Página Index
 * Mostra os últimos 4 itens de cada seção (Mais Procurados, Lançamentos, Beira Mar)
 */

class IndexHighlights {
    constructor() {
        this.sections = {
            'mais-procurados': {
                container: '.carousel-cards:first-of-type',
                title: 'Mais Procurados',
                icon: 'fas fa-star',
                emptyMessage: 'Nenhum imóvel destacado',
                emptyDescription: 'Os imóveis mais procurados aparecerão aqui quando forem adicionados pelo dashboard.'
            },
            'lancamentos': {
                container: '.lancamentos-cards',
                title: 'Lançamentos',
                icon: 'fas fa-home',
                emptyMessage: 'Nenhum lançamento cadastrado',
                emptyDescription: 'Os imóveis aparecerão aqui quando forem adicionados pelo dashboard.'
            },
            'pronto-morar': {
                container: '.pronto-cards',
                title: 'Pronto para Morar',
                icon: 'fas fa-key',
                emptyMessage: 'Nenhum imóvel pronto para morar',
                emptyDescription: 'Os imóveis aparecerão aqui quando forem adicionados pelo dashboard.'
            }
        };
        
        this.init();
    }

    async init() {
        try {
            await this.loadHighlights();
            this.setupSliderFunctionality();
        } catch (error) {
            console.error('Erro ao carregar destaques:', error);
        }
    }

    async loadHighlights() {
        // Para cada seção, carrega os últimos 4 itens
        for (const [sectionName, config] of Object.entries(this.sections)) {
            try {
                const properties = await this.fetchLatestProperties(sectionName, 4);
                this.renderHighlights(config.container, properties);
            } catch (error) {
                console.error(`Erro ao carregar ${sectionName}:`, error);
                this.showEmptyState(config.container);
            }
        }
    }

    async fetchLatestProperties(section, limit = 4) {
        try {
            // Conectar com API real do dashboard
            const response = await fetch(`/api/properties/${section}/latest?limit=${limit}`);
            if (!response.ok) throw new Error('API não disponível');
            return await response.json();
        } catch (error) {
            console.warn('API não disponível, usando dados mock');
            return this.getMockProperties(section, limit);
        }
    }

    getMockProperties(section, limit) {
        const mockData = {
            'mais-procurados': [
                {
                    id: 1,
                    title: 'Apartamento Centro Histórico Premium',
                    location: 'Centro - Maceió/AL',
                    price: 'R$ 650.000,00',
                    bedrooms: 2,
                    bathrooms: 2,
                    parking: 1,
                    area: '70m²',
                    condominio: 'R$ 280,00',
                    images: ['../assets/images/edifício.jpg', '../assets/images/fundo.jpg'],
                    tags: ['Mais procurado', 'Centro', 'Pronto para morar'],
                    dateAdded: new Date('2024-12-10')
                },
                {
                    id: 2,
                    title: 'Cobertura Vista Panorâmica',
                    location: 'Ponta Verde - Maceió/AL',
                    price: 'R$ 1.200.000,00',
                    bedrooms: 4,
                    bathrooms: 3,
                    parking: 3,
                    area: '150m²',
                    condominio: 'R$ 580,00',
                    images: ['../assets/images/edifício.jpg'],
                    tags: ['Cobertura', 'Vista mar', 'Luxo'],
                    dateAdded: new Date('2024-12-09')
                }
            ],
            'lancamentos': [
                {
                    id: 3,
                    title: 'Residencial Sunset Boulevard',
                    location: 'Jatiúca - Maceió/AL',
                    price: 'R$ 850.000,00',
                    bedrooms: 3,
                    bathrooms: 2,
                    parking: 2,
                    area: '85m²',
                    condominio: 'R$ 350,00',
                    images: ['../assets/images/edifício.jpg'],
                    tags: ['Lançamento', 'Financiamento', 'Novo'],
                    dateAdded: new Date('2024-12-08')
                },
                {
                    id: 4,
                    title: 'Condomínio Ocean Breeze',
                    location: 'Garça Torta - Maceió/AL',
                    price: 'R$ 420.000,00',
                    bedrooms: 2,
                    bathrooms: 1,
                    parking: 1,
                    area: '62m²',
                    condominio: 'R$ 220,00',
                    images: ['../assets/images/edifício.jpg'],
                    tags: ['Lançamento', 'Entrada facilitada'],
                    dateAdded: new Date('2024-12-07')
                }
            ],
            'beira-mar': [
                {
                    id: 5,
                    title: 'Flat Premium Beira Mar',
                    location: 'Pajuçara - Maceió/AL',
                    price: 'R$ 980.000,00',
                    bedrooms: 2,
                    bathrooms: 2,
                    parking: 1,
                    area: '65m²',
                    condominio: 'R$ 420,00',
                    images: ['../assets/images/edifício.jpg'],
                    tags: ['Beira mar', 'Vista mar', 'Mobiliado'],
                    dateAdded: new Date('2024-12-06')
                },
                {
                    id: 6,
                    title: 'Apartamento Frente Oceano',
                    location: 'Jatiúca - Maceió/AL',
                    price: 'R$ 1.350.000,00',
                    bedrooms: 3,
                    bathrooms: 3,
                    parking: 2,
                    area: '95m²',
                    condominio: 'R$ 680,00',
                    images: ['../assets/images/edifício.jpg'],
                    tags: ['Frente mar', 'Luxo', 'Aceita permuta'],
                    dateAdded: new Date('2024-12-05')
                }
            ]
        };

        return (mockData[section] || []).slice(0, limit);
    }

    renderHighlights(containerSelector, properties) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = properties.map(property => this.getPropertyCardHTML(property)).join('');
        
        // Adiciona funcionalidade de slider para cada card
        this.initializeCardSliders(container);
    }

    getPropertyCardHTML(property) {
        return `
            <div class="property-card" data-property-id="${property.id}">
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

    initializeCardSliders(container) {
        const cards = container.querySelectorAll('.property-card');
        
        cards.forEach(card => {
            const slides = card.querySelectorAll('.property-slide');
            const dots = card.querySelectorAll('.dot');
            const prevBtn = card.querySelector('.prev');
            const nextBtn = card.querySelector('.next');
            
            if (slides.length <= 1) {
                // Se só tem uma imagem, esconde os controles
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                card.querySelector('.dots-container').style.display = 'none';
                return;
            }

            let currentSlide = 0;

            const showSlide = (index) => {
                slides.forEach((slide, i) => {
                    slide.style.display = i === index ? 'block' : 'none';
                    slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
                });
                
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                    dot.setAttribute('aria-selected', i === index);
                });
                
                currentSlide = index;
            };

            // Event listeners para navegação
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    const newIndex = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
                    showSlide(newIndex);
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const newIndex = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
                    showSlide(newIndex);
                });
            }

            // Event listeners para dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => showSlide(index));
            });
        });
    }

    setupSliderFunctionality() {
        // Funcionalidade para os sliders das seções (setas grandes)
        document.querySelectorAll('.carousel-arrow').forEach(arrow => {
            arrow.addEventListener('click', (e) => {
                const isLeft = arrow.classList.contains('left');
                const carousel = arrow.closest('.carousel-wrapper').querySelector('.grid');
                const cardWidth = 420; // width + gap
                const scrollAmount = isLeft ? -cardWidth : cardWidth;
                
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
        });
    }

    showEmptyState(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (container) {
            // Encontra a configuração da seção baseada no container
            const sectionConfig = Object.values(this.sections).find(section => 
                section.container === containerSelector
            );
            
            if (sectionConfig) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="${sectionConfig.icon}" style="font-size: 3rem; color: #d4af37; margin-bottom: 1rem;"></i>
                        <h3>${sectionConfig.emptyMessage}</h3>
                        <p>${sectionConfig.emptyDescription}</p>
                    </div>
                `;
            } else {
                // Fallback genérico
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-home" style="font-size: 3rem; color: #d4af37; margin-bottom: 1rem;"></i>
                        <h3>Nenhum imóvel disponível</h3>
                        <p>Os imóveis aparecerão aqui quando forem adicionados pelo dashboard.</p>
                    </div>
                `;
            }
        }
    }
}

// API para dashboard gerenciar os destaques
window.IndexHighlightsAPI = {
    refresh: () => {
        if (window.indexHighlights) {
            window.indexHighlights.loadHighlights();
        }
    },
    
    addProperty: (section, property) => {
        // Adiciona nova propriedade e atualiza os destaques
        if (window.indexHighlights) {
            window.indexHighlights.loadHighlights();
        }
    }
};

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Só inicializa se estivermos na página index
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        window.indexHighlights = new IndexHighlights();
    }
});
