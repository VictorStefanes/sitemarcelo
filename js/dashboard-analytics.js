// 📊 DASHBOARD ANALYTICS - Relatórios e Estatísticas
// Sistema de analytics e relatórios do dashboard

class DashboardAnalytics {
    constructor() {
        this.charts = {};
        this.analyticsData = {};
        this.isInitialized = false;
        this.init();
    }

    init() {
        console.log('📊 Inicializando Dashboard Analytics...');
        this.loadAnalyticsData();
        this.initializeCharts();
        this.setupDateRangePicker();
        this.isInitialized = true;
        console.log('✅ Dashboard Analytics inicializado');
    }

    loadAnalyticsData() {
        // Simulação de dados de analytics
        this.analyticsData = {
            salesData: {
                monthly: [
                    { month: 'Jan', vendas: 5, valor: 2500000 },
                    { month: 'Fev', vendas: 8, valor: 4200000 },
                    { month: 'Mar', vendas: 12, valor: 6800000 },
                    { month: 'Abr', vendas: 6, valor: 3100000 },
                    { month: 'Mai', vendas: 15, valor: 8500000 },
                    { month: 'Jun', vendas: 18, valor: 9200000 }
                ],
                byType: [
                    { tipo: 'Apartamento', vendas: 45, valor: 18500000 },
                    { tipo: 'Casa', vendas: 25, valor: 22000000 },
                    { tipo: 'Terreno', vendas: 8, valor: 3200000 },
                    { tipo: 'Comercial', vendas: 6, valor: 8500000 }
                ]
            },
            viewsData: {
                daily: [120, 135, 98, 154, 187, 142, 168, 195, 178, 203, 156, 189, 234, 198, 176],
                sources: [
                    { source: 'Busca Orgânica', views: 45 },
                    { source: 'Redes Sociais', views: 30 },
                    { source: 'Referência', views: 15 },
                    { source: 'Direto', views: 10 }
                ]
            },
            performance: {
                conversionRate: 3.2,
                avgTimeOnSite: 245,
                bounceRate: 42.1,
                leadGeneration: 87
            }
        };
    }

    initializeCharts() {
        this.createSalesChart();
        this.createPropertyTypeChart();
        this.createViewsChart();
        this.createConversionChart();
    }

    createSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        const data = this.analyticsData.salesData.monthly;

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.month),
                datasets: [
                    {
                        label: 'Número de Vendas',
                        data: data.map(d => d.vendas),
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        yAxisID: 'y',
                        tension: 0.4
                    },
                    {
                        label: 'Valor (Milhões)',
                        data: data.map(d => d.valor / 1000000),
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        yAxisID: 'y1',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Mês'
                        }
                    },
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
                            text: 'Valor (Milhões R$)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Vendas Mensais - 2024'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }

    createPropertyTypeChart() {
        const ctx = document.getElementById('propertyTypeChart');
        if (!ctx) return;

        const data = this.analyticsData.salesData.byType;

        this.charts.propertyType = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.tipo),
                datasets: [{
                    data: data.map(d => d.vendas),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Vendas por Tipo de Imóvel'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createViewsChart() {
        const ctx = document.getElementById('viewsChart');
        if (!ctx) return;

        const data = this.analyticsData.viewsData.daily;
        const labels = data.map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (data.length - index - 1));
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        });

        this.charts.views = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Visualizações',
                    data: data,
                    backgroundColor: 'rgba(156, 39, 176, 0.6)',
                    borderColor: '#9C27B0',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Visualizações Diárias - Últimos 15 Dias'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Visualizações'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Data'
                        }
                    }
                }
            }
        });
    }

    createConversionChart() {
        const ctx = document.getElementById('conversionChart');
        if (!ctx) return;

        const performance = this.analyticsData.performance;

        this.charts.conversion = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Taxa de Conversão (%)',
                    'Tempo no Site (min)',
                    'Taxa de Rejeição (%)',
                    'Geração de Leads'
                ],
                datasets: [{
                    label: 'Performance Atual',
                    data: [
                        performance.conversionRate * 10, // Escala para visualização
                        performance.avgTimeOnSite / 10,   // Escala para visualização
                        performance.bounceRate,
                        performance.leadGeneration
                    ],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: '#FF6384',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Indicadores de Performance'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    setupDateRangePicker() {
        const dateRangeSelect = document.getElementById('analyticsDateRange');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                this.updateChartsForPeriod(e.target.value);
            });
        }
    }

    updateChartsForPeriod(period) {
        console.log(`📊 Atualizando charts para período: ${period}`);
        
        // Em uma implementação real, aqui faria uma nova requisição ao backend
        // Por ora, apenas simula mudança nos dados
        
        const notification = window.dashboardUI?.showNotification(
            `Dados atualizados para: ${this.getPeriodLabel(period)}`, 
            'info'
        );
    }

    getPeriodLabel(period) {
        const labels = {
            '7d': 'Últimos 7 dias',
            '30d': 'Últimos 30 dias',
            '90d': 'Últimos 90 dias',
            '1y': 'Último ano'
        };
        return labels[period] || 'Período personalizado';
    }

    exportReport(format = 'pdf') {
        console.log(`📋 Exportando relatório em formato: ${format}`);
        
        // Simulação de export
        window.dashboardUI?.showNotification(
            `Relatório sendo gerado em ${format.toUpperCase()}...`, 
            'info'
        );
        
        setTimeout(() => {
            window.dashboardUI?.showNotification(
                'Relatório gerado com sucesso!', 
                'success'
            );
        }, 2000);
    }

    generateInsights() {
        const insights = [
            {
                type: 'positive',
                title: 'Crescimento nas Vendas',
                description: 'Aumento de 23% nas vendas comparado ao mês anterior'
            },
            {
                type: 'warning',
                title: 'Taxa de Conversão',
                description: 'Taxa de conversão abaixo da média. Considere otimizar o funil de vendas'
            },
            {
                type: 'info',
                title: 'Horário de Pico',
                description: 'Maior número de visualizações entre 14h e 18h'
            }
        ];

        this.renderInsights(insights);
    }

    renderInsights(insights) {
        const container = document.getElementById('insightsContainer');
        if (!container) return;

        container.innerHTML = insights.map(insight => `
            <div class="insight-card insight-${insight.type}">
                <div class="insight-icon">
                    ${this.getInsightIcon(insight.type)}
                </div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                </div>
            </div>
        `).join('');
    }

    getInsightIcon(type) {
        const icons = {
            positive: '<i class="fas fa-chart-line"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>',
            negative: '<i class="fas fa-chart-line-down"></i>'
        };
        return icons[type] || icons.info;
    }

    updateRealTimeStats() {
        // Simulação de dados em tempo real
        const stats = {
            onlineVisitors: Math.floor(Math.random() * 50) + 10,
            todayViews: Math.floor(Math.random() * 200) + 150,
            pendingLeads: Math.floor(Math.random() * 10) + 5
        };

        // Atualizar elementos na tela
        const onlineElement = document.getElementById('onlineVisitors');
        if (onlineElement) onlineElement.textContent = stats.onlineVisitors;

        const viewsElement = document.getElementById('todayViews');
        if (viewsElement) viewsElement.textContent = stats.todayViews;

        const leadsElement = document.getElementById('pendingLeads');
        if (leadsElement) leadsElement.textContent = stats.pendingLeads;
    }

    startRealTimeUpdates() {
        // Atualizar estatísticas a cada 30 segundos
        setInterval(() => {
            this.updateRealTimeStats();
        }, 30000);
    }

    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }

    refreshCharts() {
        this.destroyCharts();
        this.initializeCharts();
    }
}

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardAnalytics = new DashboardAnalytics();
    
    // Iniciar atualizações em tempo real
    setTimeout(() => {
        window.dashboardAnalytics.startRealTimeUpdates();
        window.dashboardAnalytics.generateInsights();
    }, 1000);
});

// Exportar para uso global
window.DashboardAnalytics = DashboardAnalytics;
