/**
 * Sistema de Carregamento de Imóveis por Categoria
 * Carrega TODOS os imóveis de uma categoria específica nas páginas dedicadas
 */

class CategoryLoader {
    constructor() {
        // Usa configuração dinâmica se disponível
        const baseUrl = window.Config ? window.Config.apiBaseURL : 'http://localhost:5001';
        this.apiUrl = `${baseUrl}/properties`;
        this.currentCategory = this.detectCategory();
        this.init();
    }

    detectCategory() {
        // Detecta a categoria baseada na URL/página atual
        const path = window.location.pathname;
        
        if (path.includes('lancamentos')) return 'lancamentos';
        if (path.includes('mais-procurados')) return 'mais-procurados';
        if (path.includes('beira-mar')) return 'beira-mar';
        if (path.includes('pronto-morar')) return 'pronto-morar';
        
        return null;
    }

    async init() {
        if (!this.currentCategory) {
            console.warn('Categoria não detectada');
            return;
        }

        // Limpa qualquer conteúdo inicial e mostra loading
        this.showLoadingState();

        try {
            await this.loadCategoryProperties();
            this.setupFilters();
        } catch (error) {
            console.error('Erro ao carregar imóveis da categoria:', error);
            this.showEmptyState();
        }
    }

    showLoadingState() {
        const container = document.querySelector('.properties-grid, .grid, .lancamentos-grid');
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #d4af37; margin-bottom: 1rem;"></i>
                    <h3>Carregando imóveis...</h3>
                    <p>Aguarde enquanto buscamos os imóveis disponíveis.</p>
                </div>
            `;
        }
        
        // Atualiza contador
        const counter = document.querySelector('.properties-count');
        if (counter) {
            counter.textContent = 'Carregando...';
        }
    }

    async loadCategoryProperties() {
        try {
            // PRIORIDADE 1: Dados sincronizados do dashboard por categoria
            const categoryKey = `${this.currentCategory}Properties`;
            const storedData = localStorage.getItem(categoryKey);
            
            if (storedData) {
                const properties = JSON.parse(storedData);
                const availableProperties = properties.filter(p => p.status === 'disponivel');
                console.log(`✅ Carregado ${availableProperties.length} imóveis de ${this.currentCategory} do localStorage`);
                
                if (availableProperties.length === 0) {
                    this.showEmptyState();
                } else {
                    this.renderProperties(availableProperties);
                    this.updateCounters(availableProperties.length);
                }
                return;
            }
            
            // PRIORIDADE 2: Dados principais do dashboard
            const dashboardData = localStorage.getItem('marceloImoveisData');
            if (dashboardData) {
                const data = JSON.parse(dashboardData);
                if (data.properties && data.properties.length > 0) {
                    const categoryProperties = data.properties.filter(p => 
                        p.categoria === this.currentCategory && p.status === 'disponivel'
                    );
                    console.log(`✅ Carregado ${categoryProperties.length} imóveis de ${this.currentCategory} do dashboard principal`);
                    
                    if (categoryProperties.length === 0) {
                        this.showEmptyState();
                    } else {
                        this.renderProperties(categoryProperties);
                        this.updateCounters(categoryProperties.length);
                    }
                    return;
                }
            }
            
            // FALLBACK: Tenta API (para compatibilidade)
            const response = await fetch(`${this.apiUrl}?category=${this.currentCategory}`);
            if (!response.ok) throw new Error('API não disponível');
            
            const data = await response.json();
            const properties = data.properties || [];
            
            console.log(`✅ Carregado ${properties.length} imóveis de ${this.currentCategory} da API`);
            
            if (properties.length === 0) {
                this.showEmptyState();
            } else {
                this.renderProperties(properties);
                this.updateCounters(properties.length);
            }
            
        } catch (error) {
            console.warn(`❌ Erro ao buscar imóveis de ${this.currentCategory}:`, error.message);
            console.log('📋 Mostrando estado vazio para', this.currentCategory);
            this.showEmptyState();
        }
    }

    renderProperties(properties) {
        const container = document.querySelector('.properties-grid, .grid, .lancamentos-grid');
        if (!container) {
            console.warn('Container de propriedades não encontrado');
            return;
        }

        container.innerHTML = properties.map(property => this.getPropertyCardHTML(property)).join('');
        this.initializeCardSliders();
    }

    getPropertyCardHTML(property) {
        // Compatibilidade entre formatos dashboard/api
        const title = property.title || property.titulo || 'Imóvel sem título';
        const location = property.location || property.localizacao || 'Localização não informada';
        const price = property.price || property.preco || property.preco_formatado || 'Preço não informado';
        const images = property.images || property.imagens || ['../assets/images/default-property.jpg'];
        const bedrooms = property.bedrooms || property.quartos || 0;
        const bathrooms = property.bathrooms || property.banheiros || 0;
        const parking = property.parking || property.garagem || property.vagas || 0;
        const area = property.area || 0;
        const description = property.description || property.descricao || '';
        const features = property.features || property.caracteristicas || '';
        const featuresArray = typeof features === 'string' ? features.split(',').map(f => f.trim()).filter(f => f) : (Array.isArray(features) ? features : []);
        
        return `
            <div class="property-card" data-property-id="${property.id}">
                <div class="property-carousel">
                    ${images.length > 1 ? '<button class="nav-arrow prev" aria-label="Anterior">‹</button>' : ''}
                    ${images.length > 1 ? '<button class="nav-arrow next" aria-label="Próximo">›</button>' : ''}
                    
                    <div class="carousel-images">
                        ${images.map((image, index) => `
                            <div class="carousel-slide ${index === 0 ? 'active' : ''}" style="${index > 0 ? 'display: none;' : ''}">
                                <img src="${image}" alt="${title}">
                            </div>
                        `).join('')}
                    </div>
                    
                    ${images.length > 1 ? `
                        <div class="carousel-dots">
                            ${images.map((_, index) => `
                                <button class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="property-content">
                    <div class="property-header">
                        <h3 class="property-title">${title}</h3>
                        <p class="property-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${location}
                        </p>
                    </div>
                    
                    <div class="property-details">
                        <div class="details-grid">
                            ${bedrooms ? `<span><i class="fas fa-bed"></i> ${bedrooms} quartos</span>` : ''}
                            ${bathrooms ? `<span><i class="fas fa-bath"></i> ${bathrooms} banheiros</span>` : ''}
                            ${area ? `<span><i class="fas fa-ruler-combined"></i> ${area}m²</span>` : ''}
                            ${parking ? `<span><i class="fas fa-car"></i> ${parking} vagas</span>` : ''}
                        </div>
                    </div>
                    
                    ${description ? `
                        <div class="property-description">
                            <p>${description.length > 100 ? description.substring(0, 100) + '...' : description}</p>
                        </div>
                    ` : ''}
                    
                    ${featuresArray.length > 0 ? `
                        <div class="property-features">
                            ${featuresArray.slice(0, 3).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                            ${featuresArray.length > 3 ? `<span class="feature-more">+${featuresArray.length - 3} mais</span>` : ''}
                        </div>
                    ` : ''}
                    
                    <div class="property-footer">
                        <div class="property-price">
                            <span class="price">${price}</span>
                            ${property.condominio ? `<span class="condominio">+ Cond. ${property.condominio}</span>` : ''}
                        </div>
                        
                        <div class="property-actions">
                            <button class="btn-whatsapp" onclick="this.contactWhatsApp('${property.id}', '${property.title}')">
                                <i class="fab fa-whatsapp"></i>
                                WhatsApp
                            </button>
                            <button class="btn-details" onclick="this.showDetails('${property.id}')">
                                <i class="fas fa-info-circle"></i>
                                Ver mais
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initializeCardSliders() {
        document.querySelectorAll('.property-card').forEach(card => {
            const slides = card.querySelectorAll('.carousel-slide');
            const dots = card.querySelectorAll('.dot');
            const prevBtn = card.querySelector('.nav-arrow.prev');
            const nextBtn = card.querySelector('.nav-arrow.next');
            
            if (slides.length <= 1) return;
            
            let currentSlide = 0;
            
            const showSlide = (index) => {
                slides.forEach((slide, i) => {
                    slide.style.display = i === index ? 'block' : 'none';
                    slide.classList.toggle('active', i === index);
                });
                
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                
                currentSlide = index;
            };
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showSlide(currentSlide > 0 ? currentSlide - 1 : slides.length - 1);
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showSlide(currentSlide < slides.length - 1 ? currentSlide + 1 : 0);
                });
            }
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showSlide(index);
                });
            });
        });
    }

    updateCounters(total) {
        // Atualiza contadores na página
        const counter = document.querySelector('.results-count, .properties-count');
        if (counter) {
            counter.textContent = `${total} ${total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`;
        }
        
        // Atualiza título da página
        const pageTitle = document.querySelector('.page-title, h1');
        if (pageTitle && total > 0) {
            const categoryNames = {
                'lancamentos': 'Lançamentos',
                'mais-procurados': 'Mais Procurados', 
                'beira-mar': 'Beira Mar',
                'pronto-morar': 'Pronto para Morar'
            };
            pageTitle.textContent = `${categoryNames[this.currentCategory]} (${total})`;
        }
    }

    showEmptyState() {
        const container = document.querySelector('.properties-grid, .grid, .lancamentos-grid');
        if (!container) return;
        
        const categoryMessages = {
            'lancamentos': {
                icon: 'fas fa-home',
                title: 'Nenhum lançamento disponível',
                message: 'Novos lançamentos aparecerão aqui quando forem adicionados.'
            },
            'mais-procurados': {
                icon: 'fas fa-star',
                title: 'Nenhum imóvel em destaque',
                message: 'Os imóveis mais procurados aparecerão aqui.'
            },
            'beira-mar': {
                icon: 'fas fa-umbrella-beach',
                title: 'Nenhum imóvel beira mar',
                message: 'Imóveis com vista para o mar aparecerão aqui.'
            },
            'pronto-morar': {
                icon: 'fas fa-key',
                title: 'Nenhum imóvel pronto para morar',
                message: 'Imóveis prontos para morar aparecerão aqui.'
            }
        };
        
        const config = categoryMessages[this.currentCategory] || {
            icon: 'fas fa-home',
            title: 'Nenhum imóvel disponível',
            message: 'Os imóveis aparecerão aqui quando forem adicionados.'
        };
        
        container.innerHTML = `
            <div class="empty-state">
                <i class="${config.icon}" style="font-size: 4rem; color: #d4af37; margin-bottom: 2rem;"></i>
                <h3>${config.title}</h3>
                <p>${config.message}</p>
                <div class="empty-actions">
                    <a href="index.html" class="btn-primary">
                        <i class="fas fa-arrow-left"></i>
                        Voltar ao início
                    </a>
                </div>
            </div>
        `;
    }

    setupFilters() {
        // Implementar filtros se necessário
        console.log('Filtros configurados para categoria:', this.currentCategory);
    }

    contactWhatsApp(propertyId, title) {
        const message = `Olá! Tenho interesse no imóvel: ${title}`;
        const whatsappUrl = `https://wa.me/5582988780126?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    showDetails(propertyId) {
        // Implementar modal de detalhes ou redirecionamento
        console.log('Mostrar detalhes do imóvel:', propertyId);
    }
}

// Inicializa apenas em páginas de categoria
if (window.location.pathname.includes('lancamentos') || 
    window.location.pathname.includes('mais-procurados') || 
    window.location.pathname.includes('beira-mar') || 
    window.location.pathname.includes('pronto-morar')) {
    
    // Limpeza imediata para evitar flash de conteúdo
    function clearInitialContent() {
        const container = document.querySelector('.properties-grid, .grid, .lancamentos-grid');
        if (container) {
            // Remove o empty-state inicial imediatamente
            const emptyState = container.querySelector('.empty-state');
            if (emptyState) {
                emptyState.style.display = 'none';
            }
        }
    }
    
    // Executa a limpeza assim que o script for carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', clearInitialContent);
    } else {
        clearInitialContent();
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        window.categoryLoader = new CategoryLoader();
    });
}
