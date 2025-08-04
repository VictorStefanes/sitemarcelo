# Sistema de Gestão de Imóveis - Dashboard

## 📋 Visão Geral

Sistema completo para gerenciar imóveis com categorização automática por seções:
- **Lançamentos**: Imóveis novos
- **Mais Procurados**: Imóveis em destaque  
- **Beira Mar**: Imóveis com vista para o mar

## 🏗️ Estrutura do Sistema

### Páginas
- **index.html**: Página principal com destaques (últimos 4 de cada seção)
- **lancamentos.html**: Página específica para lançamentos
- **mais-procurados.html**: Página específica para mais procurados
- **beira-mar.html**: Página específica para beira mar

### JavaScript
- **dashboard-api.js**: API para gerenciar propriedades
- **filters.js**: Sistema de filtros unificado
- **index-highlights.js**: Gestão dos destaques na página principal

### CSS
- **styles.css**: Estilos principais e cards
- **filters.css**: Estilos dos filtros

## 🎯 Como Usar o Dashboard

### 1. Adicionar Nova Propriedade

```javascript
// Exemplo de como adicionar um imóvel
await window.DashboardAPI.addProperty({
    title: 'Apartamento Jardim Oceania',
    location: 'Jatiúca - Maceió/AL',
    price: 'R$ 850.000,00',
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    area: '85m²',
    condominio: 'R$ 350,00',
    images: [
        '/uploads/apartamento1-frente.jpg',
        '/uploads/apartamento1-sala.jpg',
        '/uploads/apartamento1-quarto.jpg'
    ],
    tags: ['Lançamento', 'Financiamento', 'Vista mar'],
    section: 'lancamentos' // ou 'mais-procurados' ou 'beira-mar'
});
```

### 2. Editar Propriedade Existente

```javascript
await window.DashboardAPI.updateProperty(123, {
    title: 'Apartamento Jardim Oceania - Atualizado',
    price: 'R$ 900.000,00',
    tags: ['Lançamento', 'Financiamento', 'Vista mar', 'Aceita permuta']
});
```

### 3. Remover Propriedade

```javascript
await window.DashboardAPI.deleteProperty(123, 'lancamentos');
```

### 4. Upload de Imagens

```javascript
const fileInput = document.getElementById('imageUpload');
const file = fileInput.files[0];
const result = await window.DashboardAPI.uploadImage(file);
console.log('URL da imagem:', result.url);
```

## 🏷️ Categorização Automática

### Seções Disponíveis
- **`lancamentos`**: Para imóveis novos, em construção
- **`mais-procurados`**: Para imóveis em destaque, mais vendidos
- **`beira-mar`**: Para imóveis com vista ou próximos ao mar

### Tags Recomendadas

**Para Lançamentos:**
- "Lançamento"
- "Financiamento"
- "Novo"
- "Em construção"
- "Entrada facilitada"

**Para Mais Procurados:**
- "Mais procurado"
- "Destaque"
- "Pronto para morar"
- "Centro"
- "Cobertura"

**Para Beira Mar:**
- "Beira mar"
- "Vista mar"
- "Frente oceano"
- "Mobiliado"
- "Temporada"

## 📱 Sistema de Destaques (Index)

A página principal mostra automaticamente os **últimos 4 imóveis** de cada seção:
- Os imóveis são ordenados por data de adição
- Atualização automática quando novos imóveis são adicionados
- Cards com slider de imagens igual às páginas específicas

## 🔍 Sistema de Filtros

Cada página de seção possui filtros avançados:
- **Finalidade**: Venda, Aluguel, Temporada
- **Tipo**: Casa, Apartamento, Cobertura, Studio, Kitnet
- **Preço**: Range de R$ 50.000 a R$ 2.000.000
- **Quartos**: 1, 2, 3, 4+
- **Suítes**: 1, 2, 3, 4+
- **Banheiros**: 1, 2, 3+
- **Vagas**: 0, 1, 2, 3+
- **Localização**: Estado, Cidade, Bairro

## 🎨 Estrutura dos Cards

Todos os cards seguem o mesmo padrão da página index:

```html
<div class="property-card">
    <!-- Navegação de imagens -->
    <button class="nav-arrow prev">‹</button>
    <button class="nav-arrow next">›</button>
    
    <!-- Slider de imagens -->
    <div class="property-image">
        <div class="property-slide">
            <img src="imagem1.jpg" alt="Título">
        </div>
        <!-- Dots para navegação -->
        <div class="dots-container">
            <button class="dot active"></button>
        </div>
    </div>
    
    <!-- Conteúdo -->
    <div class="property-content">
        <div class="location">
            <h2>Local - Cidade/Estado</h2>
            <span>#ID</span>
        </div>
        <div class="property-title">
            <h3>Título do Imóvel</h3>
        </div>
        <div class="property-features">
            <div class="feature">
                <i class="fas fa-bed"></i>
                <span>3</span>
            </div>
            <!-- Mais features -->
        </div>
        <div class="property-price">
            <h3>R$ 850.000,00</h3>
        </div>
        <div class="property-tags">
            <span class="tag">Tag1</span>
        </div>
        <i class="fas fa-star icon"></i>
    </div>
</div>
```

## 🔧 Integração com Backend

### Endpoints Esperados

```
GET    /api/properties/health              - Status da API
GET    /api/properties/:section            - Listar por seção
GET    /api/properties/:section/latest     - Últimos itens
POST   /api/properties                     - Adicionar novo
PUT    /api/properties/:id                 - Atualizar existente
DELETE /api/properties/:id                 - Remover
POST   /api/properties/upload              - Upload de imagem
```

### Formato de Dados

```json
{
    "id": 123,
    "title": "Apartamento Jardim Oceania",
    "location": "Jatiúca - Maceió/AL",
    "price": "R$ 850.000,00",
    "bedrooms": 3,
    "bathrooms": 2,
    "parking": 2,
    "area": "85m²",
    "condominio": "R$ 350,00",
    "images": ["url1.jpg", "url2.jpg"],
    "tags": ["Lançamento", "Vista mar"],
    "section": "lancamentos",
    "dateAdded": "2024-12-10T10:00:00Z"
}
```

## 🚀 Estados das Páginas

### Página Vazia (Sem Imóveis)
- Mostra estado vazio com ícone e mensagem
- Orienta que imóveis aparecerão quando adicionados

### Página com Filtros
- Filtros funcionam em tempo real
- Contador de resultados
- Estado vazio quando filtros não retornam resultados

### Página Index
- Sempre mostra últimos 4 de cada seção
- Se seção vazia, mostra "Nenhum destaque disponível"

## 📞 Eventos do Sistema

```javascript
// Escutar atualizações de propriedades
window.addEventListener('propertiesUpdated', (event) => {
    console.log('Seção atualizada:', event.detail.section);
});

// Forçar atualização dos destaques
window.IndexHighlightsAPI.refresh();

// Forçar atualização dos filtros
window.PropertyFiltersAPI.refreshProperties();
```

## ✅ Checklist de Implementação

- [x] Sistema de categorização por seção
- [x] Páginas limpas (sem cards estáticos)
- [x] API de dashboard completa
- [x] Sistema de filtros unificado
- [x] Cards com design igual ao index
- [x] Sistema de destaques automático
- [x] Estados vazios informativos
- [x] Upload de imagens
- [x] Responsividade completa

## 🎯 Próximos Passos

1. **Conectar com backend real** (substituir dados mock)
2. **Interface de administração** para gerenciar pelo dashboard
3. **Sistema de autenticação** para acesso ao dashboard
4. **Notificações** para novas propriedades
5. **Analytics** de visualizações e interesse
