// 🏠 DASHBOARD PROPERTIES - Gerenciamento de Imóveis
// Funcionalidades para CRUD de propriedades

class DashboardProperties {
    constructor() {
        this.properties = [];
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.isInitialized = false;
        this.init();
    }

    init() {
        console.log('🏠 Inicializando Dashboard Properties...');
        this.loadProperties();
        this.setupEventListeners();
        this.setupFilters();
        this.isInitialized = true;
        console.log('✅ Dashboard Properties inicializado');
    }

    setupEventListeners() {
        // Botão adicionar propriedade
        const addBtn = document.getElementById('addPropertyBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.openAddPropertyModal();
            });
        }

        // Formulário de propriedade
        const propertyForm = document.getElementById('propertyForm');
        if (propertyForm) {
            propertyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePropertySubmit(e);
            });
        }

        // Filtros
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.applyFilter(e.target.dataset.filter);
            });
        });

        // Ordenação
        const sortSelect = document.getElementById('sortProperties');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProperties(e.target.value);
            });
        }
    }

    setupFilters() {
        const filters = [
            { id: 'all', label: 'Todos', count: 0 },
            { id: 'apartamento', label: 'Apartamentos', count: 0 },
            { id: 'casa', label: 'Casas', count: 0 },
            { id: 'terreno', label: 'Terrenos', count: 0 },
            { id: 'comercial', label: 'Comercial', count: 0 }
        ];

        this.renderFilters(filters);
    }

    loadProperties() {
        // Carrega dados reais do localStorage
        const saved = localStorage.getItem('marceloImoveisData');
        if (saved) {
            const data = JSON.parse(saved);
            this.properties = data.properties || [];
        } else {
            this.properties = [];
        }
        
        console.log('📋 Propriedades carregadas:', this.properties.length);

        this.renderProperties();
        this.updateStats();
    }

    renderProperties() {
        const container = document.getElementById('propertiesContainer');
        if (!container) return;

        const filteredProperties = this.getFilteredProperties();

        if (filteredProperties.length === 0) {
            container.innerHTML = this.getEmptyState();
            return;
        }

        container.innerHTML = filteredProperties.map(property => 
            this.createPropertyCard(property)
        ).join('');

        this.attachPropertyEvents();
    }

    createPropertyCard(property) {
        const statusClass = property.status === 'vendido' ? 'sold' : 'available';
        const destaqueClass = property.destaque ? 'featured' : '';
        
        return `
            <div class="property-card ${statusClass} ${destaqueClass}" data-id="${property.id}">
                <div class="property-image">
                    <img src="${property.images[0] || 'assets/images/placeholder.jpg'}" 
                         alt="${property.titulo}" loading="lazy">
                    ${property.destaque ? '<span class="featured-badge">Destaque</span>' : ''}
                    <div class="property-actions">
                        <button class="btn-icon edit-property" data-id="${property.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-property" data-id="${property.id}" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="property-content">
                    <h3 class="property-title">${property.titulo}</h3>
                    <p class="property-address">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.endereco}
                    </p>
                    <div class="property-details">
                        <span class="detail">
                            <i class="fas fa-expand-arrows-alt"></i>
                            ${property.area}m²
                        </span>
                        <span class="detail">
                            <i class="fas fa-bed"></i>
                            ${property.quartos} quartos
                        </span>
                        <span class="detail">
                            <i class="fas fa-bath"></i>
                            ${property.banheiros} banheiros
                        </span>
                    </div>
                    <div class="property-footer">
                        <span class="property-price">R$ ${this.formatPrice(property.preco)}</span>
                        <span class="property-status status-${property.status}">${this.getStatusLabel(property.status)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    attachPropertyEvents() {
        // Editar propriedade
        document.querySelectorAll('.edit-property').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.target.closest('[data-id]').dataset.id);
                this.editProperty(id);
            });
        });

        // Excluir propriedade
        document.querySelectorAll('.delete-property').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.target.closest('[data-id]').dataset.id);
                this.deleteProperty(id);
            });
        });

        // Visualizar propriedade
        document.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.property-actions')) {
                    const id = parseInt(card.dataset.id);
                    this.viewProperty(id);
                }
            });
        });
    }

    getFilteredProperties() {
        let filtered = [...this.properties];

        // Aplicar filtro por tipo
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(p => p.tipo === this.currentFilter);
        }

        // Aplicar ordenação
        switch (this.currentSort) {
            case 'price-asc':
                filtered.sort((a, b) => a.preco - b.preco);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.preco - a.preco);
                break;
            case 'date-desc':
                filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
                break;
            case 'date-asc':
                filtered.sort((a, b) => new Date(a.created) - new Date(b.created));
                break;
        }

        return filtered;
    }

    applyFilter(filter) {
        this.currentFilter = filter;
        
        // Atualizar botões ativos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.renderProperties();
    }

    sortProperties(sortType) {
        this.currentSort = sortType;
        this.renderProperties();
    }

    openAddPropertyModal() {
        const modal = document.getElementById('propertyModal');
        if (modal) {
            this.clearPropertyForm();
            modal.style.display = 'flex';
        }
    }

    editProperty(id) {
        const property = this.properties.find(p => p.id === id);
        if (!property) return;

        this.fillPropertyForm(property);
        this.openAddPropertyModal();
    }

    deleteProperty(id) {
        if (confirm('Tem certeza que deseja excluir esta propriedade?')) {
            this.properties = this.properties.filter(p => p.id !== id);
            this.renderProperties();
            this.updateStats();
            window.dashboardUI?.showNotification('Propriedade excluída com sucesso', 'success');
        }
    }

    viewProperty(id) {
        const property = this.properties.find(p => p.id === id);
        if (!property) return;

        // Implementar modal de visualização
        console.log('Visualizar propriedade:', property);
    }

    handlePropertySubmit(e) {
        const formData = new FormData(e.target);
        const propertyData = Object.fromEntries(formData.entries());
        
        // Validar dados
        if (!this.validatePropertyData(propertyData)) {
            return;
        }

        // Salvar propriedade
        this.saveProperty(propertyData);
    }

    validatePropertyData(data) {
        const required = ['titulo', 'tipo', 'preco', 'area', 'endereco'];
        
        for (let field of required) {
            if (!data[field] || data[field].trim() === '') {
                window.dashboardUI?.showNotification(`Campo ${field} é obrigatório`, 'error');
                return false;
            }
        }

        return true;
    }

    saveProperty(data) {
        const isEdit = data.id && data.id !== '';
        
        if (isEdit) {
            // Atualizar propriedade existente
            const index = this.properties.findIndex(p => p.id === parseInt(data.id));
            if (index !== -1) {
                this.properties[index] = { ...this.properties[index], ...data, updated: new Date() };
            }
        } else {
            // Nova propriedade
            const newProperty = {
                ...data,
                id: Date.now(),
                created: new Date(),
                updated: new Date(),
                status: 'disponivel',
                images: []
            };
            this.properties.push(newProperty);
        }

        this.renderProperties();
        this.updateStats();
        this.closePropertyModal();
        
        const message = isEdit ? 'Propriedade atualizada' : 'Propriedade adicionada';
        window.dashboardUI?.showNotification(message, 'success');
    }

    updateStats() {
        const stats = this.calculatePropertyStats();
        
        // Atualizar elementos na tela
        const totalElement = document.getElementById('totalProperties');
        if (totalElement) totalElement.textContent = stats.total;

        const availableElement = document.getElementById('availableProperties');
        if (availableElement) availableElement.textContent = stats.available;

        const soldElement = document.getElementById('soldProperties');
        if (soldElement) soldElement.textContent = stats.sold;
    }

    calculatePropertyStats() {
        return {
            total: this.properties.length,
            available: this.properties.filter(p => p.status === 'disponivel').length,
            sold: this.properties.filter(p => p.status === 'vendido').length,
            featured: this.properties.filter(p => p.destaque).length
        };
    }

    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR').format(price);
    }

    getStatusLabel(status) {
        const labels = {
            'disponivel': 'Disponível',
            'vendido': 'Vendido',
            'reservado': 'Reservado'
        };
        return labels[status] || status;
    }

    getEmptyState() {
        return `
            <div class="empty-state">
                <i class="fas fa-home"></i>
                <h3>Nenhuma propriedade encontrada</h3>
                <p>Adicione sua primeira propriedade para começar.</p>
                <button class="btn btn-primary" onclick="window.dashboardProperties.openAddPropertyModal()">
                    <i class="fas fa-plus"></i>
                    Adicionar Propriedade
                </button>
            </div>
        `;
    }

    clearPropertyForm() {
        const form = document.getElementById('propertyForm');
        if (form) form.reset();
    }

    fillPropertyForm(property) {
        Object.keys(property).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) input.value = property[key];
        });
    }

    closePropertyModal() {
        const modal = document.getElementById('propertyModal');
        if (modal) modal.style.display = 'none';
    }
}

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardProperties = new DashboardProperties();
});

// Exportar para uso global
window.DashboardProperties = DashboardProperties;
