/**
 * DADOS DE DEMONSTRAÇÃO - DASHBOARD REAL
 * Script para popular o dashboard com alguns dados de exemplo
 * Remova este arquivo em produção
 */

function loadDemoData() {
    if (!window.realDashboard) {
        console.error('Dashboard real não carregado');
        return;
    }

    console.log('🎯 Carregando dados de demonstração...');

    // Limpa dados existentes (comentar em produção)
    // window.realDashboard.resetData();

    // Adiciona algumas propriedades de exemplo
    const demoProperties = [
        {
            title: 'Apartamento Vista Mar - Copacabana',
            type: 'apartamento',
            price: 850000,
            location: 'Copacabana, Rio de Janeiro',
            bedrooms: 3,
            bathrooms: 2,
            area: 120,
            description: 'Lindo apartamento com vista para o mar, varanda, churrasqueira e vaga de garagem.'
        },
        {
            title: 'Casa Moderna - Barra da Tijuca',
            type: 'casa',
            price: 1200000,
            location: 'Barra da Tijuca, Rio de Janeiro',
            bedrooms: 4,
            bathrooms: 3,
            area: 200,
            description: 'Casa nova com piscina, jardim e área gourmet completa.'
        },
        {
            title: 'Terreno Residencial - Recreio',
            type: 'terreno',
            price: 300000,
            location: 'Recreio dos Bandeirantes, Rio de Janeiro',
            bedrooms: 0,
            bathrooms: 0,
            area: 500,
            description: 'Terreno plano, documentação em dia, pronto para construir.'
        }
    ];

    // Adiciona propriedades
    demoProperties.forEach(property => {
        window.realDashboard.addProperty(property);
    });

    // Simula algumas vendas
    setTimeout(() => {
        const properties = window.realDashboard.data.properties;
        if (properties.length > 0) {
            // Venda 1
            window.realDashboard.addSale({
                propertyId: properties[0].id,
                value: 850000,
                commission: 42500,
                clientName: 'João Silva',
                type: 'venda'
            });

            // Venda 2 (mês passado)
            const sale2 = {
                propertyId: properties[1].id,
                value: 1200000,
                commission: 60000,
                clientName: 'Maria Santos',
                type: 'venda'
            };
            
            // Adiciona a venda com data do mês passado
            window.realDashboard.data.sales.push({
                ...sale2,
                id: window.realDashboard.generateId(),
                saleDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
            });
            
            // Atualiza a propriedade
            const property = window.realDashboard.data.properties.find(p => p.id === sale2.propertyId);
            if (property) {
                property.status = 'vendido';
                property.saleDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
            }
            
            window.realDashboard.data.revenue += sale2.commission;
        }

        // Adiciona alguns leads
        const demoLeads = [
            {
                name: 'Carlos Oliveira',
                contact: '(21) 99999-1111',
                interest: 'Apartamento 2 quartos em Copacabana',
                source: 'website'
            },
            {
                name: 'Ana Costa',
                contact: 'ana@email.com',
                interest: 'Casa com piscina na Barra',
                source: 'instagram'
            },
            {
                name: 'Pedro Ferreira',
                contact: '(21) 88888-2222',
                interest: 'Terreno no Recreio',
                source: 'whatsapp'
            },
            {
                name: 'Lucia Mendes',
                contact: '(21) 77777-3333',
                interest: 'Apartamento vista mar',
                source: 'indicacao'
            }
        ];

        demoLeads.forEach(lead => {
            window.realDashboard.addLead(lead);
        });

        // Simula algumas visualizações
        for (let i = 0; i < 15; i++) {
            window.realDashboard.incrementViews();
        }

        // Força atualização dos gráficos
        if (window.realCharts) {
            window.realCharts.refresh();
        }

        console.log('✅ Dados de demonstração carregados com sucesso!');
        console.log('📊 Estatísticas:', window.realDashboard.getStatistics());
        
        // Mostra notificação
        if (typeof showNotification !== 'undefined') {
            showNotification('🎯 Dados de demonstração carregados! Teste o sistema.', 'success');
        }

    }, 1000);
}

// Função para limpar dados de demo
function clearDemoData() {
    if (window.realDashboard) {
        window.realDashboard.resetData();
        console.log('🗑️ Dados de demonstração removidos');
        
        if (typeof showNotification !== 'undefined') {
            showNotification('🗑️ Dados limpos! Dashboard resetado.', 'info');
        }
    }
}

// Botão para carregar dados de demo (apenas para desenvolvimento)
function addDemoButton() {
    const demoButtons = document.createElement('div');
    demoButtons.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; z-index: 1000; display: flex; gap: 10px;">
            <button onclick="loadDemoData()" style="
                background: #28a745; 
                color: white; 
                border: none; 
                padding: 10px 15px; 
                border-radius: 8px; 
                cursor: pointer;
                font-size: 0.8rem;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">📊 Carregar Demo</button>
            <button onclick="clearDemoData()" style="
                background: #dc3545; 
                color: white; 
                border: none; 
                padding: 10px 15px; 
                border-radius: 8px; 
                cursor: pointer;
                font-size: 0.8rem;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">🗑️ Limpar</button>
        </div>
    `;
    
    document.body.appendChild(demoButtons);
}

// Adiciona botões apenas em desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', addDemoButton);
}

// Exporta funções para uso global
window.loadDemoData = loadDemoData;
window.clearDemoData = clearDemoData;

console.log('🎯 Sistema de demonstração carregado');
