/**
 * Liber 777 API Explorer & Matrix Playground — Frater Outis
 */
(function () {
    'use strict';

    const KEY_SCALES = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
        '31', '32', '32 bis', '31 bis'
    ];

    // Map special column keys in all/index.json to their actual static directory slugs
    const FOLDER_SLUG_MAP = {
        'CVI *': 'CVI',
        'CLXIX.': 'CLXIX',
        'CLXX.': 'CLXX',
        'CLXXIX.': 'CLXXIX',
        'CLXXX.': 'CLXXX',
        'CIX (continued)*': null // embedded only in /apis/777/all/index.json
    };

    function getColumnEndpoint(colKey) {
        if (Object.prototype.hasOwnProperty.call(FOLDER_SLUG_MAP, colKey)) {
            const mapped = FOLDER_SLUG_MAP[colKey];
            return mapped ? `/apis/777/column/${encodeURIComponent(mapped)}/index.json` : null;
        }
        return `/apis/777/column/${encodeURIComponent(colKey)}/index.json`;
    }

    function normalizeStr(str) {
        return String(str || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    function formatValue(val) {
        if (Array.isArray(val)) return val.filter(Boolean).join(' · ');
        if (val === null || val === undefined) return '';
        return String(val).trim();
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function highlightMatch(text, rawQuery) {
        const safe = escapeHtml(text);
        if (!rawQuery || rawQuery.length < 2) return safe;
        const escapedQ = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        try {
            const re = new RegExp(`(${escapedQ})`, 'gi');
            return safe.replace(re, '<mark>$1</mark>');
        } catch (_) {
            return safe;
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const state = {
            data: null,
            columns: [],
            scaleLabels: {},
            activeCol: null,
            drawerMode: 'table',
            lastPlaygroundJson: ''
        };

        // Elements
        const metricTotalCols = document.getElementById('metricTotalCols');
        const metricTotalCells = document.getElementById('metricTotalCells');
        const columnsGrid = document.getElementById('columnsGrid');
        const columnsCountLabel = document.getElementById('columnsCountLabel');
        const searchInput = document.getElementById('globalSearchInput');
        const searchClear = document.getElementById('globalSearchClear');
        const hitsPanel = document.getElementById('globalHitsPanel');
        const hitsTitle = document.getElementById('globalHitsTitle');
        const hitsList = document.getElementById('globalHitsList');

        // Matrix elements
        const scaleSelect = document.getElementById('scaleSelect');
        const matrixFilterInput = document.getElementById('matrixFilterInput');
        const scaleSummaryTitle = document.getElementById('scaleSummaryTitle');
        const scaleSummarySub = document.getElementById('scaleSummarySub');
        const matrixTableBody = document.getElementById('matrixTableBody');

        // Playground elements
        const pgSelect = document.getElementById('playgroundEndpointSelect');
        const pgUrlCode = document.getElementById('playgroundUrlCode');
        const pgRunBtn = document.getElementById('playgroundRunBtn');
        const pgCopyBtn = document.getElementById('playgroundCopyBtn');
        const pgStatus = document.getElementById('pgStatus');
        const pgLatency = document.getElementById('pgLatency');
        const pgSize = document.getElementById('pgSize');
        const pgOutput = document.getElementById('playgroundOutput');

        // Drawer elements
        const drawerBackdrop = document.getElementById('colDrawerBackdrop');
        const drawerRoman = document.getElementById('colDrawerRoman');
        const drawerTitle = document.getElementById('colDrawerTitle');
        const drawerBody = document.getElementById('colDrawerBody');
        const drawerClose = document.getElementById('colDrawerClose');
        const colViewTableBtn = document.getElementById('colViewTableBtn');
        const colViewJsonBtn = document.getElementById('colViewJsonBtn');
        const colCopyJsonBtn = document.getElementById('colCopyJsonBtn');
        const colRawEndpointLink = document.getElementById('colRawEndpointLink');

        // Setup Tabs
        document.querySelectorAll('.explorer-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.explorer-tab').forEach(t => {
                    t.classList.remove('is-active');
                    t.setAttribute('aria-selected', 'false');
                });
                document.querySelectorAll('.explorer-pane').forEach(p => p.classList.remove('is-active'));
                tab.classList.add('is-active');
                tab.setAttribute('aria-selected', 'true');
                const pane = document.getElementById(`pane-${tab.dataset.pane}`);
                if (pane) pane.classList.add('is-active');
            });
        });

        // Support ?scale= URL query param (for cross-links from Árvore da Vida / Tarot!)
        const urlParams = new URLSearchParams(window.location.search);
        const initialScaleParam = urlParams.get('scale');

        try {
            const res = await fetch('/apis/777/all/index.json');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            state.data = await res.json();
            state.columns = Object.keys(state.data);

            // Build canonical scale names from Col II & Col III
            const colII = state.data['II'] || {};
            const colIII = state.data['III'] || {};
            KEY_SCALES.forEach(k => {
                const hebName = formatValue(colII[k]);
                const engName = formatValue(colIII[k]);
                state.scaleLabels[k] = {
                    heb: hebName || `Escala ${k}`,
                    eng: engName || ''
                };
            });

            // Count non-empty cells
            let cellCount = 0;
            state.columns.forEach(c => {
                const obj = state.data[c];
                Object.keys(obj).forEach(k => {
                    if (k !== 'columnName' && formatValue(obj[k]) !== '') cellCount++;
                });
            });

            if (metricTotalCols) metricTotalCols.textContent = String(state.columns.length);
            if (metricTotalCells) metricTotalCells.textContent = cellCount.toLocaleString('pt-BR');

            renderColumnsGrid('');
            initScaleMatrix(initialScaleParam);
            initPlayground();

            if (initialScaleParam && KEY_SCALES.includes(initialScaleParam)) {
                const matrixTab = document.querySelector('.explorer-tab[data-pane="matrix"]');
                if (matrixTab) matrixTab.click();
            }
        } catch (err) {
            console.error('Erro ao carregar API 777:', err);
            if (columnsGrid) {
                columnsGrid.innerHTML = '<p class="explorer-count">Falha ao carregar /apis/777/all/index.json.</p>';
            }
        }

        // Render Columns Grid + Search Hits
        function renderColumnsGrid(rawQuery) {
            if (!state.data) return;
            const q = normalizeStr(rawQuery.trim());

            const filteredCols = state.columns.filter(colKey => {
                if (!q) return true;
                const colObj = state.data[colKey];
                if (normalizeStr(colKey).includes(q)) return true;
                if (normalizeStr(colObj.columnName).includes(q)) return true;
                return KEY_SCALES.some(sk => normalizeStr(formatValue(colObj[sk])).includes(q));
            });

            columnsCountLabel.textContent = `${filteredCols.length} de ${state.columns.length} colunas exibidas`;

            columnsGrid.innerHTML = filteredCols.map(colKey => {
                const colObj = state.data[colKey];
                const nonEmpty = KEY_SCALES.filter(sk => {
                    const v = formatValue(colObj[sk]);
                    return v && v !== '...';
                });
                const sample = nonEmpty.slice(0, 3).map(sk => `${sk}: ${formatValue(colObj[sk])}`).join(' · ');
                return `
                    <article class="col-item-card" data-col="${escapeHtml(colKey)}" tabindex="0" role="button" aria-label="Inspecionar Coluna ${escapeHtml(colKey)}">
                        <div>
                            <div class="col-item-top">
                                <span class="col-roman">Col. ${escapeHtml(colKey)}</span>
                                <span class="col-count">${nonEmpty.length} entradas</span>
                            </div>
                            <h3 class="col-title">${highlightMatch(colObj.columnName || 'Sem título', rawQuery.trim())}</h3>
                        </div>
                        <div class="col-sample">${escapeHtml(sample || '—')}</div>
                    </article>
                `;
            }).join('');

            // Global cell hits when query >= 2 chars
            if (q.length >= 2) {
                const hits = [];
                for (const colKey of state.columns) {
                    const colObj = state.data[colKey];
                    for (const sk of KEY_SCALES) {
                        const valStr = formatValue(colObj[sk]);
                        if (valStr && normalizeStr(valStr).includes(q)) {
                            hits.push({
                                colKey,
                                colName: colObj.columnName || colKey,
                                scale: sk,
                                scaleName: state.scaleLabels[sk]?.heb || sk,
                                value: valStr
                            });
                            if (hits.length >= 40) break;
                        }
                    }
                    if (hits.length >= 40) break;
                }

                if (hits.length > 0) {
                    hitsPanel.classList.add('is-visible');
                    hitsTitle.textContent = `${hits.length}${hits.length >= 40 ? '+' : ''} correspondências diretas encontradas`;
                    hitsList.innerHTML = hits.map(h => `
                        <div class="hit-row" data-col="${escapeHtml(h.colKey)}" data-scale="${escapeHtml(h.scale)}">
                            <div class="hit-main">${highlightMatch(h.value, rawQuery.trim())}</div>
                            <div class="hit-meta">Col. ${escapeHtml(h.colKey)} · Escala ${escapeHtml(h.scale)} (${escapeHtml(h.scaleName)})</div>
                        </div>
                    `).join('');
                } else {
                    hitsPanel.classList.remove('is-visible');
                }
            } else {
                hitsPanel.classList.remove('is-visible');
            }
        }

        // Search listeners
        let debounceTimer = null;
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const val = searchInput.value;
                searchClear.classList.toggle('is-visible', val.length > 0);
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => renderColumnsGrid(val), 110);
            });
        }
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchClear.classList.remove('is-visible');
                renderColumnsGrid('');
                searchInput.focus();
            });
        }

        // Delegated clicks for opening Column Drawer
        columnsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.col-item-card');
            if (card) openColumnDrawer(card.dataset.col);
        });
        columnsGrid.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const card = e.target.closest('.col-item-card');
                if (card) {
                    e.preventDefault();
                    openColumnDrawer(card.dataset.col);
                }
            }
        });
        hitsList.addEventListener('click', (e) => {
            const row = e.target.closest('.hit-row');
            if (row) openColumnDrawer(row.dataset.col, row.dataset.scale);
        });

        // Matrix Tab Logic
        function initScaleMatrix(defaultScale) {
            const startScale = (defaultScale && KEY_SCALES.includes(defaultScale)) ? defaultScale : '6';
            scaleSelect.innerHTML = KEY_SCALES.map(sk => {
                const info = state.scaleLabels[sk];
                return `<option value="${escapeHtml(sk)}" ${sk === startScale ? 'selected' : ''}>Escala ${escapeHtml(sk)} — ${escapeHtml(info.heb)}${info.eng ? ' (' + escapeHtml(info.eng) + ')' : ''}</option>`;
            }).join('');

            const updateMatrix = () => {
                const sk = scaleSelect.value;
                const filterQ = normalizeStr(matrixFilterInput.value.trim());
                const info = state.scaleLabels[sk] || { heb: sk, eng: '' };

                scaleSummaryTitle.textContent = `Escala ${sk} — ${info.heb}`;

                const rows = [];
                state.columns.forEach(colKey => {
                    if (colKey === 'I') return;
                    const colObj = state.data[colKey];
                    const valStr = formatValue(colObj[sk]);
                    if (!valStr || valStr === '...') return;
                    const colName = colObj.columnName || colKey;
                    if (filterQ && !normalizeStr(colName).includes(filterQ) && !normalizeStr(valStr).includes(filterQ) && !normalizeStr(colKey).includes(filterQ)) {
                        return;
                    }
                    rows.push({ colKey, colName, valStr });
                });

                scaleSummarySub.textContent = `${rows.length} colunas com atribuições registradas${info.eng ? ' · ' + info.eng : ''}`;
                matrixTableBody.innerHTML = rows.map(r => `
                    <tr data-col="${escapeHtml(r.colKey)}" style="cursor:pointer;" title="Clique para abrir a Coluna ${escapeHtml(r.colKey)}">
                        <td class="matrix-col-id">Col. ${escapeHtml(r.colKey)}</td>
                        <td class="matrix-col-name">${escapeHtml(r.colName)}</td>
                        <td class="matrix-col-val">${highlightMatch(r.valStr, matrixFilterInput.value.trim())}</td>
                    </tr>
                `).join('');
            };

            scaleSelect.addEventListener('change', updateMatrix);
            matrixFilterInput.addEventListener('input', updateMatrix);
            matrixTableBody.addEventListener('click', (e) => {
                const tr = e.target.closest('tr[data-col]');
                if (tr) openColumnDrawer(tr.dataset.col, scaleSelect.value);
            });
            updateMatrix();
        }

        // Playground Tab Logic
        function initPlayground() {
            const options = [
                `<option value="/apis/777/all/index.json">Matriz Completa (/all/index.json)</option>`,
                ...state.columns
                    .filter(c => getColumnEndpoint(c) !== null)
                    .map(c => `<option value="${escapeHtml(getColumnEndpoint(c))}" ${c === 'II' ? 'selected' : ''}>Coluna ${escapeHtml(c)} — ${escapeHtml((state.data[c].columnName || '').slice(0, 42))}</option>`)
            ];
            pgSelect.innerHTML = options.join('');
            pgUrlCode.textContent = pgSelect.value;

            pgSelect.addEventListener('change', () => {
                pgUrlCode.textContent = pgSelect.value;
            });

            const executePlaygroundFetch = async () => {
                const url = pgSelect.value;
                pgStatus.textContent = 'Requisitando...';
                const t0 = performance.now();
                try {
                    const response = await fetch(url);
                    const rawText = await response.text();
                    const dt = (performance.now() - t0).toFixed(1);
                    const kb = (new Blob([rawText]).size / 1024).toFixed(2);
                    const parsed = JSON.parse(rawText);
                    const pretty = JSON.stringify(parsed, null, 2);
                    state.lastPlaygroundJson = pretty;

                    pgStatus.textContent = `${response.status} ${response.statusText || 'OK'}`;
                    pgLatency.textContent = `${dt} ms`;
                    pgSize.textContent = `${kb} KB`;
                    pgOutput.textContent = pretty.length > 24000
                        ? pretty.slice(0, 24000) + '\n\n// ... [truncado na pré-visualização — use "Copiar JSON" para o payload integral]'
                        : pretty;
                } catch (err) {
                    pgStatus.textContent = 'Erro';
                    pgOutput.textContent = `Falha na requisição: ${err.message}`;
                }
            };

            pgRunBtn.addEventListener('click', executePlaygroundFetch);
            pgCopyBtn.addEventListener('click', async () => {
                if (!state.lastPlaygroundJson) await executePlaygroundFetch();
                if (!state.lastPlaygroundJson) return;
                await navigator.clipboard.writeText(state.lastPlaygroundJson);
                pgCopyBtn.textContent = 'Copiado ✓';
                setTimeout(() => { pgCopyBtn.textContent = 'Copiar JSON'; }, 1500);
            });
        }

        // Column Inspector Drawer
        function openColumnDrawer(colKey, highlightScale = null) {
            if (!state.data || !state.data[colKey]) return;
            state.activeCol = colKey;
            state.drawerMode = 'table';
            const colObj = state.data[colKey];

            drawerRoman.textContent = `Coluna ${colKey}`;
            drawerTitle.textContent = colObj.columnName || `Coluna ${colKey}`;

            const endpoint = getColumnEndpoint(colKey);
            if (endpoint) {
                colRawEndpointLink.href = endpoint;
                colRawEndpointLink.style.display = 'inline-flex';
            } else {
                colRawEndpointLink.style.display = 'none';
            }

            renderDrawerContent(highlightScale);
            drawerBackdrop.classList.add('is-open');
        }

        function renderDrawerContent(highlightScale = null) {
            const colKey = state.activeCol;
            if (!colKey || !state.data[colKey]) return;
            const colObj = state.data[colKey];

            colViewTableBtn.classList.toggle('fo-btn-gold', state.drawerMode === 'table');
            colViewJsonBtn.classList.toggle('fo-btn-gold', state.drawerMode === 'json');

            if (state.drawerMode === 'json') {
                drawerBody.innerHTML = `<pre class="playground-output" style="max-height:none;">${escapeHtml(JSON.stringify(colObj, null, 2))}</pre>`;
                return;
            }

            const rowsHtml = KEY_SCALES.map(sk => {
                const val = formatValue(colObj[sk]);
                const refName = state.scaleLabels[sk]?.heb || '';
                const isHighlighted = highlightScale === sk;
                return `
                    <tr ${isHighlighted ? 'style="background:rgba(201,168,76,0.16);"' : ''}>
                        <td class="matrix-col-id">${escapeHtml(sk)}</td>
                        <td class="matrix-col-name">${escapeHtml(refName)}</td>
                        <td class="matrix-col-val">${escapeHtml(val || '—')}</td>
                    </tr>
                `;
            }).join('');

            drawerBody.innerHTML = `
                <div class="matrix-table-wrap">
                    <table class="matrix-table">
                        <thead>
                            <tr>
                                <th>Escala</th>
                                <th>Sephira / Letra</th>
                                <th>Atribuição</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </div>
            `;
        }

        colViewTableBtn.addEventListener('click', () => {
            state.drawerMode = 'table';
            renderDrawerContent();
        });
        colViewJsonBtn.addEventListener('click', () => {
            state.drawerMode = 'json';
            renderDrawerContent();
        });
        colCopyJsonBtn.addEventListener('click', async () => {
            if (!state.activeCol) return;
            const jsonStr = JSON.stringify(state.data[state.activeCol], null, 2);
            await navigator.clipboard.writeText(jsonStr);
            colCopyJsonBtn.textContent = 'Copiado ✓';
            setTimeout(() => { colCopyJsonBtn.textContent = 'Copiar JSON'; }, 1500);
        });

        const closeDrawer = () => drawerBackdrop.classList.remove('is-open');
        drawerClose.addEventListener('click', closeDrawer);
        drawerBackdrop.addEventListener('click', (e) => {
            if (e.target === drawerBackdrop) closeDrawer();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawerBackdrop.classList.contains('is-open')) {
                closeDrawer();
            }
        });
    });
})();
