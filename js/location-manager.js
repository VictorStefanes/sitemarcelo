/**
 * Location Manager - Gerencia dropdowns de localização
 */

class LocationManager {
    constructor() {
        this.locations = {
            'AL': {
                name: 'Alagoas',
                cities: {
                    'Maceió': {
                        neighborhoods: [
                            'Ponta Verde', 'Jatiúca', 'Pajuçara', 'Farol', 'Mangabeiras',
                            'Cruz das Almas', 'Barro Duro', 'Benedito Bentes', 'Tabuleiro dos Martins',
                            'Jacintinho', 'Feitosa', 'Serraria', 'Ponta Grossa', 'Petrópolis',
                            'Clima Bom', 'Poço', 'Santa Amélia', 'Jardim Petrópolis', 'Gruta de Lourdes',
                            'Centro', 'Jaraguá', 'Levada', 'Pinheiro', 'Santos Dumont', 'Trapiche da Barra'
                        ]
                    },
                    'Arapiraca': {
                        neighborhoods: [
                            'Centro', 'Senador Arnon de Melo', 'Primavera', 'Baixão',
                            'Manoel Sampaio', 'Eldorado', 'Brasília', 'Nossa Senhora do Bom Conselho'
                        ]
                    },
                    'Rio Largo': {
                        neighborhoods: [
                            'Centro', 'Ilha de Santa Rita', 'Massagueira', 'Tabuleiro do Pinto'
                        ]
                    },
                    'Palmeira dos Índios': {
                        neighborhoods: [
                            'Centro', 'Alto Cruzeiro', 'Chã da Imbira', 'Vila Palmeirense'
                        ]
                    }
                }
            },
            'SP': {
                name: 'São Paulo',
                cities: {
                    'São Paulo': {
                        neighborhoods: [
                            'Vila Madalena', 'Pinheiros', 'Itaim Bibi', 'Moema', 'Vila Olímpia',
                            'Jardins', 'Higienópolis', 'Perdizes', 'Brooklin', 'Campo Belo'
                        ]
                    },
                    'Campinas': {
                        neighborhoods: [
                            'Cambuí', 'Centro', 'Jardim Guanabara', 'Vila Brandina'
                        ]
                    }
                }
            },
            'RJ': {
                name: 'Rio de Janeiro',
                cities: {
                    'Rio de Janeiro': {
                        neighborhoods: [
                            'Copacabana', 'Ipanema', 'Leblon', 'Barra da Tijuca', 'Tijuca',
                            'Botafogo', 'Flamengo', 'Centro', 'Zona Sul', 'Zona Norte'
                        ]
                    },
                    'Niterói': {
                        neighborhoods: [
                            'Icaraí', 'Santa Rosa', 'São Francisco', 'Centro'
                        ]
                    }
                }
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupInputCapitalization();
    }

    setupEventListeners() {
        const stateSelect = document.getElementById('propertyState');
        const citySelect = document.getElementById('propertyCity');
        const neighborhoodSelect = document.getElementById('propertyNeighborhood');
        const locationInput = document.getElementById('propertyLocation');

        if (stateSelect) {
            stateSelect.addEventListener('change', (e) => {
                this.handleStateChange(e.target.value);
            });
        }

        if (citySelect) {
            citySelect.addEventListener('change', (e) => {
                this.handleCityChange(e.target.value);
            });
        }

        if (neighborhoodSelect) {
            neighborhoodSelect.addEventListener('change', (e) => {
                this.updateLocationInput();
            });
        }
    }

    handleStateChange(stateCode) {
        const citySelect = document.getElementById('propertyCity');
        const neighborhoodSelect = document.getElementById('propertyNeighborhood');

        // Reset city and neighborhood
        citySelect.innerHTML = '<option value="">Selecione a cidade</option>';
        neighborhoodSelect.innerHTML = '<option value="">Selecione o bairro</option>';
        neighborhoodSelect.disabled = true;

        if (stateCode && this.locations[stateCode]) {
            // Populate cities
            const cities = this.locations[stateCode].cities;
            Object.keys(cities).forEach(cityName => {
                const option = document.createElement('option');
                option.value = cityName;
                option.textContent = cityName;
                citySelect.appendChild(option);
            });
            
            citySelect.disabled = false;
        } else {
            citySelect.disabled = true;
        }

        this.updateLocationInput();
    }

    handleCityChange(cityName) {
        const stateSelect = document.getElementById('propertyState');
        const neighborhoodSelect = document.getElementById('propertyNeighborhood');
        const stateCode = stateSelect.value;

        // Reset neighborhood
        neighborhoodSelect.innerHTML = '<option value="">Selecione o bairro</option>';

        if (stateCode && cityName && this.locations[stateCode]?.cities[cityName]) {
            // Populate neighborhoods
            const neighborhoods = this.locations[stateCode].cities[cityName].neighborhoods;
            neighborhoods.forEach(neighborhood => {
                const option = document.createElement('option');
                option.value = neighborhood;
                option.textContent = neighborhood;
                neighborhoodSelect.appendChild(option);
            });
            
            neighborhoodSelect.disabled = false;
        } else {
            neighborhoodSelect.disabled = true;
        }

        this.updateLocationInput();
    }

    updateLocationInput() {
        const stateSelect = document.getElementById('propertyState');
        const citySelect = document.getElementById('propertyCity');
        const neighborhoodSelect = document.getElementById('propertyNeighborhood');
        const locationInput = document.getElementById('propertyLocation');

        const state = stateSelect.value;
        const city = citySelect.value;
        const neighborhood = neighborhoodSelect.value;

        let locationString = '';
        
        if (neighborhood && city && state) {
            locationString = `${neighborhood} - ${city}/${state}`;
        } else if (city && state) {
            locationString = `${city}/${state}`;
        } else if (state) {
            locationString = this.locations[state]?.name || state;
        }

        if (locationInput) {
            locationInput.value = locationString;
        }
    }

    setupInputCapitalization() {
        // Campos que devem ter primeira letra maiúscula
        const fieldsToCapitalize = [
            'propertyTitle',
            'propertyDescription',
            'propertyTags'
        ];

        fieldsToCapitalize.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    this.capitalizeInput(e.target);
                });
                
                field.addEventListener('blur', (e) => {
                    this.capitalizeInput(e.target);
                });
            }
        });
    }

    capitalizeInput(input) {
        const value = input.value;
        
        if (value.length > 0) {
            // Capitaliza a primeira letra e mantém o restante
            const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
            
            // Se é um textarea (descrição), capitaliza após pontos também
            if (input.tagName === 'TEXTAREA') {
                const sentences = capitalized.split('. ');
                const capitalizedSentences = sentences.map(sentence => {
                    if (sentence.length > 0) {
                        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
                    }
                    return sentence;
                });
                input.value = capitalizedSentences.join('. ');
            } else {
                input.value = capitalized;
            }
        }
    }

    // Método para obter localização formatada
    getFormattedLocation(state, city, neighborhood) {
        if (neighborhood && city && state) {
            return `${neighborhood} - ${city}/${state}`;
        } else if (city && state) {
            return `${city}/${state}`;
        } else if (state) {
            return this.locations[state]?.name || state;
        }
        return '';
    }

    // Método para definir localização nos selects
    setLocation(locationString) {
        if (!locationString) return;

        // Parse da string "Bairro - Cidade/Estado"
        const parts = locationString.split(' - ');
        let neighborhood = '';
        let cityState = '';

        if (parts.length === 2) {
            neighborhood = parts[0];
            cityState = parts[1];
        } else {
            cityState = parts[0];
        }

        const cityStateParts = cityState.split('/');
        const city = cityStateParts[0];
        const state = cityStateParts[1];

        // Definir os valores nos selects
        const stateSelect = document.getElementById('propertyState');
        const citySelect = document.getElementById('propertyCity');
        const neighborhoodSelect = document.getElementById('propertyNeighborhood');

        if (stateSelect && state) {
            stateSelect.value = state;
            this.handleStateChange(state);
            
            setTimeout(() => {
                if (citySelect && city) {
                    citySelect.value = city;
                    this.handleCityChange(city);
                    
                    setTimeout(() => {
                        if (neighborhoodSelect && neighborhood) {
                            neighborhoodSelect.value = neighborhood;
                            this.updateLocationInput();
                        }
                    }, 100);
                }
            }, 100);
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('propertyState')) {
        window.locationManager = new LocationManager();
    }
});
