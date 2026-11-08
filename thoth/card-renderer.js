/**
 * Renderizador de Estudo Individual — Tarot de Thoth (Frater Outis)
 * Parser Markdown robusto (tabelas, listas múltiplas, títulos h1-h4) + navegação sequencial.
 */
(function () {
    'use strict';

    const ORDERED_CARDS = [
        // 22 Major Arcana
        { name: 'O Louco', path: 'Major_Arcana/The_Fool', ext: 'webp', treeLink: '/arvore-da-vida/?path=11', treeLabel: 'Caminho 11 · Aleph (א)' },
        { name: 'O Mago', path: 'Major_Arcana/The_Magus', ext: 'webp', treeLink: '/arvore-da-vida/?path=12', treeLabel: 'Caminho 12 · Beth (ב)' },
        { name: 'A Sacerdotisa', path: 'Major_Arcana/The_Priestess', ext: 'webp', treeLink: '/arvore-da-vida/?path=13', treeLabel: 'Caminho 13 · Gimel (ג)' },
        { name: 'A Imperatriz', path: 'Major_Arcana/The_Empress', ext: 'webp', treeLink: '/arvore-da-vida/?path=14', treeLabel: 'Caminho 14 · Daleth (ד)' },
        { name: 'O Imperador', path: 'Major_Arcana/The_Emperor', ext: 'webp', treeLink: '/arvore-da-vida/?path=15', treeLabel: 'Caminho 15 · Heh (ה)' },
        { name: 'O Hierofante', path: 'Major_Arcana/The_Hierophant', ext: 'webp', treeLink: '/arvore-da-vida/?path=16', treeLabel: 'Caminho 16 · Vav (ו)' },
        { name: 'Os Amantes', path: 'Major_Arcana/The_Lovers', ext: 'webp', treeLink: '/arvore-da-vida/?path=17', treeLabel: 'Caminho 17 · Zain (ז)' },
        { name: 'O Carro', path: 'Major_Arcana/The_Chariot', ext: 'webp', treeLink: '/arvore-da-vida/?path=18', treeLabel: 'Caminho 18 · Cheth (ח)' },
        { name: 'O Ajuste', path: 'Major_Arcana/The_Adjustment', ext: 'webp', treeLink: '/arvore-da-vida/?path=22', treeLabel: 'Caminho 22 · Lamed (ל)' },
        { name: 'O Eremita', path: 'Major_Arcana/The_Hermit', ext: 'webp', treeLink: '/arvore-da-vida/?path=20', treeLabel: 'Caminho 20 · Yod (י)' },
        { name: 'A Fortuna', path: 'Major_Arcana/The_Fortune', ext: 'webp', treeLink: '/arvore-da-vida/?path=21', treeLabel: 'Caminho 21 · Kaph (כ)' },
        { name: 'A Luxúria', path: 'Major_Arcana/The_Lust', ext: 'webp', treeLink: '/arvore-da-vida/?path=19', treeLabel: 'Caminho 19 · Teth (ט)' },
        { name: 'O Enforcado', path: 'Major_Arcana/The_Hanged_Man', ext: 'webp', treeLink: '/arvore-da-vida/?path=23', treeLabel: 'Caminho 23 · Mem (מ)' },
        { name: 'A Morte', path: 'Major_Arcana/The_Death', ext: 'webp', treeLink: '/arvore-da-vida/?path=24', treeLabel: 'Caminho 24 · Nun (נ)' },
        { name: 'A Arte', path: 'Major_Arcana/The_Art', ext: 'webp', treeLink: '/arvore-da-vida/?path=25', treeLabel: 'Caminho 25 · Samekh (ס)' },
        { name: 'O Diabo', path: 'Major_Arcana/The_Devil', ext: 'webp', treeLink: '/arvore-da-vida/?path=26', treeLabel: 'Caminho 26 · Ayin (ע)' },
        { name: 'A Torre', path: 'Major_Arcana/The_Tower', ext: 'webp', treeLink: '/arvore-da-vida/?path=27', treeLabel: 'Caminho 27 · Peh (פ)' },
        { name: 'A Estrela', path: 'Major_Arcana/The_Star', ext: 'webp', treeLink: '/arvore-da-vida/?path=28', treeLabel: 'Caminho 28 · Tzaddi (צ)' },
        { name: 'A Lua', path: 'Major_Arcana/The_Moon', ext: 'webp', treeLink: '/arvore-da-vida/?path=29', treeLabel: 'Caminho 29 · Qoph (ק)' },
        { name: 'O Sol', path: 'Major_Arcana/The_Sun', ext: 'webp', treeLink: '/arvore-da-vida/?path=30', treeLabel: 'Caminho 30 · Resh (ר)' },
        { name: 'O Éon', path: 'Major_Arcana/The_Aeon', ext: 'webp', treeLink: '/arvore-da-vida/?path=31', treeLabel: 'Caminho 31 · Shin (ש)' },
        { name: 'O Universo', path: 'Major_Arcana/The_Universe', ext: 'webp', treeLink: '/arvore-da-vida/?path=32', treeLabel: 'Caminho 32 · Tav (ת)' },
        // Wands
        ...['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Princess', 'Prince', 'Queen', 'Knight'].map((r, i) => ({
            name: `${r === 'Ace' ? 'Ás' : r === 'Princess' ? 'Princesa' : r === 'Prince' ? 'Príncipe' : r === 'Queen' ? 'Rainha' : r === 'Knight' ? 'Cavaleiro' : r} de Paus`,
            path: `Minor_Arcana/Wands/${r}_of_Wands`, ext: 'webp',
            treeLink: i < 10 ? `/arvore-da-vida/?sephira=${i + 1}` : null,
            treeLabel: i < 10 ? `Sephira ${i + 1} · Naipe do Fogo 🜂` : 'Corte do Fogo 🜂'
        })),
        // Cups
        ...['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Princess', 'Prince', 'Queen', 'Knight'].map((r, i) => ({
            name: `${r === 'Ace' ? 'Ás' : r === 'Princess' ? 'Princesa' : r === 'Prince' ? 'Príncipe' : r === 'Queen' ? 'Rainha' : r === 'Knight' ? 'Cavaleiro' : r} de Copas`,
            path: `Minor_Arcana/Cups/${r}_of_Cups`, ext: r === '3' ? 'jpg' : 'webp',
            treeLink: i < 10 ? `/arvore-da-vida/?sephira=${i + 1}` : null,
            treeLabel: i < 10 ? `Sephira ${i + 1} · Naipe da Água 🜄` : 'Corte da Água 🜄'
        })),
        // Swords
        ...['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Princess', 'Prince', 'Queen', 'Knight'].map((r, i) => ({
            name: `${r === 'Ace' ? 'Ás' : r === 'Princess' ? 'Princesa' : r === 'Prince' ? 'Príncipe' : r === 'Queen' ? 'Rainha' : r === 'Knight' ? 'Cavaleiro' : r} de Espadas`,
            path: `Minor_Arcana/Swords/${r}_of_Swords`, ext: r === '4' ? 'webp' : 'png',
            treeLink: i < 10 ? `/arvore-da-vida/?sephira=${i + 1}` : null,
            treeLabel: i < 10 ? `Sephira ${i + 1} · Naipe do Ar 🜁` : 'Corte do Ar 🜁'
        })),
        // Disks
        ...['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Princess', 'Prince', 'Queen', 'Knight'].map((r, i) => ({
            name: `${r === 'Ace' ? 'Ás' : r === 'Princess' ? 'Princesa' : r === 'Prince' ? 'Príncipe' : r === 'Queen' ? 'Rainha' : r === 'Knight' ? 'Cavaleiro' : r} de Discos`,
            path: `Minor_Arcana/Disks/${r}_of_Disks`, ext: 'png',
            treeLink: i < 10 ? `/arvore-da-vida/?sephira=${i + 1}` : null,
            treeLabel: i < 10 ? `Sephira ${i + 1} · Naipe da Terra 🜃` : 'Corte da Terra 🜃'
        }))
    ];

    function formatInline(text) {
        return text
            .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    }

    function renderMarkdown(md) {
        if (!md) return '';
        const lines = md.replace(/\r\n/g, '\n').split('\n');
        const out = [];
        let inUl = false;
        let inOl = false;
        let inTable = false;
        let tableHasHead = false;
        let paragraphBuf = [];

        const flushParagraph = () => {
            if (paragraphBuf.length > 0) {
                out.push(`<p>${formatInline(paragraphBuf.join(' '))}</p>`);
                paragraphBuf = [];
            }
        };
        const closeLists = () => {
            if (inUl) { out.push('</ul>'); inUl = false; }
            if (inOl) { out.push('</ol>'); inOl = false; }
        };
        const closeTable = () => {
            if (inTable) {
                out.push('</tbody></table>');
                inTable = false;
                tableHasHead = false;
            }
        };

        for (let i = 0; i < lines.length; i++) {
            const raw = lines[i];
            const trimmed = raw.trim();

            if (!trimmed) {
                flushParagraph();
                closeLists();
                closeTable();
                continue;
            }

            // Table row
            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                flushParagraph();
                closeLists();
                const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
                if (cells.every(c => /^[-:\s]+$/.test(c))) continue;
                if (!inTable) {
                    inTable = true;
                    tableHasHead = true;
                    out.push('<table><thead><tr>' + cells.map(c => `<th>${formatInline(c)}</th>`).join('') + '</tr></thead><tbody>');
                } else {
                    out.push('<tr>' + cells.map(c => `<td>${formatInline(c)}</td>`).join('') + '</tr>');
                }
                continue;
            } else {
                closeTable();
            }

            // Horizontal rule
            if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
                flushParagraph();
                closeLists();
                out.push('<hr>');
                continue;
            }

            // Headings
            const hMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
            if (hMatch) {
                flushParagraph();
                closeLists();
                const lvl = hMatch[1].length;
                out.push(`<h${lvl}>${formatInline(hMatch[2])}</h${lvl}>`);
                continue;
            }

            // Blockquote
            if (trimmed.startsWith('> ')) {
                flushParagraph();
                closeLists();
                out.push(`<blockquote>${formatInline(trimmed.slice(2))}</blockquote>`);
                continue;
            }

            // Unordered list
            if (/^[-*]\s+/.test(trimmed)) {
                flushParagraph();
                if (inOl) { out.push('</ol>'); inOl = false; }
                if (!inUl) { out.push('<ul>'); inUl = true; }
                out.push(`<li>${formatInline(trimmed.replace(/^[-*]\s+/, ''))}</li>`);
                continue;
            }

            // Ordered list
            if (/^\d+\.\s+/.test(trimmed)) {
                flushParagraph();
                if (inUl) { out.push('</ul>'); inUl = false; }
                if (!inOl) { out.push('<ol>'); inOl = true; }
                out.push(`<li>${formatInline(trimmed.replace(/^\d+\.\s+/, ''))}</li>`);
                continue;
            }

            closeLists();
            paragraphBuf.push(trimmed);
        }

        flushParagraph();
        closeLists();
        closeTable();
        return out.join('\n');
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const cardParam = params.get('card');
        const cardName = params.get('name') || '';
        const isReversed = params.get('reversed') === 'true';

        const loadingEl = document.getElementById('loading');
        const displayEl = document.getElementById('card-display');
        const errorEl = document.getElementById('error-display');

        if (!cardParam) {
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';
            return;
        }

        const shortPath = cardParam.replace(/^assets\/Tarot_Cards\//, '');
        const idx = ORDERED_CARDS.findIndex(c => c.path === shortPath);
        const cardMeta = idx >= 0 ? ORDERED_CARDS[idx] : null;

        // Setup Prev / Next navigation
        if (idx >= 0) {
            const stepNav = document.getElementById('cardStepNav');
            const prevLink = document.getElementById('prevCardLink');
            const nextLink = document.getElementById('nextCardLink');
            const prevCard = ORDERED_CARDS[(idx - 1 + ORDERED_CARDS.length) % ORDERED_CARDS.length];
            const nextCard = ORDERED_CARDS[(idx + 1) % ORDERED_CARDS.length];

            prevLink.href = `card-detail.html?card=${encodeURIComponent('assets/Tarot_Cards/' + prevCard.path)}&name=${encodeURIComponent(prevCard.name)}`;
            prevLink.title = prevCard.name;
            nextLink.href = `card-detail.html?card=${encodeURIComponent('assets/Tarot_Cards/' + nextCard.path)}&name=${encodeURIComponent(nextCard.name)}`;
            nextLink.title = nextCard.name;
            stepNav.style.display = 'flex';
        }

        try {
            const descriptionUrl = `../${cardParam}_description.md`;
            const mdRes = await fetch(descriptionUrl);
            if (!mdRes.ok) throw new Error('Markdown not found');
            const mdText = await mdRes.text();

            // Resolve image extension directly from metadata or fallback probe
            let imgUrl = cardMeta
                ? `../assets/Tarot_Cards/${cardMeta.path}.${cardMeta.ext}`
                : '';

            if (!imgUrl) {
                for (const ext of ['.webp', '.png', '.jpg']) {
                    const testUrl = `../${cardParam}${ext}`;
                    const headRes = await fetch(testUrl, { method: 'HEAD' });
                    if (headRes.ok) { imgUrl = testUrl; break; }
                }
            }

            const imgEl = document.getElementById('card-image');
            imgEl.src = imgUrl || `../${cardParam}.webp`;
            imgEl.alt = cardMeta?.name || cardName || 'Carta do Tarot de Thoth';
            if (isReversed) imgEl.style.transform = 'rotate(180deg)';

            const metaContainer = document.getElementById('card-esoteric-meta');
            if (cardMeta && metaContainer) {
                metaContainer.innerHTML = `
                    <div class="meta-kv"><span>Lâmina</span><span>${cardMeta.name}</span></div>
                    <div class="meta-kv"><span>Correspondência</span><span>${cardMeta.treeLabel}</span></div>
                    ${cardMeta.treeLink ? `<a href="${cardMeta.treeLink}" class="detail-nav-btn" style="justify-content:center;margin-top:0.35rem;">Ver na Árvore da Vida →</a>` : ''}
                `;
            }

            const bannerHtml = isReversed
                ? `<div class="status-banner reversed"><span class="title">Orientação Invertida</span><p>Considere bloqueios, excessos, interiorização ou aspectos de sombra deste arquétipo.</p></div>`
                : `<div class="status-banner upright"><span class="title">Dignidade Direta</span><p>Fluxo natural do arquétipo; no sistema Thoth observe também as dignidades elementares ao redor.</p></div>`;

            document.getElementById('card-info').innerHTML = bannerHtml + renderMarkdown(mdText);

            const h1Match = mdText.match(/^#\s+(.+)$/m);
            const titleBase = h1Match ? h1Match[1] : (cardMeta?.name || cardName);
            document.title = `${titleBase}${isReversed ? ' (Invertida)' : ''} • Tarot de Thoth - Frater Outis`;

            loadingEl.style.display = 'none';
            displayEl.style.display = 'block';
        } catch (err) {
            console.error(err);
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';
        }
    });
})();
