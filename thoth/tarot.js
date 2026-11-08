/**
 * Tarot de Thoth — Oráculo Ritual, Dignidades Elementares & Compêndio (78 Arcanos)
 * Frater Outis
 */
(function () {
    'use strict';

    const ELEMENT_LABELS = {
        fire:   { symbol: '🜂', name: 'Fogo' },
        water:  { symbol: '🜄', name: 'Água' },
        air:    { symbol: '🜁', name: 'Ar' },
        earth:  { symbol: '🜃', name: 'Terra' },
        spirit: { symbol: '🜀', name: 'Espírito' }
    };

    const tarotDeck = {
        majorArcana: [
            { num: '0',    name: 'O Louco',        subtitle: 'Espírito do Éter',          file: 'The_Fool',        path: 'Major_Arcana', ext: 'webp', elem: 'air',   astro: '🜁 Ar · Aleph (א)',      treePath: 11 },
            { num: 'I',    name: 'O Mago',         subtitle: 'Mago do Poder',             file: 'The_Magus',       path: 'Major_Arcana', ext: 'webp', elem: 'air',   astro: '☿ Mercúrio · Beth (ב)', treePath: 12 },
            { num: 'II',   name: 'A Sacerdotisa',  subtitle: 'Sacerdotisa da Estrela Prateada', file: 'The_Priestess', path: 'Major_Arcana', ext: 'webp', elem: 'water', astro: '☽ Lua · Gimel (ג)',  treePath: 13 },
            { num: 'III',  name: 'A Imperatriz',   subtitle: 'Filha dos Poderosos',       file: 'The_Empress',     path: 'Major_Arcana', ext: 'webp', elem: 'earth', astro: '♀ Vênus · Daleth (ד)',  treePath: 14 },
            { num: 'IV',   name: 'O Imperador',    subtitle: 'Filho da Manhã',            file: 'The_Emperor',     path: 'Major_Arcana', ext: 'webp', elem: 'fire',  astro: '♈ Áries · Heh (ה)',     treePath: 15 },
            { num: 'V',    name: 'O Hierofante',   subtitle: 'Mago do Eterno',            file: 'The_Hierophant',  path: 'Major_Arcana', ext: 'webp', elem: 'earth', astro: '♉ Touro · Vav (ו)',     treePath: 16 },
            { num: 'VI',   name: 'Os Amantes',     subtitle: 'Filhos da Voz / Oráculo',   file: 'The_Lovers',      path: 'Major_Arcana', ext: 'webp', elem: 'air',   astro: '♊ Gêmeos · Zain (ז)',   treePath: 17 },
            { num: 'VII',  name: 'O Carro',        subtitle: 'Senhor do Triunfo da Luz',  file: 'The_Chariot',     path: 'Major_Arcana', ext: 'webp', elem: 'water', astro: '♋ Câncer · Cheth (ח)',  treePath: 18 },
            { num: 'VIII', name: 'O Ajuste',       subtitle: 'Filha dos Senhores da Verdade', file: 'The_Adjustment', path: 'Major_Arcana', ext: 'webp', elem: 'air', astro: '♎ Libra · Lamed (ל)',  treePath: 22 },
            { num: 'IX',   name: 'O Eremita',      subtitle: 'Profeta do Eterno',         file: 'The_Hermit',      path: 'Major_Arcana', ext: 'webp', elem: 'earth', astro: '♍ Virgem · Yod (י)',    treePath: 20 },
            { num: 'X',    name: 'A Fortuna',      subtitle: 'Senhor das Forças da Vida', file: 'The_Fortune',     path: 'Major_Arcana', ext: 'webp', elem: 'fire',  astro: '♃ Júpiter · Kaph (כ)',  treePath: 21 },
            { num: 'XI',   name: 'A Luxúria',      subtitle: 'Filha da Espada Flamejante',file: 'The_Lust',        path: 'Major_Arcana', ext: 'webp', elem: 'fire',  astro: '♌ Leão · Teth (ט)',     treePath: 19 },
            { num: 'XII',  name: 'O Enforcado',    subtitle: 'Espírito das Águas Poderosas', file: 'The_Hanged_Man', path: 'Major_Arcana', ext: 'webp', elem: 'water', astro: '🜄 Água · Mem (מ)', treePath: 23 },
            { num: 'XIII', name: 'A Morte',        subtitle: 'Filho dos Grandes Transformadores', file: 'The_Death', path: 'Major_Arcana', ext: 'webp', elem: 'water', astro: '♏ Escorpião · Nun (נ)', treePath: 24 },
            { num: 'XIV',  name: 'A Arte',         subtitle: 'Filha dos Reconciliadores', file: 'The_Art',         path: 'Major_Arcana', ext: 'webp', elem: 'fire',  astro: '♐ Sagitário · Samekh (ס)', treePath: 25 },
            { num: 'XV',   name: 'O Diabo',        subtitle: 'Senhor dos Portais da Matéria', file: 'The_Devil',   path: 'Major_Arcana', ext: 'webp', elem: 'earth', astro: '♑ Capricórnio · Ayin (ע)', treePath: 26 },
            { num: 'XVI',  name: 'A Torre',        subtitle: 'Senhor dos Exércitos Poderosos', file: 'The_Tower',  path: 'Major_Arcana', ext: 'webp', elem: 'fire',  astro: '♂ Marte · Peh (פ)',     treePath: 27 },
            { num: 'XVII', name: 'A Estrela',      subtitle: 'Filha do Firmamento',       file: 'The_Star',        path: 'Major_Arcana', ext: 'webp', elem: 'air',   astro: '♒ Aquário · Tzaddi (צ)', treePath: 28 },
            { num: 'XVIII',name: 'A Lua',          subtitle: 'Regente do Fluxo e Refluxo',file: 'The_Moon',        path: 'Major_Arcana', ext: 'webp', elem: 'water', astro: '♓ Peixes · Qoph (ק)',   treePath: 29 },
            { num: 'XIX',  name: 'O Sol',          subtitle: 'Senhor do Fogo do Mundo',   file: 'The_Sun',         path: 'Major_Arcana', ext: 'webp', elem: 'fire',  astro: '☉ Sol · Resh (ר)',      treePath: 30 },
            { num: 'XX',   name: 'O Éon',          subtitle: 'Espírito do Fogo Primal',   file: 'The_Aeon',        path: 'Major_Arcana', ext: 'webp', elem: 'fire',  astro: '🜂 Fogo/Espírito · Shin (ש)', treePath: 31 },
            { num: 'XXI',  name: 'O Universo',     subtitle: 'O Grande Da Noite do Tempo',file: 'The_Universe',    path: 'Major_Arcana', ext: 'webp', elem: 'earth', astro: '♄ Saturno/Terra · Tav (ת)', treePath: 32 }
        ],
        minorArcana: {
            wands: [
                { name: 'Ás de Paus',       subtitle: 'Raiz dos Poderes do Fogo', file: 'Ace_of_Wands',      path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '🜂 Fogo · Kether (1)', sephira: 1 },
                { name: '2 de Paus',        subtitle: 'Domínio',                  file: '2_of_Wands',        path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '♂ em ♈ · Chokmah (2)', sephira: 2 },
                { name: '3 de Paus',        subtitle: 'Virtude',                  file: '3_of_Wands',        path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '☉ em ♈ · Binah (3)',   sephira: 3 },
                { name: '4 de Paus',        subtitle: 'Conclusão',                file: '4_of_Wands',        path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '♀ em ♈ · Chesed (4)',  sephira: 4 },
                { name: '5 de Paus',        subtitle: 'Disputa',                  file: '5_of_Wands',        path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '♄ em ♌ · Geburah (5)', sephira: 5 },
                { name: '6 de Paus',        subtitle: 'Vitória',                  file: '6_of_Wands',        path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '♃ em ♌ · Tiphareth (6)',sephira: 6 },
                { name: '7 de Paus',        subtitle: 'Valor',                    file: '7_of_Wands',        path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '♂ em ♌ · Netzach (7)', sephira: 7 },
                { name: '8 de Paus',        subtitle: 'Rapidez',                  file: '8_of_Wands',        path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '☿ em ♐ · Hod (8)',     sephira: 8 },
                { name: '9 de Paus',        subtitle: 'Força',                    file: '9_of_Wands',        path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '☽ em ♐ · Yesod (9)',   sephira: 9 },
                { name: '10 de Paus',       subtitle: 'Opressão',                 file: '10_of_Wands',       path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '♄ em ♐ · Malkuth (10)',sephira: 10 },
                { name: 'Princesa de Paus', subtitle: 'Terra do Fogo',            file: 'Princess_of_Wands', path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '🜃 de 🜂' },
                { name: 'Príncipe de Paus', subtitle: 'Ar do Fogo',               file: 'Prince_of_Wands',   path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '🜁 de 🜂 · ♋–♌' },
                { name: 'Rainha de Paus',   subtitle: 'Água do Fogo',             file: 'Queen_of_Wands',    path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '🜄 de 🜂 · ♓–♈' },
                { name: 'Cavaleiro de Paus',subtitle: 'Fogo do Fogo',             file: 'Knight_of_Wands',   path: 'Minor_Arcana/Wands', ext: 'webp', elem: 'fire', astro: '🜂 de 🜂 · ♏–♐' }
            ],
            cups: [
                { name: 'Ás de Copas',       subtitle: 'Raiz dos Poderes da Água',file: 'Ace_of_Cups',       path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '🜄 Água · Kether (1)', sephira: 1 },
                { name: '2 de Copas',        subtitle: 'Amor',                    file: '2_of_Cups',         path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '♀ em ♋ · Chokmah (2)', sephira: 2 },
                { name: '3 de Copas',        subtitle: 'Abundância',              file: '3_of_Cups',         path: 'Minor_Arcana/Cups', ext: 'jpg',  elem: 'water', astro: '☿ em ♋ · Binah (3)',   sephira: 3 },
                { name: '4 de Copas',        subtitle: 'Luxúria / Saciedade',     file: '4_of_Cups',         path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '☽ em ♋ · Chesed (4)',  sephira: 4 },
                { name: '5 de Copas',        subtitle: 'Desapontamento',          file: '5_of_Cups',         path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '♂ em ♏ · Geburah (5)', sephira: 5 },
                { name: '6 de Copas',        subtitle: 'Prazer',                  file: '6_of_Cups',         path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '☉ em ♏ · Tiphareth (6)',sephira: 6 },
                { name: '7 de Copas',        subtitle: 'Deboche / Ilusão',        file: '7_of_Cups',         path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '♀ em ♏ · Netzach (7)', sephira: 7 },
                { name: '8 de Copas',        subtitle: 'Indolência',              file: '8_of_Cups',         path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '♄ em ♓ · Hod (8)',     sephira: 8 },
                { name: '9 de Copas',        subtitle: 'Felicidade',              file: '9_of_Cups',         path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '♃ em ♓ · Yesod (9)',   sephira: 9 },
                { name: '10 de Copas',       subtitle: 'Saciedade',               file: '10_of_Cups',        path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '♂ em ♓ · Malkuth (10)',sephira: 10 },
                { name: 'Princesa de Copas', subtitle: 'Terra da Água',           file: 'Princess_of_Cups',  path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '🜃 de 🜄' },
                { name: 'Príncipe de Copas', subtitle: 'Ar da Água',              file: 'Prince_of_Cups',    path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '🜁 de 🜄 · ♎–♏' },
                { name: 'Rainha de Copas',   subtitle: 'Água da Água',            file: 'Queen_of_Cups',     path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '🜄 de 🜄 · ♊–♋' },
                { name: 'Cavaleiro de Copas',subtitle: 'Fogo da Água',            file: 'Knight_of_Cups',    path: 'Minor_Arcana/Cups', ext: 'webp', elem: 'water', astro: '🜂 de 🜄 · ♒–♓' }
            ],
            swords: [
                { name: 'Ás de Espadas',       subtitle: 'Raiz dos Poderes do Ar',file: 'Ace_of_Swords',     path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '🜁 Ar · Kether (1)', sephira: 1 },
                { name: '2 de Espadas',        subtitle: 'Paz',                   file: '2_of_Swords',       path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '☽ em ♎ · Chokmah (2)', sephira: 2 },
                { name: '3 de Espadas',        subtitle: 'Dor',                   file: '3_of_Swords',       path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '♄ em ♎ · Binah (3)',   sephira: 3 },
                { name: '4 de Espadas',        subtitle: 'Trégua',                file: '4_of_Swords',       path: 'Minor_Arcana/Swords', ext: 'webp', elem: 'air', astro: '♃ em ♎ · Chesed (4)',  sephira: 4 },
                { name: '5 de Espadas',        subtitle: 'Derrota',               file: '5_of_Swords',       path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '♀ em ♒ · Geburah (5)', sephira: 5 },
                { name: '6 de Espadas',        subtitle: 'Ciência',               file: '6_of_Swords',       path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '☿ em ♒ · Tiphareth (6)',sephira: 6 },
                { name: '7 de Espadas',        subtitle: 'Futilidade',            file: '7_of_Swords',       path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '☽ em ♒ · Netzach (7)', sephira: 7 },
                { name: '8 de Espadas',        subtitle: 'Interferência',         file: '8_of_Swords',       path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '♃ em ♊ · Hod (8)',     sephira: 8 },
                { name: '9 de Espadas',        subtitle: 'Crueldade',             file: '9_of_Swords',       path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '♂ em ♊ · Yesod (9)',   sephira: 9 },
                { name: '10 de Espadas',       subtitle: 'Ruína',                 file: '10_of_Swords',      path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '☉ em ♊ · Malkuth (10)',sephira: 10 },
                { name: 'Princesa de Espadas', subtitle: 'Terra do Ar',           file: 'Princess_of_Swords',path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '🜃 de 🜁' },
                { name: 'Príncipe de Espadas', subtitle: 'Ar do Ar',              file: 'Prince_of_Swords',  path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '🜁 de 🜁 · ♑–♒' },
                { name: 'Rainha de Espadas',   subtitle: 'Água do Ar',            file: 'Queen_of_Swords',   path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '🜄 de 🜁 · ♍–♎' },
                { name: 'Cavaleiro de Espadas',subtitle: 'Fogo do Ar',            file: 'Knight_of_Swords',  path: 'Minor_Arcana/Swords', ext: 'png',  elem: 'air', astro: '🜂 de 🜁 · ♉–♊' }
            ],
            disks: [
                { name: 'Ás de Discos',       subtitle: 'Raiz dos Poderes da Terra', file: 'Ace_of_Disks',   path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '🜃 Terra · Kether (1)', sephira: 1 },
                { name: '2 de Discos',        subtitle: 'Mudança',                file: '2_of_Disks',        path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '♃ em ♑ · Chokmah (2)', sephira: 2 },
                { name: '3 de Discos',        subtitle: 'Trabalho',               file: '3_of_Disks',        path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '♂ em ♑ · Binah (3)',   sephira: 3 },
                { name: '4 de Discos',        subtitle: 'Poder',                  file: '4_of_Disks',        path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '☉ em ♑ · Chesed (4)',  sephira: 4 },
                { name: '5 de Discos',        subtitle: 'Preocupação',            file: '5_of_Disks',        path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '☿ em ♉ · Geburah (5)', sephira: 5 },
                { name: '6 de Discos',        subtitle: 'Sucesso',                file: '6_of_Disks',        path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '☽ em ♉ · Tiphareth (6)',sephira: 6 },
                { name: '7 de Discos',        subtitle: 'Fracasso',               file: '7_of_Disks',        path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '♄ em ♉ · Netzach (7)', sephira: 7 },
                { name: '8 de Discos',        subtitle: 'Prudência',              file: '8_of_Disks',        path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '☉ em ♍ · Hod (8)',     sephira: 8 },
                { name: '9 de Discos',        subtitle: 'Ganho',                  file: '9_of_Disks',        path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '♀ em ♍ · Yesod (9)',   sephira: 9 },
                { name: '10 de Discos',       subtitle: 'Riqueza',                file: '10_of_Disks',       path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '☿ em ♍ · Malkuth (10)',sephira: 10 },
                { name: 'Princesa de Discos', subtitle: 'Terra da Terra',         file: 'Princess_of_Disks', path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '🜃 de 🜃' },
                { name: 'Príncipe de Discos', subtitle: 'Ar da Terra',            file: 'Prince_of_Disks',   path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '🜁 de 🜃 · ♈–♉' },
                { name: 'Rainha de Discos',   subtitle: 'Água da Terra',          file: 'Queen_of_Disks',    path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '🜄 de 🜃 · ♐–♑' },
                { name: 'Cavaleiro de Discos',subtitle: 'Fogo da Terra',          file: 'Knight_of_Disks',   path: 'Minor_Arcana/Disks', ext: 'png', elem: 'earth', astro: '🜂 de 🜃 · ♌–♍' }
            ]
        }
    };

    const spreads = {
        one: {
            name: 'Síntese Hermética (Uma Carta)',
            positions: ['Eixo da Vontade / Mensagem Central'],
            description: 'Um único arcano como espelho imediato da corrente em operação.'
        },
        three: {
            name: 'Tríade & Dignidades Elementares (Três Cartas)',
            positions: ['Influência Esquerda (Passado)', 'Núcleo / Significador (Presente)', 'Influência Direita (Devir)'],
            description: 'Método clássico de Crowley: a carta central é fortalecida, temperada ou tensionada pelos elementos das duas cartas laterais.'
        },
        cross: {
            name: 'Pentagrama dos Elementos (Cinco Cartas)',
            positions: ['🜀 Espírito (Síntese)', '🜂 Fogo (Vontade)', '🜄 Água (Intuição)', '🜁 Ar (Razão)', '🜃 Terra (Manifestação)'],
            description: 'Mapeia o equilíbrio das quatro forças elementares convergindo na quintessência central.'
        },
        horseshoe: {
            name: 'Ferradura Hermética (Sete Cartas)',
            positions: ['Passado', 'Presente', 'Forças Ocultas', 'Obstáculo Central', 'Ambiente Externo', 'Vetor de Ação', 'Síntese'],
            description: 'Sete estágios planetários revelando forças visíveis e invisíveis da questão.'
        },
        tree: {
            name: 'Espelho da Árvore da Vida (Dez Sephiroth)',
            positions: [
                '1. Kether (Origem)', '2. Chokmah (Impulso)', '3. Binah (Estrutura)',
                '4. Chesed (Expansão)', '5. Geburah (Rigor)', '6. Tiphareth (Centro Solar)',
                '7. Netzach (Desejo)', '8. Hod (Intelecto)', '9. Yesod (Subconsciente)', '10. Malkuth (Resultado)'
            ],
            description: 'Desce pelo Relâmpago Flamejante desde a semente espiritual em Kether até a concretização em Malkuth.'
        },
        celtic: {
            name: 'Cruz Celta Completa (Dez Cartas)',
            positions: [
                '1. Situação Atual', '2. Força que Cruza', '3. Raiz Inconsciente', '4. Passado Recente',
                '5. Coroa / Potencial', '6. Futuro Próximo', '7. Postura Interna', '8. Ambiente',
                '9. Temores & Anseios', '10. Desfecho'
            ],
            description: 'A estrutura divinatória clássica de dez posições unindo a Cruz Solar e o Pilar do Self.'
        }
    };

    // Procedural Rosicrucian Rose-Cross SVG back
    const ROSE_CROSS_SVG = `
        <svg viewBox="0 0 200 320" width="88%" height="88%" aria-hidden="true">
            <rect x="8" y="8" width="184" height="304" fill="none" stroke="rgba(201,168,76,0.45)" stroke-width="1"/>
            <rect x="14" y="14" width="172" height="292" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.7"/>
            <line x1="14" y1="14" x2="186" y2="306" stroke="rgba(201,168,76,0.14)" stroke-width="0.7"/>
            <line x1="186" y1="14" x2="14" y2="306" stroke="rgba(201,168,76,0.14)" stroke-width="0.7"/>
            <!-- Equal-armed Cross & Vertical Beam -->
            <path d="M90 62 H110 V145 H162 V165 H110 V258 H90 V165 H38 V145 H90 Z" fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.75)" stroke-width="1.3"/>
            <!-- Concentric Rose at Center -->
            <circle cx="100" cy="155" r="32" fill="#07070b" stroke="rgba(201,168,76,0.65)" stroke-width="1.1"/>
            <circle cx="100" cy="155" r="22" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.9" stroke-dasharray="4 3"/>
            <circle cx="100" cy="155" r="12" fill="rgba(201,168,76,0.22)" stroke="rgba(201,168,76,0.85)" stroke-width="1"/>
            <circle cx="100" cy="155" r="3" fill="#c9a84c"/>
        </svg>
    `;

    const JOURNAL_KEY = 'fo_thoth_journal_v1';

    let currentSpread = 'one';
    let drawnCards = [];
    let activeSuitFilter = 'all';

    function getAllCardsWithMeta() {
        const list = tarotDeck.majorArcana.map(c => ({ ...c, suitKey: 'major' }));
        Object.entries(tarotDeck.minorArcana).forEach(([suitKey, cards]) => {
            cards.forEach(c => list.push({ ...c, suitKey }));
        });
        return list;
    }

    function shuffle(array) {
        const a = array.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // Crowley's Elemental Dignities evaluator
    function evaluateElementPair(e1, e2) {
        if (e1 === e2) return 2; // Strongly reinforced
        const pair = [e1, e2].sort().join('-');
        if (pair === 'air-fire' || pair === 'earth-water') return 1; // Active+Active or Passive+Passive = Friendly
        if (pair === 'fire-water' || pair === 'air-earth') return -2; // Contrary/Hostile
        return 0; // Neutral (Fire-Earth, Air-Water)
    }

    function computeDignityAnalysis(cards) {
        if (cards.length < 3) return null;
        const left = cards[0];
        const center = cards[1];
        const right = cards[2];
        const s1 = evaluateElementPair(center.elem, left.elem);
        const s2 = evaluateElementPair(center.elem, right.elem);
        const total = s1 + s2;

        const elL = ELEMENT_LABELS[left.elem];
        const elC = ELEMENT_LABELS[center.elem];
        const elR = ELEMENT_LABELS[right.elem];

        let verdict = '';
        if (total >= 2) {
            verdict = `Alta Harmonia Elementar (${elL.symbol} + ${elC.symbol} + ${elR.symbol}): as cartas laterais amplificam e sustentam vigorosamente a expressão de ${center.name}.`;
        } else if (total === 1) {
            verdict = `Dignidade Favorável (${elL.symbol} · ${elC.symbol} · ${elR.symbol}): há cooperação ativa ao redor de ${center.name}, com leve modulação secundária.`;
        } else if (total === 0) {
            verdict = `Equilíbrio Neutro / Temperado (${elL.symbol} · ${elC.symbol} · ${elR.symbol}): forças complementares ou opostas se compensam; ${center.name} opera por mediação consciente.`;
        } else {
            verdict = `Tensão Alquímica / Dignidade Contrariada (${elL.symbol} × ${elC.symbol} × ${elR.symbol}): elementos antagônicos enfraquecem ou tensionam ${center.name}, exigindo síntese superior.`;
        }
        return verdict;
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Mode Tabs
        document.querySelectorAll('.thoth-mode-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.thoth-mode-tab').forEach(t => {
                    t.classList.remove('is-active');
                    t.setAttribute('aria-selected', 'false');
                });
                document.querySelectorAll('.thoth-pane').forEach(p => p.classList.remove('is-active'));
                tab.classList.add('is-active');
                tab.setAttribute('aria-selected', 'true');
                document.getElementById(`mode-${tab.dataset.mode}`)?.classList.add('is-active');
                if (tab.dataset.mode === 'journal') renderJournal();
            });
        });

        // Spread selector
        document.querySelectorAll('.spread-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.spread-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSpread = btn.dataset.spread;
                if (drawnCards.length > 0) resetReading();
            });
        });

        document.getElementById('drawBtn')?.addEventListener('click', drawCards);
        document.getElementById('resetBtn')?.addEventListener('click', resetReading);
        document.getElementById('revealAllBtn')?.addEventListener('click', revealAllCards);

        // Compendium setup
        initCompendium();
        renderJournal();
    });

    function drawCards() {
        const info = spreads[currentSpread];
        const majorsOnly = document.getElementById('toggleMajorsOnly')?.checked;
        const allowReversals = document.getElementById('toggleReversals')?.checked;
        const startFaceDown = document.getElementById('toggleFaceDown')?.checked;
        const intent = (document.getElementById('intentInput')?.value || '').trim();

        const pool = majorsOnly
            ? tarotDeck.majorArcana.map(c => ({ ...c, suitKey: 'major' }))
            : getAllCardsWithMeta();

        drawnCards = shuffle(pool).slice(0, info.positions.length).map(card => ({
            ...card,
            reversed: allowReversals ? Math.random() < 0.35 : false,
            revealed: !startFaceDown
        }));

        saveToJournal(intent, info.name, drawnCards, info.positions);
        renderSpread();
    }

    function renderSpread() {
        const container = document.getElementById('cards-container');
        const infoDiv = document.getElementById('spread-info');
        const dignityDiv = document.getElementById('dignity-banner');
        const actionBar = document.getElementById('readingActionBar');
        const revealAllBtn = document.getElementById('revealAllBtn');
        const info = spreads[currentSpread];

        if (drawnCards.length === 0) {
            container.innerHTML = '';
            infoDiv.style.display = 'none';
            dignityDiv.style.display = 'none';
            actionBar.style.display = 'none';
            return;
        }

        infoDiv.style.display = 'block';
        infoDiv.innerHTML = `<h3>${info.name}</h3><p>${info.description}</p>`;
        actionBar.style.display = 'flex';

        const anyHidden = drawnCards.some(c => !c.revealed);
        revealAllBtn.style.display = anyHidden ? 'inline-flex' : 'none';

        // Dignity banner (shown once first 3 cards are revealed in 3-card spread)
        updateDignityBanner();

        container.innerHTML = '';
        container.className = 'cards-display';

        if (currentSpread === 'one') {
            container.classList.add('one-card');
            container.appendChild(createCardSlot(drawnCards[0], info.positions[0], 0));
        } else if (currentSpread === 'three') {
            container.classList.add('three-cards');
            drawnCards.forEach((c, idx) => container.appendChild(createCardSlot(c, info.positions[idx], idx)));
        } else if (currentSpread === 'cross') {
            container.classList.add('cross-spread');
            const r1 = document.createElement('div'); r1.className = 'cross-row';
            r1.appendChild(createCardSlot(drawnCards[1], info.positions[1], 1));
            const r2 = document.createElement('div'); r2.className = 'cross-row';
            r2.appendChild(createCardSlot(drawnCards[3], info.positions[3], 3));
            r2.appendChild(createCardSlot(drawnCards[0], info.positions[0], 0));
            r2.appendChild(createCardSlot(drawnCards[2], info.positions[2], 2));
            const r3 = document.createElement('div'); r3.className = 'cross-row';
            r3.appendChild(createCardSlot(drawnCards[4], info.positions[4], 4));
            container.append(r1, r2, r3);
        } else if (currentSpread === 'tree') {
            container.classList.add('tree-spread');
            const grid = document.createElement('div');
            grid.className = 'tree-spread-grid';
            // Kabbalistic coordinates on a 3-column grid:
            // Kether(col2,row1), Binah(col1,row2), Chokmah(col3,row2), Geburah(col1,row3), Chesed(col3,row3),
            // Tiphareth(col2,row4), Hod(col1,row5), Netzach(col3,row5), Yesod(col2,row6), Malkuth(col2,row7)
            const treeCoords = [
                [2, 1], [3, 2], [1, 2], [3, 3], [1, 3],
                [2, 4], [3, 5], [1, 5], [2, 6], [2, 7]
            ];
            drawnCards.forEach((c, idx) => {
                const slot = createCardSlot(c, info.positions[idx], idx);
                slot.style.gridColumn = String(treeCoords[idx][0]);
                slot.style.gridRow = String(treeCoords[idx][1]);
                grid.appendChild(slot);
            });
            container.appendChild(grid);
        } else {
            // Horseshoe (7) & Celtic Cross (10): clean responsive rows
            container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
            drawnCards.forEach((c, idx) => container.appendChild(createCardSlot(c, info.positions[idx], idx)));
        }
    }

    function updateDignityBanner() {
        const dignityDiv = document.getElementById('dignity-banner');
        if (currentSpread === 'three' && drawnCards.length === 3 && drawnCards.every(c => c.revealed)) {
            const text = computeDignityAnalysis(drawnCards);
            dignityDiv.style.display = 'block';
            dignityDiv.innerHTML = `<strong>🜏 Dignidades Elementares</strong> ${text}`;
        } else {
            dignityDiv.style.display = 'none';
        }
    }

    function createCardSlot(card, positionLabel, index) {
        const slot = document.createElement('div');
        slot.className = `tarot-slot ${card.revealed ? '' : 'is-unrevealed'}`;
        slot.style.animationDelay = `${index * 0.08}s`;

        const imagePath = `../assets/Tarot_Cards/${card.path}/${card.file}.${card.ext}`;
        const cardPath = `assets/Tarot_Cards/${card.path}/${card.file}`;
        const revParam = card.reversed ? '&reversed=true' : '';
        const detailUrl = `card-detail.html?card=${encodeURIComponent(cardPath)}&name=${encodeURIComponent(card.name)}${revParam}`;
        const imgRotate = card.reversed ? 'transform: rotate(180deg);' : '';

        const scene = document.createElement('div');
        scene.className = `card-3d-scene ${card.revealed ? '' : 'is-facedown'}`;
        scene.innerHTML = `
            <div class="card-3d-inner">
                <div class="card-face card-face-front">
                    <img src="${imagePath}" alt="${card.name}" style="${imgRotate}" loading="lazy">
                </div>
                <div class="card-face card-face-back">
                    ${ROSE_CROSS_SVG}
                </div>
            </div>
        `;

        const meta = document.createElement('div');
        meta.className = 'slot-meta';

        const renderMetaContent = () => {
            if (!card.revealed) {
                meta.innerHTML = `
                    <div class="slot-card-name">Arcano Velado</div>
                    <div class="slot-card-corresp">Clique na carta para revelar</div>
                `;
            } else {
                meta.innerHTML = `
                    <div class="slot-card-name">${card.num !== undefined ? card.num + ' · ' : ''}${card.name}${card.reversed ? ' (Invertida)' : ''}</div>
                    <div class="slot-card-corresp">${card.subtitle ? card.subtitle + ' · ' : ''}${card.astro || ''}</div>
                    <a href="${detailUrl}" class="slot-study-link">Estudo Completo →</a>
                `;
            }
        };
        renderMetaContent();

        scene.addEventListener('click', () => {
            if (!card.revealed) {
                card.revealed = true;
                scene.classList.remove('is-facedown');
                slot.classList.remove('is-unrevealed');
                renderMetaContent();
                updateDignityBanner();
                if (drawnCards.every(c => c.revealed)) {
                    document.getElementById('revealAllBtn').style.display = 'none';
                }
            } else {
                window.location.href = detailUrl;
            }
        });

        // Subtle 3D tilt on pointermove when revealed
        scene.addEventListener('pointermove', (e) => {
            if (!card.revealed) return;
            const rect = scene.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;
            const inner = scene.querySelector('.card-3d-inner');
            if (inner) {
                inner.style.transform = `rotateY(${(nx * 12).toFixed(2)}deg) rotateX(${(-ny * 12).toFixed(2)}deg)`;
            }
        });
        scene.addEventListener('pointerleave', () => {
            const inner = scene.querySelector('.card-3d-inner');
            if (inner) {
                inner.style.transform = card.revealed ? '' : 'rotateY(180deg)';
            }
        });

        const posEl = document.createElement('div');
        posEl.className = 'slot-position-label';
        posEl.textContent = positionLabel;

        slot.append(posEl, scene, meta);
        return slot;
    }

    function revealAllCards() {
        drawnCards.forEach(c => { c.revealed = true; });
        renderSpread();
    }

    function resetReading() {
        drawnCards = [];
        renderSpread();
    }

    // Compendium Mode
    function initCompendium() {
        const grid = document.getElementById('compendiumGrid');
        const search = document.getElementById('compendiumSearch');
        const allCards = getAllCardsWithMeta();

        const normalize = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        const render = () => {
            const q = normalize(search?.value || '');
            const filtered = allCards.filter(c => {
                if (activeSuitFilter !== 'all' && c.suitKey !== activeSuitFilter) return false;
                if (!q) return true;
                return normalize(`${c.num || ''} ${c.name} ${c.subtitle || ''} ${c.astro || ''}`).includes(q);
            });

            grid.innerHTML = filtered.map(c => {
                const imgSrc = `../assets/Tarot_Cards/${c.path}/${c.file}.${c.ext}`;
                const cardParam = `assets/Tarot_Cards/${c.path}/${c.file}`;
                const href = `card-detail.html?card=${encodeURIComponent(cardParam)}&name=${encodeURIComponent(c.name)}`;
                return `
                    <a href="${href}" class="compendium-card">
                        <div class="compendium-thumb-wrap">
                            <img src="${imgSrc}" alt="${c.name}" loading="lazy">
                        </div>
                        <div class="compendium-card-kicker">${c.astro || ''}</div>
                        <div class="compendium-card-title">${c.num !== undefined ? c.num + ' — ' : ''}${c.name}</div>
                        <div class="compendium-card-sub">${c.subtitle || ''}</div>
                    </a>
                `;
            }).join('');
        };

        document.querySelectorAll('.suit-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.suit-pill').forEach(p => p.classList.remove('is-active'));
                pill.classList.add('is-active');
                activeSuitFilter = pill.dataset.suit;
                render();
            });
        });

        search?.addEventListener('input', render);
        render();
    }

    // Journal Persistence
    function saveToJournal(intent, spreadName, cards, positions) {
        try {
            const raw = JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]');
            raw.unshift({
                ts: new Date().toISOString(),
                intent: intent || 'Tiragem silenciosa',
                spreadName,
                items: cards.map((c, idx) => ({
                    pos: positions[idx],
                    name: c.name,
                    reversed: c.reversed,
                    cardPath: `assets/Tarot_Cards/${c.path}/${c.file}`
                }))
            });
            localStorage.setItem(JOURNAL_KEY, JSON.stringify(raw.slice(0, 20)));
        } catch (_) {}
    }

    function renderJournal() {
        const listEl = document.getElementById('journalList');
        const clearBtn = document.getElementById('clearJournalBtn');
        if (!listEl) return;

        let entries = [];
        try {
            entries = JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]');
        } catch (_) {}

        if (entries.length === 0) {
            listEl.innerHTML = `<p style="font-family:var(--fo-serif-body);font-size:1.15rem;color:rgba(255,255,255,0.55);">Nenhuma tiragem registrada neste navegador ainda.</p>`;
        } else {
            listEl.innerHTML = entries.map(entry => {
                const dateStr = new Date(entry.ts).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
                const chips = entry.items.map(it => {
                    const href = `card-detail.html?card=${encodeURIComponent(it.cardPath)}&name=${encodeURIComponent(it.name)}${it.reversed ? '&reversed=true' : ''}`;
                    return `<a class="journal-chip" href="${href}">${it.pos}: ${it.name}${it.reversed ? ' (Inv.)' : ''}</a>`;
                }).join('');
                return `
                    <article class="journal-entry">
                        <div class="journal-entry-head">
                            <span>${entry.spreadName}</span>
                            <span>${dateStr}</span>
                        </div>
                        <div class="journal-entry-intent">"${entry.intent}"</div>
                        <div class="journal-entry-cards">${chips}</div>
                    </article>
                `;
            }).join('');
        }

        if (clearBtn) {
            clearBtn.onclick = () => {
                localStorage.removeItem(JOURNAL_KEY);
                renderJournal();
            };
        }
    }

    // Export deck metadata globally if needed
    window.THOTH_DECK_ALL = getAllCardsWithMeta;
})();
