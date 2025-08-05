/**
 * DASHBOARD REAL DATA - Sistema de dados reais do corretor
 * Apenas mostra estatísticas baseadas em dados inseridos pelo corretor
 */

class RealDashboardData {
    constructor() {
        this.storageKey = 'marceloImoveisData';
        this.data = this.loadData();
        this.init();
    }

    init() {
        console.log('📊 Inicializando Dashboard com Dados Reais...');
        this.setupEventListeners();
        this.updateDashboard();
        console.log('✅ Dashboard Real inicializado');
    }

    // Carrega dados do localStorage
    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Estrutura inicial com zeros reais
        return {
            properties: [],
            sales: [],
            leads: [],
            views: 0,
            revenue: 0,
            expenses: 0,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
    }

    // Salva dados no localStorage
    saveData() {
        this.data.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        this.updateDashboard();
    }

    // Adiciona uma propriedade
    addProperty(property) {
        property.id = this.generateId();
        property.createdAt = new Date().toISOString();
        property.status = 'disponivel';
        this.data.properties.push(property);
        this.saveData();
        console.log('🏠 Propriedade adicionada:', property);
    }

    // Registra uma venda
    addSale(saleData) {
        const sale = {
            id: this.generateId(),
            propertyId: saleData.propertyId,
            value: saleData.value,
            commission: saleData.commission || 0,
            clientName: saleData.clientName,
            saleDate: new Date().toISOString(),
            type: saleData.type || 'venda'
        };
        
        this.data.sales.push(sale);
        this.data.revenue += sale.commission;
        
        // Atualiza status da propriedade
        const property = this.data.properties.find(p => p.id === saleData.propertyId);
        if (property) {
            property.status = 'vendido';
            property.saleDate = sale.saleDate;
        }
        
        this.saveData();
        console.log('💰 Venda registrada:', sale);
    }

    // Adiciona lead/visualização
    addLead(leadData) {
        const lead = {
            id: this.generateId(),
            name: leadData.name,
            contact: leadData.contact,
            interest: leadData.interest,
            source: leadData.source,
            createdAt: new Date().toISOString(),
            status: 'novo'
        };
        
        this.data.leads.push(lead);
        this.saveData();
        console.log('👤 Lead adicionado:', lead);
    }

    // Registra despesa
    addExpense(expense) {
        this.data.expenses += expense;
        this.saveData();
        console.log('💸 Despesa registrada:', expense);
    }

    // Incrementa visualizações
    incrementViews() {
        this.data.views++;
        this.saveData();
    }

    // Calcula estatísticas em tempo real
    getStatistics() {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        // Propriedades
        const totalProperties = this.data.properties.length;
        const availableProperties = this.data.properties.filter(p => p.status === 'disponivel').length;
        const soldProperties = this.data.properties.filter(p => p.status === 'vendido').length;

        // Vendas
        const totalSales = this.data.sales.length;
        const thisMonthSales = this.data.sales.filter(sale => {
            const saleDate = new Date(sale.saleDate);
            return saleDate.getMonth() === thisMonth && saleDate.getFullYear() === thisYear;
        }).length;

        // Receita
        const totalRevenue = this.data.revenue;
        const thisMonthRevenue = this.data.sales
            .filter(sale => {
                const saleDate = new Date(sale.saleDate);
                return saleDate.getMonth() === thisMonth && saleDate.getFullYear() === thisYear;
            })
            .reduce((sum, sale) => sum + sale.commission, 0);

        // Leads
        const totalLeads = this.data.leads.length;
        const thisMonthLeads = this.data.leads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate.getMonth() === thisMonth && leadDate.getFullYear() === thisYear;
        }).length;

        // Taxa de conversão real
        const conversionRate = totalLeads > 0 ? (totalSales / totalLeads * 100).toFixed(1) : 0;

        return {
            properties: {
                total: totalProperties,
                available: availableProperties,
                sold: soldProperties
            },
            sales: {
                total: totalSales,
                thisMonth: thisMonthSales
            },
            revenue: {
                total: totalRevenue,
                thisMonth: thisMonthRevenue,
                profit: totalRevenue - this.data.expenses
            },
            leads: {
                total: totalLeads,
                thisMonth: thisMonthLeads
            },
            performance: {
                views: this.data.views,
                conversionRate: conversionRate
            }
        };
    }

    // Atualiza o dashboard com dados reais
    updateDashboard() {
        const stats = this.getStatistics();

        // Atualiza cards principais
        this.updateElement('totalProperties', stats.properties.total);
        this.updateElement('totalSales', stats.sales.total);
        this.updateElement('totalViews', stats.performance.views);
        this.updateElement('totalRevenue', this.formatCurrency(stats.revenue.total));

        // Atualiza contadores do sidebar
        this.updateElement('totalPropertiesCount', stats.properties.total);
        this.updateElement('salesCount', stats.sales.total);

        // Atualiza tendências (baseado em dados reais do mês)
        this.updateTrends(stats);

        // Atualiza gráficos se existirem
        this.updateCharts(stats);

        console.log('📊 Dashboard atualizado com estatísticas reais:', stats);
    }

    // Atualiza tendências baseadas em dados reais
    updateTrends(stats) {
        // Se não há dados suficientes, esconde as tendências
        if (stats.sales.total === 0) {
            document.querySelectorAll('.trend').forEach(trend => {
                trend.style.display = 'none';
            });
        } else {
            // Calcula tendências reais baseado no histórico
            const trends = this.calculateRealTrends();
            this.updateTrendElements(trends);
        }
    }

    // Calcula tendências reais baseadas nos dados
    calculateRealTrends() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const lastMonth = currentMonth - 1;

        const currentMonthSales = this.data.sales.filter(sale => {
            const saleDate = new Date(sale.saleDate);
            return saleDate.getMonth() === currentMonth;
        }).length;

        const lastMonthSales = this.data.sales.filter(sale => {
            const saleDate = new Date(sale.saleDate);
            return saleDate.getMonth() === lastMonth;
        }).length;

        const salesGrowth = lastMonthSales > 0 ? 
            ((currentMonthSales - lastMonthSales) / lastMonthSales * 100).toFixed(1) : 0;

        return {
            sales: salesGrowth,
            properties: 0, // Sempre 0 até ter dados históricos
            views: 0, // Sempre 0 até implementar tracking real
            revenue: salesGrowth // Segue o mesmo padrão das vendas
        };
    }

    // Métodos auxiliares
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    setupEventListeners() {
        // Event listeners para formulários de adição
        document.addEventListener('DOMContentLoaded', () => {
            this.attachFormListeners();
        });
    }

    attachFormListeners() {
        // Listener para formulário de adicionar propriedade
        const propertyForm = document.getElementById('addPropertyForm');
        if (propertyForm) {
            propertyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePropertySubmit(e);
            });
        }

        // Listener para formulário de registrar venda
        const saleForm = document.getElementById('addSaleForm');
        if (saleForm) {
            saleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaleSubmit(e);
            });
        }
    }

    handlePropertySubmit(e) {
        const formData = new FormData(e.target);
        const property = {
            title: formData.get('title'),
            type: formData.get('type'),
            price: parseFloat(formData.get('price')),
            location: formData.get('location'),
            bedrooms: parseInt(formData.get('bedrooms')),
            bathrooms: parseInt(formData.get('bathrooms')),
            area: parseFloat(formData.get('area')),
            description: formData.get('description')
        };
        
        this.addProperty(property);
        e.target.reset();
        alert('Propriedade adicionada com sucesso!');
    }

    handleSaleSubmit(e) {
        const formData = new FormData(e.target);
        const sale = {
            propertyId: formData.get('propertyId'),
            value: parseFloat(formData.get('value')),
            commission: parseFloat(formData.get('commission')),
            clientName: formData.get('clientName'),
            type: formData.get('type')
        };
        
        this.addSale(sale);
        e.target.reset();
        alert('Venda registrada com sucesso!');
    }

    // Métodos para integração com outros sistemas
    exportData() {
        return this.data;
    }

    importData(data) {
        this.data = data;
        this.saveData();
    }

    resetData() {
        if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem(this.storageKey);
            this.data = this.loadData();
            this.updateDashboard();
            alert('Dados resetados com sucesso!');
        }
    }
}

// Inicializa o sistema de dados reais
window.realDashboard = new RealDashboardData();

// Log para produção
console.log('📊 Sistema de Dashboard Real - Produção v1.0');
