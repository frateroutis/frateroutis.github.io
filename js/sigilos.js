/**
 * Ars Sigillorum — Laboratório Ritual e Geométrico de Sigilos (Frater Outis)
 * Motores:
 *   1. Rosa-Cruz Hermética (22 Pétalas: 3 Mães, 7 Duplas, 12 Simples)
 *   2. Kameas Planetários de Agrippa (Saturno 3×3 a Lua 9×9 + Aiq Beker)
 *   3. Fusão Monogramática Zos Kia (Austin Osman Spare: ligadura real A–Z em 5 topologias)
 *   4. Mão Livre com Simetria Caleidoscópica (1×, 2×, 4×, 8×)
 * Ornamentação:
 *   Selos Clássicos, Selo de Babalon, Selo da A∴A∴, Sigillum Dei Æmeth (Enoquiano),
 *   os 7 Pantáculos Planetários de Salomão e Selos Goéticos (Lemegeton) com tooltips.
 */
(function () {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const GRIMOIRE_KEY = 'fo_sigil_grimoire_v1';

    // Mapping Latin A-Z to 22 Hebrew archetypes, Gematria, and Rose-Cross ring
    // Rings: 0 = 3 Mothers (Aleph, Mem, Shin), 1 = 7 Doubles, 2 = 12 Simples
    const LETTER_ARCANA = {
        A: { heb: 'א', gem: 1,   ring: 0, idx: 0,  total: 3  },
        B: { heb: 'ב', gem: 2,   ring: 1, idx: 0,  total: 7  },
        C: { heb: 'כ', gem: 20,  ring: 1, idx: 3,  total: 7  },
        D: { heb: 'ד', gem: 4,   ring: 1, idx: 2,  total: 7  },
        E: { heb: 'ה', gem: 5,   ring: 2, idx: 0,  total: 12 },
        F: { heb: 'ו', gem: 6,   ring: 2, idx: 1,  total: 12 },
        G: { heb: 'ג', gem: 3,   ring: 1, idx: 1,  total: 7  },
        H: { heb: 'ח', gem: 8,   ring: 2, idx: 3,  total: 12 },
        I: { heb: 'י', gem: 10,  ring: 2, idx: 5,  total: 12 },
        J: { heb: 'י', gem: 10,  ring: 2, idx: 5,  total: 12 },
        K: { heb: 'כ', gem: 20,  ring: 1, idx: 3,  total: 7  },
        L: { heb: 'ל', gem: 30,  ring: 2, idx: 6,  total: 12 },
        M: { heb: 'מ', gem: 40,  ring: 0, idx: 1,  total: 3  },
        N: { heb: 'נ', gem: 50,  ring: 2, idx: 7,  total: 12 },
        O: { heb: 'ע', gem: 70,  ring: 2, idx: 9,  total: 12 },
        P: { heb: 'פ', gem: 80,  ring: 1, idx: 4,  total: 7  },
        Q: { heb: 'ק', gem: 100, ring: 2, idx: 11, total: 12 },
        R: { heb: 'ר', gem: 200, ring: 1, idx: 5,  total: 7  },
        S: { heb: 'ס', gem: 60,  ring: 2, idx: 8,  total: 12 },
        T: { heb: 'ט', gem: 9,   ring: 2, idx: 4,  total: 12 },
        U: { heb: 'ו', gem: 6,   ring: 2, idx: 1,  total: 12 },
        V: { heb: 'ו', gem: 6,   ring: 2, idx: 1,  total: 12 },
        W: { heb: 'ש', gem: 300, ring: 0, idx: 2,  total: 3  },
        X: { heb: 'צ', gem: 90,  ring: 2, idx: 10, total: 12 },
        Y: { heb: 'י', gem: 10,  ring: 2, idx: 5,  total: 12 },
        Z: { heb: 'ז', gem: 7,   ring: 2, idx: 2,  total: 12 }
    };

    const PLANET_NAMES = {
        saturn:  { n: 3, label: '♄ Kamea de Saturno (3×3 · Soma 15)' },
        jupiter: { n: 4, label: '♃ Kamea de Júpiter (4×4 · Soma 34)' },
        mars:    { n: 5, label: '♂ Kamea de Marte (5×5 · Soma 65)' },
        sun:     { n: 6, label: '☉ Kamea do Sol (6×6 · Soma 111)' },
        venus:   { n: 7, label: '♀ Kamea de Vênus (7×7 · Soma 175)' },
        mercury: { n: 8, label: '☿ Kamea de Mercúrio (8×8 · Soma 260)' },
        moon:    { n: 9, label: '☽ Kamea da Lua (9×9 · Soma 369)' }
    };

    const ENGINE_NOTES = {
        rosecross: {
            title: 'Metodologia · Rosa-Cruz de 22 Pétalas',
            body: 'Translitera a raiz consonantal ao hebraico e une sequencialmente as coordenadas sobre a Rosa de 22 pétalas (3 Mães, 7 Duplas, 12 Simples), abrindo com círculo de origem (○) e selando com barra terminal (⊥).'
        },
        kamea: {
            title: 'Metodologia · Kameas Planetários (Agrippa)',
            body: 'Converte cada letra em valor gemátrico reduzido à escala do Quadrado Mágico do planeta regente (De Occulta Philosophia), traçando o vetor geométrico da inteligência planetária.'
        },
        monogram: {
            title: 'Metodologia · Ligadura Zos Kia (Austin Osman Spare)',
            body: 'Decompõe cada letra restante em seus traços anatômicos reais (hastes, travessões, diagonais e arcos) e solda suas âncoras comuns num único glifo composto — em núcleo concêntrico, órbita, vetor oblíquo, tríade ou haste.'
        },
        freehand: {
            title: 'Metodologia · Autografia & Caleidoscópio',
            body: 'Permite traçar selos automáticos diretamente com o cursor sobre o altar, aplicando espelhamento rotacional instantâneo (1× livre, 2× bilateral, 4× cruz ou 8× estrela).'
        }
    };

    // Primal Alphabet Vector Anatomy (A-Z) in normalized [-1, 1] coordinates
    // Each letter defines polyline/curve commands and structural anchor sockets for Spare ligature welding
    const PRIMAL_GLYPHS = {
        A: {
            cmds: [
                { t: 'L', pts: [[-0.65, 0.92], [0, -0.92], [0.65, 0.92]] },
                { t: 'L', pts: [[-0.38, 0.22], [0.38, 0.22]] }
            ],
            anchors: [[0, -0.92], [-0.65, 0.92], [0.65, 0.92], [0, 0.22]]
        },
        B: {
            cmds: [
                { t: 'L', pts: [[-0.5, -0.92], [-0.5, 0.92]] },
                { t: 'C', start: [-0.5, -0.92], segs: [[[0.52, -0.92], [0.52, -0.02], [-0.5, -0.02]], [[0.62, -0.02], [0.62, 0.92], [-0.5, 0.92]]] }
            ],
            anchors: [[-0.5, -0.92], [-0.5, 0.92], [-0.5, -0.02], [0.36, 0.45]]
        },
        C: {
            cmds: [
                { t: 'C', start: [0.54, -0.7], segs: [[[-0.76, -0.92], [-0.76, 0.92], [0.54, 0.7]]] }
            ],
            anchors: [[0.54, -0.7], [-0.46, 0], [0.54, 0.7]]
        },
        D: {
            cmds: [
                { t: 'L', pts: [[-0.5, -0.92], [-0.5, 0.92]] },
                { t: 'C', start: [-0.5, -0.92], segs: [[[0.76, -0.92], [0.76, 0.92], [-0.5, 0.92]]] }
            ],
            anchors: [[-0.5, -0.92], [-0.5, 0.92], [0.44, 0], [-0.5, 0]]
        },
        E: {
            cmds: [
                { t: 'L', pts: [[0.48, -0.9], [-0.48, -0.9], [-0.48, 0.9], [0.5, 0.9]] },
                { t: 'L', pts: [[-0.48, 0], [0.34, 0]] }
            ],
            anchors: [[-0.48, 0], [-0.48, -0.9], [-0.48, 0.9], [0.48, -0.9]]
        },
        F: {
            cmds: [
                { t: 'L', pts: [[0.5, -0.9], [-0.48, -0.9], [-0.48, 0.92]] },
                { t: 'L', pts: [[-0.48, 0.02], [0.34, 0.02]] }
            ],
            anchors: [[-0.48, 0.02], [-0.48, -0.9], [-0.48, 0.92], [0.5, -0.9]]
        },
        G: {
            cmds: [
                { t: 'C', start: [0.52, -0.68], segs: [[[-0.76, -0.92], [-0.76, 0.92], [0.54, 0.72]]] },
                { t: 'L', pts: [[0.54, 0.72], [0.54, 0.05], [0.02, 0.05]] }
            ],
            anchors: [[0.54, 0.05], [-0.46, 0], [0.02, 0.05], [0.52, -0.68]]
        },
        H: {
            cmds: [
                { t: 'L', pts: [[-0.54, -0.92], [-0.54, 0.92]] },
                { t: 'L', pts: [[0.54, -0.92], [0.54, 0.92]] },
                { t: 'L', pts: [[-0.54, 0], [0.54, 0]] }
            ],
            anchors: [[0, 0], [-0.54, 0], [0.54, 0], [-0.54, -0.92], [0.54, 0.92]]
        },
        I: {
            cmds: [
                { t: 'L', pts: [[0, -0.92], [0, 0.92]] },
                { t: 'L', pts: [[-0.32, -0.92], [0.32, -0.92]] },
                { t: 'L', pts: [[-0.32, 0.92], [0.32, 0.92]] }
            ],
            anchors: [[0, 0], [0, -0.92], [0, 0.92]]
        },
        J: {
            cmds: [
                { t: 'L', pts: [[0.3, -0.92], [0.3, 0.36]] },
                { t: 'C', start: [0.3, 0.36], segs: [[[0.3, 0.96], [-0.54, 0.96], [-0.54, 0.4]]] }
            ],
            anchors: [[0.3, -0.92], [0.3, 0], [-0.12, 0.82]]
        },
        K: {
            cmds: [
                { t: 'L', pts: [[-0.5, -0.92], [-0.5, 0.92]] },
                { t: 'L', pts: [[0.54, -0.9], [-0.5, 0.04], [0.56, 0.92]] }
            ],
            anchors: [[-0.5, 0.04], [-0.5, -0.92], [0.54, -0.9], [0.56, 0.92]]
        },
        L: {
            cmds: [
                { t: 'L', pts: [[-0.46, -0.92], [-0.46, 0.9], [0.54, 0.9]] }
            ],
            anchors: [[-0.46, 0.9], [-0.46, -0.92], [0.54, 0.9], [-0.46, 0]]
        },
        M: {
            cmds: [
                { t: 'L', pts: [[-0.7, 0.92], [-0.7, -0.9], [0, 0.22], [0.7, -0.9], [0.7, 0.92]] }
            ],
            anchors: [[0, 0.22], [-0.7, -0.9], [0.7, -0.9], [-0.7, 0.92], [0.7, 0.92]]
        },
        N: {
            cmds: [
                { t: 'L', pts: [[-0.55, 0.92], [-0.55, -0.9], [0.55, 0.9], [0.55, -0.92]] }
            ],
            anchors: [[0, 0], [-0.55, -0.9], [0.55, 0.9], [-0.55, 0.92], [0.55, -0.92]]
        },
        O: {
            cmds: [
                { t: 'C', start: [0, -0.88], segs: [[[0.82, -0.88], [0.82, 0.88], [0, 0.88]], [[-0.82, 0.88], [-0.82, -0.88], [0, -0.88]]] }
            ],
            anchors: [[0, -0.88], [0, 0.88], [-0.62, 0], [0.62, 0]]
        },
        P: {
            cmds: [
                { t: 'L', pts: [[-0.46, 0.92], [-0.46, -0.92]] },
                { t: 'C', start: [-0.46, -0.92], segs: [[[0.64, -0.92], [0.64, 0.06], [-0.46, 0.06]]] }
            ],
            anchors: [[-0.46, 0.06], [-0.46, -0.92], [-0.46, 0.92], [0.36, -0.43]]
        },
        Q: {
            cmds: [
                { t: 'C', start: [0, -0.86], segs: [[[0.8, -0.86], [0.8, 0.82], [0, 0.82]], [[-0.8, 0.82], [-0.8, -0.86], [0, -0.86]]] },
                { t: 'L', pts: [[0.1, 0.25], [0.7, 0.95]] }
            ],
            anchors: [[0.1, 0.25], [0, -0.86], [0.7, 0.95], [-0.6, 0]]
        },
        R: {
            cmds: [
                { t: 'L', pts: [[-0.46, 0.92], [-0.46, -0.92]] },
                { t: 'C', start: [-0.46, -0.92], segs: [[[0.62, -0.92], [0.62, 0.04], [-0.46, 0.04]]] },
                { t: 'L', pts: [[-0.1, 0.04], [0.56, 0.92]] }
            ],
            anchors: [[-0.46, 0.04], [-0.46, -0.92], [0.56, 0.92], [-0.46, 0.92]]
        },
        S: {
            cmds: [
                { t: 'C', start: [0.48, -0.66], segs: [[[0.1, -1.02], [-0.66, -0.8], [-0.5, -0.26]], [[-0.34, 0.18], [0.66, 0.08], [0.52, 0.6]], [[0.4, 0.98], [-0.3, 0.98], [-0.54, 0.64]]] }
            ],
            anchors: [[0, 0], [0.48, -0.66], [-0.54, 0.64]]
        },
        T: {
            cmds: [
                { t: 'L', pts: [[-0.66, -0.9], [0.66, -0.9]] },
                { t: 'L', pts: [[0, -0.9], [0, 0.92]] }
            ],
            anchors: [[0, -0.9], [0, 0.92], [0, 0], [-0.66, -0.9], [0.66, -0.9]]
        },
        U: {
            cmds: [
                { t: 'L', pts: [[-0.54, -0.92], [-0.54, 0.26]] },
                { t: 'C', start: [-0.54, 0.26], segs: [[[-0.54, 0.98], [0.54, 0.98], [0.54, 0.26]]] },
                { t: 'L', pts: [[0.54, 0.26], [0.54, -0.92]] }
            ],
            anchors: [[0, 0.8], [-0.54, -0.92], [0.54, -0.92]]
        },
        V: {
            cmds: [
                { t: 'L', pts: [[-0.64, -0.92], [0, 0.92], [0.64, -0.92]] }
            ],
            anchors: [[0, 0.92], [-0.64, -0.92], [0.64, -0.92], [0, 0]]
        },
        W: {
            cmds: [
                { t: 'L', pts: [[-0.8, -0.9], [-0.4, 0.9], [0, -0.22], [0.4, 0.9], [0.8, -0.9]] }
            ],
            anchors: [[0, -0.22], [-0.4, 0.9], [0.4, 0.9], [-0.8, -0.9], [0.8, -0.9]]
        },
        X: {
            cmds: [
                { t: 'L', pts: [[-0.62, -0.9], [0.62, 0.9]] },
                { t: 'L', pts: [[0.62, -0.9], [-0.62, 0.9]] }
            ],
            anchors: [[0, 0], [-0.62, -0.9], [0.62, 0.9], [0.62, -0.9], [-0.62, 0.9]]
        },
        Y: {
            cmds: [
                { t: 'L', pts: [[-0.62, -0.92], [0, 0.04], [0.62, -0.92]] },
                { t: 'L', pts: [[0, 0.04], [0, 0.92]] }
            ],
            anchors: [[0, 0.04], [0, 0.92], [-0.62, -0.92], [0.62, -0.92]]
        },
        Z: {
            cmds: [
                { t: 'L', pts: [[-0.58, -0.9], [0.58, -0.9], [-0.58, 0.9], [0.58, 0.9]] }
            ],
            anchors: [[0, 0], [-0.58, -0.9], [0.58, -0.9], [-0.58, 0.9], [0.58, 0.9]]
        }
    };

    // Catalog of all 24 Seals & Ornamentations with rich scholarly tooltips
    const SEAL_CATALOG = {
        'double-inscribed': {
            cat: 'classic', chip: 'Anel Duplo', title: 'Anel Duplo + Inscrição Orbital',
            lore: 'Duplo círculo mágico hermético de contenção com pontos cardeais e inscrição orbital contínua das consoantes destiladas e suas equivalentes hebraicas.',
            compactSigil: false
        },
        'single': {
            cat: 'classic', chip: 'Círculo Simples', title: 'Círculo Hermético Simples',
            lore: 'O anel indivisível de concentração da Vontade: delimita o microcosmo sagrado do sigilo separando-o da dispersão profana.',
            compactSigil: false
        },
        'octagram': {
            cat: 'classic', chip: 'Octograma 8×', title: 'Octograma (Estrela de 8 Pontas)',
            lore: 'Dois quadrados entrelaçados a 45° com oito vetores radiais — emblema da Magia do Caos (Peter J. Carroll) e da regeneração mercurial sobre o acaso.',
            compactSigil: true
        },
        'hexagram': {
            cat: 'classic', chip: 'Hexagrama Solar', title: 'Hexagrama Hermético (Fogo & Água)',
            lore: 'Interpenetração do triângulo ascendente do Fogo e do triângulo descendente da Água ("Assim na Terra como no Céu"), equilibrando as forças planetárias em Tiphareth.',
            compactSigil: true
        },
        'none': {
            cat: 'classic', chip: 'Sigilo Nu', title: 'Nu (Sigilo Puro sem Moldura)',
            lore: 'Exibe exclusivamente a cifragem gráfica pura da intenção, ideal para gravação direta em talismãs físicos, velas, pergaminho ou visualização austera.',
            compactSigil: false
        },

        // Thelema & Enochian
        'aa': {
            cat: 'thelema', chip: 'A∴A∴ Astrum Argentum', title: 'Selo da A∴A∴ (Astrum Argentum)',
            lore: 'Selo da Estrela de Prata (Ordem fundada por Aleister Crowley e George Cecil Jones em 1907): Heptagrama 7/2 entrelaçado ao heptágono interior com as sete letras de BABALON, encimado pelo Olho Radiante de Binah sobre o Abismo.',
            compactSigil: true
        },
        'babalon': {
            cat: 'thelema', chip: 'Selo de Babalon', title: 'Selo de Nossa Senhora Babalon (156)',
            lore: 'O Heptagrama agudo 7/3 de Thelema inscrito com BABALON e o número 156 (Chokmah / Cidade das Pirâmides), repousando sobre o Crescente Lunar da Taça Sagrada (Graal) onde todo ego é vertido em êxtase.',
            compactSigil: true
        },
        'enochian': {
            cat: 'thelema', chip: 'Sigillum Dei Æmeth', title: 'Selo Enoquiano — Sigillum Dei Æmeth',
            lore: 'O "Selo da Verdade de Deus" recebido por Dr. John Dee e Edward Kelley (1582): coroa externa das 40 letras divinas, Grande Heptágono dos Arcanjos Planetários, Heptagrama 7/2, Heptágono interno e Pentagrama central com as cinco cruzes da Luz.',
            compactSigil: true
        },

        // 7 Planetary Pentacles (Clavicula Salomonis)
        'pantacle-sun': {
            cat: 'pantacles', chip: '☉ Sol', title: 'Pantáculo do Sol (Tiphareth · Ouro)',
            lore: 'Inspirado na Clavicula Salomonis: Grande Hexagrama Solar de 12 raios flamejantes inscrito com YHVH Eloah va-Daath (יהוה אלוה ודעת), Metatron, inteligência Nakhiel (111) e espírito Sorath (666). Rege iluminação, soberania, vitalidade e glória.',
            compactSigil: true, ringText: '☉ יהוה אלוה ודעת · METATRON · NAKHIEL · SORATH · SHEMESH ', glyph: '☉'
        },
        'pantacle-moon': {
            cat: 'pantacles', chip: '☽ Lua', title: 'Pantáculo da Lua (Yesod · Prata)',
            lore: 'Pantáculo Lunar das Portas Astrais (Clavicula Salomonis): duplo crescente prateado e os 28 marcos das mansões lunares, inscrito com Shaddai El Chai (שדי אל חי), Gabriel e Chashmodai. Rege intuição, sonhos, viagens astrais e mistérios noturnos.',
            compactSigil: true, ringText: '☽ שדי אל חי · GABRIEL · CHASHMODAI · LEVANAH · YESOD ', glyph: '☽'
        },
        'pantacle-mercury': {
            cat: 'pantacles', chip: '☿ Mercúrio', title: 'Pantáculo de Mercúrio (Hod · Azougue)',
            lore: 'Pantáculo Hermético de Mercúrio (Clavicula Salomonis): estrela octogonal dupla da razão, eixos caduceanos e inscrição Elohim Tzabaoth (אלהים צבאות), Raphael, inteligência Tiriel (260) e espírito Taphthartharath. Rege ciência oculta, verbo, escrita e abertura de portas.',
            compactSigil: true, ringText: '☿ אלהים צבאות · RAPHAEL · TIRIEL · TAPHTHARTHARATH · KOKAB ', glyph: '☿'
        },
        'pantacle-venus': {
            cat: 'pantacles', chip: '♀ Vênus', title: 'Pantáculo de Vênus (Netzach · Cobre)',
            lore: 'Pantáculo Venusiano (Clavicula Salomonis): Heptagrama da Harmonia e Rosa interna inscrita com YHVH Tzabaoth (יהוה צבאות), Haniel, inteligência Hagiel (49) e espírito Kedemel. Rege magnetismo, arte, beleza, amor e concórdia.',
            compactSigil: true, ringText: '♀ יהוה צבאות · HANIEL · HAGIEL · KEDEMEL · NOGAH ', glyph: '♀'
        },
        'pantacle-mars': {
            cat: 'pantacles', chip: '♂ Marte', title: 'Pantáculo de Marte (Geburah · Ferro)',
            lore: 'Grande Pantáculo Marcial (Clavicula Salomonis): Pentagrama e lanças ígneas radiais inscritos com Elohim Gibor (אלהים גבור), AGLA, Khamael, inteligência Graphiel e espírito Bartzabel. Rege coragem, força executiva, proteção combativa e corte de entraves.',
            compactSigil: true, ringText: '♂ אלהים גבור · KHAMAEL · GRAPHIEL · BARTZABEL · MADIM ', glyph: '♂'
        },
        'pantacle-jupiter': {
            cat: 'pantacles', chip: '♃ Júpiter', title: 'Pantáculo de Júpiter (Chesed · Estanho)',
            lore: 'Pantáculo Soberano de Júpiter (Clavicula Salomonis): Cruz Potenciada dos quatro quadrantes e selo de Parasiel inscritos com El (אל), Eheieh, Tzadkiel, inteligência Jophiel (136) e espírito Hismael. Rege prosperidade, justiça, expansão e autoridade.',
            compactSigil: true, ringText: '♃ אל · אהיה · TZADKIEL · JOPHIEL · HISMAEL · PARASIEL ', glyph: '♃'
        },
        'pantacle-saturn': {
            cat: 'pantacles', chip: '♄ Saturno', title: 'Pantáculo de Saturno (Binah · Chumbo)',
            lore: 'Grande Pantáculo Saturnino (Clavicula Salomonis): cruz patriarcal selada e triângulo austero inscritos com YHVH Elohim (יהוה אלהים), Tzaphkiel, inteligência Agiel (45) e espírito Zazel. Rege proteção severa, silêncio, limites, paciência e obras do tempo.',
            compactSigil: true, ringText: '♄ יהוה אלהים · TZAPHKIEL · AGIEL · ZAZEL · SHABBATHAI ', glyph: '♄'
        },

        // Goetia & Solomonic Evocation Seals (Lemegeton / Ars Goetia)
        'goetia-circle': {
            cat: 'goetia', chip: 'Círculo de Salomão', title: 'Goécia — Grande Círculo Mágico de Salomão',
            lore: 'O Círculo Salomônico do Lemegeton: faixa dupla serpentina com os grandes Nomes Divinos (TETRAGRAMMATON, EHEIEH, ADONAI, ELOHIM GIBOR) e quatro hexagramas/pentagramas cardeais que resguardam o operador no eixo do Universo.',
            compactSigil: true, ringText: '✠ TETRAGRAMMATON · ANAPHAXETON · PRIMEUMATON · EHEIEH · ADONAI '
        },
        'goetia-triangle': {
            cat: 'goetia', chip: 'Triângulo da Arte', title: 'Goécia — Triângulo Salomônico da Arte',
            lore: 'Triângulo equilátero de manifestação da Ars Goetia ladeado pelos nomes ANAPHAXETON, TETRAGRAMMATON e PRIMEUMATON, com MI-CHA-EL segmentado nos três lados e o espelho escuro central de condensação.',
            compactSigil: true
        },
        'goetia-bael': {
            cat: 'goetia', chip: '#01 Bael', title: 'Goécia #01 — Bael (Rei do Oriente · ☉ Sol)',
            lore: '1º Espírito do Lemegeton — Grande Rei que comanda 66 legiões. Seu selo tradicional articula cruzes simétricas e cálice central; confere astúcia estratégica, discrição/invisibilidade aos olhos adversários e ciência política.',
            compactSigil: true, spirit: 'bael', ringText: 'I · BAEL · REX ORIENTIS · LXVI LEGIONES · ☉ SHEMESH · '
        },
        'goetia-vassago': {
            cat: 'goetia', chip: '#03 Vassago', title: 'Goécia #03 — Vassago (Príncipe · ♃ Júpiter)',
            lore: '3º Espírito da Ars Goetia — Poderoso Príncipe de natureza benéfica (26 legiões). Seu selo em chave angular e cruzes duplas declara acontecimentos passados e vindouros e revela o que está oculto ou perdido.',
            compactSigil: true, spirit: 'vassago', ringText: 'III · VASSAGO · PRINCEPS · XXVI LEGIONES · ♃ TZEDEQ · '
        },
        'goetia-paimon': {
            cat: 'goetia', chip: '#09 Paimon', title: 'Goécia #09 — Paimon (Grande Rei · ☉ Sol)',
            lore: '9º Espírito da Ars Goetia — Grande Rei obediente a Lúcifer (200 legiões). Seu icônico selo traz a arcada coroada por quatro figuras/hastes sobre pedestal cruciforme; ensina todas as artes, ciências secretas, dignidades e mistérios da Terra e do abismo.',
            compactSigil: true, spirit: 'paimon', ringText: 'IX · PAIMON · REX MAGNUS · CC LEGIONES · ☉ SHEMESH · '
        },
        'goetia-buer': {
            cat: 'goetia', chip: '#10 Buer', title: 'Goécia #10 — Buer (Presidente · ☿ Mercúrio)',
            lore: '10º Espírito da Ars Goetia — Grande Presidente que aparece quando o Sol transita Sagitário (50 legiões). Seu selo radial de cinco braços recurvados ensina filosofia moral e natural, lógica, virtudes das ervas e restauração da saúde.',
            compactSigil: true, spirit: 'buer', ringText: 'X · BUER · PRAESES · L LEGIONES · ☿ KOKAB · '
        },
        'goetia-gusion': {
            cat: 'goetia', chip: '#11 Gusion', title: 'Goécia #11 — Gusion (Duque · ♀ Vênus)',
            lore: '11º Espírito da Ars Goetia — Forte Duque (40 legiões). Seu selo une crescente receptivo, V axial e cruzes laterais; discerne todas as coisas passadas, presentes e futuras, reconcilia alianças e outorga honra e dignidade.',
            compactSigil: true, spirit: 'gusion', ringText: 'XI · GUSION · DUX · XL LEGIONES · ♀ NOGAH · '
        },
        'goetia-astaroth': {
            cat: 'goetia', chip: '#29 Astaroth', title: 'Goécia #29 — Astaroth (Poderoso Duque · ♀ Vênus)',
            lore: '29º Espírito da Ars Goetia — Grande e Forte Duque (40 legiões). Seu célebre selo inscreve o pentagrama assimétrico atravessado por lança cruciforme e signos estelares; responde com verdade sobre passado, presente, futuro e todas as ciências liberais.',
            compactSigil: true, spirit: 'astaroth', ringText: 'XXIX · ASTAROTH · DUX MAGNUS · XL LEGIONES · ♀ NOGAH · '
        },
        'goetia-asmoday': {
            cat: 'goetia', chip: '#32 Asmoday', title: 'Goécia #32 — Asmoday (Rei · ☉ Sol)',
            lore: '32º Espírito da Ars Goetia — Rei forte e soberano (72 legiões). Seu selo solar concêntrico e cruciforme confere o Anel das Virtudes, ensina aritmética, astronomia, geometria e todas as artes mecânicas, além de guardar tesouros.',
            compactSigil: true, spirit: 'asmoday', ringText: 'XXXII · ASMODAY · REX · LXXII LEGIONES · ☉ SHEMESH · '
        },
        'goetia-orobas': {
            cat: 'goetia', chip: '#55 Orobas', title: 'Goécia #55 — Orobas (Príncipe · ♃ Júpiter)',
            lore: '55º Espírito da Ars Goetia — Grande Príncipe (20 legiões), notável por ser inteiramente fiel ao conjurador e impedir que qualquer espírito o engane. Seu selo simétrico em coluna de arcos duplos outorga verdade oracular, honras e proteção.',
            compactSigil: true, spirit: 'orobas', ringText: 'LV · OROBAS · PRINCEPS FIDELIS · XX LEGIONES · ♃ TZEDEQ · '
        },
        'goetia-belial': {
            cat: 'goetia', chip: '#68 Belial', title: 'Goécia #68 — Belial (Poderoso Rei · ☉ Sol)',
            lore: '68º Espírito da Ars Goetia — Rei imponente (80 legiões). Seu selo geométrico de dois círculos superiores e cruzes axiais rege autonomia radical, eloquência persuasiva, distribuição de dignidades e soberania pessoal.',
            compactSigil: true, spirit: 'belial', ringText: 'LXVIII · BELIAL · REX POTENS · LXXX LEGIONES · ☉ SHEMESH · '
        },
        'goetia-dantalion': {
            cat: 'goetia', chip: '#71 Dantalion', title: 'Goécia #71 — Dantalion (Grande Duque · ♀ Vênus)',
            lore: '71º Espírito da Ars Goetia — Grande Duque de múltiplos semblantes que traz um livro na mão direita (36 legiões). Seu selo em cálice triangular e cruzes gêmeas ensina todas as artes e ciências, revela conselhos secretos e opera sobre a psique.',
            compactSigil: true, spirit: 'dantalion', ringText: 'LXXI · DANTALION · DUX · XXXVI LEGIONES · ♀ NOGAH · '
        }
    };

    // Authentic Magic Square generator (Agrippa De Occulta Philosophia)
    function buildMagicSquare(n) {
        if (n === 3) {
            return [
                [4, 9, 2],
                [3, 5, 7],
                [8, 1, 6]
            ];
        }
        if (n === 4) {
            return [
                [4,  14, 15, 1],
                [9,  7,  6,  12],
                [5,  11, 10, 8],
                [16, 2,  3,  13]
            ];
        }
        if (n === 6) {
            return [
                [6,  32, 3,  34, 35, 1],
                [7,  11, 27, 28, 8,  30],
                [19, 14, 16, 15, 23, 24],
                [18, 20, 22, 21, 17, 13],
                [25, 29, 10, 9,  26, 12],
                [36, 5,  33, 4,  2,  31]
            ];
        }
        if (n === 8) {
            const grid = Array.from({ length: 8 }, () => Array(8).fill(0));
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const idx = r * 8 + c + 1;
                    const mr = r % 4;
                    const mc = c % 4;
                    const onDiag = (mr === mc) || (mr + mc === 3);
                    grid[r][c] = onDiag ? (65 - idx) : idx;
                }
            }
            return grid;
        }
        const grid = Array.from({ length: n }, () => Array(n).fill(0));
        let r = 0;
        let c = Math.floor(n / 2);
        for (let num = 1; num <= n * n; num++) {
            grid[r][c] = num;
            const nr = (r - 1 + n) % n;
            const nc = (c + 1) % n;
            if (grid[nr][nc] !== 0) {
                r = (r + 1) % n;
            } else {
                r = nr;
                c = nc;
            }
        }
        return grid;
    }

    function svgEl(tag, attrs = {}) {
        const el = document.createElementNS(SVG_NS, tag);
        for (const [k, v] of Object.entries(attrs)) {
            el.setAttribute(k, String(v));
        }
        return el;
    }

    function pointsToPath(pts, tension01) {
        if (pts.length === 0) return '';
        if (pts.length === 1) return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        if (tension01 <= 0.02 || pts.length === 2) {
            return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
        }

        const k = tension01 * 0.36;
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i === 0 ? 0 : i - 1];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

            const cp1x = p1.x + (p2.x - p0.x) * k;
            const cp1y = p1.y + (p2.y - p0.y) * k;
            const cp2x = p2.x - (p3.x - p1.x) * k;
            const cp2y = p2.y - (p3.y - p1.y) * k;

            d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
        }
        return d;
    }

    function reduceDigitalRoot(num) {
        let n = num;
        while (n > 9) {
            n = String(n).split('').reduce((acc, d) => acc + Number(d), 0);
        }
        return n;
    }

    // Star / Polygon SVG helper
    function starPolygonPoints(cx, cy, r, n, step = 1, startDeg = -90) {
        const pts = [];
        let idx = 0;
        for (let i = 0; i < n; i++) {
            const a = ((startDeg + (idx * 360) / n) * Math.PI) / 180;
            pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
            idx = (idx + step) % n;
        }
        return pts.join(' ');
    }

    // Goetic Cross helper (line terminating with perpendicular crossbar)
    function drawCrossArm(group, x1, y1, x2, y2, ink, sw, op = 0.45, barLen = 11) {
        group.appendChild(svgEl('line', { x1, y1, x2, y2, stroke: ink, 'stroke-width': sw, 'stroke-opacity': op, 'stroke-linecap': 'round' }));
        const ang = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
        const t = 0.78;
        const bx = x1 + (x2 - x1) * t;
        const by = y1 + (y2 - y1) * t;
        group.appendChild(svgEl('line', {
            x1: bx - Math.cos(ang) * barLen, y1: by - Math.sin(ang) * barLen,
            x2: bx + Math.cos(ang) * barLen, y2: by + Math.sin(ang) * barLen,
            stroke: ink, 'stroke-width': sw * 0.9, 'stroke-opacity': op, 'stroke-linecap': 'round'
        }));
        const eLen = barLen * 0.65;
        group.appendChild(svgEl('line', {
            x1: x2 - Math.cos(ang) * eLen, y1: y2 - Math.sin(ang) * eLen,
            x2: x2 + Math.cos(ang) * eLen, y2: y2 + Math.sin(ang) * eLen,
            stroke: ink, 'stroke-width': sw * 0.85, 'stroke-opacity': op, 'stroke-linecap': 'round'
        }));
    }

    document.addEventListener('DOMContentLoaded', () => {
        const svg = document.getElementById('sigilSvg');
        const altarStage = document.getElementById('altarStage');
        const particlesCanvas = document.getElementById('altarParticlesCanvas');
        const intentInput = document.getElementById('sigilIntentInput');
        const stripVowelsToggle = document.getElementById('stripVowelsToggle');
        const dedupeToggle = document.getElementById('dedupeToggle');
        const seedDisplay = document.getElementById('distilledSeedDisplay');
        const hebDisplay = document.getElementById('distilledHebDisplay');
        const gemDisplay = document.getElementById('distilledGematriaDisplay');

        const engineMethodNote = document.getElementById('engineMethodNote');
        const kameaSub = document.getElementById('kameaSubControls');
        const monogramSub = document.getElementById('monogramSubControls');
        const monogramTopologySelect = document.getElementById('monogramTopologySelect');
        const kameaSelect = document.getElementById('kameaPlanetSelect');
        const symmetrySelect = document.getElementById('symmetrySelect');
        const showMatrixGuide = document.getElementById('showMatrixGuide');
        const frameSelect = document.getElementById('frameSelect');
        const frameTooltipBadge = document.getElementById('frameTooltipBadge');
        const sealLoreCard = document.getElementById('sealLoreCard');
        const sealCatTabs = document.getElementById('sealCatTabs');
        const sealChipsGrid = document.getElementById('sealChipsGrid');
        const inkSelect = document.getElementById('inkSelect');
        const curveRange = document.getElementById('curveRange');
        const strokeRange = document.getElementById('strokeRange');
        const altarMethodLabel = document.getElementById('altarMethodLabel');

        if (!svg || !intentInput) return;

        const state = {
            engine: 'rosecross',
            planet: 'sun',
            monogramTopology: 'nexus',
            monogramSeed: 1,
            sealCategory: 'thelema',
            freehandStrokes: [],
            activeStroke: null,
            veiled: false
        };

        // ======================================================================
        // Floating Viewport-Clamped Tooltip Portal
        // ======================================================================
        const portalTip = document.createElement('div');
        portalTip.className = 'sigil-floating-tooltip';
        portalTip.setAttribute('role', 'tooltip');
        document.body.appendChild(portalTip);
        document.body.classList.add('has-sigil-portal');

        let activeTipTarget = null;

        function positionPortalTip(target) {
            if (!target) return;
            const rect = target.getBoundingClientRect();
            const tw = portalTip.offsetWidth || 280;
            const th = portalTip.offsetHeight || 80;
            let left = rect.left + rect.width / 2 - tw / 2;
            left = Math.max(12, Math.min(window.innerWidth - tw - 12, left));
            let top = rect.top - th - 10;
            if (top < 12) top = rect.bottom + 10;
            portalTip.style.left = `${Math.round(left)}px`;
            portalTip.style.top = `${Math.round(top)}px`;
        }

        function showPortalTip(target) {
            const text = target.getAttribute('data-tooltip');
            if (!text) return;
            const title = target.getAttribute('data-tooltip-title');
            portalTip.innerHTML = title ? `<strong>${title}</strong>${text}` : text;
            activeTipTarget = target;
            portalTip.classList.add('is-visible');
            positionPortalTip(target);
        }

        function hidePortalTip() {
            activeTipTarget = null;
            portalTip.classList.remove('is-visible');
        }

        document.addEventListener('pointerover', (e) => {
            const t = e.target.closest?.('[data-tooltip]');
            if (t) showPortalTip(t);
        });
        document.addEventListener('pointerout', (e) => {
            if (activeTipTarget && !e.relatedTarget?.closest?.('[data-tooltip]')) hidePortalTip();
        });
        document.addEventListener('pointerdown', (e) => {
            if (activeTipTarget && !e.target.closest?.('[data-tooltip]')) hidePortalTip();
        });
        document.addEventListener('focusin', (e) => {
            const t = e.target.closest?.('[data-tooltip]');
            if (t) showPortalTip(t);
        });
        document.addEventListener('focusout', hidePortalTip);
        window.addEventListener('scroll', () => { if (activeTipTarget) positionPortalTip(activeTipTarget); }, { passive: true });

        // ======================================================================
        // Seal Category Chips Gallery & Lore Sync
        // ======================================================================
        function renderSealChips() {
            if (!sealChipsGrid) return;
            const currentVal = frameSelect.value;
            const entries = Object.entries(SEAL_CATALOG).filter(([, meta]) => meta.cat === state.sealCategory);
            sealChipsGrid.innerHTML = entries.map(([key, meta]) => `
                <button
                    type="button"
                    class="seal-chip ${key === currentVal ? 'is-active' : ''}"
                    data-seal="${key}"
                    data-tooltip-title="${meta.title.replace(/"/g, '&quot;')}"
                    data-tooltip="${meta.lore.replace(/"/g, '&quot;')}"
                >${meta.chip}</button>
            `).join('');

            sealChipsGrid.querySelectorAll('.seal-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    frameSelect.value = chip.dataset.seal;
                    syncSealLoreAndUI();
                    renderSigil();
                });
            });
        }

        function syncSealLoreAndUI() {
            const key = frameSelect.value;
            const meta = SEAL_CATALOG[key] || SEAL_CATALOG['double-inscribed'];
            if (sealLoreCard) {
                sealLoreCard.innerHTML = `<strong>${meta.title}</strong>${meta.lore}`;
            }
            if (frameTooltipBadge) {
                frameTooltipBadge.setAttribute('data-tooltip-title', meta.title);
                frameTooltipBadge.setAttribute('data-tooltip', meta.lore);
            }
            if (meta.cat && meta.cat !== state.sealCategory) {
                state.sealCategory = meta.cat;
                sealCatTabs?.querySelectorAll('.seal-cat-tab').forEach(t => {
                    t.classList.toggle('is-active', t.dataset.cat === state.sealCategory);
                });
            }
            renderSealChips();
        }

        sealCatTabs?.querySelectorAll('.seal-cat-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                state.sealCategory = tab.dataset.cat;
                sealCatTabs.querySelectorAll('.seal-cat-tab').forEach(t => t.classList.remove('is-active'));
                tab.classList.add('is-active');
                renderSealChips();
            });
        });

        function syncEngineNote() {
            const info = ENGINE_NOTES[state.engine];
            if (engineMethodNote && info) {
                engineMethodNote.innerHTML = `<strong>${info.title}</strong>${info.body}`;
            }
        }

        // ======================================================================
        // Intent Distillation
        // ======================================================================
        function distillIntent() {
            const raw = intentInput.value || '';
            let letters = raw
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toUpperCase()
                .replace(/[^A-Z]/g, '')
                .split('');

            if (stripVowelsToggle.checked) {
                letters = letters.filter(ch => !'AEIOU'.includes(ch));
            }
            if (dedupeToggle.checked) {
                const seen = new Set();
                letters = letters.filter(ch => {
                    if (seen.has(ch)) return false;
                    seen.add(ch);
                    return true;
                });
            }

            const hebArr = letters.map(ch => LETTER_ARCANA[ch]?.heb || '');
            const gemSum = letters.reduce((acc, ch) => acc + (LETTER_ARCANA[ch]?.gem || 0), 0);
            const root = gemSum > 0 ? reduceDigitalRoot(gemSum) : 0;

            seedDisplay.textContent = letters.length ? letters.join(' ') : '∅ (Apenas selo / traço manual)';
            hebDisplay.textContent = hebArr.length ? hebArr.join(' ') : '—';
            gemDisplay.textContent = gemSum > 0 ? `${gemSum} (Raiz ${root})` : '0';

            return { letters, hebArr, gemSum, root };
        }

        function roseCrossCoord(ch) {
            const meta = LETTER_ARCANA[ch];
            if (!meta) return { x: 300, y: 300 };
            const radii = [56, 114, 178];
            const r = radii[meta.ring];
            const phaseOffsets = [-Math.PI / 2, -Math.PI / 2 + 0.22, -Math.PI / 2 + 0.12];
            const angle = phaseOffsets[meta.ring] + (meta.idx / meta.total) * Math.PI * 2;
            return {
                x: 300 + Math.cos(angle) * r,
                y: 300 + Math.sin(angle) * r
            };
        }

        // ======================================================================
        // Sacred Seals, Pentacles & Goetic Ornamentation Renderer
        // ======================================================================
        function addCircularRingText(defs, group, pathId, radius, textStr, ink, fontSize = 10, opacity = 0.52, spacing = 3.6, orbiting = true) {
            const p = svgEl('path', {
                id: pathId,
                d: `M 300, ${300 - radius} a ${radius},${radius} 0 1,1 -0.1,0`
            });
            defs.appendChild(p);
            const wrap = orbiting ? svgEl('g', { class: 'orbital-inscription' }) : svgEl('g');
            const textEl = svgEl('text', {
                fill: ink,
                'fill-opacity': String(opacity),
                'font-size': String(fontSize),
                'font-family': 'JetBrains Mono, monospace',
                'letter-spacing': String(spacing)
            });
            const tp = svgEl('textPath', { href: `#${pathId}`, startOffset: '0%' });
            tp.textContent = Array(4).fill(textStr).join(' · ');
            textEl.appendChild(tp);
            wrap.appendChild(textEl);
            group.appendChild(wrap);
        }

        function renderSacredFrame(defs, frameGroup, frame, ink, letters, hebArr) {
            if (frame === 'none') return;

            if (frame === 'single' || frame === 'double-inscribed') {
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 270, fill: 'none', stroke: ink, 'stroke-width': 1.25, 'stroke-opacity': 0.58 }));
                if (frame === 'double-inscribed') {
                    frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 236, fill: 'none', stroke: ink, 'stroke-width': 0.95, 'stroke-opacity': 0.36 }));
                    [0, 90, 180, 270].forEach(deg => {
                        const rad = (deg * Math.PI) / 180;
                        frameGroup.appendChild(svgEl('line', {
                            x1: 300 + Math.cos(rad) * 236, y1: 300 + Math.sin(rad) * 236,
                            x2: 300 + Math.cos(rad) * 270, y2: 300 + Math.sin(rad) * 270,
                            stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.36
                        }));
                    });
                    const inscr = letters.length > 0
                        ? `${letters.join(' · ')} ∴ ${hebArr.join(' ')} ∴ `
                        : 'ARS SIGILLORUM ∴ ZOS KIA ∴ ';
                    addCircularRingText(defs, frameGroup, 'orbitDoublePath', 249, inscr, ink, 10.2, 0.46, 4.0, true);
                }
                return;
            }

            if (frame === 'octagram') {
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 266, fill: 'none', stroke: ink, 'stroke-width': 1.1, 'stroke-opacity': 0.48 }));
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 254, 4, 1, 0), fill: 'none', stroke: ink, 'stroke-width': 1, 'stroke-opacity': 0.38 }));
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 254, 4, 1, 45), fill: 'none', stroke: ink, 'stroke-width': 1, 'stroke-opacity': 0.38 }));
                for (let k = 0; k < 8; k++) {
                    const a = (k * Math.PI) / 4;
                    frameGroup.appendChild(svgEl('line', {
                        x1: 300 + Math.cos(a) * 195, y1: 300 + Math.sin(a) * 195,
                        x2: 300 + Math.cos(a) * 260, y2: 300 + Math.sin(a) * 260,
                        stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.35
                    }));
                }
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 175, fill: 'none', stroke: ink, 'stroke-width': 0.85, 'stroke-opacity': 0.25, 'stroke-dasharray': '3 4' }));
                return;
            }

            if (frame === 'hexagram') {
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 266, fill: 'none', stroke: ink, 'stroke-width': 1.1, 'stroke-opacity': 0.48 }));
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 254, 3, 1, -90), fill: 'none', stroke: ink, 'stroke-width': 1.1, 'stroke-opacity': 0.42 }));
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 254, 3, 1, 90), fill: 'none', stroke: ink, 'stroke-width': 1.1, 'stroke-opacity': 0.42 }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 146, fill: 'none', stroke: ink, 'stroke-width': 0.85, 'stroke-opacity': 0.28 }));
                return;
            }

            // Seal of A∴A∴ (Astrum Argentum)
            if (frame === 'aa') {
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 274, fill: 'none', stroke: ink, 'stroke-width': 1.4, 'stroke-opacity': 0.65 }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 244, fill: 'none', stroke: ink, 'stroke-width': 1.0, 'stroke-opacity': 0.45 }));
                addCircularRingText(defs, frameGroup, 'orbitAAPath', 255, 'A∴A∴ · ASTRUM ARGENTUM · CERTA AMORIS · ', ink, 9.8, 0.5, 3.8, true);

                // 7/2 Heptagram of the Silver Star + Inner Heptagon
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 242, 7, 2, -90), fill: 'none', stroke: ink, 'stroke-width': 1.25, 'stroke-opacity': 0.56 }));
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 242, 7, 1, -90), fill: 'none', stroke: ink, 'stroke-width': 0.85, 'stroke-opacity': 0.28 }));
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 168, 7, 1, -90 + 180 / 7), fill: 'none', stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.34 }));

                const bab = ['B', 'A', 'B', 'A', 'L', 'O', 'N'];
                bab.forEach((ch, i) => {
                    const ang = ((-90 + 180 / 7 + (i * 360) / 7) * Math.PI) / 180;
                    const tx = 300 + Math.cos(ang) * 204;
                    const ty = 300 + Math.sin(ang) * 204;
                    const lbl = svgEl('text', {
                        x: tx, y: ty, fill: ink, 'fill-opacity': 0.58,
                        'font-family': 'Playfair Display, serif', 'font-size': '13', 'font-weight': '700',
                        'text-anchor': 'middle', 'dominant-baseline': 'central'
                    });
                    lbl.textContent = ch;
                    frameGroup.appendChild(lbl);
                });

                // Radiant Eye in Triangle at top apex
                frameGroup.appendChild(svgEl('polygon', { points: '300,64 282,95 318,95', fill: '#050508', stroke: ink, 'stroke-width': 1.05, 'stroke-opacity': 0.72 }));
                frameGroup.appendChild(svgEl('ellipse', { cx: 300, cy: 84, rx: 8, ry: 4.5, fill: 'none', stroke: ink, 'stroke-width': 0.95, 'stroke-opacity': 0.8 }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 84, r: 2, fill: ink, 'fill-opacity': 0.85 }));
                return;
            }

            // Seal of Babalon
            if (frame === 'babalon') {
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 274, fill: 'none', stroke: ink, 'stroke-width': 1.45, 'stroke-opacity': 0.68 }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 238, fill: 'none', stroke: ink, 'stroke-width': 1.05, 'stroke-opacity': 0.45 }));
                addCircularRingText(defs, frameGroup, 'orbitBabalonPath', 252, 'BABALON · CLVI (156) · SANCTA GRAAL · NOX · ', ink, 9.8, 0.52, 3.8, true);

                // Acute 7/3 Heptagram of Babalon
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 236, 7, 3, -90), fill: 'none', stroke: ink, 'stroke-width': 1.35, 'stroke-opacity': 0.6 }));

                const bab = ['B', 'A', 'B', 'A', 'L', 'O', 'N'];
                bab.forEach((ch, i) => {
                    const ang = ((-90 + (i * 360) / 7) * Math.PI) / 180;
                    const tx = 300 + Math.cos(ang) * 212;
                    const ty = 300 + Math.sin(ang) * 212;
                    const lbl = svgEl('text', {
                        x: tx, y: ty, fill: ink, 'fill-opacity': 0.65,
                        'font-family': 'Playfair Display, serif', 'font-size': '13.5', 'font-weight': '700',
                        'text-anchor': 'middle', 'dominant-baseline': 'central'
                    });
                    lbl.textContent = ch;
                    frameGroup.appendChild(lbl);
                });

                // Receptive Lunar Chalice / Crescent of Babalon + Secret Cross at bottom sanctum
                frameGroup.appendChild(svgEl('path', {
                    d: 'M 244 438 C 266 474, 334 474, 356 438 C 332 458, 268 458, 244 438 Z',
                    fill: 'none', stroke: ink, 'stroke-width': 1.15, 'stroke-opacity': 0.62
                }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 150, fill: 'none', stroke: ink, 'stroke-width': 0.85, 'stroke-opacity': 0.28, 'stroke-dasharray': '4 4' }));
                return;
            }

            // Sigillum Dei Æmeth (Enochian Seal of John Dee)
            if (frame === 'enochian') {
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 280, fill: 'none', stroke: ink, 'stroke-width': 1.5, 'stroke-opacity': 0.68 }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 252, fill: 'none', stroke: ink, 'stroke-width': 1.1, 'stroke-opacity': 0.5 }));
                // 40 divisions of the Outer Ring of Divine Letters
                const dee40 = 'TAOAGLAONIHAAELIALPHAROMEIELGALETHOGOGPA';
                for (let i = 0; i < 40; i++) {
                    const a1 = ((i * 9 - 90) * Math.PI) / 180;
                    const aMid = (((i + 0.5) * 9 - 90) * Math.PI) / 180;
                    frameGroup.appendChild(svgEl('line', {
                        x1: 300 + Math.cos(a1) * 252, y1: 300 + Math.sin(a1) * 252,
                        x2: 300 + Math.cos(a1) * 280, y2: 300 + Math.sin(a1) * 280,
                        stroke: ink, 'stroke-width': 0.6, 'stroke-opacity': 0.28
                    }));
                    if (i % 2 === 0) {
                        const chTxt = svgEl('text', {
                            x: 300 + Math.cos(aMid) * 266, y: 300 + Math.sin(aMid) * 266,
                            fill: ink, 'fill-opacity': 0.5, 'font-family': 'JetBrains Mono, monospace',
                            'font-size': '8.5', 'text-anchor': 'middle', 'dominant-baseline': 'central'
                        });
                        chTxt.textContent = dee40[i % dee40.length];
                        frameGroup.appendChild(chTxt);
                    }
                }

                // Great Heptagon + 7/2 Heptagram + Inner Heptagon + Central Pentagram
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 248, 7, 1, -90), fill: 'none', stroke: ink, 'stroke-width': 1.25, 'stroke-opacity': 0.56 }));
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 224, 7, 2, -90), fill: 'none', stroke: ink, 'stroke-width': 1.05, 'stroke-opacity': 0.44 }));
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 178, 7, 1, -90 + 180 / 7), fill: 'none', stroke: ink, 'stroke-width': 1.0, 'stroke-opacity': 0.42 }));
                frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 168, 5, 2, -90), fill: 'none', stroke: ink, 'stroke-width': 1.15, 'stroke-opacity': 0.48 }));

                // Five Crosses of Light around the Pentagram angles
                for (let k = 0; k < 5; k++) {
                    const ang = ((-90 + 36 + k * 72) * Math.PI) / 180;
                    const cx = 300 + Math.cos(ang) * 142;
                    const cy = 300 + Math.sin(ang) * 142;
                    frameGroup.appendChild(svgEl('line', { x1: cx - 7, y1: cy, x2: cx + 7, y2: cy, stroke: ink, 'stroke-width': 1, 'stroke-opacity': 0.46 }));
                    frameGroup.appendChild(svgEl('line', { x1: cx, y1: cy - 7, x2: cx, y2: cy + 7, stroke: ink, 'stroke-width': 1, 'stroke-opacity': 0.46 }));
                }
                return;
            }

            // 7 Planetary Pentacles (Clavicula Salomonis)
            if (frame.startsWith('pantacle-')) {
                const meta = SEAL_CATALOG[frame];
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 276, fill: 'none', stroke: ink, 'stroke-width': 1.55, 'stroke-opacity': 0.7 }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 240, fill: 'none', stroke: ink, 'stroke-width': 1.1, 'stroke-opacity': 0.5 }));
                addCircularRingText(defs, frameGroup, 'orbitPantaclePath', 254, meta.ringText, ink, 10.2, 0.56, 3.3, true);

                // Four Cardinal Planetary Glyphs
                [0, 90, 180, 270].forEach(deg => {
                    const rad = (deg * Math.PI) / 180;
                    const gx = 300 + Math.cos(rad) * 222;
                    const gy = 300 + Math.sin(rad) * 222;
                    const gt = svgEl('text', {
                        x: gx, y: gy, fill: ink, 'fill-opacity': 0.65,
                        'font-size': '14', 'text-anchor': 'middle', 'dominant-baseline': 'central'
                    });
                    gt.textContent = meta.glyph;
                    frameGroup.appendChild(gt);
                });

                if (frame === 'pantacle-sun') {
                    // 12-Ray Flaming Solar Wheel + Sovereign Hexagram
                    for (let i = 0; i < 12; i++) {
                        const a = (i * Math.PI) / 6;
                        frameGroup.appendChild(svgEl('line', {
                            x1: 300 + Math.cos(a) * 165, y1: 300 + Math.sin(a) * 165,
                            x2: 300 + Math.cos(a) * 234, y2: 300 + Math.sin(a) * 234,
                            stroke: ink, 'stroke-width': i % 2 === 0 ? 1.2 : 0.8, 'stroke-opacity': 0.4
                        }));
                    }
                    frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 224, 3, 1, -90), fill: 'none', stroke: ink, 'stroke-width': 1.2, 'stroke-opacity': 0.52 }));
                    frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 224, 3, 1, 90), fill: 'none', stroke: ink, 'stroke-width': 1.2, 'stroke-opacity': 0.52 }));
                } else if (frame === 'pantacle-moon') {
                    // 28 Lunar Mansion ticks + Twin Crescent Gates
                    for (let i = 0; i < 28; i++) {
                        const a = (i * Math.PI * 2) / 28;
                        frameGroup.appendChild(svgEl('line', {
                            x1: 300 + Math.cos(a) * 228, y1: 300 + Math.sin(a) * 228,
                            x2: 300 + Math.cos(a) * 238, y2: 300 + Math.sin(a) * 238,
                            stroke: ink, 'stroke-width': 0.85, 'stroke-opacity': 0.42
                        }));
                    }
                    frameGroup.appendChild(svgEl('path', { d: 'M 210 175 C 145 245, 145 355, 210 425 C 172 355, 172 245, 210 175 Z', fill: 'none', stroke: ink, 'stroke-width': 1.15, 'stroke-opacity': 0.5 }));
                    frameGroup.appendChild(svgEl('path', { d: 'M 390 175 C 455 245, 455 355, 390 425 C 428 355, 428 245, 390 175 Z', fill: 'none', stroke: ink, 'stroke-width': 1.15, 'stroke-opacity': 0.5 }));
                } else if (frame === 'pantacle-mercury') {
                    // Interlaced 8-pointed Star of Hod + Hermetic Crossed Axes
                    frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 224, 8, 3, -90), fill: 'none', stroke: ink, 'stroke-width': 1.2, 'stroke-opacity': 0.52 }));
                    frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 186, 8, 1, -90), fill: 'none', stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.34 }));
                } else if (frame === 'pantacle-venus') {
                    // 7/2 & 7/3 Interlaced Venusian Heptagrams + Inner Rose Circle
                    frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 226, 7, 2, -90), fill: 'none', stroke: ink, 'stroke-width': 1.2, 'stroke-opacity': 0.52 }));
                    frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 184, 7, 3, -90), fill: 'none', stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.34 }));
                } else if (frame === 'pantacle-mars') {
                    // Flaming Martial Pentagram + 5 Spear-Crosses
                    frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 228, 5, 2, -90), fill: 'none', stroke: ink, 'stroke-width': 1.3, 'stroke-opacity': 0.56 }));
                    for (let k = 0; k < 5; k++) {
                        const a = ((-90 + k * 72) * Math.PI) / 180;
                        drawCrossArm(frameGroup, 300 + Math.cos(a) * 165, 300 + Math.sin(a) * 165, 300 + Math.cos(a) * 218, 300 + Math.sin(a) * 218, ink, 1.05, 0.45, 7);
                    }
                } else if (frame === 'pantacle-jupiter') {
                    // Sovereign Cross-Potent dividing the 4 Quadrants + Square of Chesed
                    frameGroup.appendChild(svgEl('rect', { x: 142, y: 142, width: 316, height: 316, fill: 'none', stroke: ink, 'stroke-width': 1.1, 'stroke-opacity': 0.42 }));
                    drawCrossArm(frameGroup, 300, 142, 300, 82, ink, 1.2, 0.55, 10);
                    drawCrossArm(frameGroup, 300, 458, 300, 518, ink, 1.2, 0.55, 10);
                    drawCrossArm(frameGroup, 142, 300, 82, 300, ink, 1.2, 0.55, 10);
                    drawCrossArm(frameGroup, 458, 300, 518, 300, ink, 1.2, 0.55, 10);
                } else if (frame === 'pantacle-saturn') {
                    // Austere Cube-Cross & Triangle of Binah
                    frameGroup.appendChild(svgEl('rect', { x: 144, y: 144, width: 312, height: 312, fill: 'none', stroke: ink, 'stroke-width': 1.15, 'stroke-opacity': 0.46 }));
                    frameGroup.appendChild(svgEl('line', { x1: 144, y1: 144, x2: 456, y2: 456, stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.3 }));
                    frameGroup.appendChild(svgEl('line', { x1: 456, y1: 144, x2: 144, y2: 456, stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.3 }));
                    frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 210, 3, 1, -90), fill: 'none', stroke: ink, 'stroke-width': 1.15, 'stroke-opacity': 0.48 }));
                }
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 144, fill: 'none', stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.3 }));
                return;
            }

            // Goetic Circle, Triangle & Individual Spirit Seals (Ars Goetia)
            if (frame === 'goetia-circle') {
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 278, fill: 'none', stroke: ink, 'stroke-width': 1.6, 'stroke-opacity': 0.72 }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 242, fill: 'none', stroke: ink, 'stroke-width': 1.2, 'stroke-opacity': 0.55 }));
                frameGroup.appendChild(svgEl('rect', { x: 130, y: 130, width: 340, height: 340, fill: 'none', stroke: ink, 'stroke-width': 1.0, 'stroke-opacity': 0.36 }));
                addCircularRingText(defs, frameGroup, 'orbitGoetiaCircle', 256, SEAL_CATALOG['goetia-circle'].ringText, ink, 10, 0.56, 3.5, true);
                // Four Small Pentagrams at the 4 Cardinal Angles
                [[300, 104], [300, 496], [104, 300], [496, 300]].forEach(([px, py]) => {
                    frameGroup.appendChild(svgEl('circle', { cx: px, cy: py, r: 19, fill: '#050508', stroke: ink, 'stroke-width': 1, 'stroke-opacity': 0.6 }));
                    frameGroup.appendChild(svgEl('polygon', { points: starPolygonPoints(px, py, 15, 5, 2, -90), fill: 'none', stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.65 }));
                });
                return;
            }

            if (frame === 'goetia-triangle') {
                // Outer Triangle of the Art + Central Dark Mirror Circle + Divine Names
                frameGroup.appendChild(svgEl('polygon', { points: '300,44 548,476 52,476', fill: 'none', stroke: ink, 'stroke-width': 1.6, 'stroke-opacity': 0.72 }));
                frameGroup.appendChild(svgEl('polygon', { points: '300,68 524,462 76,462', fill: 'none', stroke: ink, 'stroke-width': 1.0, 'stroke-opacity': 0.42 }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 325, r: 134, fill: 'none', stroke: ink, 'stroke-width': 1.35, 'stroke-opacity': 0.62 }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 325, r: 124, fill: 'none', stroke: ink, 'stroke-width': 0.8, 'stroke-opacity': 0.3, 'stroke-dasharray': '3 4' }));

                const labels = [
                    { txt: 'PRIMEUMATON', x: 300, y: 502, rot: 0 },
                    { txt: 'TETRAGRAMMATON', x: 150, y: 252, rot: -60 },
                    { txt: 'ANAPHAXETON', x: 450, y: 252, rot: 60 }
                ];
                labels.forEach(l => {
                    const tEl = svgEl('text', {
                        x: l.x, y: l.y, fill: ink, 'fill-opacity': 0.62,
                        'font-family': 'JetBrains Mono, monospace', 'font-size': '10.5', 'letter-spacing': '3.5',
                        'text-anchor': 'middle', transform: `rotate(${l.rot} ${l.x} ${l.y})`
                    });
                    tEl.textContent = l.txt;
                    frameGroup.appendChild(tEl);
                });
                return;
            }

            // Specific Goetic Spirit Seals (#01 Bael .. #71 Dantalion)
            if (frame.startsWith('goetia-')) {
                const meta = SEAL_CATALOG[frame];
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 276, fill: 'none', stroke: ink, 'stroke-width': 1.55, 'stroke-opacity': 0.72 }));
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 240, fill: 'none', stroke: ink, 'stroke-width': 1.1, 'stroke-opacity': 0.5 }));
                addCircularRingText(defs, frameGroup, 'orbitGoetiaSpirit', 254, meta.ringText, ink, 9.8, 0.56, 3.5, true);

                const sp = meta.spirit;
                const gSeal = svgEl('g', { opacity: '0.78' });

                if (sp === 'bael') {
                    drawCrossArm(gSeal, 300, 145, 300, 76, ink, 1.35, 0.6, 13);
                    drawCrossArm(gSeal, 175, 300, 86, 300, ink, 1.35, 0.6, 13);
                    drawCrossArm(gSeal, 425, 300, 514, 300, ink, 1.35, 0.6, 13);
                    drawCrossArm(gSeal, 300, 445, 300, 514, ink, 1.35, 0.6, 13);
                    gSeal.appendChild(svgEl('path', { d: 'M 220 98 Q 300 150 380 98', fill: 'none', stroke: ink, 'stroke-width': 1.2, 'stroke-opacity': 0.5 }));
                    gSeal.appendChild(svgEl('path', { d: 'M 225 495 L 300 448 L 375 495', fill: 'none', stroke: ink, 'stroke-width': 1.2, 'stroke-opacity': 0.5 }));
                } else if (sp === 'vassago') {
                    gSeal.appendChild(svgEl('polygon', { points: '132,190 468,190 300,492', fill: 'none', stroke: ink, 'stroke-width': 1.15, 'stroke-opacity': 0.45 }));
                    drawCrossArm(gSeal, 132, 190, 92, 135, ink, 1.3, 0.58, 11);
                    drawCrossArm(gSeal, 468, 190, 508, 135, ink, 1.3, 0.58, 11);
                    drawCrossArm(gSeal, 300, 190, 300, 82, ink, 1.3, 0.58, 12);
                } else if (sp === 'paimon') {
                    // Paimon's iconic Crowned Arch with 4 vertical figures/antennas + pedestal cross
                    gSeal.appendChild(svgEl('path', { d: 'M 155 156 Q 300 120 445 156', fill: 'none', stroke: ink, 'stroke-width': 1.4, 'stroke-opacity': 0.62 }));
                    [195, 265, 335, 405].forEach(px => {
                        gSeal.appendChild(svgEl('line', { x1: px, y1: 142, x2: px, y2: 96, stroke: ink, 'stroke-width': 1.25, 'stroke-opacity': 0.6 }));
                        gSeal.appendChild(svgEl('circle', { cx: px, cy: 88, r: 6.5, fill: 'none', stroke: ink, 'stroke-width': 1.1, 'stroke-opacity': 0.65 }));
                    });
                    drawCrossArm(gSeal, 300, 442, 300, 518, ink, 1.4, 0.62, 14);
                    drawCrossArm(gSeal, 160, 300, 84, 300, ink, 1.25, 0.52, 11);
                    drawCrossArm(gSeal, 440, 300, 516, 300, ink, 1.25, 0.52, 11);
                } else if (sp === 'buer') {
                    // Buer's iconic 5 bent/booted radial pentiskelion legs around the central Sanctum
                    for (let k = 0; k < 5; k++) {
                        const a = ((-90 + k * 72) * Math.PI) / 180;
                        const bend = ((-90 + k * 72 + 26) * Math.PI) / 180;
                        const sx = 300 + Math.cos(a) * 146;
                        const sy = 300 + Math.sin(a) * 146;
                        const kx = 300 + Math.cos(a) * 194;
                        const ky = 300 + Math.sin(a) * 194;
                        const fx = 300 + Math.cos(bend) * 224;
                        const fy = 300 + Math.sin(bend) * 224;
                        gSeal.appendChild(svgEl('path', {
                            d: `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${kx.toFixed(1)} ${ky.toFixed(1)} Q ${(kx + fx) * 0.5} ${(ky + fy) * 0.5} ${fx.toFixed(1)} ${fy.toFixed(1)}`,
                            fill: 'none', stroke: ink, 'stroke-width': 1.4, 'stroke-opacity': 0.62, 'stroke-linecap': 'round'
                        }));
                        const tipAng = bend + Math.PI / 2;
                        gSeal.appendChild(svgEl('line', {
                            x1: fx, y1: fy,
                            x2: fx + Math.cos(tipAng) * 12, y2: fy + Math.sin(tipAng) * 12,
                            stroke: ink, 'stroke-width': 1.4, 'stroke-opacity': 0.65, 'stroke-linecap': 'round'
                        }));
                    }
                } else if (sp === 'gusion') {
                    gSeal.appendChild(svgEl('path', { d: 'M 190 112 C 235 170, 365 170, 410 112', fill: 'none', stroke: ink, 'stroke-width': 1.3, 'stroke-opacity': 0.58 }));
                    drawCrossArm(gSeal, 300, 154, 300, 82, ink, 1.3, 0.6, 12);
                    drawCrossArm(gSeal, 152, 300, 84, 300, ink, 1.3, 0.58, 11);
                    drawCrossArm(gSeal, 448, 300, 516, 300, ink, 1.3, 0.58, 11);
                    drawCrossArm(gSeal, 300, 446, 300, 516, ink, 1.3, 0.6, 12);
                } else if (sp === 'astaroth') {
                    // Astaroth's Pentagram + Lance Cross
                    gSeal.appendChild(svgEl('polygon', { points: starPolygonPoints(300, 300, 224, 5, 2, -90), fill: 'none', stroke: ink, 'stroke-width': 1.3, 'stroke-opacity': 0.56 }));
                    drawCrossArm(gSeal, 440, 300, 520, 300, ink, 1.35, 0.65, 13);
                    drawCrossArm(gSeal, 160, 300, 80, 300, ink, 1.35, 0.65, 13);
                } else if (sp === 'asmoday') {
                    gSeal.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 206, fill: 'none', stroke: ink, 'stroke-width': 1.1, 'stroke-opacity': 0.42 }));
                    drawCrossArm(gSeal, 300, 148, 300, 76, ink, 1.4, 0.62, 14);
                    drawCrossArm(gSeal, 300, 452, 300, 522, ink, 1.4, 0.62, 14);
                    drawCrossArm(gSeal, 148, 300, 76, 300, ink, 1.4, 0.62, 14);
                    drawCrossArm(gSeal, 452, 300, 522, 300, ink, 1.4, 0.62, 14);
                } else if (sp === 'orobas') {
                    gSeal.appendChild(svgEl('path', { d: 'M 135 205 Q 220 300 135 395', fill: 'none', stroke: ink, 'stroke-width': 1.3, 'stroke-opacity': 0.56 }));
                    gSeal.appendChild(svgEl('path', { d: 'M 465 205 Q 380 300 465 395', fill: 'none', stroke: ink, 'stroke-width': 1.3, 'stroke-opacity': 0.56 }));
                    drawCrossArm(gSeal, 300, 145, 300, 78, ink, 1.35, 0.6, 13);
                    drawCrossArm(gSeal, 300, 455, 300, 520, ink, 1.35, 0.6, 13);
                } else if (sp === 'belial') {
                    gSeal.appendChild(svgEl('circle', { cx: 242, cy: 108, r: 20, fill: 'none', stroke: ink, 'stroke-width': 1.25, 'stroke-opacity': 0.58 }));
                    gSeal.appendChild(svgEl('circle', { cx: 358, cy: 108, r: 20, fill: 'none', stroke: ink, 'stroke-width': 1.25, 'stroke-opacity': 0.58 }));
                    gSeal.appendChild(svgEl('line', { x1: 262, y1: 108, x2: 338, y2: 108, stroke: ink, 'stroke-width': 1.2, 'stroke-opacity': 0.55 }));
                    drawCrossArm(gSeal, 152, 300, 82, 300, ink, 1.35, 0.6, 12);
                    drawCrossArm(gSeal, 448, 300, 518, 300, ink, 1.35, 0.6, 12);
                    drawCrossArm(gSeal, 300, 448, 300, 518, ink, 1.35, 0.6, 14);
                } else if (sp === 'dantalion') {
                    gSeal.appendChild(svgEl('polygon', { points: '215,112 385,112 300,175', fill: 'none', stroke: ink, 'stroke-width': 1.25, 'stroke-opacity': 0.56 }));
                    drawCrossArm(gSeal, 300, 112, 300, 74, ink, 1.25, 0.6, 10);
                    drawCrossArm(gSeal, 152, 280, 82, 280, ink, 1.35, 0.6, 12);
                    drawCrossArm(gSeal, 448, 280, 518, 280, ink, 1.35, 0.6, 12);
                    drawCrossArm(gSeal, 300, 446, 300, 518, ink, 1.35, 0.6, 14);
                }

                frameGroup.appendChild(gSeal);
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 146, fill: 'none', stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.32 }));
            }
        }

        // ======================================================================
        // Authentic Austin Osman Spare Zos Kia Letter-Fusion Engine
        // ======================================================================
        function transformPt(pt, tx, ty, scale, rad, mirrorX) {
            const mx = mirrorX ? -pt[0] : pt[0];
            const my = pt[1];
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            return [
                tx + (mx * cos - my * sin) * scale,
                ty + (mx * sin + my * cos) * scale
            ];
        }

        function computeMonogramPlacements(letters, topology, seed) {
            const placements = [];
            const liveAnchors = [];
            const n = letters.length;

            letters.forEach((ch, idx) => {
                const glyph = PRIMAL_GLYPHS[ch] || PRIMAL_GLYPHS.X;
                const h = (ch.charCodeAt(0) * 37 + idx * 53 + seed * 89) % 360;
                const mirrorX = ((idx + seed) % 3 === 1);

                let tx = 300;
                let ty = 300;
                let scale = 68;
                let rad = 0;

                if (topology === 'nexus') {
                    // Authentic Spare Monogram: directly weld a letter's structural anchor onto an existing glyph anchor
                    const rotSteps = [0, Math.PI / 2, Math.PI, -Math.PI / 2, Math.PI / 4, -Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4];
                    rad = rotSteps[(idx * 3 + seed) % rotSteps.length];
                    scale = idx === 0 ? 86 : Math.max(46, 76 - idx * 3.2);

                    if (idx === 0 || liveAnchors.length === 0) {
                        tx = 300;
                        ty = 300;
                    } else {
                        let bestScore = Infinity;
                        let bestTx = 300;
                        let bestTy = 300;
                        let bestRad = rad;
                        const rotChoices = [
                            rotSteps[(idx * 3 + seed) % rotSteps.length],
                            rotSteps[(idx * 5 + seed + 1) % rotSteps.length]
                        ];
                        for (let rIdx = 0; rIdx < rotChoices.length; rIdx++) {
                            const candRad = rotChoices[rIdx];
                            for (let sIdx = 0; sIdx < Math.min(liveAnchors.length, 10); sIdx++) {
                                const targetSocket = liveAnchors[(idx * 2 + seed + sIdx) % liveAnchors.length];
                                const localAnchor = glyph.anchors[(idx + seed + sIdx) % glyph.anchors.length];
                                const [ox, oy] = transformPt(localAnchor, 0, 0, scale, candRad, mirrorX);
                                const candTx = targetSocket[0] - ox;
                                const candTy = targetSocket[1] - oy;
                                // Favor welds keeping the center compact without stacking directly on top of a previous glyph origin
                                const distCenter = Math.hypot(candTx - 300, candTy - 300);
                                const overlapPenalty = placements.some(p => Math.hypot(p.tx - candTx, p.ty - candTy) < 16) ? 65 : 0;
                                const score = distCenter + overlapPenalty;
                                if (score < bestScore) {
                                    bestScore = score;
                                    bestTx = candTx;
                                    bestTy = candTy;
                                    bestRad = candRad;
                                }
                            }
                        }
                        tx = bestTx;
                        ty = bestTy;
                        rad = bestRad;
                    }
                } else if (topology === 'orbital') {
                    // Constellation / Orbital Ring of interlocked letters
                    const baseR = n === 1 ? 0 : 88;
                    const theta = -Math.PI / 2 + (idx / n) * Math.PI * 2 + (seed - 1) * 0.42;
                    tx = 300 + Math.cos(theta) * baseR;
                    ty = 300 + Math.sin(theta) * baseR;
                    rad = theta + Math.PI / 2 + ((h % 2 === 0) ? 0 : Math.PI);
                    scale = Math.max(38, 60 - n * 1.4);
                } else if (topology === 'diagonal') {
                    // Ascending / Crossed Oblique Vector (no vertical stick!)
                    const mainDiag = (seed % 2 === 0) ? -Math.PI / 4 : Math.PI / 4;
                    const onCrossArm = n >= 4 && (idx % 3 === 2);
                    const axisAng = onCrossArm ? (mainDiag + Math.PI / 2) : mainDiag;
                    const t = n === 1 ? 0 : ((idx / (n - 1)) - 0.5) * 210;
                    tx = 300 + Math.cos(axisAng) * (onCrossArm ? t * 0.68 : t);
                    ty = 300 + Math.sin(axisAng) * (onCrossArm ? t * 0.68 : t);
                    rad = axisAng + ((idx % 2 === 0) ? 0 : Math.PI / 2);
                    scale = Math.max(40, 62 - n * 1.2);
                } else if (topology === 'triad') {
                    // Triangular 3-Pole Altar Ligature
                    const poleIdx = idx % 3;
                    const poleAng = -Math.PI / 2 + poleIdx * ((Math.PI * 2) / 3) + (seed - 1) * 0.35;
                    const poleR = n === 1 ? 0 : 84;
                    const layerOffset = Math.floor(idx / 3) * 18;
                    tx = 300 + Math.cos(poleAng) * Math.max(18, poleR - layerOffset);
                    ty = 300 + Math.sin(poleAng) * Math.max(18, poleR - layerOffset);
                    rad = poleAng + Math.PI / 2;
                    scale = Math.max(40, 62 - Math.floor(idx / 3) * 8);
                } else {
                    // 'spine' — Axial Stave (Vertical on odd seeds, Horizontal on even seeds!)
                    const horizontal = (seed % 2 === 0);
                    const t = n === 1 ? 0 : ((idx / (n - 1)) - 0.5) * 220;
                    tx = horizontal ? 300 + t : 300;
                    ty = horizontal ? 300 : 300 + t;
                    rad = ((idx + seed) % 2 === 0) ? 0 : Math.PI / 2;
                    scale = Math.max(38, 58 - n * 1.1);
                }

                const worldAnchors = glyph.anchors.map(a => transformPt(a, tx, ty, scale, rad, mirrorX));
                worldAnchors.forEach(wa => liveAnchors.push(wa));

                placements.push({ ch, glyph, tx, ty, scale, rad, mirrorX, worldAnchors });
            });

            // Normalize bounding box cleanly around (300, 300) within [138..462]
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            placements.forEach(p => {
                p.worldAnchors.forEach(([x, y]) => {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                });
            });
            const cx = (minX + maxX) / 2 || 300;
            const cy = (minY + maxY) / 2 || 300;
            const span = Math.max(maxX - minX, maxY - minY, 120);
            const fit = span > 290 ? 290 / span : 1;

            placements.forEach(p => {
                p.tx = 300 + (p.tx - cx) * fit;
                p.ty = 300 + (p.ty - cy) * fit;
                p.scale *= fit;
                p.worldAnchors = p.glyph.anchors.map(a => transformPt(a, p.tx, p.ty, p.scale, p.rad, p.mirrorX));
            });

            return placements;
        }

        function renderMonogramSigil(sigilGroup, guideGroup, letters, ink, strokeW, topology, seed, showGuide) {
            const placements = computeMonogramPlacements(letters, topology, seed);
            if (!placements.length) return;

            // Structural Ligature Bridges connecting centers/sockets in non-overlapping topologies
            if (placements.length > 1 && topology !== 'nexus') {
                const bridgePts = placements.map(p => ({ x: p.tx, y: p.ty }));
                if (topology === 'orbital' || topology === 'triad') {
                    bridgePts.push({ x: placements[0].tx, y: placements[0].ty });
                }
                sigilGroup.appendChild(svgEl('path', {
                    d: pointsToPath(bridgePts, topology === 'orbital' ? 0.55 : 0.05),
                    fill: 'none',
                    stroke: ink,
                    'stroke-width': strokeW * 0.88,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round'
                }));
            }

            // Render every fused letter's true anatomical strokes
            placements.forEach((p, idx) => {
                const dParts = [];
                p.glyph.cmds.forEach(cmd => {
                    if (cmd.t === 'L') {
                        cmd.pts.forEach((pt, i) => {
                            const [wx, wy] = transformPt(pt, p.tx, p.ty, p.scale, p.rad, p.mirrorX);
                            dParts.push(`${i === 0 ? 'M' : 'L'} ${wx.toFixed(1)} ${wy.toFixed(1)}`);
                        });
                    } else if (cmd.t === 'C') {
                        const [sx, sy] = transformPt(cmd.start, p.tx, p.ty, p.scale, p.rad, p.mirrorX);
                        dParts.push(`M ${sx.toFixed(1)} ${sy.toFixed(1)}`);
                        cmd.segs.forEach(([c1, c2, end]) => {
                            const [x1, y1] = transformPt(c1, p.tx, p.ty, p.scale, p.rad, p.mirrorX);
                            const [x2, y2] = transformPt(c2, p.tx, p.ty, p.scale, p.rad, p.mirrorX);
                            const [ex, ey] = transformPt(end, p.tx, p.ty, p.scale, p.rad, p.mirrorX);
                            dParts.push(`C ${x1.toFixed(1)} ${y1.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`);
                        });
                    }
                });

                sigilGroup.appendChild(svgEl('path', {
                    d: dParts.join(' '),
                    fill: 'none',
                    stroke: ink,
                    'stroke-width': strokeW,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round'
                }));

                // Optional Matrix Guide: faintly show where each letter is fused!
                if (showGuide && guideGroup) {
                    guideGroup.appendChild(svgEl('circle', {
                        cx: p.tx, cy: p.ty, r: 4,
                        fill: 'none', stroke: ink, 'stroke-opacity': 0.28, 'stroke-width': 0.8
                    }));
                    const tag = svgEl('text', {
                        x: p.tx + 9, y: p.ty - 8,
                        fill: ink, 'fill-opacity': 0.34,
                        'font-family': 'JetBrains Mono, monospace', 'font-size': '9.5'
                    });
                    tag.textContent = `${idx + 1}:${p.ch}`;
                    guideGroup.appendChild(tag);
                }
            });

            // Spare Signature Talismanic Terminals (Anima Ring ○ on first extremity + Sealing Bar ⊥ on last extremity)
            const firstAnchor = placements[0].worldAnchors[0];
            const lastP = placements[placements.length - 1];
            const lastAnchor = lastP.worldAnchors[lastP.worldAnchors.length - 1];

            if (firstAnchor) {
                sigilGroup.appendChild(svgEl('circle', {
                    cx: firstAnchor[0], cy: firstAnchor[1], r: strokeW * 2.4,
                    fill: '#050508', stroke: ink, 'stroke-width': strokeW * 0.85
                }));
            }
            if (lastAnchor) {
                const ang = Math.atan2(lastAnchor[1] - 300, lastAnchor[0] - 300) + Math.PI / 2;
                const bh = strokeW * 3.6;
                sigilGroup.appendChild(svgEl('line', {
                    x1: lastAnchor[0] - Math.cos(ang) * bh, y1: lastAnchor[1] - Math.sin(ang) * bh,
                    x2: lastAnchor[0] + Math.cos(ang) * bh, y2: lastAnchor[1] + Math.sin(ang) * bh,
                    stroke: ink, 'stroke-width': strokeW * 0.92, 'stroke-linecap': 'round'
                }));
            }
        }

        // ======================================================================
        // Main SVG Sigil Renderer
        // ======================================================================
        function renderSigil() {
            const { letters, hebArr } = distillIntent();
            const ink = inkSelect.value;
            const strokeW = Number(strokeRange.value) / 10;
            const tension = Number(curveRange.value) / 100;
            const frame = frameSelect.value;
            const sealMeta = SEAL_CATALOG[frame] || SEAL_CATALOG['double-inscribed'];
            const showGuide = showMatrixGuide.checked;

            while (svg.firstChild) svg.removeChild(svg.firstChild);

            const defs = svgEl('defs');
            const filter = svgEl('filter', { id: 'sigilGlow', x: '-25%', y: '-25%', width: '150%', height: '150%' });
            filter.appendChild(svgEl('feGaussianBlur', { stdDeviation: '4.2', result: 'blur' }));
            const merge = svgEl('feMerge');
            merge.appendChild(svgEl('feMergeNode', { in: 'blur' }));
            merge.appendChild(svgEl('feMergeNode', { in: 'SourceGraphic' }));
            filter.appendChild(merge);
            defs.appendChild(filter);
            svg.appendChild(defs);

            // 1. Sacred Seal / Ornamentation Layer
            const frameGroup = svgEl('g', { opacity: '0.9' });
            renderSacredFrame(defs, frameGroup, frame, ink, letters, hebArr);
            svg.appendChild(frameGroup);

            // Scale inner sigil sanctum harmoniously when inside intricate seals/pentacles/triangles
            let innerTransform = '';
            if (frame === 'goetia-triangle') {
                innerTransform = 'translate(300, 325) scale(0.56) translate(-300, -300)';
            } else if (sealMeta.compactSigil) {
                innerTransform = 'translate(300, 300) scale(0.68) translate(-300, -300)';
            }

            // 2. Underlying Occult Matrix Guide (optional)
            const guideGroup = svgEl('g', { 'pointer-events': 'none' });
            if (innerTransform) guideGroup.setAttribute('transform', innerTransform);

            if (showGuide) {
                if (state.engine === 'rosecross') {
                    [56, 114, 178].forEach(r => {
                        guideGroup.appendChild(svgEl('circle', {
                            cx: 300, cy: 300, r,
                            fill: 'none', stroke: ink, 'stroke-opacity': 0.12, 'stroke-dasharray': '2 5'
                        }));
                    });
                    const plotted = new Set();
                    Object.values(LETTER_ARCANA).forEach(m => {
                        const key = `${m.ring}-${m.idx}`;
                        if (plotted.has(key)) return;
                        plotted.add(key);
                        const radii = [56, 114, 178];
                        const phaseOffsets = [-Math.PI / 2, -Math.PI / 2 + 0.22, -Math.PI / 2 + 0.12];
                        const ang = phaseOffsets[m.ring] + (m.idx / m.total) * Math.PI * 2;
                        const px = 300 + Math.cos(ang) * radii[m.ring];
                        const py = 300 + Math.sin(ang) * radii[m.ring];
                        const txt = svgEl('text', {
                            x: px, y: py,
                            fill: ink, 'fill-opacity': 0.2,
                            'font-size': '11', 'text-anchor': 'middle', 'dominant-baseline': 'central'
                        });
                        txt.textContent = m.heb;
                        guideGroup.appendChild(txt);
                    });
                } else if (state.engine === 'kamea') {
                    const pInfo = PLANET_NAMES[state.planet];
                    const n = pInfo.n;
                    const sq = buildMagicSquare(n);
                    const boxSize = 330;
                    const start = 300 - boxSize / 2;
                    const cell = boxSize / n;

                    for (let r = 0; r < n; r++) {
                        for (let c = 0; c < n; c++) {
                            const x = start + c * cell;
                            const y = start + r * cell;
                            guideGroup.appendChild(svgEl('rect', {
                                x, y, width: cell, height: cell,
                                fill: 'none', stroke: ink, 'stroke-opacity': 0.1, 'stroke-width': 0.7
                            }));
                            const numTxt = svgEl('text', {
                                x: x + cell / 2, y: y + cell / 2,
                                fill: ink, 'fill-opacity': 0.22,
                                'font-family': 'JetBrains Mono, monospace',
                                'font-size': n >= 8 ? '9.5' : '11',
                                'text-anchor': 'middle', 'dominant-baseline': 'central'
                            });
                            numTxt.textContent = String(sq[r][c]);
                            guideGroup.appendChild(numTxt);
                        }
                    }
                } else if (state.engine === 'freehand') {
                    guideGroup.appendChild(svgEl('line', { x1: 300, y1: 110, x2: 300, y2: 490, stroke: ink, 'stroke-opacity': 0.09, 'stroke-dasharray': '3 6' }));
                    guideGroup.appendChild(svgEl('line', { x1: 110, y1: 300, x2: 490, y2: 300, stroke: ink, 'stroke-opacity': 0.09, 'stroke-dasharray': '3 6' }));
                }
            }
            svg.appendChild(guideGroup);

            // 3. Core Sigil Glyph Group
            const sigilGroup = svgEl('g', { filter: 'url(#sigilGlow)' });
            if (innerTransform) sigilGroup.setAttribute('transform', innerTransform);

            if (letters.length > 0 && state.engine === 'rosecross') {
                const pts = letters.map(roseCrossCoord);
                renderTracedSigil(sigilGroup, pts, ink, strokeW, tension);
            } else if (letters.length > 0 && state.engine === 'kamea') {
                const pInfo = PLANET_NAMES[state.planet];
                const n = pInfo.n;
                const maxVal = n * n;
                const sq = buildMagicSquare(n);
                const coordByNumber = {};
                const boxSize = 330;
                const start = 300 - boxSize / 2;
                const cell = boxSize / n;

                for (let r = 0; r < n; r++) {
                    for (let c = 0; c < n; c++) {
                        coordByNumber[sq[r][c]] = {
                            x: start + (c + 0.5) * cell,
                            y: start + (r + 0.5) * cell
                        };
                    }
                }

                const pts = letters.map((ch, i) => {
                    const gem = LETTER_ARCANA[ch]?.gem || (ch.charCodeAt(0) - 64);
                    const targetNum = ((gem + i * 3 - 1) % maxVal) + 1;
                    return coordByNumber[targetNum] || { x: 300, y: 300 };
                });
                renderTracedSigil(sigilGroup, pts, ink, strokeW, tension);
            } else if (letters.length > 0 && state.engine === 'monogram') {
                renderMonogramSigil(sigilGroup, guideGroup, letters, ink, strokeW, state.monogramTopology, state.monogramSeed, showGuide);
            }

            svg.appendChild(sigilGroup);

            // 4. Freehand Symmetrical Strokes (direct 1:1 with pointer coordinates)
            const freehandGroup = svgEl('g', { filter: 'url(#sigilGlow)' });
            const allStrokes = state.activeStroke
                ? [...state.freehandStrokes, state.activeStroke]
                : state.freehandStrokes;

            allStrokes.forEach(stroke => {
                if (stroke.points.length < 2) return;
                const sym = stroke.symmetry || 1;
                for (let k = 0; k < sym; k++) {
                    const angle = (k / sym) * Math.PI * 2;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    const rotated = stroke.points.map(pt => {
                        const dx = pt.x - 300;
                        const dy = pt.y - 300;
                        return {
                            x: 300 + dx * cos - dy * sin,
                            y: 300 + dx * sin + dy * cos
                        };
                    });
                    freehandGroup.appendChild(svgEl('path', {
                        d: pointsToPath(rotated, 0.45),
                        fill: 'none',
                        stroke: ink,
                        'stroke-width': strokeW,
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round'
                    }));
                }
            });
            svg.appendChild(freehandGroup);

            updateMethodStatusLabel();
        }

        function renderTracedSigil(group, pts, ink, strokeW, tension) {
            if (pts.length === 0) return;

            if (pts.length === 1) {
                group.appendChild(svgEl('circle', { cx: pts[0].x, cy: pts[0].y, r: 18, fill: 'none', stroke: ink, 'stroke-width': strokeW }));
                group.appendChild(svgEl('circle', { cx: pts[0].x, cy: pts[0].y, r: 3, fill: ink }));
                return;
            }

            group.appendChild(svgEl('path', {
                d: pointsToPath(pts, tension),
                fill: 'none',
                stroke: ink,
                'stroke-width': strokeW,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round'
            }));

            group.appendChild(svgEl('circle', {
                cx: pts[0].x, cy: pts[0].y, r: strokeW * 2.6,
                fill: '#050508', stroke: ink, 'stroke-width': strokeW * 0.85
            }));

            for (let i = 1; i < pts.length - 1; i++) {
                if (i % 3 === 0) {
                    group.appendChild(svgEl('circle', {
                        cx: pts[i].x, cy: pts[i].y, r: strokeW * 0.9,
                        fill: ink
                    }));
                }
            }

            const last = pts[pts.length - 1];
            const prev = pts[pts.length - 2];
            const ang = Math.atan2(last.y - prev.y, last.x - prev.x) + Math.PI / 2;
            const barHalf = strokeW * 3.8;
            group.appendChild(svgEl('line', {
                x1: last.x - Math.cos(ang) * barHalf,
                y1: last.y - Math.sin(ang) * barHalf,
                x2: last.x + Math.cos(ang) * barHalf,
                y2: last.y + Math.sin(ang) * barHalf,
                stroke: ink,
                'stroke-width': strokeW,
                'stroke-linecap': 'round'
            }));
        }

        function updateMethodStatusLabel() {
            const topoNames = {
                nexus: 'Núcleo Concêntrico',
                orbital: 'Constelação Orbital',
                diagonal: 'Vetor Cruzado',
                triad: 'Altar Triangular',
                spine: (state.monogramSeed % 2 === 0) ? 'Eixo Horizontal' : 'Eixo Vertical'
            };
            const names = {
                rosecross: 'Rosa-Cruz Hermética · 22 Pétalas',
                kamea: PLANET_NAMES[state.planet].label,
                monogram: `Zos Kia (${topoNames[state.monogramTopology] || 'Fusão'}) · Variação #${state.monogramSeed}`,
                freehand: `Altar Caleidoscópico · Simetria ${symmetrySelect.value}×`
            };
            altarMethodLabel.textContent = names[state.engine] || '';
        }

        // ======================================================================
        // Pointer Drawing on SVG Altar
        // ======================================================================
        function clientToSvgPoint(evt) {
            const rect = svg.getBoundingClientRect();
            return {
                x: ((evt.clientX - rect.left) / rect.width) * 600,
                y: ((evt.clientY - rect.top) / rect.height) * 600
            };
        }

        svg.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 && e.pointerType === 'mouse') return;
            svg.setPointerCapture(e.pointerId);
            const pt = clientToSvgPoint(e);
            state.activeStroke = {
                symmetry: Number(symmetrySelect.value) || 1,
                points: [pt]
            };
        });

        svg.addEventListener('pointermove', (e) => {
            if (!state.activeStroke) return;
            const pt = clientToSvgPoint(e);
            const prev = state.activeStroke.points[state.activeStroke.points.length - 1];
            if (Math.hypot(pt.x - prev.x, pt.y - prev.y) > 4) {
                state.activeStroke.points.push(pt);
                renderSigil();
            }
        });

        const finishStroke = () => {
            if (!state.activeStroke) return;
            if (state.activeStroke.points.length >= 2) {
                state.freehandStrokes.push(state.activeStroke);
            }
            state.activeStroke = null;
            renderSigil();
        };
        svg.addEventListener('pointerup', finishStroke);
        svg.addEventListener('pointercancel', finishStroke);

        // ======================================================================
        // Controls Wiring
        // ======================================================================
        document.querySelectorAll('.engine-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.engine-btn').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                state.engine = btn.dataset.engine;
                kameaSub.style.display = state.engine === 'kamea' ? 'block' : 'none';
                monogramSub.style.display = state.engine === 'monogram' ? 'block' : 'none';
                syncEngineNote();
                renderSigil();
            });
        });

        [intentInput, stripVowelsToggle, dedupeToggle, showMatrixGuide, inkSelect, curveRange, strokeRange].forEach(el => {
            el?.addEventListener('input', renderSigil);
            el?.addEventListener('change', renderSigil);
        });

        frameSelect?.addEventListener('change', () => {
            syncSealLoreAndUI();
            renderSigil();
        });

        kameaSelect?.addEventListener('change', () => {
            state.planet = kameaSelect.value;
            renderSigil();
        });

        monogramTopologySelect?.addEventListener('change', () => {
            state.monogramTopology = monogramTopologySelect.value;
            renderSigil();
        });

        symmetrySelect?.addEventListener('change', updateMethodStatusLabel);

        document.getElementById('mutateSeedBtn')?.addEventListener('click', () => {
            state.monogramSeed = (state.monogramSeed % 99) + 1;
            renderSigil();
        });

        document.getElementById('undoStrokeBtn')?.addEventListener('click', () => {
            state.freehandStrokes.pop();
            renderSigil();
        });

        document.getElementById('clearStrokesBtn')?.addEventListener('click', () => {
            state.freehandStrokes = [];
            renderSigil();
        });

        const veilBtn = document.getElementById('veilIntentBtn');
        veilBtn?.addEventListener('click', () => {
            state.veiled = !state.veiled;
            intentInput.classList.toggle('is-veiled', state.veiled);
            veilBtn.textContent = state.veiled ? 'Revelar Texto' : 'Velar Texto';
        });

        // ======================================================================
        // Export SVG & High-Res PNG
        // ======================================================================
        function buildStandaloneSvgString(cleanWithoutGuides = false) {
            const prevGuide = showMatrixGuide.checked;
            if (cleanWithoutGuides) {
                showMatrixGuide.checked = false;
                renderSigil();
            }
            const clone = svg.cloneNode(true);
            const bgRect = svgEl('rect', { x: 0, y: 0, width: 600, height: 600, fill: '#030305' });
            clone.insertBefore(bgRect, clone.firstChild);
            const serialized = new XMLSerializer().serializeToString(clone);
            if (cleanWithoutGuides) {
                showMatrixGuide.checked = prevGuide;
                renderSigil();
            }
            return serialized;
        }

        document.getElementById('exportSvgBtn')?.addEventListener('click', () => {
            const xml = buildStandaloneSvgString(false);
            const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sigilo-${Date.now()}.svg`;
            a.click();
            URL.revokeObjectURL(url);
        });

        document.getElementById('exportPngBtn')?.addEventListener('click', () => {
            const xml = buildStandaloneSvgString(false);
            const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 2048;
                canvas.height = 2048;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#030305';
                ctx.fillRect(0, 0, 2048, 2048);
                ctx.drawImage(img, 0, 0, 2048, 2048);
                URL.revokeObjectURL(url);
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = `sigilo-${Date.now()}.png`;
                a.click();
            };
            img.src = url;
        });

        function scopeSvgIds(markup, suffix) {
            return markup
                .replace(/id="(sigilGlow|orbit[A-Za-z0-9]+)"/g, `id="$1_${suffix}"`)
                .replace(/url\(#(sigilGlow)\)/g, `url(#$1_${suffix})`)
                .replace(/href="#(orbit[A-Za-z0-9]+)"/g, `href="#$1_${suffix}"`);
        }

        // Silent Grimoire
        function renderGrimoire() {
            const strip = document.getElementById('grimoireStrip');
            const thumbs = document.getElementById('grimoireThumbs');
            let items = [];
            try { items = JSON.parse(localStorage.getItem(GRIMOIRE_KEY) || '[]'); } catch (_) {}

            if (!items.length) {
                strip.style.display = 'none';
                return;
            }
            strip.style.display = 'block';
            thumbs.innerHTML = items.map((it, idx) => `
                <div class="grimoire-item" data-idx="${idx}" title="Clique para baixar este selo em SVG">
                    ${scopeSvgIds(it.svg, `grim_${idx}`)}
                    <div class="grimoire-item-meta">${it.date}</div>
                </div>
            `).join('');

            thumbs.querySelectorAll('.grimoire-item').forEach(el => {
                el.addEventListener('click', () => {
                    const item = items[Number(el.dataset.idx)];
                    if (!item) return;
                    const blob = new Blob([item.svg], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `selo-grimorio-${Number(el.dataset.idx) + 1}.svg`;
                    a.click();
                    URL.revokeObjectURL(url);
                });
            });
        }

        document.getElementById('saveGrimoireBtn')?.addEventListener('click', () => {
            const svgMarkup = buildStandaloneSvgString(true);
            let items = [];
            try { items = JSON.parse(localStorage.getItem(GRIMOIRE_KEY) || '[]'); } catch (_) {}
            items.unshift({
                date: new Date().toLocaleDateString('pt-BR'),
                svg: svgMarkup
            });
            localStorage.setItem(GRIMOIRE_KEY, JSON.stringify(items.slice(0, 12)));
            renderGrimoire();
            window.outisApp?.showNotification('Selo gravado anonimamente no Grimório.', 'info');
        });

        document.getElementById('clearGrimoireBtn')?.addEventListener('click', () => {
            localStorage.removeItem(GRIMOIRE_KEY);
            renderGrimoire();
        });

        // ======================================================================
        // Ambient Altar Particle System + Ember Incineration
        // ======================================================================
        const pCtx = particlesCanvas.getContext('2d');
        const dust = Array.from({ length: 46 }, () => ({
            x: Math.random(),
            y: Math.random(),
            vx: (Math.random() - 0.5) * 0.0004,
            vy: -0.0003 - Math.random() * 0.0005,
            r: 0.7 + Math.random() * 1.4,
            a: 0.12 + Math.random() * 0.35
        }));
        let embers = [];
        let cursorNorm = { x: 0.5, y: 0.5, active: false };

        altarStage.addEventListener('pointermove', (e) => {
            const rect = altarStage.getBoundingClientRect();
            cursorNorm.x = (e.clientX - rect.left) / rect.width;
            cursorNorm.y = (e.clientY - rect.top) / rect.height;
            cursorNorm.active = true;
        });
        altarStage.addEventListener('pointerleave', () => { cursorNorm.active = false; });

        function animateAltarCanvas() {
            const w = altarStage.clientWidth || 500;
            const h = altarStage.clientHeight || 500;
            if (particlesCanvas.width !== w || particlesCanvas.height !== h) {
                particlesCanvas.width = w;
                particlesCanvas.height = h;
            }
            pCtx.clearRect(0, 0, w, h);

            for (const p of dust) {
                p.x += p.vx;
                p.y += p.vy;
                if (cursorNorm.active) {
                    const dx = cursorNorm.x - p.x;
                    const dy = cursorNorm.y - p.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 0.22 && dist > 0.001) {
                        p.x += dx * 0.004;
                        p.y += dy * 0.004;
                    }
                }
                if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
                if (p.x < 0) p.x = 1;
                if (p.x > 1) p.x = 0;

                pCtx.beginPath();
                pCtx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
                pCtx.fillStyle = `rgba(255, 255, 255, ${p.a.toFixed(2)})`;
                pCtx.fill();
            }

            if (embers.length > 0) {
                embers = embers.filter(em => em.life > 0);
                for (const em of embers) {
                    em.x += em.vx;
                    em.y += em.vy;
                    em.vy -= 0.00018;
                    em.life -= 0.014;
                    pCtx.beginPath();
                    pCtx.arc(em.x * w, em.y * h, em.r, 0, Math.PI * 2);
                    pCtx.fillStyle = `rgba(212, 175, 55, ${Math.max(0, em.life).toFixed(2)})`;
                    pCtx.fill();
                }
            }

            requestAnimationFrame(animateAltarCanvas);
        }
        requestAnimationFrame(animateAltarCanvas);

        document.getElementById('burnSigilBtn')?.addEventListener('click', () => {
            svg.classList.add('is-incinerating');
            for (let i = 0; i < 110; i++) {
                const angle = Math.random() * Math.PI * 2;
                const rad = Math.random() * 0.28;
                embers.push({
                    x: 0.5 + Math.cos(angle) * rad,
                    y: 0.5 + Math.sin(angle) * rad,
                    vx: (Math.random() - 0.5) * 0.005,
                    vy: -0.002 - Math.random() * 0.006,
                    r: 1.2 + Math.random() * 2.4,
                    life: 1.0
                });
            }
            setTimeout(() => {
                intentInput.value = '';
                state.freehandStrokes = [];
                state.veiled = false;
                intentInput.classList.remove('is-veiled');
                if (veilBtn) veilBtn.textContent = 'Velar Texto';
                renderSigil();
                svg.classList.remove('is-incinerating');
                window.outisApp?.showNotification('Sigilo dissolvido no éter. Sentença apagada.', 'info');
            }, 680);
        });

        // ======================================================================
        // Gnosis & Harmonic Charging Chamber (Web Audio API)
        // ======================================================================
        const chamber = document.getElementById('gnosisChamber');
        const mount = document.getElementById('gnosisSvgMount');
        const centerpiece = document.getElementById('gnosisCenterpiece');
        const chargeFill = document.getElementById('gnosisChargeFill');
        const statusText = document.getElementById('gnosisStatusText');
        const droneBtn = document.getElementById('gnosisDroneBtn');

        let audioCtx = null;
        let droneNodes = null;
        let charging = false;
        let chargeLevel = 0;

        function startHarmonicDrone() {
            if (droneNodes) return;
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            if (!audioCtx) audioCtx = new Ctx();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const master = audioCtx.createGain();
            master.gain.setValueAtTime(0.0001, audioCtx.currentTime);
            master.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 1.8);

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(340, audioCtx.currentTime);

            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const osc3 = audioCtx.createOscillator();
            osc1.type = 'sine';     osc1.frequency.value = 110;
            osc2.type = 'sine';     osc2.frequency.value = 114.5;
            osc3.type = 'triangle'; osc3.frequency.value = 165;

            const g3 = audioCtx.createGain();
            g3.gain.value = 0.25;

            osc1.connect(filter);
            osc2.connect(filter);
            osc3.connect(g3);
            g3.connect(filter);
            filter.connect(master);
            master.connect(audioCtx.destination);

            osc1.start(); osc2.start(); osc3.start();
            droneNodes = { master, filter, oscs: [osc1, osc2, osc3] };
            droneBtn.textContent = '♪ Drone Harmônico: Ativo (110Hz θ)';
        }

        function stopHarmonicDrone() {
            if (!droneNodes || !audioCtx) return;
            const now = audioCtx.currentTime;
            droneNodes.master.gain.cancelScheduledValues(now);
            droneNodes.master.gain.setValueAtTime(Math.max(droneNodes.master.gain.value, 0.001), now);
            droneNodes.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
            const toStop = droneNodes.oscs;
            droneNodes = null;
            droneBtn.textContent = '♪ Drone Harmônico: Desligado';
            setTimeout(() => {
                toStop.forEach(o => { try { o.stop(); } catch (_) {} });
            }, 650);
        }

        droneBtn?.addEventListener('click', () => {
            if (droneNodes) stopHarmonicDrone();
            else startHarmonicDrone();
        });

        function openGnosisChamber() {
            const prevGuide = showMatrixGuide.checked;
            showMatrixGuide.checked = false;
            renderSigil();
            mount.innerHTML = scopeSvgIds(new XMLSerializer().serializeToString(svg), 'gnosis');
            showMatrixGuide.checked = prevGuide;
            renderSigil();

            chargeLevel = 0;
            chargeFill.style.transform = 'scaleX(0)';
            centerpiece.classList.remove('is-consecrated');
            statusText.textContent = 'Fixe o olhar no centro do selo. Mantenha pressionado sobre o sigilo para concentrar e consagrar.';
            chamber.classList.add('is-open');
            chamber.setAttribute('aria-hidden', 'false');
        }

        function closeGnosisChamber() {
            charging = false;
            stopHarmonicDrone();
            chamber.classList.remove('is-open');
            chamber.setAttribute('aria-hidden', 'true');
        }

        document.getElementById('enterGnosisBtn')?.addEventListener('click', openGnosisChamber);
        document.getElementById('exitGnosisBtn')?.addEventListener('click', closeGnosisChamber);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chamber.classList.contains('is-open')) closeGnosisChamber();
        });

        centerpiece?.addEventListener('pointerdown', () => { charging = true; });
        window.addEventListener('pointerup', () => { charging = false; });

        function gnosisLoop() {
            if (chamber.classList.contains('is-open')) {
                if (charging && chargeLevel < 1) {
                    chargeLevel = Math.min(1, chargeLevel + 0.0085);
                    if (droneNodes && audioCtx) {
                        droneNodes.filter.frequency.setTargetAtTime(340 + chargeLevel * 900, audioCtx.currentTime, 0.08);
                    }
                    if (chargeLevel >= 1) {
                        centerpiece.classList.add('is-consecrated');
                        statusText.textContent = '🜏 Selo Consagrado em Gnose. Solte, guarde no grimório ou incinere no esquecimento.';
                    }
                } else if (!charging && chargeLevel > 0 && chargeLevel < 1) {
                    chargeLevel = Math.max(0, chargeLevel - 0.005);
                }

                chargeFill.style.transform = `scaleX(${chargeLevel.toFixed(3)})`;
                const scale = 1 + chargeLevel * 0.08;
                const glowPx = Math.round(6 + chargeLevel * 34);
                mount.style.transform = `scale(${scale.toFixed(3)})`;
                if (chargeLevel < 1) {
                    mount.style.filter = `drop-shadow(0 0 ${glowPx}px rgba(255,255,255,${(0.25 + chargeLevel * 0.65).toFixed(2)}))`;
                }
            }
            requestAnimationFrame(gnosisLoop);
        }
        requestAnimationFrame(gnosisLoop);

        // Initial render
        syncEngineNote();
        syncSealLoreAndUI();
        renderSigil();
        renderGrimoire();
    });
})();