/**
 * INTEGRAÇÃO DE GRÁFICOS COM DADOS REAIS
 * Substitui os dados mockados pelos dados reais do dashboard
 */

class RealDashboardCharts {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        console.log('📊 Inicializando gráficos com dados reais...');
        
        // Aguarda o dashboard estar pronto
        if (window.realDashboard) {
            this.setupCharts();
        } else {
            // Aguarda o dashboard ser carregado
            const checkDashboard = setInterval(() => {
                if (window.realDashboard) {
                    clearInterval(checkDashboard);
                    this.setupCharts();
                }
            }, 100);
        }
    }

    setupCharts() {
        this.createCategoryChart();
        this.createSalesChart();
        this.createLeadsChart();
        this.createPerformanceChart();
        console.log('✅ Gráficos com dados reais configurados');
    }

    // Gráfico de imóveis por categoria
    createCategoryChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const stats = window.realDashboard.getStatistics();
        
        // Conta propriedades por tipo
        const propertyTypes = {};
        window.realDashboard.data.properties.forEach(property => {
            propertyTypes[property.type] = (propertyTypes[property.type] || 0) + 1;
        });

        const labels = Object.keys(propertyTypes);
        const data = Object.values(propertyTypes);
        
        // Se não há dados, mostra mensagem
        if (labels.length === 0) {
            this.showNoDataMessage(canvas, 'Nenhum imóvel cadastrado');
            return;
        }

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.map(type => this.capitalizeType(type)),
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#667eea',
                        '#56ab2f',
                        '#f39c12',
                        '#e74c3c',
                        '#9b59b6',
                        '#1abc9c'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de vendas mensais
    createSalesChart() {
        const canvas = document.getElementById('salesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const salesData = this.getSalesDataByMonth();

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: salesData.labels,
                datasets: [{
                    label: 'Vendas',
                    data: salesData.sales,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }, {
                    label: 'Receita (em milhares)',
                    data: salesData.revenue,
                    borderColor: '#56ab2f',
                    backgroundColor: 'rgba(86, 171, 47, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#56ab2f',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Número de Vendas'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Receita (R$ mil)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    // Gráfico de leads por fonte
    createLeadsChart() {
        const canvas = document.getElementById('leadsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Conta leads por fonte
        const leadSources = {};
        window.realDashboard.data.leads.forEach(lead => {
            leadSources[lead.source] = (leadSources[lead.source] || 0) + 1;
        });

        const labels = Object.keys(leadSources);
        const data = Object.values(leadSources);

        if (labels.length === 0) {
            this.showNoDataMessage(canvas, 'Nenhum lead cadastrado');
            return;
        }

        this.charts.leads = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.map(source => this.capitalizeSource(source)),
                datasets: [{
                    label: 'Leads',
                    data: data,
                    backgroundColor: [
                        '#667eea',
                        '#56ab2f',
                        '#f39c12',
                        '#e74c3c',
                        '#9b59b6',
                        '#1abc9c',
                        '#34495e'
                    ],
                    borderRadius: 8,
                    borderSkipped: false
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
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Gráfico de performance
    createPerformanceChart() {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const stats = window.realDashboard.getStatistics();

        // Calcula métricas de performance
        const conversionRate = parseFloat(stats.performance.conversionRate) || 0;
        const averageTicket = stats.sales.total > 0 ? 
            (stats.revenue.total / stats.sales.total) : 0;
        const leadQuality = stats.leads.total > 0 ? 
            (stats.sales.total / stats.leads.total * 100) : 0;

        this.charts.performance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Taxa de Conversão (%)',
                    'Ticket Médio (x1000)',
                    'Qualidade dos Leads (%)',
                    'Vendas por Mês',
                    'Atividade (Propriedades)'
                ],
                datasets: [{
                    label: 'Performance Atual',
                    data: [
                        conversionRate,
                        averageTicket / 1000, // Divide por 1000 para escala
                        leadQuality,
                        stats.sales.thisMonth * 10, // Multiplica para visualização
                        stats.properties.total
                    ],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    // Obtém dados de vendas por mês
    getSalesDataByMonth() {
        const months = [];
        const sales = [];
        const revenue = [];
        
        // Últimos 6 meses
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            
            const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
            months.push(monthName);
            
            // Conta vendas do mês
            const monthSales = window.realDashboard.data.sales.filter(sale => {
                const saleDate = new Date(sale.saleDate);
                return saleDate.getMonth() === date.getMonth() && 
                       saleDate.getFullYear() === date.getFullYear();
            });
            
            sales.push(monthSales.length);
            
            const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.commission, 0);
            revenue.push(monthRevenue / 1000); // Em milhares
        }

        return {
            labels: months,
            sales: sales,
            revenue: revenue
        };
    }

    // Mostra mensagem quando não há dados
    showNoDataMessage(canvas, message) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }

    // Helpers para formatação
    capitalizeType(type) {
        const types = {
            'apartamento': 'Apartamento',
            'casa': 'Casa',
            'terreno': 'Terreno',
            'comercial': 'Comercial',
            'sitio': 'Sítio'
        };
        return types[type] || type;
    }

    capitalizeSource(source) {
        const sources = {
            'website': 'Site',
            'whatsapp': 'WhatsApp',
            'instagram': 'Instagram',
            'facebook': 'Facebook',
            'indicacao': 'Indicação',
            'outdoor': 'Outdoor/Placa',
            'outro': 'Outro'
        };
        return sources[source] || source;
    }

    // Atualiza todos os gráficos
    updateAllCharts() {
        // Destrói gráficos existentes
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        
        // Recria com dados atualizados
        this.setupCharts();
    }

    // Método para ser chamado quando dados são atualizados
    refresh() {
        setTimeout(() => {
            this.updateAllCharts();
        }, 100);
    }
}

// Inicializa quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.realCharts = new RealDashboardCharts();
    
    // Listener para atualizar gráficos quando dados mudarem
    if (window.realDashboard) {
        const originalSaveData = window.realDashboard.saveData;
        window.realDashboard.saveData = function() {
            originalSaveData.call(this);
            if (window.realCharts) {
                window.realCharts.refresh();
            }
        };
    }
});

// Cria instância global para compatibilidade
window.realDashboardCharts = new RealDashboardCharts();

console.log('📊 Sistema de gráficos reais carregado');
