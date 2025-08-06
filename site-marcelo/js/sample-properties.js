/**
 * Script para Popular Banco com Propriedades de Exemplo
 * Execute este arquivo no console do navegador para adicionar propriedades de teste
 */

const sampleProperties = [
    // Lançamentos
    {
        title: "Residencial Paradise Bay - Jatiúca",
        price: "750000",
        location: "Jatiúca",
        category: "lancamentos",
        type: "apartamento",
        area: 85,
        bedrooms: 3,
        bathrooms: 2,
        parking: 1,
        description: "Novo empreendimento na Jatiúca com vista parcial para o mar. Apartamento de 3 quartos com suíte e varanda gourmet.",
        features: ["Vista parcial mar", "Varanda gourmet", "Área de lazer", "Piscina", "Academia"]
    },
    {
        title: "Edifício Coral Plaza - Ponta Verde",
        price: "950000",
        location: "Ponta Verde",
        category: "lancamentos", 
        type: "apartamento",
        area: 120,
        bedrooms: 4,
        bathrooms: 3,
        parking: 2,
        description: "Lançamento exclusivo na Ponta Verde com acabamento de luxo e localização privilegiada.",
        features: ["Vista mar", "Acabamento premium", "Varandão", "Churrasqueira", "2 vagas"]
    },
    
    // Mais Procurados
    {
        title: "Casa Duplex - Mangabeiras",
        price: "680000",
        location: "Mangabeiras",
        category: "mais-procurados",
        type: "casa",
        area: 180,
        bedrooms: 4,
        bathrooms: 3,
        parking: 2,
        description: "Casa duplex em condomínio fechado com área de lazer completa e excelente localização.",
        features: ["Condomínio fechado", "Área gourmet", "Quintal", "Segurança 24h"]
    },
    {
        title: "Apartamento Vista Mar - Pajuçara",
        price: "850000",
        location: "Pajuçara",
        category: "mais-procurados",
        type: "apartamento", 
        area: 95,
        bedrooms: 3,
        bathrooms: 2,
        parking: 1,
        description: "Apartamento com vista frontal para o mar na orla de Pajuçara, completamente mobiliado.",
        features: ["Vista frontal mar", "Mobiliado", "Orla de Pajuçara", "Sacada"]
    },
    
    // Pronto para Morar
    {
        title: "Apartamento Pronto - Farol",
        price: "420000",
        location: "Farol",
        category: "pronto-morar",
        type: "apartamento",
        area: 70,
        bedrooms: 2,
        bathrooms: 2,
        parking: 1,
        description: "Apartamento pronto para morar no Farol, totalmente reformado com móveis planejados.",
        features: ["Reformado", "Móveis planejados", "Pronto para morar", "Ar condicionado"]
    },
    {
        title: "Casa Térrea - Cruz das Almas",
        price: "380000",
        location: "Cruz das Almas",
        category: "pronto-morar",
        type: "casa",
        area: 120,
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        description: "Casa térrea pronta para morar em bairro residencial tranquilo com quintal amplo.",
        features: ["Quintal amplo", "Garagem coberta", "Área de serviço", "Portão eletrônico"]
    },
    
    // Beira Mar
    {
        title: "Cobertura Duplex - Jatiúca",
        price: "1250000",
        location: "Jatiúca",
        category: "beira-mar",
        type: "cobertura",
        area: 200,
        bedrooms: 4,
        bathrooms: 4,
        parking: 3,
        description: "Cobertura duplex de frente para o mar com terraço gourmet e vista panorâmica de Maceió.",
        features: ["Frente mar", "Terraço gourmet", "Vista panorâmica", "Jacuzzi", "Churrasqueira"]
    },
    {
        title: "Apartamento Beira Mar - Ponta Verde",
        price: "1100000",
        location: "Ponta Verde", 
        category: "beira-mar",
        type: "apartamento",
        area: 110,
        bedrooms: 3,
        bathrooms: 3,
        parking: 2,
        description: "Apartamento de frente para o mar na orla da Ponta Verde com varanda ampla.",
        features: ["Frente mar", "Varanda ampla", "Andar alto", "Vista desobstruída"]
    }
];

async function addSampleProperties() {
    const apiUrl = window.Config ? window.Config.apiBaseURL : 'http://localhost:5000';
    
    console.log('🏠 Adicionando propriedades de exemplo...');
    
    for (let i = 0; i < sampleProperties.length; i++) {
        const property = sampleProperties[i];
        
        try {
            const response = await fetch(`${apiUrl}/properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(property)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log(`✅ Propriedade ${i + 1} adicionada: ${property.title} (ID: ${result.id})`);
            } else {
                console.error(`❌ Erro ao adicionar propriedade ${i + 1}:`, await response.text());
            }
            
            // Aguarda um pouco entre as requisições
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.error(`❌ Erro ao adicionar propriedade ${i + 1}:`, error);
        }
    }
    
    console.log('🎉 Processo concluído! Atualize a página para ver as propriedades.');
}

// Auto-executa se não estiver em produção
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        // Aguarda um pouco para garantir que tudo foi carregado
        setTimeout(() => {
            addSampleProperties();
        }, 2000);
    });
}

// Também disponibiliza a função globalmente para execução manual
window.addSampleProperties = addSampleProperties;
