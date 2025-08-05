/**
 * Sistema de Destaques para Página Index
 * Conecta com a API do dashboard para mostrar imóveis reais
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
            // PRIORIDADE 1: Dados sincronizados do dashboard
            const categoryKey = `${section}Properties`;
            const storedData = localStorage.getItem(categoryKey);
            
            if (storedData) {
                const properties = JSON.parse(storedData);
                const availableProperties = properties.filter(p => p.status === 'disponivel');
                console.log(`✅ Carregado ${availableProperties.length} imóveis de ${section} do localStorage`);
                
                // Ordena por data de criação (mais recentes primeiro) e limita
                return availableProperties
                    .sort((a, b) => new Date(b.createdAt || b.created || Date.now()) - new Date(a.createdAt || a.created || Date.now()))
                    .slice(0, limit);
            }
            
            // PRIORIDADE 2: Dados principais do dashboard
            const dashboardData = localStorage.getItem('marceloImoveisData');
            if (dashboardData) {
                const data = JSON.parse(dashboardData);
                if (data.properties && data.properties.length > 0) {
                    const sectionProperties = data.properties.filter(p => 
                        p.categoria === section && p.status === 'disponivel'
                    );
                    console.log(`✅ Carregado ${sectionProperties.length} imóveis de ${section} do dashboard principal`);
                    
                    // Ordena por data de criação (mais recentes primeiro) e limita
                    return sectionProperties
                        .sort((a, b) => new Date(b.createdAt || b.created || Date.now()) - new Date(a.createdAt || a.created || Date.now()))
                        .slice(0, limit);
                }
            }
            
            // FALLBACK: Tenta API (para compatibilidade)
            const baseUrl = window.Config ? window.Config.apiBaseURL : 'http://localhost:5001';
            const response = await fetch(`${baseUrl}/properties?category=${section}&limit=${limit}`);
            if (!response.ok) throw new Error('API não disponível');
            const apiData = await response.json();
            
            console.log(`✅ Carregado ${apiData.properties?.length || 0} imóveis de ${section} da API`);
            return apiData.properties || [];
            
        } catch (error) {
            console.warn(`❌ Erro ao carregar ${section}:`, error.message);
            console.log('📋 Mostrando estado vazio para', section);
            return [];
        }
    }

    renderHighlights(containerSelector, properties) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        // Se não há propriedades, mostra empty state
        if (!properties || properties.length === 0) {
            this.showEmptyState(containerSelector);
            return;
        }

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
                        <p class="property-title">${property.title}</p>
                    </div>
                    <div class="property-details">
                        <div class="details-row">
                            <span><i class="fas fa-bed"></i> ${property.bedrooms || 0}</span>
                            <span><i class="fas fa-bath"></i> ${property.bathrooms || 0}</span>
                            <span><i class="fas fa-car"></i> ${property.parking || 0}</span>
                            <span><i class="fas fa-ruler-combined"></i> ${property.area}</span>
                        </div>
                        <div class="price-info">
                            <p class="price">${property.price}</p>
                            ${property.condominio ? `<p class="condominio">+ Cond. ${property.condominio}</p>` : ''}
                        </div>
                    </div>
                    ${property.tags ? `
                        <div class="property-tags">
                            ${property.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="property-actions">
                        <button class="btn-whatsapp" onclick="window.open('https://wa.me/5582988780126?text=Olá! Tenho interesse no imóvel: ${encodeURIComponent(property.title)}', '_blank')">
                            <i class="fab fa-whatsapp"></i>
                            WhatsApp
                        </button>
                        <button class="btn-details" onclick="this.showPropertyDetails('${property.id}')">
                            <i class="fas fa-info-circle"></i>
                            Detalhes
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    initializeCardSliders(container) {
        const cards = container.querySelectorAll('.property-card');
        
        cards.forEach(card => {
            const slides = card.querySelectorAll('.property-slide');
            const dots = card.querySelectorAll('.dot');
            const prevBtn = card.querySelector('.nav-arrow.prev');
            const nextBtn = card.querySelector('.nav-arrow.next');
            
            if (slides.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
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
            
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(currentSlide > 0 ? currentSlide - 1 : slides.length - 1);
            });
            
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(currentSlide < slides.length - 1 ? currentSlide + 1 : 0);
            });
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showSlide(index);
                });
            });
        });
    }

    setupSliderFunctionality() {
        // Configura navegação das setas principais (entre cards)
        document.querySelectorAll('.carousel-arrow').forEach(arrow => {
            arrow.addEventListener('click', (e) => {
                const isLeft = arrow.classList.contains('left');
                const wrapper = arrow.closest('.carousel-wrapper');
                const container = wrapper.querySelector('.carousel-cards');
                const cards = container.querySelectorAll('.property-card:not(.empty-state)');
                
                if (cards.length === 0) return;
                
                const cardWidth = cards[0].offsetWidth + 20; // card width + margin
                const containerWidth = container.offsetWidth;
                const maxScroll = container.scrollWidth - containerWidth;
                
                let newScrollLeft;
                if (isLeft) {
                    newScrollLeft = Math.max(0, container.scrollLeft - cardWidth);
                } else {
                    newScrollLeft = Math.min(maxScroll, container.scrollLeft + cardWidth);
                }
                
                container.scrollTo({
                    left: newScrollLeft,
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

    showPropertyDetails(propertyId) {
        // Implementar modal de detalhes ou redirecionar para página específica
        console.log('Mostrar detalhes do imóvel:', propertyId);
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.indexHighlights = new IndexHighlights();
});
