// ===========================================
// DASHBOARD CORE JAVASCRIPT
// ===========================================

class DashboardCore {
    constructor() {
        this.properties = [];
        this.filters = {
            search: '',
            category: 'all',
            priceRange: 'all',
            status: 'all'
        };
        this.currentView = 'overview';
        this.charts = {};
        
        this.init();
    }

    init() {
        this.loadStoredData();
        this.setupEventListeners();
        this.initializeCharts();
        this.updateDashboard();
        this.setupMobileMenu();
    }

    // ===========================================
    // DATA MANAGEMENT
    // ===========================================
    loadStoredData() {
        const stored = localStorage.getItem('dashboard_properties');
        if (stored) {
            this.properties = JSON.parse(stored);
        }
        
        // Load sample data if empty
        if (this.properties.length === 0) {
            this.loadSampleData();
        }
    }

    loadSampleData() {
        this.properties = [
            {
                id: '1',
                title: 'Apartamento Vista Mar Premium',
                location: 'Beira Mar, Fortaleza',
                price: 850000,
                category: 'beira-mar',
                status: 'disponivel',
                bedrooms: 3,
                bathrooms: 2,
                area: 120,
                images: [
                    'assets/images/edifício.jpg',
                    'assets/images/fundo.jpg',
                    'assets/images/53103520100-d8bfe7d10f-k.jpg.webp'
                ],
                description: 'Apartamento de luxo com vista privilegiada para o mar.',
                features: ['Vista Mar', 'Varanda Gourmet', 'Área de Lazer'],
                dateAdded: new Date().toISOString(),
                views: 45,
                leads: 8
            },
            {
                id: '2',
                title: 'Casa Moderna em Condomínio',
                location: 'Aldeota, Fortaleza',
                price: 650000,
                category: 'mais-procurados',
                status: 'vendido',
                bedrooms: 4,
                bathrooms: 3,
                area: 180,
                images: [
                    'assets/images/fundo.jpg',
                    'assets/images/edifício.jpg'
                ],
                description: 'Casa em condomínio fechado com segurança 24h.',
                features: ['Condomínio Fechado', 'Piscina', 'Churrasqueira'],
                dateAdded: new Date(Date.now() - 86400000).toISOString(),
                soldDate: new Date(Date.now() - 432000000).toISOString(), // Vendido há 5 dias
                views: 67,
                leads: 12
            },
            {
                id: '3',
                title: 'Loft Contemporâneo Downtown',
                location: 'Centro, Fortaleza',
                price: 420000,
                category: 'lancamentos',
                status: 'em-construcao',
                bedrooms: 1,
                bathrooms: 1,
                area: 75,
                images: ['assets/images/53103520100-d8bfe7d10f-k.jpg.webp'],
                description: 'Loft moderno no coração da cidade.',
                features: ['Design Moderno', 'Localização Central', 'Pronto 2025'],
                dateAdded: new Date(Date.now() - 172800000).toISOString(),
                views: 23,
                leads: 5
            },
            {
                id: '4',
                title: 'Cobertura Duplex Luxo',
                location: 'Meireles, Fortaleza',
                price: 1200000,
                category: 'mais-procurados',
                status: 'vendido',
                bedrooms: 4,
                bathrooms: 4,
                area: 200,
                images: ['assets/images/edifício.jpg'],
                description: 'Cobertura duplex com área gourmet e vista panorâmica.',
                features: ['Vista Panorâmica', 'Área Gourmet', 'Piscina Privativa'],
                dateAdded: new Date(Date.now() - 2592000000).toISOString(), // Há 30 dias
                soldDate: new Date(Date.now() - 1296000000).toISOString(), // Vendido há 15 dias
                views: 89,
                leads: 15
            },
            {
                id: '5',
                title: 'Casa de Praia Exclusiva',
                location: 'Porto das Dunas, Aquiraz',
                price: 980000,
                category: 'beira-mar',
                status: 'vendido',
                bedrooms: 3,
                bathrooms: 3,
                area: 150,
                images: ['assets/images/fundo.jpg'],
                description: 'Casa de praia com acesso direto ao mar.',
                features: ['Frente Mar', 'Piscina', 'Área de Lazer'],
                dateAdded: new Date(Date.now() - 5184000000).toISOString(), // Há 60 dias
                soldDate: new Date(Date.now() - 2592000000).toISOString(), // Vendido há 30 dias (mês passado)
                views: 134,
                leads: 23
            }
        ];
        this.saveData();
    }

    saveData() {
        localStorage.setItem('dashboard_properties', JSON.stringify(this.properties));
    }

    // ===========================================
    // EVENT LISTENERS
    // ===========================================
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                if (view) {
                    this.switchView(view);
                }
            });
        });

        // Search and filters
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.debounce(() => this.filterProperties(), 300)();
            });
        }

        const categoryFilter = document.querySelector('.filter-select');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.filterProperties();
            });
        }

        // Property form
        const propertyForm = document.querySelector('.property-form');
        if (propertyForm) {
            propertyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePropertySubmit(e);
            });
        }

        // Image upload
        const imageInput = document.querySelector('#property-images');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                this.handleImageUpload(e);
            });
        }

        // Upload area click
        const uploadArea = document.querySelector('.image-upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('click', () => {
                document.querySelector('#property-images').click();
            });

            // Drag and drop functionality
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                
                const files = Array.from(e.dataTransfer.files);
                this.handleMultipleImageUpload(files);
            });
        }
    }

    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.dashboard-sidebar');
        
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                }
            });
        }
    }

    // ===========================================
    // VIEW MANAGEMENT
    // ===========================================
    switchView(view) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.style.display = 'none';
        });
        
        const targetSection = document.querySelector(`[data-section="${view}"]`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        this.currentView = view;

        // Load view-specific data
        switch(view) {
            case 'overview':
                this.updateOverview();
                break;
            case 'properties':
                this.updatePropertiesView();
                break;
            case 'add-property':
                this.resetPropertyForm();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
        }
    }

    // ===========================================
    // OVERVIEW SECTION
    // ===========================================
    updateOverview() {
        const stats = this.calculateStats();
        const trends = this.calculateTrends();
        
        // Update stat cards with proper selectors
        const totalPropertiesEl = document.getElementById('totalProperties');
        const totalSalesEl = document.getElementById('totalSales');
        const totalViewsEl = document.getElementById('totalViews');
        const totalRevenueEl = document.getElementById('totalRevenue');
        
        if (totalPropertiesEl) totalPropertiesEl.textContent = stats.total;
        if (totalSalesEl) totalSalesEl.textContent = stats.sold;
        if (totalViewsEl) totalViewsEl.textContent = stats.totalViews;
        if (totalRevenueEl) totalRevenueEl.textContent = this.formatCurrency(stats.revenue);

        // Update sidebar counts
        const totalPropertiesCountEl = document.getElementById('totalPropertiesCount');
        const salesCountEl = document.getElementById('salesCount');
        
        if (totalPropertiesCountEl) totalPropertiesCountEl.textContent = stats.total;
        if (salesCountEl) salesCountEl.textContent = stats.sold;

        // Update trend indicators
        this.updateTrendIndicators(trends);

        // Update recent activities
        this.updateRecentActivities();
        
        // Update charts if visible
        if (this.charts.overview) {
            this.updateOverviewChart();
        }
    }

    calculateStats() {
        const total = this.properties.length;
        const available = this.properties.filter(p => p.status === 'disponivel').length;
        const sold = this.properties.filter(p => p.status === 'vendido').length;
        const revenue = this.properties
            .filter(p => p.status === 'vendido')
            .reduce((sum, p) => sum + p.price, 0);
        
        // Calculate total views from all properties
        const totalViews = this.properties.reduce((sum, p) => sum + (p.views || 0), 0);

        return { total, available, sold, revenue, totalViews };
    }

    calculateTrends() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        // Properties added this month vs last month
        const thisMonthProperties = this.properties.filter(p => {
            const date = new Date(p.dateAdded);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length;

        const lastMonthProperties = this.properties.filter(p => {
            const date = new Date(p.dateAdded);
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length;

        // Sales this month vs last month
        const thisMonthSales = this.properties.filter(p => {
            if (p.status !== 'vendido' || !p.soldDate) return false;
            const date = new Date(p.soldDate);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length;

        const lastMonthSales = this.properties.filter(p => {
            if (p.status !== 'vendido' || !p.soldDate) return false;
            const date = new Date(p.soldDate);
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length;

        // Calculate percentage changes
        const propertiesTrend = this.calculatePercentageChange(lastMonthProperties, thisMonthProperties);
        const salesTrend = this.calculatePercentageChange(lastMonthSales, thisMonthSales);
        
        // Views trend (simulated based on recent activity)
        const viewsTrend = this.calculateViewsTrend();
        
        // Revenue trend
        const thisMonthRevenue = this.properties
            .filter(p => {
                if (p.status !== 'vendido' || !p.soldDate) return false;
                const date = new Date(p.soldDate);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            })
            .reduce((sum, p) => sum + p.price, 0);

        const lastMonthRevenue = this.properties
            .filter(p => {
                if (p.status !== 'vendido' || !p.soldDate) return false;
                const date = new Date(p.soldDate);
                return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
            })
            .reduce((sum, p) => sum + p.price, 0);

        const revenueTrend = this.calculatePercentageChange(lastMonthRevenue, thisMonthRevenue);

        return {
            properties: propertiesTrend,
            sales: salesTrend,
            views: viewsTrend,
            revenue: revenueTrend
        };
    }

    calculatePercentageChange(oldValue, newValue) {
        if (oldValue === 0) {
            return newValue > 0 ? { value: 100, positive: true } : { value: 0, positive: true };
        }
        
        const change = ((newValue - oldValue) / oldValue) * 100;
        return {
            value: Math.abs(Math.round(change)),
            positive: change >= 0
        };
    }

    calculateViewsTrend() {
        // Calculate views trend based on properties added in the last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentProperties = this.properties.filter(p => new Date(p.dateAdded) >= thirtyDaysAgo);
        const recentViews = recentProperties.reduce((sum, p) => sum + (p.views || 0), 0);
        
        // Simulate trend based on activity
        const baseViews = this.properties.length * 10; // Assume 10 views per property as baseline
        const change = recentViews > baseViews ? 25 : Math.max(5, Math.round(recentViews / baseViews * 20));
        
        return {
            value: change,
            positive: true
        };
    }

    updateTrendIndicators(trends) {
        const trendElements = document.querySelectorAll('.trend');
        
        if (trendElements.length >= 4) {
            // Properties trend
            this.updateTrendElement(trendElements[0], trends.properties);
            
            // Sales trend
            this.updateTrendElement(trendElements[1], trends.sales);
            
            // Views trend
            this.updateTrendElement(trendElements[2], trends.views);
            
            // Revenue trend
            this.updateTrendElement(trendElements[3], trends.revenue);
        }
    }

    updateTrendElement(element, trend) {
        const icon = element.querySelector('i');
        const text = element.querySelector('i').nextSibling;
        
        // Update icon
        icon.className = trend.positive ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
        
        // Update text
        element.lastChild.textContent = `${trend.positive ? '+' : '-'}${trend.value}% este mês`;
        
        // Update class
        element.className = trend.positive ? 'trend positive' : 'trend negative';
    }

    updateRecentActivities() {
        const activities = this.generateRecentActivities();
        const container = document.querySelector('.activities-list');
        
        if (container) {
            container.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    generateRecentActivities() {
        const activities = [];
        
        // Recent properties
        const recentProperties = this.properties
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 3);

        recentProperties.forEach(property => {
            activities.push({
                icon: 'fas fa-home',
                title: `Nova propriedade adicionada: ${property.title}`,
                time: this.formatTimeAgo(property.dateAdded)
            });
        });

        // Add some sample activities
        activities.push({
            icon: 'fas fa-eye',
            title: 'Propriedade visualizada 15 vezes hoje',
            time: '2 horas atrás'
        });

        activities.push({
            icon: 'fas fa-handshake',
            title: 'Nova negociação iniciada',
            time: '4 horas atrás'
        });

        return activities.slice(0, 5);
    }

    // ===========================================
    // PROPERTIES MANAGEMENT
    // ===========================================
    updatePropertiesView() {
        this.renderProperties();
    }

    renderProperties() {
        const container = document.querySelector('.properties-grid');
        if (!container) return;

        const filteredProperties = this.getFilteredProperties();

        if (filteredProperties.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-home"></i>
                    <h3>Nenhuma propriedade encontrada</h3>
                    <p>Tente ajustar os filtros ou adicione uma nova propriedade.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredProperties.map(property => this.createPropertyCard(property)).join('');
        this.setupPropertyActions();
    }

    createPropertyCard(property) {
        const hasMultipleImages = property.images && property.images.length > 1;
        const imageSection = this.createImageSection(property, hasMultipleImages);
        
        return `
            <div class="property-item" data-id="${property.id}">
                ${imageSection}
                <div class="property-content">
                    <h4 class="property-title">${property.title}</h4>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.location}
                    </div>
                    <div class="property-price">${this.formatCurrency(property.price)}</div>
                    <div class="property-features">
                        <div class="feature">
                            <i class="fas fa-bed"></i>
                            ${property.bedrooms} quartos
                        </div>
                        <div class="feature">
                            <i class="fas fa-bath"></i>
                            ${property.bathrooms} banheiros
                        </div>
                        <div class="feature">
                            <i class="fas fa-ruler-combined"></i>
                            ${property.area}m²
                        </div>
                    </div>
                    <div class="property-tags">
                        ${property.features.map(feature => `<span class="tag">${feature}</span>`).join('')}
                    </div>
                    <div class="property-actions">
                        <button class="action-btn edit-btn" data-action="edit" data-id="${property.id}">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                        <button class="action-btn delete-btn" data-action="delete" data-id="${property.id}">
                            <i class="fas fa-trash"></i>
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createImageSection(property, hasMultipleImages) {
        const defaultImage = 'assets/images/fundo.jpg';
        const images = property.images && property.images.length > 0 ? property.images : [defaultImage];
        
        if (!hasMultipleImages) {
            return `
                <div class="property-image">
                    <img src="${images[0]}" alt="${property.title}">
                    <div class="property-status status-${property.category}">
                        ${this.getCategoryLabel(property.category)}
                    </div>
                </div>
            `;
        }

        return `
            <div class="property-image">
                <div class="property-image-carousel" data-property-id="${property.id}">
                    <div class="carousel-images">
                        ${images.map(img => `<img src="${img}" alt="${property.title}">`).join('')}
                    </div>
                    
                    <button class="carousel-controls carousel-prev" onclick="dashboard.prevImage('${property.id}')">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="carousel-controls carousel-next" onclick="dashboard.nextImage('${property.id}')">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    
                    <div class="carousel-nav">
                        ${images.map((_, index) => `
                            <div class="carousel-dot ${index === 0 ? 'active' : ''}" 
                                 onclick="dashboard.goToImage('${property.id}', ${index})"></div>
                        `).join('')}
                    </div>
                    
                    <div class="image-count">
                        <i class="fas fa-images"></i> ${images.length}
                    </div>
                    
                    <div class="property-status status-${property.category}">
                        ${this.getCategoryLabel(property.category)}
                    </div>
                </div>
            </div>
        `;
    }

    setupPropertyActions() {
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]').dataset.action;
                const id = e.target.closest('[data-action]').dataset.id;
                
                switch(action) {
                    case 'edit':
                        this.editProperty(id);
                        break;
                    case 'delete':
                        this.deleteProperty(id);
                        break;
                }
            });
        });
    }

    getFilteredProperties() {
        return this.properties.filter(property => {
            const matchesSearch = !this.filters.search || 
                property.title.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                property.location.toLowerCase().includes(this.filters.search.toLowerCase());
            
            const matchesCategory = this.filters.category === 'all' || 
                property.category === this.filters.category;
            
            const matchesStatus = this.filters.status === 'all' || 
                property.status === this.filters.status;
            
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }

    filterProperties() {
        if (this.currentView === 'properties') {
            this.renderProperties();
        }
    }

    // ===========================================
    // PROPERTY FORM HANDLING
    // ===========================================
    async handlePropertySubmit(e) {
        const formData = new FormData(e.target);
        const property = {
            id: formData.get('id') || Date.now().toString(),
            title: formData.get('title'),
            location: formData.get('location'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            status: formData.get('status'),
            bedrooms: parseInt(formData.get('bedrooms')),
            bathrooms: parseInt(formData.get('bathrooms')),
            area: parseFloat(formData.get('area')),
            description: formData.get('description'),
            features: formData.get('features').split(',').map(f => f.trim()).filter(f => f),
            images: this.currentImages || [],
            dateAdded: new Date().toISOString(),
            views: 0,
            leads: 0
        };

        const existingIndex = this.properties.findIndex(p => p.id === property.id);
        
        // Se o status mudou para vendido, adiciona a data de venda
        if (existingIndex !== -1) {
            const existingProperty = this.properties[existingIndex];
            if (existingProperty.status !== 'vendido' && property.status === 'vendido') {
                property.soldDate = new Date().toISOString();
            } else if (existingProperty.status === 'vendido' && existingProperty.soldDate) {
                // Mantém a data de venda original se já existir
                property.soldDate = existingProperty.soldDate;
            }
        } else if (property.status === 'vendido') {
            property.soldDate = new Date().toISOString();
        }
        
        // Tenta salvar no backend se disponível
        let backendResult = { success: true };
        if (window.dashboardBackend && window.dashboardBackend.isOnlineMode) {
            if (existingIndex !== -1) {
                backendResult = await window.dashboardBackend.updatePropertyInBackend(property.id, property);
            } else {
                backendResult = await window.dashboardBackend.savePropertyToBackend(property);
            }
        }

        // Atualiza localmente
        if (existingIndex !== -1) {
            this.properties[existingIndex] = { ...this.properties[existingIndex], ...property };
        } else {
            this.properties.push(property);
        }

        this.saveData();
        
        if (backendResult.success) {
            this.showSuccessMessage(existingIndex !== -1 ? 'Propriedade atualizada com sucesso!' : 'Propriedade salva com sucesso!');
        } else {
            this.showErrorMessage('Propriedade salva localmente, mas não foi sincronizada com o servidor');
        }
        
        this.resetPropertyForm();
        this.updateDashboard();
        
        // Switch to properties view
        this.switchView('properties');
    }

    editProperty(id) {
        const property = this.properties.find(p => p.id === id);
        if (!property) return;

        // Switch to add property view
        this.switchView('add-property');
        
        // Populate form
        setTimeout(() => {
            document.querySelector('[name="id"]').value = property.id;
            document.querySelector('[name="title"]').value = property.title;
            document.querySelector('[name="location"]').value = property.location;
            document.querySelector('[name="price"]').value = property.price;
            document.querySelector('[name="category"]').value = property.category;
            document.querySelector('[name="status"]').value = property.status;
            document.querySelector('[name="bedrooms"]').value = property.bedrooms;
            document.querySelector('[name="bathrooms"]').value = property.bathrooms;
            document.querySelector('[name="area"]').value = property.area;
            document.querySelector('[name="description"]').value = property.description;
            document.querySelector('[name="features"]').value = property.features.join(', ');
            
            this.currentImages = property.images;
            this.updateImagePreview();
        }, 100);
    }

    async deleteProperty(id) {
        if (confirm('Tem certeza que deseja excluir esta propriedade?')) {
            // Tenta deletar no backend se disponível
            let backendResult = { success: true };
            if (window.dashboardBackend && window.dashboardBackend.isOnlineMode) {
                backendResult = await window.dashboardBackend.deletePropertyFromBackend(id);
            }

            // Remove localmente
            this.properties = this.properties.filter(p => p.id !== id);
            this.saveData();
            this.renderProperties();
            this.updateDashboard();
            
            if (backendResult.success) {
                this.showSuccessMessage('Propriedade excluída com sucesso!');
            } else {
                this.showErrorMessage('Propriedade removida localmente, mas não foi sincronizada com o servidor');
            }
        }
    }

    resetPropertyForm() {
        const form = document.querySelector('.property-form');
        if (form) {
            form.reset();
            this.currentImages = [];
            this.updateImagePreview();
        }
    }

    // ===========================================
    // IMAGE HANDLING
    // ===========================================
    handleImageUpload(e) {
        const files = Array.from(e.target.files);
        this.handleMultipleImageUpload(files);
    }

    handleMultipleImageUpload(files) {
        this.currentImages = this.currentImages || [];
        
        // Limit total images to 10
        const availableSlots = 10 - this.currentImages.length;
        const filesToProcess = files.slice(0, availableSlots);
        
        if (files.length > availableSlots) {
            this.showSuccessMessage(`Apenas ${availableSlots} imagens foram adicionadas. Máximo de 10 imagens por propriedade.`);
        }
        
        let processedCount = 0;
        const totalFiles = filesToProcess.length;
        
        filesToProcess.forEach(file => {
            if (file.type.startsWith('image/')) {
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    this.showErrorMessage(`Arquivo ${file.name} é muito grande. Máximo 5MB por imagem.`);
                    processedCount++;
                    if (processedCount === totalFiles) {
                        this.updateImagePreview();
                    }
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.currentImages.push(e.target.result);
                    processedCount++;
                    
                    if (processedCount === totalFiles) {
                        this.updateImagePreview();
                        this.showSuccessMessage(`${totalFiles} imagem(ns) adicionada(s) com sucesso!`);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                processedCount++;
                if (processedCount === totalFiles) {
                    this.updateImagePreview();
                }
            }
        });
    }

    updateImagePreview() {
        const container = document.querySelector('.images-preview');
        if (!container) return;

        if (!this.currentImages || this.currentImages.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <div class="preview-header">
                <h4><i class="fas fa-images"></i> ${this.currentImages.length} imagem(ns) selecionada(s)</h4>
                <small>Arraste para reordenar • Clique no X para remover</small>
            </div>
            <div class="preview-grid">
                ${this.currentImages.map((image, index) => `
                    <div class="image-preview-item" draggable="true" data-index="${index}">
                        <img src="${image}" alt="Preview ${index + 1}">
                        <div class="image-overlay">
                            <span class="image-number">${index + 1}</span>
                            <button type="button" class="image-remove" onclick="dashboard.removeImage(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        ${index === 0 ? '<div class="main-image-badge">Principal</div>' : ''}
                    </div>
                `).join('')}
            </div>
        `;

        // Add drag and drop reordering
        this.setupImageReordering();
    }

    removeImage(index) {
        this.currentImages.splice(index, 1);
        this.updateImagePreview();
        this.showSuccessMessage('Imagem removida com sucesso!');
    }

    setupImageReordering() {
        const items = document.querySelectorAll('.image-preview-item');
        let draggedElement = null;

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedElement = item;
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                draggedElement = null;
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedElement && draggedElement !== item) {
                    const fromIndex = parseInt(draggedElement.dataset.index);
                    const toIndex = parseInt(item.dataset.index);
                    
                    // Reorder array
                    const [movedImage] = this.currentImages.splice(fromIndex, 1);
                    this.currentImages.splice(toIndex, 0, movedImage);
                    
                    this.updateImagePreview();
                    this.showSuccessMessage('Ordem das imagens atualizada!');
                }
            });
        });
    }

    // ===========================================
    // IMAGE CAROUSEL CONTROLS
    // ===========================================
    prevImage(propertyId) {
        this.changeCarouselImage(propertyId, -1);
    }

    nextImage(propertyId) {
        this.changeCarouselImage(propertyId, 1);
    }

    goToImage(propertyId, index) {
        this.setCarouselImage(propertyId, index);
    }

    changeCarouselImage(propertyId, direction) {
        const carousel = document.querySelector(`[data-property-id="${propertyId}"]`);
        if (!carousel) return;

        const images = carousel.querySelectorAll('.carousel-images img');
        const dots = carousel.querySelectorAll('.carousel-dot');
        const currentIndex = Array.from(dots).findIndex(dot => dot.classList.contains('active'));
        
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = images.length - 1;
        if (newIndex >= images.length) newIndex = 0;
        
        this.setCarouselImage(propertyId, newIndex);
    }

    setCarouselImage(propertyId, index) {
        const carousel = document.querySelector(`[data-property-id="${propertyId}"]`);
        if (!carousel) return;

        const imagesContainer = carousel.querySelector('.carousel-images');
        const dots = carousel.querySelectorAll('.carousel-dot');
        
        // Update image position
        imagesContainer.style.transform = `translateX(-${index * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // ===========================================
    // CHARTS AND ANALYTICS
    // ===========================================
    initializeCharts() {
        // Overview chart
        const overviewCtx = document.querySelector('#overviewChart');
        if (overviewCtx) {
            this.charts.overview = new Chart(overviewCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Disponíveis', 'Vendidos', 'Em Construção'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: [
                            '#10B981',
                            '#F59E0B',
                            '#3B82F6'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Sales chart
        const salesCtx = document.querySelector('#salesChart');
        if (salesCtx) {
            this.charts.sales = new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Vendas',
                        data: [0, 0, 0, 0, 0, 0],
                        borderColor: '#D4AF37',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#9CA3AF'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#9CA3AF'
                            }
                        }
                    }
                }
            });
        }
    }

    updateOverviewChart() {
        if (!this.charts.overview) return;

        const available = this.properties.filter(p => p.status === 'disponivel').length;
        const sold = this.properties.filter(p => p.status === 'vendido').length;
        const construction = this.properties.filter(p => p.status === 'em-construcao').length;

        this.charts.overview.data.datasets[0].data = [available, sold, construction];
        this.charts.overview.update();
    }

    updateAnalytics() {
        this.updateOverviewChart();
        // Update other analytics charts as needed
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Hoje';
        if (diffInDays === 1) return 'Ontem';
        if (diffInDays < 7) return `${diffInDays} dias atrás`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
        return `${Math.floor(diffInDays / 30)} meses atrás`;
    }

    getCategoryLabel(category) {
        const labels = {
            'lancamentos': 'Lançamento',
            'mais-procurados': 'Mais Procurado',
            'beira-mar': 'Beira Mar',
            'pronto-morar': 'Pronto p/ Morar'
        };
        return labels[category] || category;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'success') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    updateDashboard() {
        if (this.currentView === 'overview') {
            this.updateOverview();
        } else if (this.currentView === 'properties') {
            this.updatePropertiesView();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardCore();
});

// Add toast styles
const toastStyles = `
<style>
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--gradient-green);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: var(--shadow-large);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
}

.toast.show {
    transform: translateX(0);
}

.toast.success {
    background: var(--gradient-green);
}

.toast.error {
    background: linear-gradient(135deg, #EF4444, #DC2626);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', toastStyles);
