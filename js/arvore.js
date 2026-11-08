/**
 * Árvore da Vida Hermética (Etz Chaim) — Frater Outis
 * Quatro Escalas de Cor do Liber 777 (Atziluth, Briah, Yetzirah, Assiah + Noir),
 * Geometria Sagrada em SVG e Integração Direta com Tarot de Thoth & API 777.
 */
(function () {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';

    const WORLD_META = {
        atziluth: { title: 'Mundo de Atziluth · Escala do Rei (Arquétipos)' },
        briah:    { title: 'Mundo de Briah · Escala da Rainha (Arcanjos)' },
        yetzirah: { title: 'Mundo de Yetzirah · Escala do Príncipe (Coros)' },
        assiah:   { title: 'Mundo de Assiah · Escala da Princesa (Esferas)' },
        noir:     { title: 'Modo Negativo · Prata & Obsidiana' }
    };

    const POS = {
        1:  { x: 410, y: 125 },
        2:  { x: 605, y: 245 },
        3:  { x: 215, y: 245 },
        d:  { x: 410, y: 345 },
        4:  { x: 605, y: 445 },
        5:  { x: 215, y: 445 },
        6:  { x: 410, y: 565 },
        7:  { x: 605, y: 710 },
        8:  { x: 215, y: 710 },
        9:  { x: 410, y: 830 },
        10: { x: 410, y: 975 }
    };

    const SEPHIROTH = [
        {
            id: 1, scale: '1', num: '1', name: 'Kether', heb: 'כתר', gematria: 620,
            meaning: 'A Coroa', pillar: 'Pilar do Equilíbrio (Topo)',
            godName: 'Eheieh (אהיה)', archangel: 'Metatron', choir: 'Chaioth ha-Qadesh',
            chakra: 'Rashith ha-Gilgalim (Primum Mobile)',
            vision: 'Antigo Rei barbado visto de perfil',
            virtue: 'Realização da Grande Obra', vice: '—',
            weapons: 'Suástica, Coroa, Lâmpada', qliphoth: 'Thaumiel (Gêmeos de Deus)',
            scales: { atziluth: '#fffef8', briah: '#ffffff', yetzirah: '#f8f9fa', assiah: '#f3e9d2' },
            minors: [
                { suit: 'Paus 🜂', title: 'Ás de Paus — Raiz do Fogo', card: 'assets/Tarot_Cards/Minor_Arcana/Wands/Ace_of_Wands' },
                { suit: 'Copas 🜄', title: 'Ás de Copas — Raiz da Água', card: 'assets/Tarot_Cards/Minor_Arcana/Cups/Ace_of_Cups' },
                { suit: 'Espadas 🜁', title: 'Ás de Espadas — Raiz do Ar', card: 'assets/Tarot_Cards/Minor_Arcana/Swords/Ace_of_Swords' },
                { suit: 'Discos 🜃', title: 'Ás de Discos — Raiz da Terra', card: 'assets/Tarot_Cards/Minor_Arcana/Disks/Ace_of_Disks' }
            ]
        },
        {
            id: 2, scale: '2', num: '2', name: 'Chokmah', heb: 'חכמה', gematria: 73,
            meaning: 'Sabedoria', pillar: 'Pilar da Misericórdia (Jachin)',
            godName: 'Yah (יה)', archangel: 'Raziel', choir: 'Auphanim (Rodas)',
            chakra: 'Mazloth (Esfera do Zodíaco / Urano)',
            vision: 'Figura barbada / Pai Cósmico',
            virtue: 'Devoção', vice: '—',
            weapons: 'Lingam, Manto Interior da Glória, Baqueta', qliphoth: 'Ghagiel (Os Estorvadores)',
            scales: { atziluth: '#7ec8e3', briah: '#9aa0a6', yetzirah: '#b8c4d0', assiah: '#eaeaea' },
            minors: [
                { suit: 'Paus 🜂', title: '2 de Paus — Domínio', card: 'assets/Tarot_Cards/Minor_Arcana/Wands/2_of_Wands' },
                { suit: 'Copas 🜄', title: '2 de Copas — Amor', card: 'assets/Tarot_Cards/Minor_Arcana/Cups/2_of_Cups' },
                { suit: 'Espadas 🜁', title: '2 de Espadas — Paz', card: 'assets/Tarot_Cards/Minor_Arcana/Swords/2_of_Swords' },
                { suit: 'Discos 🜃', title: '2 de Discos — Mudança', card: 'assets/Tarot_Cards/Minor_Arcana/Disks/2_of_Disks' }
            ]
        },
        {
            id: 3, scale: '3', num: '3', name: 'Binah', heb: 'בינה', gematria: 67,
            meaning: 'Compreensão', pillar: 'Pilar da Severidade (Boaz)',
            godName: 'YHVH Elohim', archangel: 'Tzaphkiel', choir: 'Aralim (Tronos)',
            chakra: 'Shabbathai (♄ Saturno)',
            vision: 'Mulher madura, a Grande Mãe (Ama / Aima)',
            virtue: 'Silêncio', vice: 'Avareza / Inércia',
            weapons: 'Yoni, Taça, Manto Exterior da Ocultação', qliphoth: 'Satariel (Os Ocultadores)',
            scales: { atziluth: '#991b36', briah: '#17171c', yetzirah: '#3b241c', assiah: '#6b6468' },
            minors: [
                { suit: 'Paus 🜂', title: '3 de Paus — Virtude', card: 'assets/Tarot_Cards/Minor_Arcana/Wands/3_of_Wands' },
                { suit: 'Copas 🜄', title: '3 de Copas — Abundância', card: 'assets/Tarot_Cards/Minor_Arcana/Cups/3_of_Cups' },
                { suit: 'Espadas 🜁', title: '3 de Espadas — Dor', card: 'assets/Tarot_Cards/Minor_Arcana/Swords/3_of_Swords' },
                { suit: 'Discos 🜃', title: '3 de Discos — Trabalho', card: 'assets/Tarot_Cards/Minor_Arcana/Disks/3_of_Disks' }
            ]
        },
        {
            id: 'd', scale: '0', num: '—', name: 'Daath', heb: 'דעת', gematria: 474,
            meaning: 'Conhecimento (Não-Sephira)', pillar: 'Sobre o Abismo (Choronzon / Babalon)',
            godName: 'YHVH Elohim (reflexo no Abismo)', archangel: 'Uriel / Guardiões do Abismo', choir: 'Serpentes da Sabedoria',
            chakra: 'Ponte Invisível / Sirius–Plutão',
            vision: 'Cabeça de duas faces sobre o Deserto de Poeira',
            virtue: 'Desapego radical do Ego (Travessia do Abismo)', vice: 'Dispersão, Falso Conhecimento',
            weapons: 'Prisma Invisível, Máscara do Silêncio', qliphoth: 'Choronzon (333 — Dispersão)',
            scales: { atziluth: '#b19cd9', briah: '#8c869c', yetzirah: '#6d597a', assiah: '#4a4e69' },
            minors: []
        },
        {
            id: 4, scale: '4', num: '4', name: 'Chesed', heb: 'חסד', gematria: 72,
            meaning: 'Misericórdia (Gedulah)', pillar: 'Pilar da Misericórdia (Jachin)',
            godName: 'El (אל)', archangel: 'Tzadkiel', choir: 'Chasmalim (Brilhantes)',
            chakra: 'Tzedeq (♃ Júpiter)',
            vision: 'Poderoso Rei coroado e entronizado',
            virtue: 'Obediência', vice: 'Fanatismo, Hipocrisia, Tirania',
            weapons: 'Cetro, Bastão, Pirâmide Sólida, Esfera', qliphoth: 'Gha\'agsheblah (Os Devoradores)',
            scales: { atziluth: '#4c2a85', briah: '#1d4ed8', yetzirah: '#7c3aed', assiah: '#1e3a8a' },
            minors: [
                { suit: 'Paus 🜂', title: '4 de Paus — Conclusão', card: 'assets/Tarot_Cards/Minor_Arcana/Wands/4_of_Wands' },
                { suit: 'Copas 🜄', title: '4 de Copas — Luxúria', card: 'assets/Tarot_Cards/Minor_Arcana/Cups/4_of_Cups' },
                { suit: 'Espadas 🜁', title: '4 de Espadas — Trégua', card: 'assets/Tarot_Cards/Minor_Arcana/Swords/4_of_Swords' },
                { suit: 'Discos 🜃', title: '4 de Discos — Poder', card: 'assets/Tarot_Cards/Minor_Arcana/Disks/4_of_Disks' }
            ]
        },
        {
            id: 5, scale: '5', num: '5', name: 'Geburah', heb: 'גבורה', gematria: 216,
            meaning: 'Força / Severidade', pillar: 'Pilar da Severidade (Boaz)',
            godName: 'Elohim Gibor', archangel: 'Khamael', choir: 'Seraphim (Serpentes de Fogo)',
            chakra: 'Madim (♂ Marte)',
            vision: 'Poderoso Guerreiro em sua carruagem',
            virtue: 'Energia, Coragem', vice: 'Crueldade, Destruição',
            weapons: 'Espada, Lança, Flagelo, Buril', qliphoth: 'Golachab (Os Incendiários)',
            scales: { atziluth: '#ea580c', briah: '#dc2626', yetzirah: '#ef4444', assiah: '#991b1b' },
            minors: [
                { suit: 'Paus 🜂', title: '5 de Paus — Disputa', card: 'assets/Tarot_Cards/Minor_Arcana/Wands/5_of_Wands' },
                { suit: 'Copas 🜄', title: '5 de Copas — Desapontamento', card: 'assets/Tarot_Cards/Minor_Arcana/Cups/5_of_Cups' },
                { suit: 'Espadas 🜁', title: '5 de Espadas — Derrota', card: 'assets/Tarot_Cards/Minor_Arcana/Swords/5_of_Swords' },
                { suit: 'Discos 🜃', title: '5 de Discos — Preocupação', card: 'assets/Tarot_Cards/Minor_Arcana/Disks/5_of_Disks' }
            ]
        },
        {
            id: 6, scale: '6', num: '6', name: 'Tiphareth', heb: 'תפארת', gematria: 1081,
            meaning: 'Beleza / Harmonia', pillar: 'Pilar do Equilíbrio (Coração Solar)',
            godName: 'YHVH Eloah va-Daath', archangel: 'Raphael', choir: 'Malakim (Reis)',
            chakra: 'Shemesh (☉ Sol)',
            vision: 'Rei Majestoso, Criança, Deus Sacrificado',
            virtue: 'Devoção à Grande Obra', vice: 'Orgulho espiritual',
            weapons: 'Lamen, Rosa-Cruz, Cruz do Calvário', qliphoth: 'Thagirion (Os Litigantes)',
            scales: { atziluth: '#f472b6', briah: '#eab308', yetzirah: '#f59e0b', assiah: '#d97706' },
            minors: [
                { suit: 'Paus 🜂', title: '6 de Paus — Vitória', card: 'assets/Tarot_Cards/Minor_Arcana/Wands/6_of_Wands' },
                { suit: 'Copas 🜄', title: '6 de Copas — Prazer', card: 'assets/Tarot_Cards/Minor_Arcana/Cups/6_of_Cups' },
                { suit: 'Espadas 🜁', title: '6 de Espadas — Ciência', card: 'assets/Tarot_Cards/Minor_Arcana/Swords/6_of_Swords' },
                { suit: 'Discos 🜃', title: '6 de Discos — Sucesso', card: 'assets/Tarot_Cards/Minor_Arcana/Disks/6_of_Disks' }
            ]
        },
        {
            id: 7, scale: '7', num: '7', name: 'Netzach', heb: 'נצח', gematria: 148,
            meaning: 'Vitória / Eternidade', pillar: 'Pilar da Misericórdia (Jachin)',
            godName: 'YHVH Tzabaoth', archangel: 'Haniel', choir: 'Elohim (Deuses)',
            chakra: 'Nogah (♀ Vênus)',
            vision: 'Bela mulher desnuda',
            virtue: 'Altruísmo / Desapego', vice: 'Impudicícia, Luxúria egoísta',
            weapons: 'Lâmpada, Cinto, Rosa', qliphoth: 'A\'arab Zaraq (Corvos da Dispersão)',
            scales: { atziluth: '#fbbf24', briah: '#10b981', yetzirah: '#84cc16', assiah: '#65a30d' },
            minors: [
                { suit: 'Paus 🜂', title: '7 de Paus — Valor', card: 'assets/Tarot_Cards/Minor_Arcana/Wands/7_of_Wands' },
                { suit: 'Copas 🜄', title: '7 de Copas — Deboche', card: 'assets/Tarot_Cards/Minor_Arcana/Cups/7_of_Cups' },
                { suit: 'Espadas 🜁', title: '7 de Espadas — Futilidade', card: 'assets/Tarot_Cards/Minor_Arcana/Swords/7_of_Swords' },
                { suit: 'Discos 🜃', title: '7 de Discos — Fracasso', card: 'assets/Tarot_Cards/Minor_Arcana/Disks/7_of_Disks' }
            ]
        },
        {
            id: 8, scale: '8', num: '8', name: 'Hod', heb: 'הוד', gematria: 15,
            meaning: 'Esplendor / Glória', pillar: 'Pilar da Severidade (Boaz)',
            godName: 'Elohim Tzabaoth', archangel: 'Michael', choir: 'Beni Elohim (Filhos dos Deuses)',
            chakra: 'Kokab (☿ Mercúrio)',
            vision: 'Um Hermafrodita',
            virtue: 'Veracidade', vice: 'Falsidade, Desonestidade',
            weapons: 'Nomes, Versículos e Avental', qliphoth: 'Samael (Veneno de Deus)',
            scales: { atziluth: '#8b5cf6', briah: '#f97316', yetzirah: '#b45309', assiah: '#78350f' },
            minors: [
                { suit: 'Paus 🜂', title: '8 de Paus — Rapidez', card: 'assets/Tarot_Cards/Minor_Arcana/Wands/8_of_Wands' },
                { suit: 'Copas 🜄', title: '8 de Copas — Indolência', card: 'assets/Tarot_Cards/Minor_Arcana/Cups/8_of_Cups' },
                { suit: 'Espadas 🜁', title: '8 de Espadas — Interferência', card: 'assets/Tarot_Cards/Minor_Arcana/Swords/8_of_Swords' },
                { suit: 'Discos 🜃', title: '8 de Discos — Prudência', card: 'assets/Tarot_Cards/Minor_Arcana/Disks/8_of_Disks' }
            ]
        },
        {
            id: 9, scale: '9', num: '9', name: 'Yesod', heb: 'יסוד', gematria: 80,
            meaning: 'Fundamento', pillar: 'Pilar do Equilíbrio (Esfera Astral)',
            godName: 'Shaddai El Chai', archangel: 'Gabriel', choir: 'Kerubim (Os Fortes)',
            chakra: 'Levanah (☽ Lua)',
            vision: 'Belo homem nu, muito forte',
            virtue: 'Independência', vice: 'Preguiça, Ilusão Astral',
            weapons: 'Perfumes e Sandálias', qliphoth: 'Gamaliel (Os Obscenos)',
            scales: { atziluth: '#4338ca', briah: '#7e22ce', yetzirah: '#4c1d95', assiah: '#fef08a' },
            minors: [
                { suit: 'Paus 🜂', title: '9 de Paus — Força', card: 'assets/Tarot_Cards/Minor_Arcana/Wands/9_of_Wands' },
                { suit: 'Copas 🜄', title: '9 de Copas — Felicidade', card: 'assets/Tarot_Cards/Minor_Arcana/Cups/9_of_Cups' },
                { suit: 'Espadas 🜁', title: '9 de Espadas — Crueldade', card: 'assets/Tarot_Cards/Minor_Arcana/Swords/9_of_Swords' },
                { suit: 'Discos 🜃', title: '9 de Discos — Ganho', card: 'assets/Tarot_Cards/Minor_Arcana/Disks/9_of_Disks' }
            ]
        },
        {
            id: 10, scale: '10', num: '10', name: 'Malkuth', heb: 'מלכות', gematria: 496,
            meaning: 'O Reino', pillar: 'Pilar do Equilíbrio (Manifestação)',
            godName: 'Adonai ha-Aretz', archangel: 'Sandalphon', choir: 'Ashim (Almas de Fogo)',
            chakra: 'Cholem Yesodoth (Esfera dos Elementos / Terra)',
            vision: 'Jovem mulher coroada e velada em um trono',
            virtue: 'Discriminação / Discernimento', vice: 'Avareza, Inércia material',
            weapons: 'Círculo Mágico, Triângulo da Arte, Altar de Cubo Duplo', qliphoth: 'Lilith / Nahemoth',
            scales: { atziluth: '#eab308', briah: 'quartered', yetzirah: 'quartered', assiah: '#111115' },
            minors: [
                { suit: 'Paus 🜂', title: '10 de Paus — Opressão', card: 'assets/Tarot_Cards/Minor_Arcana/Wands/10_of_Wands' },
                { suit: 'Copas 🜄', title: '10 de Copas — Saciedade', card: 'assets/Tarot_Cards/Minor_Arcana/Cups/10_of_Cups' },
                { suit: 'Espadas 🜁', title: '10 de Espadas — Ruína', card: 'assets/Tarot_Cards/Minor_Arcana/Swords/10_of_Swords' },
                { suit: 'Discos 🜃', title: '10 de Discos — Riqueza', card: 'assets/Tarot_Cards/Minor_Arcana/Disks/10_of_Disks' }
            ]
        }
    ];

    const PATHS = [
        { num: 11, pair: [1, 2],  heb: 'א', letter: 'Aleph',  gematria: 1,   meaning: 'Boi',          attrib: '🜁 Ar (Letra Mãe)',           thoth: '0 — O Louco',        gd: '0 — O Louco',             file: 'The_Fool',        scales: { atziluth: '#fef08a', briah: '#60a5fa', yetzirah: '#10b981', assiah: '#fde047' } },
        { num: 12, pair: [1, 3],  heb: 'ב', letter: 'Beth',   gematria: 2,   meaning: 'Casa',         attrib: '☿ Mercúrio (Letra Dupla)',   thoth: 'I — O Mago',         gd: 'I — O Mago',              file: 'The_Magus',       scales: { atziluth: '#facc15', briah: '#a855f7', yetzirah: '#9ca3af', assiah: '#c4b5fd' } },
        { num: 13, pair: [1, 6],  heb: 'ג', letter: 'Gimel',  gematria: 3,   meaning: 'Camelo',       attrib: '☽ Lua (Letra Dupla)',        thoth: 'II — A Sacerdotisa', gd: 'II — A Sacerdotisa',      file: 'The_Priestess',   scales: { atziluth: '#3b82f6', briah: '#cbd5e1', yetzirah: '#bfdbfe', assiah: '#e2e8f0' } },
        { num: 14, pair: [2, 3],  heb: 'ד', letter: 'Daleth', gematria: 4,   meaning: 'Porta',        attrib: '♀ Vênus (Letra Dupla)',      thoth: 'III — A Imperatriz', gd: 'III — A Imperatriz',      file: 'The_Empress',     scales: { atziluth: '#10b981', briah: '#38bdf8', yetzirah: '#4ade80', assiah: '#fda4af' } },
        { num: 15, pair: [2, 6],  heb: 'ה', letter: 'Heh',    gematria: 5,   meaning: 'Janela',       attrib: '♈ Áries (Em Liber AL: Aquário/Estrela)', thoth: 'IV — O Imperador (ou XVII em Liber AL)', gd: 'IV — O Imperador', file: 'The_Emperor', scales: { atziluth: '#ef4444', briah: '#dc2626', yetzirah: '#f97316', assiah: '#fbbf24' } },
        { num: 16, pair: [2, 4],  heb: 'ו', letter: 'Vav',    gematria: 6,   meaning: 'Prego / Elo',  attrib: '♉ Touro (Letra Simples)',    thoth: 'V — O Hierofante',   gd: 'V — O Hierofante',        file: 'The_Hierophant',  scales: { atziluth: '#ea580c', briah: '#4338ca', yetzirah: '#78350f', assiah: '#9a3412' } },
        { num: 17, pair: [3, 6],  heb: 'ז', letter: 'Zain',   gematria: 7,   meaning: 'Espada',       attrib: '♊ Gêmeos (Letra Simples)',   thoth: 'VI — Os Amantes',    gd: 'VI — Os Amantes',         file: 'The_Lovers',      scales: { atziluth: '#fb923c', briah: '#c4b5fd', yetzirah: '#fde68a', assiah: '#cbd5e1' } },
        { num: 18, pair: [3, 5],  heb: 'ח', letter: 'Cheth',  gematria: 8,   meaning: 'Cerca / Graal',attrib: '♋ Câncer (Letra Simples)',   thoth: 'VII — O Carro',      gd: 'VII — O Carro',           file: 'The_Chariot',     scales: { atziluth: '#f59e0b', briah: '#991b1b', yetzirah: '#b45309', assiah: '#fcd34d' } },
        { num: 19, pair: [4, 5],  heb: 'ט', letter: 'Teth',   gematria: 9,   meaning: 'Serpente',     attrib: '♌ Leão (Letra Simples)',     thoth: 'XI — A Luxúria',     gd: 'VIII — A Força',          file: 'The_Lust',        scales: { atziluth: '#fde047', briah: '#7e22ce', yetzirah: '#9ca3af', assiah: '#f59e0b' } },
        { num: 20, pair: [4, 6],  heb: 'י', letter: 'Yod',    gematria: 10,  meaning: 'Mão',          attrib: '♍ Virgem (Letra Simples)',   thoth: 'IX — O Eremita',     gd: 'IX — O Eremita',          file: 'The_Hermit',      scales: { atziluth: '#84cc16', briah: '#64748b', yetzirah: '#4d7c0f', assiah: '#581c87' } },
        { num: 21, pair: [4, 7],  heb: 'כ', letter: 'Kaph',   gematria: 20,  meaning: 'Palma da Mão', attrib: '♃ Júpiter (Letra Dupla)',    thoth: 'X — A Fortuna',      gd: 'X — A Roda da Fortuna',   file: 'The_Fortune',     scales: { atziluth: '#8b5cf6', briah: '#2563eb', yetzirah: '#6d28d9', assiah: '#60a5fa' } },
        { num: 22, pair: [5, 6],  heb: 'ל', letter: 'Lamed',  gematria: 30,  meaning: 'Aguilhão',     attrib: '♎ Libra (Letra Simples)',    thoth: 'VIII — O Ajuste',    gd: 'XI — A Justiça',          file: 'The_Adjustment',  scales: { atziluth: '#10b981', briah: '#1d4ed8', yetzirah: '#047857', assiah: '#6ee7b7' } },
        { num: 23, pair: [5, 8],  heb: 'מ', letter: 'Mem',    gematria: 40,  meaning: 'Água',         attrib: '🜄 Água (Letra Mãe)',         thoth: 'XII — O Enforcado',  gd: 'XII — O Enforcado',       file: 'The_Hanged_Man',  scales: { atziluth: '#1d4ed8', briah: '#0f766e', yetzirah: '#65a30d', assiah: '#e2e8f0' } },
        { num: 24, pair: [6, 7],  heb: 'נ', letter: 'Nun',    gematria: 50,  meaning: 'Peixe',        attrib: '♏ Escorpião (Letra Simples)',thoth: 'XIII — A Morte',     gd: 'XIII — A Morte',          file: 'The_Death',       scales: { atziluth: '#0d9488', briah: '#78350f', yetzirah: '#451a03', assiah: '#1e293b' } },
        { num: 25, pair: [6, 9],  heb: 'ס', letter: 'Samekh', gematria: 60,  meaning: 'Esteio / Arco',attrib: '♐ Sagitário (Letra Simples)',thoth: 'XIV — A Arte',       gd: 'XIV — A Temperança',      file: 'The_Art',         scales: { atziluth: '#2563eb', briah: '#eab308', yetzirah: '#16a34a', assiah: '#1e40af' } },
        { num: 26, pair: [6, 8],  heb: 'ע', letter: 'Ayin',   gematria: 70,  meaning: 'Olho',         attrib: '♑ Capricórnio (Letra Simples)',thoth: 'XV — O Diabo',     gd: 'XV — O Diabo',            file: 'The_Devil',       scales: { atziluth: '#312e81', briah: '#18181b', yetzirah: '#334155', assiah: '#52525b' } },
        { num: 27, pair: [7, 8],  heb: 'פ', letter: 'Peh',    gematria: 80,  meaning: 'Boca',         attrib: '♂ Marte (Letra Dupla)',      thoth: 'XVI — A Torre',      gd: 'XVI — A Torre',           file: 'The_Tower',       scales: { atziluth: '#dc2626', briah: '#ef4444', yetzirah: '#b91c1c', assiah: '#f87171' } },
        { num: 28, pair: [7, 9],  heb: 'צ', letter: 'Tzaddi', gematria: 90,  meaning: 'Anzol',        attrib: '♒ Aquário (Em Liber AL: Imperador)', thoth: 'XVII — A Estrela (ou IV em Liber AL)', gd: 'XVII — A Estrela', file: 'The_Star', scales: { atziluth: '#9333ea', briah: '#7dd3fc', yetzirah: '#c084fc', assiah: '#f8fafc' } },
        { num: 29, pair: [7, 10], heb: 'ק', letter: 'Qoph',   gematria: 100, meaning: 'Nuca',         attrib: '♓ Peixes (Letra Simples)',   thoth: 'XVIII — A Lua',      gd: 'XVIII — A Lua',           file: 'The_Moon',        scales: { atziluth: '#881337', briah: '#fde68a', yetzirah: '#a8a29e', assiah: '#d6d3d1' } },
        { num: 30, pair: [8, 9],  heb: 'ר', letter: 'Resh',   gematria: 200, meaning: 'Cabeça',       attrib: '☉ Sol (Letra Dupla)',        thoth: 'XIX — O Sol',        gd: 'XIX — O Sol',             file: 'The_Sun',         scales: { atziluth: '#f97316', briah: '#facc15', yetzirah: '#f59e0b', assiah: '#fbbf24' } },
        { num: 31, pair: [8, 10], heb: 'ש', letter: 'Shin',   gematria: 300, meaning: 'Dente / Fogo', attrib: '🜂 Fogo / Espírito (Letra Mãe)',thoth: 'XX — O Éon',       gd: 'XX — O Julgamento',       file: 'The_Aeon',        scales: { atziluth: '#ef4444', briah: '#ea580c', yetzirah: '#f87171', assiah: '#dc2626' } },
        { num: 32, pair: [9, 10], heb: 'ת', letter: 'Tav',    gematria: 400, meaning: 'Cruz Tau',     attrib: '♄ Saturno / 🜃 Terra (Dupla)',thoth: 'XXI — O Universo',   gd: 'XXI — O Mundo',           file: 'The_Universe',    scales: { atziluth: '#3730a3', briah: '#09090b', yetzirah: '#1e1b4b', assiah: '#27272a' } }
    ];

    function createSvgEl(tag, attrs = {}) {
        const el = document.createElementNS(SVG_NS, tag);
        for (const [k, v] of Object.entries(attrs)) {
            el.setAttribute(k, String(v));
        }
        return el;
    }

    function srgbLum(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const f = c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    }

    function bestContrastText(hex) {
        if (!hex || !hex.startsWith('#') || hex.length < 7) return '#ffffff';
        const lBg = srgbLum(hex);
        const lDark = srgbLum('#070709');
        const lLight = 1.0;
        const cDark = (Math.max(lBg, lDark) + 0.05) / (Math.min(lBg, lDark) + 0.05);
        const cLight = (Math.max(lBg, lLight) + 0.05) / (Math.min(lBg, lLight) + 0.05);
        return cDark > cLight ? '#070709' : '#ffffff';
    }

    document.addEventListener('DOMContentLoaded', () => {
        const svg = document.getElementById('etzChaimSvg');
        const svgWrap = document.getElementById('treeSvgWrap');
        const loupe = document.getElementById('treeLoupe');
        const loupeSvg = document.getElementById('treeLoupeSvg');
        const zoomInBtn = document.getElementById('treeZoomInBtn');
        const zoomOutBtn = document.getElementById('treeZoomOutBtn');
        const zoomResetBtn = document.getElementById('treeZoomResetBtn');
        const zoomReadout = document.getElementById('treeZoomReadout');
        const loupeToggleBtn = document.getElementById('treeLoupeToggleBtn');
        const inspectorContent = document.getElementById('treeInspectorContent');
        const jumpSelect = document.getElementById('treeJumpSelect');
        const prevBtn = document.getElementById('treePrevBtn');
        const nextBtn = document.getElementById('treeNextBtn');
        const worldIndicator = document.getElementById('treeWorldIndicator');
        const lockIndicator = document.getElementById('treeLockIndicator');

        if (!svg || !inspectorContent) return;

        const BASE_VB = { x: 70, y: 2, w: 680, h: 1054 };

        const state = {
            world: localStorage.getItem('fo_tree_world') || 'briah',
            layers: {
                daath: localStorage.getItem('fo_tree_daath') !== 'false',
                veils: true,
                pillars: true,
                sword: false
            },
            selectedKey: 'node:6',
            locked: false,
            zoom: 1,
            vb: { ...BASE_VB },
            loupeEnabled: false
        };

        function getNavigableItems() {
            const nodes = SEPHIROTH.filter(n => state.layers.daath || n.id !== 'd')
                .map(n => ({ key: `node:${n.id}`, label: `${n.num === '—' ? 'Daath' : n.num + '. ' + n.name} (${n.meaning})`, type: 'node', data: n }));
            const paths = PATHS.map(p => ({ key: `path:${p.num}`, label: `Caminho ${p.num} — ${p.letter} (${p.thoth})`, type: 'path', data: p }));
            return [...nodes, ...paths];
        }

        function populateJumpSelect() {
            const items = getNavigableItems();
            const nodeOpts = items.filter(i => i.type === 'node').map(i => `<option value="${i.key}">${i.label}</option>`).join('');
            const pathOpts = items.filter(i => i.type === 'path').map(i => `<option value="${i.key}">${i.label}</option>`).join('');
            jumpSelect.innerHTML = `
                <optgroup label="Sephiroth">${nodeOpts}</optgroup>
                <optgroup label="22 Caminhos (Letras &amp; Arcanos)">${pathOpts}</optgroup>
            `;
            jumpSelect.value = state.selectedKey;
        }

        function resolveColor(scalesObj) {
            if (state.world === 'noir') return '#d4d4d8';
            return scalesObj[state.world] || scalesObj.briah;
        }

        function drawTree() {
            while (svg.firstChild) svg.removeChild(svg.firstChild);

            const defs = createSvgEl('defs');
            const clipMalkuth = createSvgEl('clipPath', { id: 'malkuthClip' });
            clipMalkuth.appendChild(createSvgEl('circle', { cx: POS[10].x, cy: POS[10].y, r: 31 }));
            defs.appendChild(clipMalkuth);
            svg.appendChild(defs);

            // 1. Three Negative Veils
            if (state.layers.veils) {
                const veils = [
                    { r: 105, label: 'Ain Soph Aur' },
                    { r: 145, label: 'Ain Soph' },
                    { r: 185, label: 'Ain' }
                ];
                veils.forEach(v => {
                    svg.appendChild(createSvgEl('path', {
                        d: `M ${POS[1].x - v.r} ${POS[1].y + 10} A ${v.r} ${v.r * 0.62} 0 0 1 ${POS[1].x + v.r} ${POS[1].y + 10}`,
                        class: 'veil-arc'
                    }));
                    const txt = createSvgEl('text', {
                        x: POS[1].x,
                        y: POS[1].y - v.r * 0.62 + 6,
                        class: 'veil-label'
                    });
                    txt.textContent = v.label;
                    svg.appendChild(txt);
                });
            }

            // 2. Three Pillars
            if (state.layers.pillars) {
                const pillarDefs = [
                    { x: 215, top: 190, bottom: 770, name: 'Severidade · Boaz' },
                    { x: 410, top: 80,  bottom: 1020, name: 'Equilíbrio' },
                    { x: 605, top: 190, bottom: 770, name: 'Misericórdia · Jachin' }
                ];
                pillarDefs.forEach(p => {
                    svg.appendChild(createSvgEl('line', { x1: p.x, y1: p.top, x2: p.x, y2: p.bottom, class: 'pillar-line' }));
                    const lbl = createSvgEl('text', { x: p.x, y: p.bottom + 24, class: 'pillar-title' });
                    lbl.textContent = p.name;
                    svg.appendChild(lbl);
                });
            }

            if (state.layers.daath) {
                svg.appendChild(createSvgEl('line', { x1: 145, y1: 345, x2: 675, y2: 345, class: 'abyss-veil' }));
            }

            // 3. Twenty-Two Paths
            PATHS.forEach(path => {
                const p1 = POS[path.pair[0]];
                const p2 = POS[path.pair[1]];
                const mx = (p1.x + p2.x) * 0.5;
                const my = (p1.y + p2.y) * 0.5;
                const key = `path:${path.num}`;

                let bx = mx;
                let by = my;
                if (path.num === 13) by = 204; // Cleanly between Kether subtitle (174) and Daleth badge (245)
                if (path.num === 14) by = my;
                if (path.num === 25) by = 674; // Cleanly above Peh badge (710)

                const g = createSvgEl('g', {
                    class: 'tree-path-group',
                    'data-key': key,
                    'data-a': path.pair[0],
                    'data-b': path.pair[1]
                });

                const pathColor = state.world === 'noir' ? '#71717a' : resolveColor(path.scales);

                g.appendChild(createSvgEl('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, class: 'tree-path-hit' }));
                g.appendChild(createSvgEl('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, class: 'tree-path-outer' }));
                g.appendChild(createSvgEl('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, class: 'tree-path-core', stroke: pathColor }));

                g.appendChild(createSvgEl('circle', { cx: bx, cy: by, r: 10.5, class: 'tree-path-badge' }));
                const hebTxt = createSvgEl('text', { x: bx, y: by, class: 'tree-path-heb' });
                hebTxt.textContent = path.heb;
                g.appendChild(hebTxt);

                g.addEventListener('mouseenter', () => {
                    if (!state.locked) selectEntity(key, false);
                });
                g.addEventListener('click', (e) => {
                    if (didPanDrag) return;
                    e.stopPropagation();
                    selectEntity(key, true);
                });

                svg.appendChild(g);
            });

            // 4. Flaming Sword
            if (state.layers.sword) {
                const seq = state.layers.daath ? [1, 2, 3, 'd', 4, 5, 6, 7, 8, 9, 10] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                const pts = seq.map(id => `${POS[id].x},${POS[id].y}`).join(' ');
                svg.appendChild(createSvgEl('polyline', { points: pts, class: 'flaming-sword' }));
            }

            // 5. Sephiroth Nodes
            const nodesToDraw = SEPHIROTH.filter(n => state.layers.daath || n.id !== 'd');
            nodesToDraw.forEach(node => {
                const pos = POS[node.id];
                const r = node.id === 'd' ? 23 : 31;
                const key = `node:${node.id}`;
                const g = createSvgEl('g', {
                    class: `tree-node-group ${node.id === 'd' ? 'tree-node-daath' : ''}`,
                    'data-key': key,
                    'data-node-id': node.id
                });

                g.appendChild(createSvgEl('circle', { cx: pos.x, cy: pos.y, r: r + 5.5, class: 'tree-node-halo' }));

                const fillVal = resolveColor(node.scales);
                if (fillVal === 'quartered' && node.id === 10) {
                    const qGroup = createSvgEl('g', { 'clip-path': 'url(#malkuthClip)' });
                    const cx = pos.x, cy = pos.y, s = 44;
                    qGroup.appendChild(createSvgEl('polygon', { points: `${cx},${cy} ${cx - s},${cy - s} ${cx + s},${cy - s}`, fill: '#d4b830' }));
                    qGroup.appendChild(createSvgEl('polygon', { points: `${cx},${cy} ${cx - s},${cy - s} ${cx - s},${cy + s}`, fill: '#556b2f' }));
                    qGroup.appendChild(createSvgEl('polygon', { points: `${cx},${cy} ${cx + s},${cy - s} ${cx + s},${cy + s}`, fill: '#7f3b21' }));
                    qGroup.appendChild(createSvgEl('polygon', { points: `${cx},${cy} ${cx - s},${cy + s} ${cx + s},${cy + s}`, fill: '#0b0b0e' }));
                    g.appendChild(qGroup);
                    g.appendChild(createSvgEl('circle', { cx: pos.x, cy: pos.y, r: 15.5, fill: 'rgba(5, 5, 9, 0.82)', stroke: 'rgba(255, 255, 255, 0.35)', 'stroke-width': '0.9' }));
                    g.appendChild(createSvgEl('circle', { cx: pos.x, cy: pos.y, r, fill: 'none', class: 'tree-node-sphere' }));
                } else {
                    const actualFill = state.world === 'noir'
                        ? (node.id === 1 ? '#f4f4f5' : node.id === 3 || node.id === 10 ? '#09090b' : '#18181b')
                        : fillVal;
                    g.appendChild(createSvgEl('circle', { cx: pos.x, cy: pos.y, r, fill: actualFill, class: 'tree-node-sphere' }));
                }

                const textFill = state.world === 'noir'
                    ? (node.id === 1 ? '#070709' : '#ffffff')
                    : (fillVal === 'quartered' ? '#ffffff' : bestContrastText(fillVal));
                const textHalo = textFill === '#ffffff' ? 'rgba(3, 3, 6, 0.52)' : 'rgba(255, 255, 255, 0.35)';

                const hebEl = createSvgEl('text', {
                    x: pos.x,
                    y: pos.y + 1,
                    class: 'tree-node-heb',
                    fill: textFill,
                    stroke: textHalo,
                    'stroke-width': '2',
                    'paint-order': 'stroke'
                });
                hebEl.textContent = node.heb;
                g.appendChild(hebEl);

                const titleEl = createSvgEl('text', { x: pos.x, y: pos.y - r - 12, class: 'tree-node-title' });
                titleEl.textContent = node.num === '—' ? 'Daath' : `${node.num}. ${node.name}`;
                g.appendChild(titleEl);

                const subEl = createSvgEl('text', { x: pos.x, y: pos.y + r + 18, class: 'tree-node-sub' });
                subEl.textContent = node.meaning.split('/')[0].trim();
                g.appendChild(subEl);

                g.addEventListener('mouseenter', () => {
                    if (!state.locked) selectEntity(key, false);
                });
                g.addEventListener('click', (e) => {
                    if (didPanDrag) return;
                    e.stopPropagation();
                    selectEntity(key, true);
                });

                svg.appendChild(g);
            });

            applySelectionHighlights();
            syncLoupeMarkup();
        }

        let didPanDrag = false;

        svg.addEventListener('click', (e) => {
            if (didPanDrag) {
                e.stopPropagation();
                return;
            }
            if (state.locked) {
                state.locked = false;
                updateLockLabel();
                applySelectionHighlights();
            }
        });

        function updateLockLabel() {
            lockIndicator.textContent = state.locked
                ? 'Fixado · Clique no fundo para liberar'
                : 'Passe o cursor ou clique para fixar';
        }

        function selectEntity(key, lock = false) {
            state.selectedKey = key;
            if (lock) state.locked = true;
            updateLockLabel();
            if (jumpSelect) jumpSelect.value = key;
            applySelectionHighlights();
            if (state.loupeEnabled) syncLoupeMarkup();
            renderInspector(key);
        }

        function applySelectionHighlights() {
            const pathGroups = svg.querySelectorAll('.tree-path-group');
            const nodeGroups = svg.querySelectorAll('.tree-node-group');

            pathGroups.forEach(el => el.classList.remove('is-selected', 'is-dimmed'));
            nodeGroups.forEach(el => el.classList.remove('is-selected', 'is-dimmed'));

            if (!state.selectedKey) return;
            const [kind, rawId] = state.selectedKey.split(':');

            if (kind === 'node') {
                const targetId = rawId === 'd' ? 'd' : Number(rawId);
                const connectedNodes = new Set([String(targetId)]);

                pathGroups.forEach(pg => {
                    const a = Number(pg.getAttribute('data-a'));
                    const b = Number(pg.getAttribute('data-b'));
                    if (a === targetId || b === targetId) {
                        pg.classList.add('is-selected');
                        connectedNodes.add(String(a));
                        connectedNodes.add(String(b));
                    } else if (state.locked) {
                        pg.classList.add('is-dimmed');
                    }
                });

                nodeGroups.forEach(ng => {
                    const nid = ng.getAttribute('data-node-id');
                    if (nid === String(targetId)) {
                        ng.classList.add('is-selected');
                    } else if (state.locked && !connectedNodes.has(nid)) {
                        ng.classList.add('is-dimmed');
                    }
                });
            } else if (kind === 'path') {
                const pathNum = Number(rawId);
                const pathObj = PATHS.find(p => p.num === pathNum);
                if (!pathObj) return;
                const [pa, pb] = pathObj.pair.map(String);

                pathGroups.forEach(pg => {
                    if (pg.getAttribute('data-key') === state.selectedKey) {
                        pg.classList.add('is-selected');
                    } else if (state.locked) {
                        pg.classList.add('is-dimmed');
                    }
                });

                nodeGroups.forEach(ng => {
                    const nid = ng.getAttribute('data-node-id');
                    if (nid === pa || nid === pb) {
                        ng.classList.add('is-selected');
                    } else if (state.locked) {
                        ng.classList.add('is-dimmed');
                    }
                });
            }
        }

        function swatchBg(val) {
            if (val === 'quartered') {
                return 'linear-gradient(90deg, #d4b830 0% 25%, #556b2f 25% 50%, #7f3b21 50% 75%, #0b0b0e 75% 100%)';
            }
            return val;
        }

        function renderInspector(key) {
            const [kind, rawId] = key.split(':');

            if (kind === 'node') {
                const node = SEPHIROTH.find(n => String(n.id) === rawId);
                if (!node) return;

                const minorHtml = node.minors.length > 0
                    ? `
                        <div class="insp-section-title">Arcanos Menores Regidos (Tarot de Thoth)</div>
                        <div class="insp-minor-grid">
                            ${node.minors.map(m => `
                                <a class="insp-minor-link" href="/thoth/card-detail.html?card=${encodeURIComponent(m.card)}&name=${encodeURIComponent(m.title)}">
                                    <div style="font-family:var(--fo-mono);font-size:0.66rem;color:var(--fo-gold);">${m.suit}</div>
                                    <div>${m.title}</div>
                                </a>
                            `).join('')}
                        </div>
                    `
                    : '';

                inspectorContent.innerHTML = `
                    <div class="insp-head">
                        <div>
                            <div class="insp-kicker">Sephira · Escala ${node.scale}</div>
                            <h2 class="insp-title">${node.num === '—' ? 'Daath' : `${node.num}. ${node.name}`}</h2>
                            <div class="insp-meaning">${node.meaning} · ${node.pillar}</div>
                        </div>
                        <div class="insp-hebrew-box">
                            <span class="insp-hebrew-glyph">${node.heb}</span>
                            <span class="insp-gematria">Gematria ${node.gematria}</span>
                        </div>
                    </div>

                    <div class="insp-scales-strip">
                        <div class="scale-swatch-card"><div class="scale-swatch-bar" style="background:${swatchBg(node.scales.atziluth)}"></div><span class="scale-swatch-lbl">Atziluth</span></div>
                        <div class="scale-swatch-card"><div class="scale-swatch-bar" style="background:${swatchBg(node.scales.briah)}"></div><span class="scale-swatch-lbl">Briah</span></div>
                        <div class="scale-swatch-card"><div class="scale-swatch-bar" style="background:${swatchBg(node.scales.yetzirah)}"></div><span class="scale-swatch-lbl">Yetzirah</span></div>
                        <div class="scale-swatch-card"><div class="scale-swatch-bar" style="background:${swatchBg(node.scales.assiah)}"></div><span class="scale-swatch-lbl">Assiah</span></div>
                    </div>

                    <div class="insp-section-title">Hierarquia dos Quatro Mundos</div>
                    <div class="insp-kv-list">
                        <div class="insp-kv-row"><span class="insp-kv-key">Nome Divino (Atziluth)</span><span class="insp-kv-val">${node.godName}</span></div>
                        <div class="insp-kv-row"><span class="insp-kv-key">Arcanjo (Briah)</span><span class="insp-kv-val">${node.archangel}</span></div>
                        <div class="insp-kv-row"><span class="insp-kv-key">Coro Angélico (Yetzirah)</span><span class="insp-kv-val">${node.choir}</span></div>
                        <div class="insp-kv-row"><span class="insp-kv-key">Esfera / Astro (Assiah)</span><span class="insp-kv-val">${node.chakra}</span></div>
                    </div>

                    <div class="insp-section-title">Simbolismo Mágico &amp; Ético (Liber 777)</div>
                    <div class="insp-kv-list">
                        <div class="insp-kv-row"><span class="insp-kv-key">Imagem Mágica</span><span class="insp-kv-val">${node.vision}</span></div>
                        <div class="insp-kv-row"><span class="insp-kv-key">Virtude</span><span class="insp-kv-val">${node.virtue}</span></div>
                        <div class="insp-kv-row"><span class="insp-kv-key">Vício</span><span class="insp-kv-val">${node.vice}</span></div>
                        <div class="insp-kv-row"><span class="insp-kv-key">Armas &amp; Símbolos</span><span class="insp-kv-val">${node.weapons}</span></div>
                        <div class="insp-kv-row"><span class="insp-kv-key">Casca Qliphótica</span><span class="insp-kv-val">${node.qliphoth}</span></div>
                    </div>

                    ${minorHtml}

                    <div class="insp-actions-row">
                        <a href="/apis/777/?scale=${encodeURIComponent(node.scale)}" class="fo-btn">Cruzar Escala ${node.scale} no Liber 777 →</a>
                    </div>
                `;
            } else if (kind === 'path') {
                const path = PATHS.find(p => p.num === Number(rawId));
                if (!path) return;
                const nA = SEPHIROTH.find(s => s.id === path.pair[0]);
                const nB = SEPHIROTH.find(s => s.id === path.pair[1]);
                const cardParam = `assets/Tarot_Cards/Major_Arcana/${path.file}`;
                const imgSrc = `/assets/Tarot_Cards/Major_Arcana/${path.file}.webp`;
                const detailHref = `/thoth/card-detail.html?card=${encodeURIComponent(cardParam)}&name=${encodeURIComponent(path.thoth)}`;

                inspectorContent.innerHTML = `
                    <div class="insp-head">
                        <div>
                            <div class="insp-kicker">Caminho ${path.num} · Entre ${nA.name} e ${nB.name}</div>
                            <h2 class="insp-title">${path.letter} — ${path.thoth}</h2>
                            <div class="insp-meaning">Significado da Letra: "${path.meaning}"</div>
                        </div>
                        <div class="insp-hebrew-box">
                            <span class="insp-hebrew-glyph">${path.heb}</span>
                            <span class="insp-gematria">Valor ${path.gematria}</span>
                        </div>
                    </div>

                    <div class="insp-scales-strip">
                        <div class="scale-swatch-card"><div class="scale-swatch-bar" style="background:${path.scales.atziluth}"></div><span class="scale-swatch-lbl">Atziluth</span></div>
                        <div class="scale-swatch-card"><div class="scale-swatch-bar" style="background:${path.scales.briah}"></div><span class="scale-swatch-lbl">Briah</span></div>
                        <div class="scale-swatch-card"><div class="scale-swatch-bar" style="background:${path.scales.yetzirah}"></div><span class="scale-swatch-lbl">Yetzirah</span></div>
                        <div class="scale-swatch-card"><div class="scale-swatch-bar" style="background:${path.scales.assiah}"></div><span class="scale-swatch-lbl">Assiah</span></div>
                    </div>

                    <div class="insp-section-title">Correspondências do Caminho</div>
                    <div class="insp-kv-list">
                        <div class="insp-kv-row"><span class="insp-kv-key">Conecta</span><span class="insp-kv-val">${nA.num}. ${nA.name} ↔ ${nB.num}. ${nB.name}</span></div>
                        <div class="insp-kv-row"><span class="insp-kv-key">Regência / Elemento</span><span class="insp-kv-val">${path.attrib}</span></div>
                        <div class="insp-kv-row"><span class="insp-kv-key">Atribuição Thoth</span><span class="insp-kv-val">${path.thoth}</span></div>
                        <div class="insp-kv-row"><span class="insp-kv-key">Atribuição Golden Dawn</span><span class="insp-kv-val">${path.gd}</span></div>
                    </div>

                    <div class="insp-section-title">Arcano Maior Correspondente</div>
                    <div class="insp-tarot-card">
                        <img src="${imgSrc}" alt="${path.thoth}" class="insp-tarot-thumb" loading="lazy">
                        <div class="insp-tarot-info">
                            <div class="insp-tarot-name">${path.thoth}</div>
                            <div class="insp-tarot-gd">Caminho ${path.num} · Letra ${path.letter} (${path.heb})</div>
                            <a href="${detailHref}" class="fo-btn fo-btn-gold" style="margin-top:0.35rem;padding:0.42rem 0.8rem;font-size:0.7rem;">Ler Estudo Completo da Carta →</a>
                        </div>
                    </div>

                    <div class="insp-actions-row">
                        <a href="/apis/777/?scale=${path.num}" class="fo-btn">Cruzar Escala ${path.num} no Liber 777 →</a>
                    </div>
                `;
            }
        }

        // World Switcher
        document.querySelectorAll('.world-pill').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.world === state.world);
            btn.addEventListener('click', () => {
                state.world = btn.dataset.world;
                localStorage.setItem('fo_tree_world', state.world);
                document.querySelectorAll('.world-pill').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                worldIndicator.textContent = WORLD_META[state.world]?.title || '';
                drawTree();
            });
        });
        worldIndicator.textContent = WORLD_META[state.world]?.title || '';

        // Layer Toggles
        document.querySelectorAll('.layer-toggle').forEach(btn => {
            const layer = btn.dataset.layer;
            btn.classList.toggle('is-on', !!state.layers[layer]);
            btn.addEventListener('click', () => {
                state.layers[layer] = !state.layers[layer];
                if (layer === 'daath') {
                    localStorage.setItem('fo_tree_daath', String(state.layers.daath));
                    if (!state.layers.daath && state.selectedKey === 'node:d') {
                        state.selectedKey = 'node:6';
                    }
                    populateJumpSelect();
                }
                btn.classList.toggle('is-on', state.layers[layer]);
                drawTree();
                renderInspector(state.selectedKey);
            });
        });

        // Jump Select & Prev/Next
        jumpSelect.addEventListener('change', () => selectEntity(jumpSelect.value, true));

        function stepEntity(delta) {
            const items = getNavigableItems();
            const idx = items.findIndex(i => i.key === state.selectedKey);
            const nextIdx = (idx + delta + items.length) % items.length;
            selectEntity(items[nextIdx].key, true);
        }

        prevBtn.addEventListener('click', () => stepEntity(-1));
        nextBtn.addEventListener('click', () => stepEntity(1));

        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            if (e.key === 'ArrowLeft') stepEntity(-1);
            if (e.key === 'ArrowRight') stepEntity(1);
            if (e.key === 'Escape' && state.locked) {
                state.locked = false;
                updateLockLabel();
                applySelectionHighlights();
            }
        });

        const params = new URLSearchParams(window.location.search);
        if (params.get('path')) {
            const pNum = Number(params.get('path'));
            if (PATHS.some(p => p.num === pNum)) {
                state.selectedKey = `path:${pNum}`;
                state.locked = true;
            }
        } else if (params.get('sephira')) {
            const sId = params.get('sephira');
            if (SEPHIROTH.some(s => String(s.id) === sId)) {
                state.selectedKey = `node:${sId}`;
                state.locked = true;
            }
        }

            populateJumpSelect();
        updateLockLabel();
        applyViewBox();
        drawTree();
        renderInspector(state.selectedKey);

        // ==================================================================
        // Interactive Zoom, Pan & Optional Cursor Loupe (Exact CTM Mapping)
        // ==================================================================
        function screenToSvg(clientX, clientY) {
            const ctm = svg.getScreenCTM();
            if (ctm) {
                const pt = svg.createSVGPoint();
                pt.x = clientX;
                pt.y = clientY;
                const loc = pt.matrixTransform(ctm.inverse());
                return { x: loc.x, y: loc.y };
            }
            const rect = svg.getBoundingClientRect();
            return {
                x: state.vb.x + ((clientX - rect.left) / (rect.width || 1)) * state.vb.w,
                y: state.vb.y + ((clientY - rect.top) / (rect.height || 1)) * state.vb.h
            };
        }

        function clampViewBox(vb) {
            vb.x = Math.max(-120, Math.min(820 - vb.w + 120, vb.x));
            vb.y = Math.max(-80, Math.min(1080 - vb.h + 80, vb.y));
            return vb;
        }

        function applyViewBox() {
            clampViewBox(state.vb);
            svg.setAttribute('viewBox', `${state.vb.x.toFixed(2)} ${state.vb.y.toFixed(2)} ${state.vb.w.toFixed(2)} ${state.vb.h.toFixed(2)}`);
            state.zoom = BASE_VB.w / state.vb.w;
            if (zoomReadout) zoomReadout.textContent = `${Math.round(state.zoom * 100)}%`;
            svgWrap?.classList.toggle('is-zoomed', state.zoom > 1.04);
        }

        function setZoomAtPoint(targetZoom, clientX, clientY) {
            const clamped = Math.max(1, Math.min(4.2, targetZoom));
            const focus = screenToSvg(clientX, clientY);
            const fx = (focus.x - state.vb.x) / state.vb.w;
            const fy = (focus.y - state.vb.y) / state.vb.h;

            state.vb.w = BASE_VB.w / clamped;
            state.vb.h = BASE_VB.h / clamped;
            state.vb.x = focus.x - fx * state.vb.w;
            state.vb.y = focus.y - fy * state.vb.h;
            if (clamped === 1) {
                state.vb = { ...BASE_VB };
            }
            applyViewBox();
        }

        function syncLoupeMarkup() {
            if (!loupeSvg) return;
            loupeSvg.innerHTML = svg.innerHTML;
            // Avoid duplicate clipPath id clash between main SVG and loupe
            const loupeClip = loupeSvg.querySelector('#malkuthClip');
            if (loupeClip) loupeClip.id = 'malkuthClipLoupe';
            const qGroup = loupeSvg.querySelector('[clip-path="url(#malkuthClip)"]');
            if (qGroup) qGroup.setAttribute('clip-path', 'url(#malkuthClipLoupe)');
        }

        zoomInBtn?.addEventListener('click', () => {
            const rect = svg.getBoundingClientRect();
            setZoomAtPoint(state.zoom * 1.32, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });

        zoomOutBtn?.addEventListener('click', () => {
            const rect = svg.getBoundingClientRect();
            setZoomAtPoint(state.zoom / 1.32, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });

        zoomResetBtn?.addEventListener('click', () => {
            state.vb = { ...BASE_VB };
            applyViewBox();
        });

        loupeToggleBtn?.addEventListener('click', () => {
            state.loupeEnabled = !state.loupeEnabled;
            loupeToggleBtn.classList.toggle('is-active', state.loupeEnabled);
            svgWrap?.classList.toggle('has-loupe', state.loupeEnabled);
            if (state.loupeEnabled) syncLoupeMarkup();
            else loupe?.classList.remove('is-visible');
        });

        // Mouse wheel / trackpad pinch zoom centered on cursor
        svgWrap?.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey || state.zoom > 1.01) {
                e.preventDefault();
                const factor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
                setZoomAtPoint(state.zoom * factor, e.clientX, e.clientY);
            }
        }, { passive: false });

        // Double-click quick zoom toggle
        svg.addEventListener('dblclick', (e) => {
            if (state.zoom < 1.3) setZoomAtPoint(2.2, e.clientX, e.clientY);
            else {
                state.vb = { ...BASE_VB };
                applyViewBox();
            }
        });

        // Drag to pan when zoomed + live cursor Loupe tracking
        let panStart = null;
        svgWrap?.addEventListener('pointerdown', (e) => {
            didPanDrag = false;
            if (state.zoom <= 1.02 || e.button !== 0) return;
            const ctm = svg.getScreenCTM();
            panStart = {
                x: e.clientX,
                y: e.clientY,
                vbx: state.vb.x,
                vby: state.vb.y,
                scaleX: ctm ? ctm.a : (svg.getBoundingClientRect().width / state.vb.w),
                scaleY: ctm ? ctm.d : (svg.getBoundingClientRect().height / state.vb.h)
            };
            svgWrap.classList.add('is-panning');
        });

        svgWrap?.addEventListener('pointermove', (e) => {
            if (panStart) {
                const moveDist = Math.hypot(e.clientX - panStart.x, e.clientY - panStart.y);
                if (moveDist > 4) didPanDrag = true;
                const dx = (e.clientX - panStart.x) / (panStart.scaleX || 1);
                const dy = (e.clientY - panStart.y) / (panStart.scaleY || 1);
                state.vb.x = panStart.vbx - dx;
                state.vb.y = panStart.vby - dy;
                applyViewBox();
            }

            if (state.loupeEnabled && loupe && loupeSvg) {
                const wrapRect = svgWrap.getBoundingClientRect();
                const lx = e.clientX - wrapRect.left;
                const ly = e.clientY - wrapRect.top;
                loupe.style.left = `${lx}px`;
                loupe.style.top = `${ly}px`;
                loupe.classList.add('is-visible');

                const { x: svgX, y: svgY } = screenToSvg(e.clientX, e.clientY);
                const ctm = svg.getScreenCTM();
                const pxPerVb = ctm ? Math.abs(ctm.a) : (svg.getBoundingClientRect().width / state.vb.w);
                const loupeMag = 2.6;
                const loupeSpan = 196 / Math.max(0.25, pxPerVb * loupeMag);
                loupeSvg.setAttribute(
                    'viewBox',
                    `${(svgX - loupeSpan / 2).toFixed(1)} ${(svgY - loupeSpan / 2).toFixed(1)} ${loupeSpan.toFixed(1)} ${loupeSpan.toFixed(1)}`
                );
            }
        });

        const endPan = () => {
            panStart = null;
            svgWrap?.classList.remove('is-panning');
            setTimeout(() => { didPanDrag = false; }, 30);
        };
        window.addEventListener('pointerup', endPan);
        svgWrap?.addEventListener('pointerleave', () => {
            loupe?.classList.remove('is-visible');
            endPan();
        });

        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            if (e.key.toLowerCase() === 'l' && loupeToggleBtn) {
                loupeToggleBtn.click();
            }
        });
    });
})();
