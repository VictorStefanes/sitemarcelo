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
        
        // Limpa qualquer conteúdo imediatamente
        this.clearInitialContent();
        
        // Inicializa quando DOM estiver pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    clearInitialContent() {
        // Limpa imediatamente qualquer conteúdo que possa estar carregado
        const containers = document.querySelectorAll('.properties-grid, .grid, .lancamentos-grid');
        containers.forEach(container => {
            if (container) {
                // Remove qualquer conteúdo anterior imediatamente
                container.innerHTML = '';
                container.style.minHeight = '200px';
                container.style.display = 'block';
                
                // Insere placeholder de loading personalizado
                const categoryName = this.getCategoryDisplayName();
                container.innerHTML = `
                    <div class="instant-loading" style="display: flex; align-items: center; justify-content: center; min-height: 200px; color: #666;">
                        <i class="fas fa-spinner fa-spin" style="margin-right: 10px; color: #d4af37;"></i>
                        Carregando ${categoryName.toLowerCase()}...
                    </div>
                `;
            }
        });
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
        const containers = document.querySelectorAll('.properties-grid, .grid, .lancamentos-grid');
        containers.forEach(container => {
            if (container) {
                // Limpa imediatamente qualquer conteúdo anterior
                container.innerHTML = '';
                container.style.minHeight = '200px'; // Evita mudança de layout
                
                // Insere loading sem delay
                container.innerHTML = `
                    <div class="loading-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #d4af37; margin-bottom: 1rem;"></i>
                        <h3 style="margin: 0; color: #666;">Carregando ${this.getCategoryDisplayName()}...</h3>
                        <p style="margin: 0.5rem 0 0 0; color: #999; font-size: 0.9rem;">Aguarde um momento</p>
                    </div>
                `;
            }
        });
        
        // Atualiza contador
        const counter = document.querySelector('.properties-count');
        if (counter) {
            counter.textContent = 'Carregando...';
            counter.style.opacity = '0.7';
        }
    }

    getCategoryDisplayName() {
        const names = {
            'lancamentos': 'Lançamentos',
            'mais-procurados': 'Mais Procurados',
            'beira-mar': 'Beira Mar',
            'pronto-morar': 'Pronto para Morar'
        };
        return names[this.currentCategory] || 'imóveis';
    }

    async loadCategoryProperties() {
        try {
            // Carrega TODOS os imóveis da categoria (sem limite)
            const response = await fetch(`${this.apiUrl}?category=${this.currentCategory}`);
            if (!response.ok) throw new Error('API não disponível');
            
            const data = await response.json();
            const properties = data.properties || [];
            
            if (properties.length === 0) {
                this.showEmptyState();
            } else {
                this.renderProperties(properties);
                this.updateCounters(properties.length);
            }
            
        } catch (error) {
            console.error('Erro ao buscar imóveis:', error);
            this.showEmptyState();
        }
    }

    renderProperties(properties) {
        const containers = document.querySelectorAll('.properties-grid, .grid, .lancamentos-grid');
        const targetContainer = containers[0]; // Usa o primeiro container encontrado
        
        if (!targetContainer) {
            console.warn('Container de propriedades não encontrado');
            return;
        }

        // Remove altura mínima e renderiza as propriedades
        targetContainer.style.minHeight = '';
        targetContainer.innerHTML = properties.map(property => this.getPropertyCardHTML(property)).join('');
        
        // Inicializa sliders dos cards
        this.initializeCardSliders();
        
        // Adiciona animação de fade-in
        targetContainer.style.opacity = '0';
        setTimeout(() => {
            targetContainer.style.transition = 'opacity 0.3s ease';
            targetContainer.style.opacity = '1';
        }, 50);
    }

    getPropertyCardHTML(property) {
        const images = property.images && property.images.length > 0 ? property.images : ['../assets/images/default-property.jpg'];
        const features = Array.isArray(property.features) ? property.features : [];
        
        return `
            <div class="property-card" data-property-id="${property.id}">
                <div class="property-carousel">
                    ${images.length > 1 ? '<button class="nav-arrow prev" aria-label="Anterior">‹</button>' : ''}
                    ${images.length > 1 ? '<button class="nav-arrow next" aria-label="Próximo">›</button>' : ''}
                    
                    <div class="carousel-images">
                        ${images.map((image, index) => `
                            <div class="carousel-slide ${index === 0 ? 'active' : ''}" style="${index > 0 ? 'display: none;' : ''}">
                                <img src="${image}" alt="${property.title}">
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
                        <h3 class="property-title">${property.title}</h3>
                        <p class="property-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${property.location}
                        </p>
                    </div>
                    
                    <div class="property-details">
                        <div class="details-grid">
                            ${property.bedrooms ? `<span><i class="fas fa-bed"></i> ${property.bedrooms} quartos</span>` : ''}
                            ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} banheiros</span>` : ''}
                            ${property.area ? `<span><i class="fas fa-ruler-combined"></i> ${property.area}m²</span>` : ''}
                            ${property.parking ? `<span><i class="fas fa-car"></i> ${property.parking} vagas</span>` : ''}
                        </div>
                    </div>
                    
                    ${property.description ? `
                        <div class="property-description">
                            <p>${property.description.length > 100 ? property.description.substring(0, 100) + '...' : property.description}</p>
                        </div>
                    ` : ''}
                    
                    ${features.length > 0 ? `
                        <div class="property-features">
                            ${features.slice(0, 3).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                            ${features.length > 3 ? `<span class="feature-more">+${features.length - 3} mais</span>` : ''}
                        </div>
                    ` : ''}
                    
                    <div class="property-footer">
                        <div class="property-price">
                            <span class="price">${property.price}</span>
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
        // Atualiza contadores na página com transição suave
        const counter = document.querySelector('.results-count, .properties-count');
        if (counter) {
            counter.style.transition = 'opacity 0.3s ease';
            counter.style.opacity = '1';
            
            const categoryName = this.getCategoryDisplayName();
            if (total === 0) {
                counter.textContent = `Nenhum imóvel encontrado em ${categoryName}`;
                counter.style.color = '#999';
            } else if (total === 1) {
                counter.textContent = `1 imóvel em ${categoryName}`;
                counter.style.color = '#333';
            } else {
                counter.textContent = `${total} imóveis em ${categoryName}`;
                counter.style.color = '#333';
            }
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
        const containers = document.querySelectorAll('.properties-grid, .grid, .lancamentos-grid');
        const targetContainer = containers[0];
        if (!targetContainer) return;
        
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
        
        // Remove altura mínima e insere conteúdo vazio
        targetContainer.style.minHeight = '';
        targetContainer.innerHTML = `
            <div class="empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; text-align: center; opacity: 0; transition: opacity 0.3s ease;">
                <i class="${config.icon}" style="font-size: 3rem; color: #d4af37; margin-bottom: 1.5rem;"></i>
                <h3 style="margin-bottom: 1rem; color: #333;">${config.title}</h3>
                <p style="margin-bottom: 2rem; color: #666; max-width: 400px;">${config.message}</p>
                <div class="empty-actions">
                    <a href="index.html" class="btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 12px 24px; background: linear-gradient(135deg, #d4af37 0%, #f1d366 100%); color: #1a1a1a; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;">
                        <i class="fas fa-arrow-left"></i>
                        Voltar ao início
                    </a>
                </div>
            </div>
        `;
        
        // Fade in do conteúdo
        setTimeout(() => {
            const emptyState = targetContainer.querySelector('.empty-state');
            if (emptyState) {
                emptyState.style.opacity = '1';
            }
        }, 50);
    }

    setupFilters() {
        // Implementar filtros se necessário
        console.log('Filtros configurados para categoria:', this.currentCategory);
    }

    contactWhatsApp(propertyId, title) {
        const message = `Olá! Tenho interesse no imóvel: ${title}`;
        const whatsappUrl = `https://wa.me/5582887801260?text=${encodeURIComponent(message)}`;
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
    
    // Limpeza imediata e otimizada para evitar qualquer flash
    function immediateCleanup() {
        const containers = document.querySelectorAll('.properties-grid, .grid, .lancamentos-grid');
        containers.forEach(container => {
            if (container) {
                // Remove qualquer conteúdo imediatamente
                container.innerHTML = '';
                
                // Detecta categoria atual
                const path = window.location.pathname;
                let categoryName = 'imóveis';
                if (path.includes('lancamentos')) categoryName = 'lançamentos';
                else if (path.includes('mais-procurados')) categoryName = 'mais procurados';
                else if (path.includes('beira-mar')) categoryName = 'beira mar';
                else if (path.includes('pronto-morar')) categoryName = 'prontos para morar';
                
                // Insere loading personalizado instantaneamente
                container.style.minHeight = '200px';
                container.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; min-height: 200px; color: #666; font-family: inherit;">
                        <i class="fas fa-spinner fa-spin" style="margin-right: 10px; color: #d4af37; font-size: 1.2rem;"></i>
                        Carregando ${categoryName}...
                    </div>
                `;
            }
        });
    }
    
    // Executa limpeza imediatamente, independente do estado do DOM
    immediateCleanup();
    
    // Inicializa o CategoryLoader
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.categoryLoader = new CategoryLoader();
        });
    } else {
        window.categoryLoader = new CategoryLoader();
    }
}
