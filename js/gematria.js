/**
 * Frater Outis — Gematria Hermética Engine
 * Calculadora em tempo real e visualizador da Grande Tabela de Gematria.
 */

(function () {
    'use strict';

    // Hebrew Standard (Mispar Hechrachi) & Sofit Values
    const HEBREW_STD = {
        'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
        'י': 10, 'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50,
        'ס': 60, 'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90, 'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
    };

    const HEBREW_SOFIT = {
        'ך': 500, 'ם': 600, 'ן': 700, 'ף': 800, 'ץ': 900
    };

    // Greek Isopsephy
    const GREEK = {
        'α': 1, 'ἀ': 1, 'ἁ': 1, 'ὰ': 1, 'ά': 1, 'ᾶ': 1, 'β': 2, 'γ': 3, 'δ': 4,
        'ε': 5, 'ἐ': 5, 'ἑ': 5, 'ὲ': 5, 'έ': 5, 'ϝ': 6, 'ϛ': 6, 'ζ': 7,
        'η': 8, 'ἠ': 8, 'ἡ': 8, 'ὴ': 8, 'ή': 8, 'ῆ': 8, 'θ': 9,
        'ι': 10, 'ἰ': 10, 'ἱ': 10, 'ὶ': 10, 'ί': 10, 'ῖ': 10, 'ϊ': 10, 'ΐ': 10,
        'κ': 20, 'λ': 30, 'μ': 40, 'ν': 50, 'ξ': 60, 'ο': 70, 'ὀ': 70, 'ὁ': 70, 'ὸ': 70, 'ό': 70,
        'π': 80, 'ϙ': 90, 'ϟ': 90, 'ρ': 100, 'ῥ': 100, 'σ': 200, 'ς': 200, 'τ': 300,
        'υ': 400, 'ὐ': 400, 'ὑ': 400, 'ὺ': 400, 'ύ': 400, 'ῦ': 400, 'ϋ': 400, 'ΰ': 400,
        'φ': 500, 'χ': 600, 'ψ': 700, 'ω': 800, 'ὠ': 800, 'ὡ': 800, 'ὼ': 800, 'ώ': 800, 'ῶ': 800, 'ϡ': 900
    };

    // New Aeon English Qabalah (NAEQ / ALW Cipher) from Liber AL II:55
    // Order: A=1, L=2, W=3, H=4, S=5, D=6, O=7, Z=8, K=9, V=10, G=11, R=12, C=13,
    //        N=14, Y=15, J=16, U=17, F=18, Q=19, B=20, M=21, X=22, I=23, T=24, E=25, P=26
    const NAEQ = {
        'A': 1, 'L': 2, 'W': 3, 'H': 4, 'S': 5, 'D': 6, 'O': 7, 'Z': 8,
        'K': 9, 'V': 10, 'G': 11, 'R': 12, 'C': 13, 'N': 14, 'Y': 15, 'J': 16,
        'U': 17, 'F': 18, 'Q': 19, 'B': 20, 'M': 21, 'X': 22, 'I': 23, 'T': 24,
        'E': 25, 'P': 26
    };

    // Simple Gematria (A=1...Z=26)
    const SIMPLE_LATIN = {};
    for (let i = 0; i < 26; i++) {
        SIMPLE_LATIN[String.fromCharCode(65 + i)] = i + 1;
    }

    // State
    const state = {
        searchQuery: '',
        activeCategory: 'all',
        sortOrder: 'asc',
        selectedNumber: null
    };

    // DOM Elements
    let calcInput, resHebrewVal, resHebrewBreak, resGreekVal, resGreekBreak,
        resNaeqVal, resNaeqBreak, resSimpleVal, resSimpleBreak,
        btnFilterCalc, tableSearchInput, sortSelect, categoryPills,
        tableBody, statusCount, modalBackdrop, modalContent, modalCloseBtn;

    function init() {
        calcInput = document.getElementById('calcInput');
        resHebrewVal = document.getElementById('resHebrewVal');
        resHebrewBreak = document.getElementById('resHebrewBreak');
        resGreekVal = document.getElementById('resGreekVal');
        resGreekBreak = document.getElementById('resGreekBreak');
        resNaeqVal = document.getElementById('resNaeqVal');
        resNaeqBreak = document.getElementById('resNaeqBreak');
        resSimpleVal = document.getElementById('resSimpleVal');
        resSimpleBreak = document.getElementById('resSimpleBreak');
        btnFilterCalc = document.getElementById('btnFilterCalc');

        tableSearchInput = document.getElementById('tableSearchInput');
        sortSelect = document.getElementById('sortSelect');
        categoryPills = document.querySelectorAll('.cat-pill');
        tableBody = document.getElementById('gematriaTableBody');
        statusCount = document.getElementById('statusCount');

        modalBackdrop = document.getElementById('gematriaModal');
        modalContent = document.getElementById('gematriaModalContent');
        modalCloseBtn = document.getElementById('modalCloseBtn');

        bindEvents();
        updateCategoryCounts();
        renderTable();

        // Calculate initial sample if input is pre-filled or trigger empty state
        calculateLive(calcInput ? calcInput.value : '');
    }

    function bindEvents() {
        if (calcInput) {
            calcInput.addEventListener('input', (e) => calculateLive(e.target.value));
        }

        if (btnFilterCalc) {
            btnFilterCalc.addEventListener('click', () => {
                const text = calcInput.value.trim();
                if (!text) return;
                // Prefer calculated hebrew or NAEQ value
                const nHeb = calcHebrew(text).total;
                const nNaeq = calcNaeq(text).total;
                const nSimple = calcSimple(text).total;
                const val = nHeb > 0 ? nHeb : (nNaeq > 0 ? nNaeq : nSimple);
                if (val > 0) {
                    tableSearchInput.value = String(val);
                    state.searchQuery = String(val);
                    renderTable();
                    // Scroll down to table
                    document.querySelector('.gematria-controls').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (tableSearchInput) {
            tableSearchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value.trim();
                renderTable();
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                state.sortOrder = e.target.value;
                renderTable();
            });
        }

        categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
                categoryPills.forEach(p => p.classList.remove('is-active'));
                pill.classList.add('is-active');
                state.activeCategory = pill.dataset.cat;
                renderTable();
            });
        });

        const resetBtn = document.getElementById('btnResetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                state.searchQuery = '';
                state.activeCategory = 'all';
                state.sortOrder = 'asc';
                if (tableSearchInput) tableSearchInput.value = '';
                if (sortSelect) sortSelect.value = 'asc';
                categoryPills.forEach(p => p.classList.toggle('is-active', p.dataset.cat === 'all'));
                renderTable();
            });
        }

        // Modal dismissal
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', (e) => {
                if (e.target === modalBackdrop) closeModal();
            });
        }
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    // ==========================================
    // Real-time Calculators
    // ==========================================

    function normalizeText(txt) {
        return (txt || '').normalize('NFD');
    }

    function calcHebrew(raw) {
        let total = 0;
        const parts = [];
        for (const char of raw) {
            if (HEBREW_STD[char]) {
                const val = HEBREW_STD[char];
                total += val;
                parts.push(`${char}(${val})`);
            }
        }
        return { total, breakdown: parts.join(' + ') };
    }

    function calcGreek(raw) {
        let total = 0;
        const parts = [];
        const lower = raw.toLowerCase();
        for (const char of lower) {
            if (GREEK[char]) {
                const val = GREEK[char];
                total += val;
                parts.push(`${char}(${val})`);
            }
        }
        return { total, breakdown: parts.join(' + ') };
    }

    function calcNaeq(raw) {
        let total = 0;
        const parts = [];
        // Strip accents for Latin evaluation
        const clean = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
        for (const char of clean) {
            if (NAEQ[char]) {
                const val = NAEQ[char];
                total += val;
                parts.push(`${char}(${val})`);
            }
        }
        return { total, breakdown: parts.join(' + ') };
    }

    function calcSimple(raw) {
        let total = 0;
        const parts = [];
        const clean = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
        for (const char of clean) {
            if (SIMPLE_LATIN[char]) {
                const val = SIMPLE_LATIN[char];
                total += val;
                parts.push(`${char}(${val})`);
            }
        }
        return { total, breakdown: parts.join(' + ') };
    }

    function calculateLive(text) {
        if (!text || !text.trim()) {
            if (resHebrewVal) resHebrewVal.textContent = '0';
            if (resHebrewBreak) resHebrewBreak.textContent = 'Aguardando texto...';
            if (resGreekVal) resGreekVal.textContent = '0';
            if (resGreekBreak) resGreekBreak.textContent = 'Aguardando texto...';
            if (resNaeqVal) resNaeqVal.textContent = '0';
            if (resNaeqBreak) resNaeqBreak.textContent = 'Aguardando texto...';
            if (resSimpleVal) resSimpleVal.textContent = '0';
            if (resSimpleBreak) resSimpleBreak.textContent = 'Aguardando texto...';
            return;
        }

        const h = calcHebrew(text);
        const g = calcGreek(text);
        const n = calcNaeq(text);
        const s = calcSimple(text);

        if (resHebrewVal) resHebrewVal.textContent = h.total || '—';
        if (resHebrewBreak) resHebrewBreak.textContent = h.breakdown || (h.total === 0 ? 'Sem letras hebraicas detectadas' : '');

        if (resGreekVal) resGreekVal.textContent = g.total || '—';
        if (resGreekBreak) resGreekBreak.textContent = g.breakdown || (g.total === 0 ? 'Sem letras gregas detectadas' : '');

        if (resNaeqVal) resNaeqVal.textContent = n.total || '—';
        if (resNaeqBreak) resNaeqBreak.textContent = n.breakdown || (n.total === 0 ? 'Sem letras latinas' : '');

        if (resSimpleVal) resSimpleVal.textContent = s.total || '—';
        if (resSimpleBreak) resSimpleBreak.textContent = s.breakdown || (s.total === 0 ? 'Sem letras latinas' : '');
    }

    // ==========================================
    // Table Rendering & Filtering
    // ==========================================

    function getFilteredEntries() {
        const db = window.GEMATRIA_DATABASE || [];
        const q = state.searchQuery.toLowerCase();
        const cat = state.activeCategory;

        return db.filter(entry => {
            // Category filter
            if (cat !== 'all') {
                if (!entry.categories || !entry.categories.includes(cat)) {
                    return false;
                }
            }

            // Search filter
            if (!q) return true;

            // Direct number match
            if (String(entry.n) === q || String(entry.n).startsWith(q)) return true;

            // Hebrew match
            if (entry.hebrew && entry.hebrew.some(h =>
                (h.text && h.text.toLowerCase().includes(q)) ||
                (h.translit && h.translit.toLowerCase().includes(q)) ||
                (h.meaning && h.meaning.toLowerCase().includes(q))
            )) return true;

            // Greek match
            if (entry.greek && entry.greek.some(g =>
                (g.text && g.text.toLowerCase().includes(q)) ||
                (g.translit && g.translit.toLowerCase().includes(q)) ||
                (g.meaning && g.meaning.toLowerCase().includes(q))
            )) return true;

            // English match
            if (entry.english && entry.english.some(en =>
                (en.term && en.term.toLowerCase().includes(q)) ||
                (en.notes && en.notes.toLowerCase().includes(q))
            )) return true;

            // Portuguese match
            if (entry.portuguese && entry.portuguese.some(pt =>
                (pt.term && pt.term.toLowerCase().includes(q)) ||
                (pt.notes && pt.notes.toLowerCase().includes(q))
            )) return true;

            // Significance match
            if (entry.significance && entry.significance.toLowerCase().includes(q)) return true;

            return false;
        }).sort((a, b) => {
            return state.sortOrder === 'desc' ? b.n - a.n : a.n - b.n;
        });
    }

    function updateCategoryCounts() {
        const db = window.GEMATRIA_DATABASE || [];
        const counts = { all: db.length };
        db.forEach(e => {
            (e.categories || []).forEach(c => {
                counts[c] = (counts[c] || 0) + 1;
            });
        });

        categoryPills.forEach(pill => {
            const cat = pill.dataset.cat;
            const countEl = pill.querySelector('.cat-count');
            if (countEl) {
                countEl.textContent = counts[cat] || 0;
            }
        });
    }

    function renderTable() {
        if (!tableBody) return;
        const entries = getFilteredEntries();

        if (statusCount) {
            const total = (window.GEMATRIA_DATABASE || []).length;
            statusCount.textContent = `Exibindo ${entries.length} de ${total} nós numéricos sagrados`;
        }

        if (entries.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 3rem 1rem; color: rgba(255, 255, 255, 0.45); font-family: var(--fo-mono); font-size: 0.85rem;">
                        Nenhuma correspondência encontrada para o filtro atual.<br>
                        <button type="button" class="btn-reset-filters" style="margin-top: 0.8rem; display: inline-block;" onclick="document.getElementById('btnResetFilters').click()">Limpar filtros de pesquisa</button>
                    </td>
                </tr>
            `;
            return;
        }

        const rowsHtml = entries.map(entry => {
            // Hebrew Cell
            let hebContent = '<span class="empty-cell-dash">—</span>';
            if (entry.hebrew && entry.hebrew.length > 0) {
                hebContent = entry.hebrew.map(h => `
                    <div class="heb-item">
                        <div class="heb-text">${escapeHtml(h.text)}</div>
                        <div class="heb-translit">${escapeHtml(h.translit)}</div>
                        <div class="heb-meaning">${escapeHtml(h.meaning)}</div>
                    </div>
                `).join('');
            }
            if (entry.shem && entry.shem.length > 0) {
                const shemBadges = entry.shem.map(s => `
                    <div class="shem-tag" title="${escapeHtml(s.attribute)}">
                        ★ Shem #${s.index} (${escapeHtml(s.choir)})
                    </div>
                `).join('');
                hebContent += shemBadges;
            }

            // Greek Cell
            let grkContent = '<span class="empty-cell-dash">—</span>';
            if (entry.greek && entry.greek.length > 0) {
                grkContent = entry.greek.map(g => `
                    <div class="grk-item">
                        <div class="grk-text">${escapeHtml(g.text)}</div>
                        <div class="grk-translit">${escapeHtml(g.translit)}</div>
                        <div class="grk-meaning">${escapeHtml(g.meaning)}</div>
                    </div>
                `).join('');
            }

            // English Cell
            let engContent = '<span class="empty-cell-dash">—</span>';
            if (entry.english && entry.english.length > 0) {
                engContent = entry.english.map(en => `
                    <div class="lang-item">
                        <div class="lang-term-title">${escapeHtml(en.term)}</div>
                        <div class="lang-cipher-badge">${escapeHtml(en.cipher || 'Simbólica')}</div>
                        ${en.notes ? `<div class="lang-note">${escapeHtml(en.notes)}</div>` : ''}
                    </div>
                `).join('');
            }

            // Portuguese Cell
            let ptContent = '<span class="empty-cell-dash">—</span>';
            if (entry.portuguese && entry.portuguese.length > 0) {
                ptContent = entry.portuguese.map(pt => `
                    <div class="lang-item">
                        <div class="lang-term-title">${escapeHtml(pt.term)}</div>
                        <div class="lang-cipher-badge">${escapeHtml(pt.cipher || 'Simbólica')}</div>
                        ${pt.notes ? `<div class="lang-note">${escapeHtml(pt.notes)}</div>` : ''}
                    </div>
                `).join('');
            }

            // Notes / Significance Cell
            const notesContent = entry.significance
                ? `<div class="cell-notes-wrap">${escapeHtml(entry.significance)}</div>`
                : '<span class="empty-cell-dash">—</span>';

            return `
                <tr data-num="${entry.n}">
                    <td class="col-num cell-num-wrap">
                        <span class="num-badge">${entry.n}</span>
                    </td>
                    <td class="col-heb cell-heb-wrap">${hebContent}</td>
                    <td class="col-grk cell-grk-wrap">${grkContent}</td>
                    <td class="col-eng cell-eng-wrap">${engContent}</td>
                    <td class="col-pt cell-pt-wrap">${ptContent}</td>
                    <td class="col-notes">${notesContent}</td>
                </tr>
            `;
        }).join('');

        tableBody.innerHTML = rowsHtml;

        // Bind row clicks
        tableBody.querySelectorAll('tr[data-num]').forEach(row => {
            row.addEventListener('click', () => {
                const n = Number(row.dataset.num);
                openModalForNumber(n);
            });
        });
    }

    // ==========================================
    // Modal Inspector
    // ==========================================

    function openModalForNumber(n) {
        const db = window.GEMATRIA_DATABASE || [];
        const entry = db.find(e => e.n === n);
        if (!entry) return;

        state.selectedNumber = n;

        let shemHtml = '';
        if (entry.shem && entry.shem.length > 0) {
            shemHtml = `
                <div class="modal-section">
                    <div class="modal-section-title">Shem ha-Mephorash (72 Nomes de Deus)</div>
                    ${entry.shem.map(s => `
                        <p class="modal-p" style="margin-bottom: 0.5rem;">
                            <strong>#${s.index} — ${escapeHtml(s.letters)} (${escapeHtml(s.angel)})</strong><br>
                            Coro: ${escapeHtml(s.choir)} • Atributo Divino: <em>${escapeHtml(s.attribute)}</em>
                        </p>
                    `).join('')}
                </div>
            `;
        }

        let hebHtml = '';
        if (entry.hebrew && entry.hebrew.length > 0) {
            hebHtml = `
                <div class="modal-section">
                    <div class="modal-section-title">Tradição Hebraica &amp; Cabala Clássica</div>
                    ${entry.hebrew.map(h => `
                        <p class="modal-p" style="margin-bottom: 0.4rem;">
                            <span style="font-size: 1.3rem; font-weight: bold; margin-right: 0.5rem; color: #fff;">${escapeHtml(h.text)}</span>
                            — <strong>${escapeHtml(h.translit)}</strong>: ${escapeHtml(h.meaning)}
                        </p>
                    `).join('')}
                </div>
            `;
        }

        let grkHtml = '';
        if (entry.greek && entry.greek.length > 0) {
            grkHtml = `
                <div class="modal-section">
                    <div class="modal-section-title">Isopsefia Grega &amp; Helenística</div>
                    ${entry.greek.map(g => `
                        <p class="modal-p" style="margin-bottom: 0.4rem;">
                            <span style="font-size: 1.2rem; font-weight: bold; margin-right: 0.5rem; color: #fff;">${escapeHtml(g.text)}</span>
                            — <strong>${escapeHtml(g.translit)}</strong>: ${escapeHtml(g.meaning)}
                        </p>
                    `).join('')}
                </div>
            `;
        }

        let langHtml = '';
        if ((entry.english && entry.english.length > 0) || (entry.portuguese && entry.portuguese.length > 0)) {
            langHtml = `
                <div class="modal-section">
                    <div class="modal-section-title">English Qabalah &amp; Vernáculo Português</div>
                    ${(entry.english || []).map(en => `
                        <p class="modal-p" style="margin-bottom: 0.35rem;">
                            🇬🇧 <strong>${escapeHtml(en.term)}</strong> [${escapeHtml(en.cipher || 'Simbólica')}]
                            ${en.notes ? `— <em>${escapeHtml(en.notes)}</em>` : ''}
                        </p>
                    `).join('')}
                    ${(entry.portuguese || []).map(pt => `
                        <p class="modal-p" style="margin-bottom: 0.35rem;">
                            🇧🇷 <strong>${escapeHtml(pt.term)}</strong> [${escapeHtml(pt.cipher || 'Simbólica')}]
                            ${pt.notes ? `— <em>${escapeHtml(pt.notes)}</em>` : ''}
                        </p>
                    `).join('')}
                </div>
            `;
        }

        let sigHtml = '';
        if (entry.significance) {
            sigHtml = `
                <div class="modal-section">
                    <div class="modal-section-title">Comentário Esotérico &amp; Liber 777</div>
                    <p class="modal-p">${escapeHtml(entry.significance)}</p>
                </div>
            `;
        }

        modalContent.innerHTML = `
            <div class="modal-num-hero">
                <span class="modal-num-display">${entry.n}</span>
                <span class="modal-num-label">Valor Numérico Cabalístico</span>
            </div>
            ${shemHtml}
            ${hebHtml}
            ${grkHtml}
            ${langHtml}
            ${sigHtml}
            <div class="modal-actions">
                <button type="button" class="modal-btn" id="modalCopyBtn">📋 Copiar Dados</button>
                <button type="button" class="modal-btn" id="modalCalcBtn">⌨️ Preencher na Calculadora</button>
            </div>
        `;

        const copyBtn = document.getElementById('modalCopyBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const summary = `${entry.n}: ${entry.significance || ''}`;
                navigator.clipboard.writeText(summary).then(() => {
                    copyBtn.textContent = '✓ Copiado!';
                    setTimeout(() => { copyBtn.textContent = '📋 Copiar Dados'; }, 1500);
                });
            });
        }

        const calcBtn = document.getElementById('modalCalcBtn');
        if (calcBtn) {
            calcBtn.addEventListener('click', () => {
                const primaryTerm = (entry.hebrew[0] && entry.hebrew[0].text) ||
                                    (entry.english[0] && entry.english[0].term) ||
                                    (entry.greek[0] && entry.greek[0].text) || String(entry.n);
                if (calcInput) {
                    calcInput.value = primaryTerm;
                    calculateLive(primaryTerm);
                }
                closeModal();
                calcInput.scrollIntoView({ behavior: 'smooth' });
            });
        }

        modalBackdrop.classList.add('is-open');
    }

    function closeModal() {
        if (modalBackdrop) {
            modalBackdrop.classList.remove('is-open');
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
