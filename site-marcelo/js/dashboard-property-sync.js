/**
 * INTEGRAÇÃO DASHBOARD ↔ PÁGINAS DE IMÓVEIS
 * 
 * ⚠️ PROBLEMA IDENTIFICADO:
 * - Dashboard usa localStorage (dados locais)
 * - Páginas usam API backend (Flask)
 * - Não há sincronização entre eles!
 * 
 * 🎯 SOLUÇÃO:
 * Este arquivo sincroniza dados do dashboard com as páginas
 */

class DashboardPropertySync {
    constructor() {
        this.dashboardKey = 'marceloImoveisData';
        this.mockKey = 'mockProperties'; // Para compatibilidade
        this.init();
    }

    init() {
        console.log('🔄 Inicializando sincronização Dashboard ↔ Páginas');
        this.syncDashboardToPages();
        this.setupAutoSync();
    }

    // Converte dados do dashboard para formato das páginas
    syncDashboardToPages() {
        const dashboardData = this.getDashboardData();
        
        if (!dashboardData || !dashboardData.properties || dashboardData.properties.length === 0) {
            console.log('📋 Dashboard vazio, mantendo dados existentes das páginas');
            return;
        }

        // Converte propriedades do dashboard para formato das páginas
        const convertedProperties = dashboardData.properties.map(prop => this.convertProperty(prop));
        
        // Organiza por categorias
        const byCategory = this.organizeByCategory(convertedProperties);
        
        // Salva no formato esperado pelas páginas
        this.savePropertiesToPages(byCategory);
        
        console.log('✅ Dados sincronizados:', {
            totalProperties: convertedProperties.length,
            categories: Object.keys(byCategory),
            available: convertedProperties.filter(p => p.status === 'disponivel').length,
            sold: convertedProperties.filter(p => p.status === 'vendido').length
        });
    }

    // Configuração de sincronização automática
    setupAutoSync() {
        // Sincroniza a cada 30 segundos
        setInterval(() => {
            this.syncDashboardToPages();
        }, 30000);

        // Força sincronização quando localStorage muda
        window.addEventListener('storage', (e) => {
            if (e.key === this.dashboardKey) {
                console.log('🔄 Detectada mudança no dashboard, sincronizando...');
                this.syncDashboardToPages();
            }
        });
    }

    // Converte propriedade do dashboard para formato das páginas
    convertProperty(dashboardProp) {
        console.log('🔄 Convertendo propriedade do dashboard:', dashboardProp);
        
        const converted = {
            id: dashboardProp.id || `prop_${Date.now()}`,
            titulo: dashboardProp.title || dashboardProp.titulo || 'Imóvel sem título',
            preco: dashboardProp.price || dashboardProp.preco || 0,
            localizacao: dashboardProp.location || dashboardProp.localizacao || 'Localização não informada',
            quartos: dashboardProp.bedrooms || dashboardProp.quartos || 0,
            banheiros: dashboardProp.bathrooms || dashboardProp.banheiros || 0,
            garagem: dashboardProp.garage || dashboardProp.garagem || 0,
            area: dashboardProp.area || 0,
            tipo: this.mapPropertyType(dashboardProp.type || dashboardProp.tipo),
            categoria: dashboardProp.category || dashboardProp.categoria || this.mapToCategory(dashboardProp.type || dashboardProp.tipo),
            descricao: dashboardProp.description || dashboardProp.descricao || '',
            imagens: dashboardProp.images || ['assets/images/fundo.jpg'], // Imagem padrão
            status: dashboardProp.status || 'disponivel',
            createdAt: dashboardProp.createdAt || new Date().toISOString(),
            saleDate: dashboardProp.saleDate || null,
            // Campos extras para compatibilidade
            preco_formatado: this.formatPrice(dashboardProp.price || dashboardProp.preco || 0),
            localizacao_simplificada: this.simplifyLocation(dashboardProp.location || dashboardProp.localizacao || ''),
            destaque: dashboardProp.destaque || false,
            // Para ordenação na página inicial (últimos 4)
            created: dashboardProp.createdAt || new Date().toISOString()
        };
        
        console.log('✅ Propriedade convertida para páginas:', converted);
        return converted;
    }

    // Mapeia tipos do dashboard para tipos das páginas
    mapPropertyType(dashboardType) {
        const typeMap = {
            'Casa': 'casa',
            'Apartamento': 'apartamento',
            'Cobertura': 'cobertura',
            'Studio': 'studio',
            'Kitnet': 'kitnet'
        };
        return typeMap[dashboardType] || dashboardType?.toLowerCase() || 'apartamento';
    }

    // Mapeia tipo para categoria se não estiver definida
    mapToCategory(type) {
        const categoryMap = {
            'Casa': 'pronto-morar',
            'Apartamento': 'mais-procurados',
            'Cobertura': 'beira-mar',
            'Studio': 'pronto-morar',
            'Kitnet': 'mais-procurados'
        };
        return categoryMap[type] || 'mais-procurados';
    }

    // Formata preço para exibição
    formatPrice(price) {
        if (!price || price === 0) return 'Consulte o preço';
        
        // Se já está formatado, retorna como está
        if (typeof price === 'string' && price.includes('R$')) {
            return price;
        }
        
        // Formatar número
        const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.')) : price;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(numPrice);
    }

    // Simplifica localização para exibição
    simplifyLocation(location) {
        if (!location) return '';
        
        // Remove detalhes extras, mantém apenas bairro e cidade
        return location.split(',').slice(0, 2).join(', ').trim();
    }

    // Organiza propriedades por categoria
    organizeByCategory(properties) {
        const categories = {
            'lancamentos': [],
            'mais-procurados': [],
            'beira-mar': [],
            'pronto-morar': []
        };

        properties.forEach(property => {
            const category = property.categoria || 'mais-procurados';
            if (categories[category]) {
                categories[category].push(property);
            } else {
                categories['mais-procurados'].push(property);
            }
        });

        return categories;
    }

    // Salva propriedades organizadas para as páginas
    savePropertiesToPages(categorizedProperties) {
        // Salva cada categoria separadamente (formato esperado pelas páginas)
        Object.entries(categorizedProperties).forEach(([category, properties]) => {
            localStorage.setItem(`${category}Properties`, JSON.stringify(properties));
        });

        // Salva também no formato mock para compatibilidade
        const allProperties = Object.values(categorizedProperties).flat();
        localStorage.setItem(this.mockKey, JSON.stringify(allProperties));
        
        console.log('💾 Propriedades salvas por categoria:', {
            lancamentos: categorizedProperties['lancamentos'].length,
            'mais-procurados': categorizedProperties['mais-procurados'].length,
            'beira-mar': categorizedProperties['beira-mar'].length,
            'pronto-morar': categorizedProperties['pronto-morar'].length
        });
    }

    // Obtém dados do dashboard
    getDashboardData() {
        const data = localStorage.getItem(this.dashboardKey);
        try {
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Erro ao ler dados do dashboard:', error);
            return null;
        }
    }

    // Métodos públicos para uso externo
    forcSync() {
        console.log('🔄 Forçando sincronização manual...');
        this.syncDashboardToPages();
    }

    getStats() {
        const dashboardData = this.getDashboardData();
        return {
            properties: dashboardData?.properties?.length || 0,
            sales: dashboardData?.sales?.length || 0,
            leads: dashboardData?.leads?.length || 0,
            views: dashboardData?.views || 0
        };
    }
}

// Auto-inicialização
if (typeof window !== 'undefined') {
    // Aguarda DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.dashboardPropertySync = new DashboardPropertySync();
            window.propertySync = window.dashboardPropertySync; // Alias para compatibilidade
            window.forceSyncProperties = () => window.dashboardPropertySync.syncDashboardToPages();
        });
    } else {
        window.dashboardPropertySync = new DashboardPropertySync();
        window.propertySync = window.dashboardPropertySync; // Alias para compatibilidade
        window.forceSyncProperties = () => window.dashboardPropertySync.syncDashboardToPages();
    }
    
    // Força sincronização após 1 segundo (garante que outros scripts carregaram)
    setTimeout(() => {
        if (window.dashboardPropertySync) {
            window.dashboardPropertySync.syncDashboardToPages();
        }
    }, 1000);
}

console.log('📦 Dashboard Property Sync carregado');
