import requests
import json

API_URL = "http://localhost:5000/properties"

properties = [
    {
        "title": "Residencial Paradise Bay - Jatiúca",
        "price": "750000",
        "location": "Jatiúca",
        "category": "lancamentos",
        "type": "apartamento",
        "area": 85,
        "bedrooms": 3,
        "bathrooms": 2,
        "parking": 1,
        "description": "Novo empreendimento na Jatiúca com vista parcial para o mar.",
        "features": ["Vista parcial mar", "Varanda gourmet", "Área de lazer"]
    },
    {
        "title": "Casa Duplex - Mangabeiras",
        "price": "680000",
        "location": "Mangabeiras",
        "category": "mais-procurados",
        "type": "casa",
        "area": 180,
        "bedrooms": 4,
        "bathrooms": 3,
        "parking": 2,
        "description": "Casa duplex em condomínio fechado com área de lazer completa.",
        "features": ["Condomínio fechado", "Área gourmet", "Quintal"]
    },
    {
        "title": "Apartamento Pronto - Farol",
        "price": "420000",
        "location": "Farol",
        "category": "pronto-morar",
        "type": "apartamento",
        "area": 70,
        "bedrooms": 2,
        "bathrooms": 2,
        "parking": 1,
        "description": "Apartamento pronto para morar no Farol, totalmente reformado.",
        "features": ["Reformado", "Móveis planejados", "Pronto para morar"]
    },
    {
        "title": "Cobertura Duplex - Jatiúca",
        "price": "1250000",
        "location": "Jatiúca",
        "category": "beira-mar",
        "type": "cobertura",
        "area": 200,
        "bedrooms": 4,
        "bathrooms": 4,
        "parking": 3,
        "description": "Cobertura duplex de frente para o mar com terraço gourmet.",
        "features": ["Frente mar", "Terraço gourmet", "Vista panorâmica"]
    }
]

def add_properties():
    print("🏠 Adicionando propriedades de exemplo...")
    
    for i, property_data in enumerate(properties):
        try:
            response = requests.post(API_URL, json=property_data)
            
            if response.status_code == 201:
                result = response.json()
                print(f"✅ Propriedade {i + 1} adicionada: {property_data['title']} (ID: {result.get('id')})")
            else:
                print(f"❌ Erro ao adicionar propriedade {i + 1}: {response.text}")
                
        except Exception as e:
            print(f"❌ Erro ao adicionar propriedade {i + 1}: {e}")
    
    print("🎉 Processo concluído!")

if __name__ == "__main__":
    add_properties()
