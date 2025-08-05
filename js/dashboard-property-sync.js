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

    getDashboardData() {
        const saved = localStorage.getItem(this.dashboardKey);
        return saved ? JSON.parse(saved) : null;
    }

    // Converte propriedade do dashboard para formato das páginas
    convertProperty(dashboardProp) {
        return {
            id: dashboardProp.id || `prop_${Date.now()}`,
            titulo: dashboardProp.title || dashboardProp.titulo || 'Imóvel sem título',
            preco: dashboardProp.price || dashboardProp.preco || 0,
            localizacao: dashboardProp.location || dashboardProp.localizacao || 'Localização não informada',
            quartos: dashboardProp.bedrooms || dashboardProp.quartos || 0,
            banheiros: dashboardProp.bathrooms || dashboardProp.banheiros || 0,
            garagem: dashboardProp.garage || dashboardProp.garagem || 0,
            area: dashboardProp.area || 0,
            tipo: this.mapPropertyType(dashboardProp.type || dashboardProp.tipo),
            categoria: this.mapToCategory(dashboardProp.type || dashboardProp.tipo),
            descricao: dashboardProp.description || dashboardProp.descricao || '',
            imagens: dashboardProp.images || ['assets/images/fundo.jpg'], // Imagem padrão
            status: dashboardProp.status || 'disponivel',
            createdAt: dashboardProp.createdAt || new Date().toISOString(),
            saleDate: dashboardProp.saleDate || null,
            // Campos extras para compatibilidade
            preco_formatado: this.formatPrice(dashboardProp.price || dashboardProp.preco || 0),
            localizacao_simplificada: this.simplifyLocation(dashboardProp.location || dashboardProp.localizacao || ''),
            destaque: false // Por padrão não é destaque
        };
    }

    // Mapeia tipos do dashboard para tipos das páginas
    mapPropertyType(dashboardType) {
        const typeMap = {
            'apartamento': 'apartamento',
            'casa': 'casa',
            'terreno': 'terreno',
            'comercial': 'comercial',
            'sitio': 'sitio',
            'chacara': 'sitio',
            'sobrado': 'casa',
            'cobertura': 'apartamento'
        };
        
        return typeMap[dashboardType?.toLowerCase()] || 'apartamento';
    }

    // Mapeia tipos para categorias das páginas
    mapToCategory(dashboardType) {
        const categoryMap = {
            'apartamento': 'lancamentos',
            'casa': 'mais-procurados', 
            'terreno': 'beira-mar',
            'comercial': 'pronto-morar',
            'sitio': 'beira-mar',
            'chacara': 'beira-mar',
            'sobrado': 'mais-procurados',
            'cobertura': 'lancamentos'
        };
        
        return categoryMap[dashboardType?.toLowerCase()] || 'lancamentos';
    }

    // Organiza propriedades por categoria
    organizeByCategory(properties) {
        const categories = {
            'lancamentos': [],
            'mais-procurados': [],
            'beira-mar': [],
            'pronto-morar': []
        };

        properties.forEach(prop => {
            const category = prop.categoria;
            if (categories[category]) {
                categories[category].push(prop);
            } else {
                // Se categoria não existir, adiciona em lançamentos
                categories['lancamentos'].push(prop);
            }
        });

        return categories;
    }

    // Salva propriedades no formato esperado pelas páginas
    savePropertiesToPages(categorizedProperties) {
        // Salva cada categoria separadamente
        Object.keys(categorizedProperties).forEach(category => {
            const key = `${category}Properties`;
            localStorage.setItem(key, JSON.stringify(categorizedProperties[category]));
        });

        // Salva todas as propriedades juntas para compatibilidade
        const allProperties = Object.values(categorizedProperties).flat();
        localStorage.setItem('allProperties', JSON.stringify(allProperties));
        
        // Atualiza mock properties para compatibilidade
        localStorage.setItem(this.mockKey, JSON.stringify(allProperties));
    }

    // Formata preço
    formatPrice(price) {
        if (!price || price === 0) return 'Preço a consultar';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    // Simplifica localização
    simplifyLocation(location) {
        return location.split(',')[0] || location;
    }

    // Configura sincronização automática
    setupAutoSync() {
        // Observa mudanças no localStorage do dashboard
        window.addEventListener('storage', (e) => {
            if (e.key === this.dashboardKey) {
                console.log('🔄 Dados do dashboard alterados, sincronizando...');
                this.syncDashboardToPages();
            }
        });

        // Sincroniza a cada 30 segundos para capturar mudanças na mesma aba
        setInterval(() => {
            this.syncDashboardToPages();
        }, 30000);
    }

    // Método para forçar sincronização (chamado manualmente)
    forcSync() {
        console.log('🔄 Forçando sincronização...');
        this.syncDashboardToPages();
        return this.getStats();
    }

    // Retorna estatísticas da sincronização
    getStats() {
        const dashboardData = this.getDashboardData();
        const allProperties = JSON.parse(localStorage.getItem('allProperties') || '[]');
        
        return {
            dashboard: {
                total: dashboardData?.properties?.length || 0,
                available: dashboardData?.properties?.filter(p => p.status === 'disponivel').length || 0,
                sold: dashboardData?.properties?.filter(p => p.status === 'vendido').length || 0
            },
            pages: {
                total: allProperties.length,
                byCategory: {
                    'lancamentos': JSON.parse(localStorage.getItem('lancamentosProperties') || '[]').length,
                    'mais-procurados': JSON.parse(localStorage.getItem('mais-procuradosProperties') || '[]').length,
                    'beira-mar': JSON.parse(localStorage.getItem('beira-marProperties') || '[]').length,
                    'pronto-morar': JSON.parse(localStorage.getItem('pronto-morarProperties') || '[]').length
                }
            },
            lastSync: new Date().toISOString()
        };
    }

    // Limpa todas as propriedades das páginas
    clearPageProperties() {
        const categories = ['lancamentos', 'mais-procurados', 'beira-mar', 'pronto-morar'];
        categories.forEach(category => {
            localStorage.removeItem(`${category}Properties`);
        });
        localStorage.removeItem('allProperties');
        localStorage.removeItem(this.mockKey);
        console.log('🗑️ Propriedades das páginas limpas');
    }
}

// Auto-inicializa o sistema de sincronização
if (typeof window !== 'undefined') {
    window.propertySync = new DashboardPropertySync();
    
    // Expõe métodos úteis globalmente
    window.forceSyncProperties = () => window.propertySync.forcSync();
    window.getPropertyStats = () => window.propertySync.getStats();
    window.clearAllProperties = () => window.propertySync.clearPageProperties();
    
    console.log('🔗 Sistema de sincronização Dashboard ↔ Páginas ativo');
    console.log('💡 Use: forceSyncProperties(), getPropertyStats(), clearAllProperties()');
}
