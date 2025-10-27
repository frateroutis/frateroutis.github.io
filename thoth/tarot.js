// Banco de dados completo das cartas do Tarot de Thoth
const tarotDeck = {
    majorArcana: [
        { name: "O Louco", file: "The_Fool", namePT: "O Louco", path: "Major_Arcana", ext: "webp" },
        { name: "O Mago", file: "The_Magus", namePT: "O Mago", path: "Major_Arcana", ext: "webp" },
        { name: "A Sacerdotisa", file: "The_Priestess", namePT: "A Sacerdotisa", path: "Major_Arcana", ext: "webp" },
        { name: "A Imperatriz", file: "The_Empress", namePT: "A Imperatriz", path: "Major_Arcana", ext: "webp" },
        { name: "O Imperador", file: "The_Emperor", namePT: "O Imperador", path: "Major_Arcana", ext: "webp" },
        { name: "O Hierofante", file: "The_Hierophant", namePT: "O Hierofante", path: "Major_Arcana", ext: "webp" },
        { name: "Os Amantes", file: "The_Lovers", namePT: "Os Amantes", path: "Major_Arcana", ext: "webp" },
        { name: "O Carro", file: "The_Chariot", namePT: "O Carro", path: "Major_Arcana", ext: "webp" },
        { name: "O Ajuste", file: "The_Adjustment", namePT: "O Ajuste", path: "Major_Arcana", ext: "webp" },
        { name: "O Eremita", file: "The_Hermit", namePT: "O Eremita", path: "Major_Arcana", ext: "webp" },
        { name: "A Fortuna", file: "The_Fortune", namePT: "A Fortuna", path: "Major_Arcana", ext: "webp" },
        { name: "A Luxúria", file: "The_Lust", namePT: "A Luxúria", path: "Major_Arcana", ext: "webp" },
        { name: "O Enforcado", file: "The_Hanged_Man", namePT: "O Enforcado", path: "Major_Arcana", ext: "webp" },
        { name: "A Morte", file: "The_Death", namePT: "A Morte", path: "Major_Arcana", ext: "webp" },
        { name: "A Arte", file: "The_Art", namePT: "A Arte", path: "Major_Arcana", ext: "webp" },
        { name: "O Diabo", file: "The_Devil", namePT: "O Diabo", path: "Major_Arcana", ext: "webp" },
        { name: "A Torre", file: "The_Tower", namePT: "A Torre", path: "Major_Arcana", ext: "webp" },
        { name: "A Estrela", file: "The_Star", namePT: "A Estrela", path: "Major_Arcana", ext: "webp" },
        { name: "A Lua", file: "The_Moon", namePT: "A Lua", path: "Major_Arcana", ext: "webp" },
        { name: "O Sol", file: "The_Sun", namePT: "O Sol", path: "Major_Arcana", ext: "webp" },
        { name: "O Éon", file: "The_Aeon", namePT: "O Éon", path: "Major_Arcana", ext: "webp" },
        { name: "O Universo", file: "The_Universe", namePT: "O Universo", path: "Major_Arcana", ext: "webp" }
    ],
    
    minorArcana: {
        wands: [
            { name: "Ás de Paus", file: "Ace_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "2 de Paus", file: "2_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "3 de Paus", file: "3_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "4 de Paus", file: "4_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "5 de Paus", file: "5_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "6 de Paus", file: "6_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "7 de Paus", file: "7_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "8 de Paus", file: "8_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "9 de Paus", file: "9_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "10 de Paus", file: "10_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "Princesa de Paus", file: "Princess_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "Príncipe de Paus", file: "Prince_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "Rainha de Paus", file: "Queen_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" },
            { name: "Cavaleiro de Paus", file: "Knight_of_Wands", path: "Minor_Arcana/Wands", ext: "webp" }
        ],
        cups: [
            { name: "Ás de Copas", file: "Ace_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "2 de Copas", file: "2_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "3 de Copas", file: "3_of_Cups", path: "Minor_Arcana/Cups", ext: "jpg" },
            { name: "4 de Copas", file: "4_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "5 de Copas", file: "5_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "6 de Copas", file: "6_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "7 de Copas", file: "7_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "8 de Copas", file: "8_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "9 de Copas", file: "9_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "10 de Copas", file: "10_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "Princesa de Copas", file: "Princess_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "Príncipe de Copas", file: "Prince_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "Rainha de Copas", file: "Queen_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" },
            { name: "Cavaleiro de Copas", file: "Knight_of_Cups", path: "Minor_Arcana/Cups", ext: "webp" }
        ],
        swords: [
            { name: "Ás de Espadas", file: "Ace_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "2 de Espadas", file: "2_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "3 de Espadas", file: "3_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "4 de Espadas", file: "4_of_Swords", path: "Minor_Arcana/Swords", ext: "webp" },
            { name: "5 de Espadas", file: "5_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "6 de Espadas", file: "6_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "7 de Espadas", file: "7_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "8 de Espadas", file: "8_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "9 de Espadas", file: "9_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "10 de Espadas", file: "10_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "Princesa de Espadas", file: "Princess_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "Príncipe de Espadas", file: "Prince_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "Rainha de Espadas", file: "Queen_of_Swords", path: "Minor_Arcana/Swords", ext: "png" },
            { name: "Cavaleiro de Espadas", file: "Knight_of_Swords", path: "Minor_Arcana/Swords", ext: "png" }
        ],
        disks: [
            { name: "Ás de Discos", file: "Ace_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "2 de Discos", file: "2_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "3 de Discos", file: "3_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "4 de Discos", file: "4_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "5 de Discos", file: "5_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "6 de Discos", file: "6_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "7 de Discos", file: "7_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "8 de Discos", file: "8_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "9 de Discos", file: "9_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "10 de Discos", file: "10_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "Princesa de Discos", file: "Princess_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "Príncipe de Discos", file: "Prince_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "Rainha de Discos", file: "Queen_of_Disks", path: "Minor_Arcana/Disks", ext: "png" },
            { name: "Cavaleiro de Discos", file: "Knight_of_Disks", path: "Minor_Arcana/Disks", ext: "png" }
        ]
    }
};

// Configurações dos spreads
const spreads = {
    one: {
        name: "Uma Carta",
        positions: ["Mensagem do Dia"],
        description: "Uma única carta para orientação direta e clara sobre sua situação atual."
    },
    three: {
        name: "Três Cartas",
        positions: ["Passado", "Presente", "Futuro"],
        description: "Visão temporal da sua jornada: de onde você veio, onde está e para onde vai."
    },
    cross: {
        name: "Cruz Celta Simplificada",
        positions: [
            "Situação Atual",
            "Desafio/Obstáculo",
            "Passado Recente",
            "Futuro Próximo",
            "Resultado Final"
        ],
        description: "Uma análise estruturada focando nos aspectos centrais da sua questão."
    },
    horseshoe: {
        name: "Ferradura",
        positions: [
            "Passado",
            "Presente",
            "Influências Ocultas",
            "Obstáculos",
            "Ambiente",
            "Ação Sugerida",
            "Resultado"
        ],
        description: "Tiragem abrangente que revela múltiplas camadas da situação."
    },
    celtic: {
        name: "Cruz Celta Completa",
        positions: [
            "Você Agora",
            "Desafio Cruzado",
            "Fundação",
            "Passado Recente",
            "Melhor Resultado Possível",
            "Futuro Próximo",
            "Você na Situação",
            "Ambiente/Outros",
            "Esperanças e Medos",
            "Resultado Final"
        ],
        description: "A tiragem mais completa do Tarot, revelando todos os aspectos da questão."
    }
};

// Estado atual da aplicação
let currentSpread = 'one';
let drawnCards = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setupSpreadButtons();
    updateSpreadInfo();
});

// Configurar botões de spread
function setupSpreadButtons() {
    const buttons = document.querySelectorAll('.spread-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSpread = btn.dataset.spread;
            updateSpreadInfo();
            
            // Limpa tiragem anterior se houver
            if (drawnCards.length > 0) {
                resetReading();
            }
        });
    });
}

// Atualizar informações do spread
function updateSpreadInfo() {
    const info = spreads[currentSpread];
    const infoDiv = document.getElementById('spread-info');
    
    if (drawnCards.length === 0) {
        infoDiv.style.display = 'none';
    } else {
        infoDiv.style.display = 'block';
        infoDiv.innerHTML = `
            <h3>${info.name}</h3>
            <p>${info.description}</p>
        `;
    }
}

// Obter deck completo
function getFullDeck() {
    const deck = [...tarotDeck.majorArcana];
    Object.values(tarotDeck.minorArcana).forEach(suit => {
        deck.push(...suit);
    });
    return deck;
}

// Embaralhar array (Fisher-Yates)
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Sortear cartas
function drawCards() {
    const info = spreads[currentSpread];
    const numCards = info.positions.length;
    
    const fullDeck = getFullDeck();
    const shuffled = shuffle(fullDeck);
    
    // Sorteia cartas e determina se estão invertidas (50% de chance)
    drawnCards = shuffled.slice(0, numCards).map(card => ({
        ...card,
        reversed: Math.random() < 0.5
    }));
    
    displayCards();
    updateSpreadInfo();
    
    document.getElementById('reset-btn').style.display = 'block';
}

// Exibir cartas
function displayCards() {
    const container = document.getElementById('cards-container');
    const info = spreads[currentSpread];
    
    container.innerHTML = '';
    
    // Aplicar classe de layout apropriada
    container.className = 'cards-display';
    if (currentSpread === 'one') {
        container.classList.add('one-card');
    } else if (currentSpread === 'three') {
        container.classList.add('three-cards');
    } else if (currentSpread === 'cross') {
        container.classList.add('cross-spread');
        displayCrossSpread(container, info);
        return;
    } else if (currentSpread === 'horseshoe') {
        container.classList.add('horseshoe-spread');
        displayHorseshoeSpread(container, info);
        return;
    } else if (currentSpread === 'celtic') {
        container.classList.add('celtic-spread');
        displayCelticSpread(container, info);
        return;
    }
    
    // Layout simples para 1 ou 3 cartas
    drawnCards.forEach((card, index) => {
        const cardElement = createCardElement(card, info.positions[index], index);
        container.appendChild(cardElement);
    });
}

// Layout da Cruz (5 cartas)
function displayCrossSpread(container, info) {
    // Linha 1: Passado Recente
    const row1 = document.createElement('div');
    row1.className = 'cross-row';
    row1.appendChild(createCardElement(drawnCards[2], info.positions[2], 2));
    container.appendChild(row1);
    
    // Linha 2: Desafio - Situação Atual - Futuro Próximo
    const row2 = document.createElement('div');
    row2.className = 'cross-row';
    row2.appendChild(createCardElement(drawnCards[1], info.positions[1], 1));
    row2.appendChild(createCardElement(drawnCards[0], info.positions[0], 0));
    row2.appendChild(createCardElement(drawnCards[3], info.positions[3], 3));
    container.appendChild(row2);
    
    // Linha 3: Resultado Final
    const row3 = document.createElement('div');
    row3.className = 'cross-row';
    row3.appendChild(createCardElement(drawnCards[4], info.positions[4], 4));
    container.appendChild(row3);
}

// Layout da Ferradura (7 cartas) - Formato de arco
function displayHorseshoeSpread(container, info) {
    const horseshoeContainer = document.createElement('div');
    horseshoeContainer.style.display = 'flex';
    horseshoeContainer.style.flexDirection = 'column';
    horseshoeContainer.style.alignItems = 'center';
    horseshoeContainer.style.gap = '2rem';
    horseshoeContainer.style.width = '100%';
    
    // Linha superior (3 cartas): Passado, Presente, Influências Ocultas
    const topRow = document.createElement('div');
    topRow.className = 'horseshoe-row';
    topRow.style.display = 'flex';
    topRow.style.gap = '1.5rem';
    topRow.style.justifyContent = 'center';
    topRow.style.flexWrap = 'wrap';
    
    for (let i = 0; i < 3; i++) {
        topRow.appendChild(createCardElement(drawnCards[i], info.positions[i], i));
    }
    horseshoeContainer.appendChild(topRow);
    
    // Linha do meio (1 carta): Obstáculos (no centro)
    const middleRow = document.createElement('div');
    middleRow.className = 'horseshoe-row';
    middleRow.style.display = 'flex';
    middleRow.style.justifyContent = 'center';
    middleRow.appendChild(createCardElement(drawnCards[3], info.positions[3], 3));
    horseshoeContainer.appendChild(middleRow);
    
    // Linha inferior (3 cartas): Ambiente, Ação Sugerida, Resultado
    const bottomRow = document.createElement('div');
    bottomRow.className = 'horseshoe-row';
    bottomRow.style.display = 'flex';
    bottomRow.style.gap = '1.5rem';
    bottomRow.style.justifyContent = 'center';
    bottomRow.style.flexWrap = 'wrap';
    
    for (let i = 4; i < 7; i++) {
        bottomRow.appendChild(createCardElement(drawnCards[i], info.positions[i], i));
    }
    horseshoeContainer.appendChild(bottomRow);
    
    container.appendChild(horseshoeContainer);
}

// Layout da Cruz Celta (10 cartas) - Layout tradicional melhorado
function displayCelticSpread(container, info) {
    const celticContainer = document.createElement('div');
    celticContainer.style.display = 'flex';
    celticContainer.style.gap = '3rem';
    celticContainer.style.justifyContent = 'center';
    celticContainer.style.alignItems = 'flex-start';
    celticContainer.style.flexWrap = 'wrap';
    
    // Seção da Cruz (cartas 0-5)
    const crossSection = document.createElement('div');
    crossSection.style.display = 'grid';
    crossSection.style.gridTemplateColumns = 'repeat(3, 1fr)';
    crossSection.style.gridTemplateRows = 'repeat(4, auto)';
    crossSection.style.gap = '1rem';
    crossSection.style.maxWidth = '800px';
    crossSection.style.justifyItems = 'center';
    
    // Posição 3 (Passado Recente) - Topo
    const card3 = createCardElement(drawnCards[3], info.positions[3], 3);
    card3.style.gridColumn = '2';
    card3.style.gridRow = '1';
    crossSection.appendChild(card3);
    
    // Posição 4 (Melhor Resultado) - Esquerda
    const card4 = createCardElement(drawnCards[4], info.positions[4], 4);
    card4.style.gridColumn = '1';
    card4.style.gridRow = '2';
    crossSection.appendChild(card4);
    
    // Posições 0 e 1 (Centro - Você Agora e Desafio) - Sobrepostas
    const centerContainer = document.createElement('div');
    centerContainer.style.position = 'relative';
    centerContainer.style.gridColumn = '2';
    centerContainer.style.gridRow = '2';
    centerContainer.style.display = 'flex';
    centerContainer.style.alignItems = 'center';
    centerContainer.style.justifyContent = 'center';
    
    const card0 = createCardElement(drawnCards[0], info.positions[0], 0);
    card0.style.position = 'relative';
    centerContainer.appendChild(card0);
    
    const card1 = createCardElement(drawnCards[1], info.positions[1], 1);
    card1.style.position = 'absolute';
    card1.style.transform = 'rotate(90deg)';
    card1.style.opacity = '0.9';
    centerContainer.appendChild(card1);
    
    crossSection.appendChild(centerContainer);
    
    // Posição 5 (Futuro Próximo) - Direita
    const card5 = createCardElement(drawnCards[5], info.positions[5], 5);
    card5.style.gridColumn = '3';
    card5.style.gridRow = '2';
    crossSection.appendChild(card5);
    
    // Posição 2 (Fundação) - Embaixo
    const card2 = createCardElement(drawnCards[2], info.positions[2], 2);
    card2.style.gridColumn = '2';
    card2.style.gridRow = '3';
    crossSection.appendChild(card2);
    
    celticContainer.appendChild(crossSection);
    
    // Coluna do Staff (cartas 6-9) - Lado direito
    const staffSection = document.createElement('div');
    staffSection.style.display = 'flex';
    staffSection.style.flexDirection = 'column';
    staffSection.style.gap = '1.5rem';
    staffSection.style.alignItems = 'center';
    
    // Adiciona título visual para a coluna
    const staffTitle = document.createElement('div');
    staffTitle.style.color = 'var(--gold)';
    staffTitle.style.fontSize = '0.9rem';
    staffTitle.style.fontWeight = 'bold';
    staffTitle.style.marginBottom = '0.5rem';
    staffTitle.style.textAlign = 'center';
    staffTitle.style.textTransform = 'uppercase';
    staffTitle.style.letterSpacing = '1px';
    staffTitle.textContent = '— Coluna do Self —';
    staffSection.appendChild(staffTitle);
    
    for (let i = 6; i < 10; i++) {
        staffSection.appendChild(createCardElement(drawnCards[i], info.positions[i], i));
    }
    
    celticContainer.appendChild(staffSection);
    container.appendChild(celticContainer);
}

// Criar elemento de carta
function createCardElement(card, position, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.style.animationDelay = `${index * 0.15}s`;
    
    const imagePath = `../assets/Tarot_Cards/${card.path}/${card.file}.${card.ext}`;
    const cardPath = `assets/Tarot_Cards/${card.path}/${card.file}`;
    const reversedParam = card.reversed ? '&reversed=true' : '';
    const detailUrl = `card-detail.html?card=${encodeURIComponent(cardPath)}&name=${encodeURIComponent(card.name)}${reversedParam}`;
    
    // Adiciona classe e estilo de rotação se invertida
    const imageStyle = card.reversed ? 'transform: rotate(180deg);' : '';
    const positionIndicator = card.reversed
        ? '<div class="reversed-indicator">🔄 Invertida</div>'
        : '<div class="upright-indicator">✓ Vertical</div>';
    
    cardDiv.innerHTML = `
        <div class="card-position">${position}</div>
        ${positionIndicator}
        <div class="card-image-container">
            <img src="${imagePath}" alt="${card.name}" class="card-image" style="${imageStyle}"
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:var(--gold);font-size:1.2rem;text-align:center;padding:1rem;\\'>Imagem não disponível</div>'">
        </div>
        <div class="card-name">${card.name}${card.reversed ? ' (Invertida)' : ''}</div>
            <a href="${detailUrl}" class="card-link" target="_blank">
                📖 Ver Descrição Completa
            </a>
    `;
    
    return cardDiv;
}

// Resetar tiragem
function resetReading() {
    drawnCards = [];
    document.getElementById('cards-container').innerHTML = '';
    document.getElementById('reset-btn').style.display = 'none';
    updateSpreadInfo();
}
