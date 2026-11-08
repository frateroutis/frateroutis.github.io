/**
 * Ars Sigillorum — Laboratório Ritual e Geométrico de Sigilos (Frater Outis)
 * Motores:
 *   1. Rosa-Cruz Hermética (22 Pétalas: 3 Mães, 7 Duplas, 12 Simples)
 *   2. Kameas Planetários de Agrippa (Saturno 3×3 a Lua 9×9 + Aiq Beker)
 *   3. Monograma Axial Zos Kia (Austin Osman Spare)
 *   4. Mão Livre com Simetria Caleidoscópica (1×, 2×, 4×, 8×)
 * Recursos: Câmara de Gnose com Web Audio API, Incineração no Éter e Exportação SVG/PNG.
 */
(function () {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const GRIMOIRE_KEY = 'fo_sigil_grimoire_v1';

    // Mapping Latin A-Z to 22 Hebrew archetypes, Gematria, and Rose-Cross ring
    // Rings: 0 = 3 Mothers (Aleph, Mem, Shin), 1 = 7 Doubles, 2 = 12 Simples
    const LETTER_ARCANA = {
        A: { heb: 'א', gem: 1,   ring: 0, idx: 0,  total: 3  }, // Aleph
        B: { heb: 'ב', gem: 2,   ring: 1, idx: 0,  total: 7  }, // Beth
        C: { heb: 'כ', gem: 20,  ring: 1, idx: 3,  total: 7  }, // Kaph
        D: { heb: 'ד', gem: 4,   ring: 1, idx: 2,  total: 7  }, // Daleth
        E: { heb: 'ה', gem: 5,   ring: 2, idx: 0,  total: 12 }, // Heh
        F: { heb: 'ו', gem: 6,   ring: 2, idx: 1,  total: 12 }, // Vav
        G: { heb: 'ג', gem: 3,   ring: 1, idx: 1,  total: 7  }, // Gimel
        H: { heb: 'ח', gem: 8,   ring: 2, idx: 3,  total: 12 }, // Cheth
        I: { heb: 'י', gem: 10,  ring: 2, idx: 5,  total: 12 }, // Yod
        J: { heb: 'י', gem: 10,  ring: 2, idx: 5,  total: 12 }, // Yod
        K: { heb: 'כ', gem: 20,  ring: 1, idx: 3,  total: 7  }, // Kaph
        L: { heb: 'ל', gem: 30,  ring: 2, idx: 6,  total: 12 }, // Lamed
        M: { heb: 'מ', gem: 40,  ring: 0, idx: 1,  total: 3  }, // Mem
        N: { heb: 'נ', gem: 50,  ring: 2, idx: 7,  total: 12 }, // Nun
        O: { heb: 'ע', gem: 70,  ring: 2, idx: 9,  total: 12 }, // Ayin
        P: { heb: 'פ', gem: 80,  ring: 1, idx: 4,  total: 7  }, // Peh
        Q: { heb: 'ק', gem: 100, ring: 2, idx: 11, total: 12 }, // Qoph
        R: { heb: 'ר', gem: 200, ring: 1, idx: 5,  total: 7  }, // Resh
        S: { heb: 'ס', gem: 60,  ring: 2, idx: 8,  total: 12 }, // Samekh
        T: { heb: 'ט', gem: 9,   ring: 2, idx: 4,  total: 12 }, // Teth
        U: { heb: 'ו', gem: 6,   ring: 2, idx: 1,  total: 12 }, // Vav
        V: { heb: 'ו', gem: 6,   ring: 2, idx: 1,  total: 12 }, // Vav
        W: { heb: 'ש', gem: 300, ring: 0, idx: 2,  total: 3  }, // Shin
        X: { heb: 'צ', gem: 90,  ring: 2, idx: 10, total: 12 }, // Tzaddi
        Y: { heb: 'י', gem: 10,  ring: 2, idx: 5,  total: 12 }, // Yod
        Z: { heb: 'ז', gem: 7,   ring: 2, idx: 2,  total: 12 }  // Zain
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

    // Authentic Magic Square generator (Agrippa De Occulta Philosophia)
    function buildMagicSquare(n) {
        if (n === 3) {
            // Classical Agrippa Saturn (Lo Shu orientation)
            return [
                [4, 9, 2],
                [3, 5, 7],
                [8, 1, 6]
            ];
        }
        if (n === 4) {
            // Classical Agrippa Jupiter (sum 34)
            return [
                [4,  14, 15, 1],
                [9,  7,  6,  12],
                [5,  11, 10, 8],
                [16, 2,  3,  13]
            ];
        }
        if (n === 6) {
            // Classical Agrippa Sun (sum 111)
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
            // Doubly-even Mercury (sum 260)
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
        // Odd orders (5 Mars = 65, 7 Venus = 175, 9 Moon = 369) via Siamese method
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

    // Catmull-Rom spline to SVG path with adjustable tension (0 = straight lines, 1 = fluid curves)
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

        const kameaSub = document.getElementById('kameaSubControls');
        const monogramSub = document.getElementById('monogramSubControls');
        const kameaSelect = document.getElementById('kameaPlanetSelect');
        const symmetrySelect = document.getElementById('symmetrySelect');
        const showMatrixGuide = document.getElementById('showMatrixGuide');
        const frameSelect = document.getElementById('frameSelect');
        const inkSelect = document.getElementById('inkSelect');
        const curveRange = document.getElementById('curveRange');
        const strokeRange = document.getElementById('strokeRange');
        const altarMethodLabel = document.getElementById('altarMethodLabel');

        if (!svg || !intentInput) return;

        const state = {
            engine: 'rosecross',
            planet: 'sun',
            monogramSeed: 1,
            freehandStrokes: [], // Array of strokes; each stroke is { symmetry, points: [{x,y}...] }
            activeStroke: null,
            veiled: false
        };

        // Distill user's statement of will
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

            seedDisplay.textContent = letters.length ? letters.join(' ') : '∅ (Apenas traço manual)';
            hebDisplay.textContent = hebArr.length ? hebArr.join(' ') : '—';
            gemDisplay.textContent = gemSum > 0 ? `${gemSum} (Raiz ${root})` : '0';

            return { letters, hebArr, gemSum, root };
        }

        // Rose-Cross Petal Coordinate
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

        // Render Sigil SVG
        function renderSigil() {
            const { letters, hebArr } = distillIntent();
            const ink = inkSelect.value;
            const strokeW = Number(strokeRange.value) / 10;
            const tension = Number(curveRange.value) / 100;
            const frame = frameSelect.value;
            const showGuide = showMatrixGuide.checked;

            while (svg.firstChild) svg.removeChild(svg.firstChild);

            // Glow filter definition
            const defs = svgEl('defs');
            const filter = svgEl('filter', { id: 'sigilGlow', x: '-25%', y: '-25%', width: '150%', height: '150%' });
            filter.appendChild(svgEl('feGaussianBlur', { stdDeviation: '4.5', result: 'blur' }));
            const merge = svgEl('feMerge');
            merge.appendChild(svgEl('feMergeNode', { in: 'blur' }));
            merge.appendChild(svgEl('feMergeNode', { in: 'SourceGraphic' }));
            filter.appendChild(merge);
            defs.appendChild(filter);

            // Circular text path for double-inscribed ring
            const orbitPath = svgEl('path', {
                id: 'sigilOrbitTextPath',
                d: 'M 300, 56 a 244,244 0 1,1 -0.1,0'
            });
            defs.appendChild(orbitPath);
            svg.appendChild(defs);

            // 1. Sacred Containment Frame
            const frameGroup = svgEl('g', { opacity: '0.88' });
            if (frame === 'single' || frame === 'double-inscribed') {
                frameGroup.appendChild(svgEl('circle', {
                    cx: 300, cy: 300, r: 266,
                    fill: 'none', stroke: ink, 'stroke-width': 1.2, 'stroke-opacity': 0.55
                }));
                if (frame === 'double-inscribed') {
                    frameGroup.appendChild(svgEl('circle', {
                        cx: 300, cy: 300, r: 234,
                        fill: 'none', stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.35
                    }));
                    // Cardinal sigil ticks
                    [0, 90, 180, 270].forEach(deg => {
                        const rad = (deg * Math.PI) / 180;
                        frameGroup.appendChild(svgEl('line', {
                            x1: 300 + Math.cos(rad) * 234, y1: 300 + Math.sin(rad) * 234,
                            x2: 300 + Math.cos(rad) * 266, y2: 300 + Math.sin(rad) * 266,
                            stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.35
                        }));
                    });
                    if (letters.length > 0) {
                        const inscription = Array(4).fill(`${letters.join(' · ')} ∴ ${hebArr.join(' ')} ∴ `).join('');
                        const orbitGroup = svgEl('g', { class: 'orbital-inscription' });
                        const textEl = svgEl('text', {
                            fill: ink,
                            'fill-opacity': '0.45',
                            'font-size': '10.5',
                            'font-family': 'JetBrains Mono, monospace',
                            'letter-spacing': '4.2'
                        });
                        const tp = svgEl('textPath', { href: '#sigilOrbitTextPath', startOffset: '0%' });
                        tp.textContent = inscription;
                        textEl.appendChild(tp);
                        orbitGroup.appendChild(textEl);
                        frameGroup.appendChild(orbitGroup);
                    }
                }
            } else if (frame === 'octagram') {
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 256, fill: 'none', stroke: ink, 'stroke-width': 1, 'stroke-opacity': 0.4 }));
                const sq1 = [0, 90, 180, 270].map(a => `${300 + 248 * Math.cos(a * Math.PI / 180)},${300 + 248 * Math.sin(a * Math.PI / 180)}`).join(' ');
                const sq2 = [45, 135, 225, 315].map(a => `${300 + 248 * Math.cos(a * Math.PI / 180)},${300 + 248 * Math.sin(a * Math.PI / 180)}`).join(' ');
                frameGroup.appendChild(svgEl('polygon', { points: sq1, fill: 'none', stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.35 }));
                frameGroup.appendChild(svgEl('polygon', { points: sq2, fill: 'none', stroke: ink, 'stroke-width': 0.9, 'stroke-opacity': 0.35 }));
            } else if (frame === 'hexagram') {
                frameGroup.appendChild(svgEl('circle', { cx: 300, cy: 300, r: 256, fill: 'none', stroke: ink, 'stroke-width': 1, 'stroke-opacity': 0.4 }));
                const t1 = [-90, 30, 150].map(a => `${300 + 246 * Math.cos(a * Math.PI / 180)},${300 + 246 * Math.sin(a * Math.PI / 180)}`).join(' ');
                const t2 = [90, 210, 330].map(a => `${300 + 246 * Math.cos(a * Math.PI / 180)},${300 + 246 * Math.sin(a * Math.PI / 180)}`).join(' ');
                frameGroup.appendChild(svgEl('polygon', { points: t1, fill: 'none', stroke: ink, 'stroke-width': 0.95, 'stroke-opacity': 0.38 }));
                frameGroup.appendChild(svgEl('polygon', { points: t2, fill: 'none', stroke: ink, 'stroke-width': 0.95, 'stroke-opacity': 0.38 }));
            }
            svg.appendChild(frameGroup);

            // 2. Underlying Occult Matrix Guide (optional)
            const guideGroup = svgEl('g', { 'pointer-events': 'none' });
            if (showGuide) {
                if (state.engine === 'rosecross') {
                    [56, 114, 178].forEach(r => {
                        guideGroup.appendChild(svgEl('circle', {
                            cx: 300, cy: 300, r,
                            fill: 'none', stroke: ink, 'stroke-opacity': 0.11, 'stroke-dasharray': '2 5'
                        }));
                    });
                    // Plot all 22 unique Hebrew positions faintly
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
                            fill: ink, 'fill-opacity': 0.18,
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
                                fill: 'none', stroke: ink, 'stroke-opacity': 0.09, 'stroke-width': 0.7
                            }));
                            const numTxt = svgEl('text', {
                                x: x + cell / 2, y: y + cell / 2,
                                fill: ink, 'fill-opacity': 0.2,
                                'font-family': 'JetBrains Mono, monospace',
                                'font-size': n >= 8 ? '9.5' : '11',
                                'text-anchor': 'middle', 'dominant-baseline': 'central'
                            });
                            numTxt.textContent = String(sq[r][c]);
                            guideGroup.appendChild(numTxt);
                        }
                    }
                } else if (state.engine === 'monogram' || state.engine === 'freehand') {
                    guideGroup.appendChild(svgEl('line', { x1: 300, y1: 110, x2: 300, y2: 490, stroke: ink, 'stroke-opacity': 0.08, 'stroke-dasharray': '3 6' }));
                    guideGroup.appendChild(svgEl('line', { x1: 110, y1: 300, x2: 490, y2: 300, stroke: ink, 'stroke-opacity': 0.08, 'stroke-dasharray': '3 6' }));
                }
            }
            svg.appendChild(guideGroup);

            // 3. Core Sigil Glyph Group
            const sigilGroup = svgEl('g', { filter: 'url(#sigilGlow)' });

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
                    // Aiq Beker + positional spread onto 1..N^2
                    const targetNum = ((gem + i * 3 - 1) % maxVal) + 1;
                    return coordByNumber[targetNum] || { x: 300, y: 300 };
                });
                renderTracedSigil(sigilGroup, pts, ink, strokeW, tension);
            } else if (letters.length > 0 && state.engine === 'monogram') {
                renderMonogramSigil(sigilGroup, letters, ink, strokeW, state.monogramSeed);
            }

            // 4. Freehand Symmetrical Strokes (usable in any mode!)
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
                    sigilGroup.appendChild(svgEl('path', {
                        d: pointsToPath(rotated, 0.45),
                        fill: 'none',
                        stroke: ink,
                        'stroke-width': strokeW,
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round'
                    }));
                }
            });

            svg.appendChild(sigilGroup);
            updateMethodStatusLabel();
        }

        // Render classic traced vector sigil with Golden Dawn ○ origin, node accents, and ⊥ bar terminus
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

            // Origin ring (Anima / Beginning)
            group.appendChild(svgEl('circle', {
                cx: pts[0].x, cy: pts[0].y, r: strokeW * 2.6,
                fill: '#050508', stroke: ink, 'stroke-width': strokeW * 0.85
            }));

            // Subtle intermediate vertex diamonds on sharp turns
            for (let i = 1; i < pts.length - 1; i++) {
                if (i % 3 === 0) {
                    group.appendChild(svgEl('circle', {
                        cx: pts[i].x, cy: pts[i].y, r: strokeW * 0.9,
                        fill: ink
                    }));
                }
            }

            // Perpendicular terminal bar (Fixation / Seal)
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

        // Render Monogrammatic Zos Kia Sigil along a central spine
        function renderMonogramSigil(group, letters, ink, strokeW, seed) {
            const cx = 300;
            const topY = 148;
            const botY = 452;
            const span = botY - topY;

            // Central Axis Mundi Spine
            group.appendChild(svgEl('line', {
                x1: cx, y1: topY, x2: cx, y2: botY,
                stroke: ink, 'stroke-width': strokeW, 'stroke-linecap': 'round'
            }));

            // Terminal trident / arrow / ring at top & bottom based on seed
            group.appendChild(svgEl('circle', {
                cx, cy: topY - 12, r: 11,
                fill: 'none', stroke: ink, 'stroke-width': strokeW * 0.9
            }));
            group.appendChild(svgEl('line', {
                x1: cx - 18, y1: botY, x2: cx + 18, y2: botY,
                stroke: ink, 'stroke-width': strokeW, 'stroke-linecap': 'round'
            }));

            // Deterministically weave geometric limbs per distilled letter
            letters.forEach((ch, idx) => {
                const code = ch.charCodeAt(0) - 65;
                const hash = (code * 31 + idx * 17 + seed * 53) % 97;
                const t = letters.length === 1 ? 0.5 : (idx + 0.5) / letters.length;
                const y = topY + 24 + t * (span - 48);
                const reach = 32 + (hash % 58);
                const motif = hash % 5;

                if (motif === 0) {
                    // Symmetrical crossbar with terminal ticks
                    group.appendChild(svgEl('line', { x1: cx - reach, y1: y, x2: cx + reach, y2: y, stroke: ink, 'stroke-width': strokeW * 0.9, 'stroke-linecap': 'round' }));
                    group.appendChild(svgEl('line', { x1: cx - reach, y1: y - 9, x2: cx - reach, y2: y + 9, stroke: ink, 'stroke-width': strokeW * 0.75 }));
                    group.appendChild(svgEl('line', { x1: cx + reach, y1: y - 9, x2: cx + reach, y2: y + 9, stroke: ink, 'stroke-width': strokeW * 0.75 }));
                } else if (motif === 1) {
                    // Upward or downward lunar crescent
                    const dir = (hash % 2 === 0) ? -1 : 1;
                    group.appendChild(svgEl('path', {
                        d: `M ${cx - reach} ${y + dir * 24} Q ${cx} ${y - dir * 26} ${cx + reach} ${y + dir * 24}`,
                        fill: 'none', stroke: ink, 'stroke-width': strokeW * 0.9, 'stroke-linecap': 'round'
                    }));
                } else if (motif === 2) {
                    // Diamond / Vesica eye centered on spine
                    const rw = reach * 0.75;
                    const rh = 20 + (hash % 16);
                    group.appendChild(svgEl('polygon', {
                        points: `${cx},${y - rh} ${cx + rw},${y} ${cx},${y + rh} ${cx - rw},${y}`,
                        fill: 'none', stroke: ink, 'stroke-width': strokeW * 0.85, 'stroke-linejoin': 'round'
                    }));
                } else if (motif === 3) {
                    // Diagonal Runic wings + terminal spheres
                    const dy = (hash % 2 === 0 ? -1 : 1) * 28;
                    group.appendChild(svgEl('line', { x1: cx, y1: y, x2: cx - reach, y2: y + dy, stroke: ink, 'stroke-width': strokeW * 0.9, 'stroke-linecap': 'round' }));
                    group.appendChild(svgEl('line', { x1: cx, y1: y, x2: cx + reach, y2: y - dy, stroke: ink, 'stroke-width': strokeW * 0.9, 'stroke-linecap': 'round' }));
                    group.appendChild(svgEl('circle', { cx: cx - reach, cy: y + dy, r: strokeW * 1.4, fill: ink }));
                    group.appendChild(svgEl('circle', { cx: cx + reach, cy: y - dy, r: strokeW * 1.4, fill: ink }));
                } else {
                    // Solar ring / Vesica arc
                    group.appendChild(svgEl('circle', {
                        cx, cy: y, r: 16 + (hash % 24),
                        fill: 'none', stroke: ink, 'stroke-width': strokeW * 0.82
                    }));
                }
            });
        }

        function updateMethodStatusLabel() {
            const names = {
                rosecross: 'Rosa-Cruz Hermética · 22 Pétalas',
                kamea: PLANET_NAMES[state.planet].label,
                monogram: `Monograma Zos Kia · Semente #${state.monogramSeed}`,
                freehand: `Altar Caleidoscópico · Simetria ${symmetrySelect.value}×`
            };
            altarMethodLabel.textContent = names[state.engine] || '';
        }

        // Pointer Drawing on SVG Altar
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

        // Controls Wiring
        document.querySelectorAll('.engine-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.engine-btn').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                state.engine = btn.dataset.engine;
                kameaSub.style.display = state.engine === 'kamea' ? 'block' : 'none';
                monogramSub.style.display = state.engine === 'monogram' ? 'block' : 'none';
                renderSigil();
            });
        });

        [intentInput, stripVowelsToggle, dedupeToggle, showMatrixGuide, frameSelect, inkSelect, curveRange, strokeRange].forEach(el => {
            el?.addEventListener('input', renderSigil);
            el?.addEventListener('change', renderSigil);
        });

        kameaSelect?.addEventListener('change', () => {
            state.planet = kameaSelect.value;
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

        // Export SVG & High-Res PNG
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

        // Silent Grimoire (saves pure SVG glyph WITHOUT storing conscious sentence!)
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
                    ${it.svg}
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
                    a.download = `selo-grimorio-${el.dataset.idx + 1}.svg`;
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

        // Ambient Altar Particle System + Ember Incineration
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

            // Ambient dust
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

            // Incineration embers
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

        // Burn / Banish by Forgetting
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
            osc1.type = 'sine';     osc1.frequency.value = 110;    // A2 fundamental
            osc2.type = 'sine';     osc2.frequency.value = 114.5;  // 4.5Hz Theta beat
            osc3.type = 'triangle'; osc3.frequency.value = 165;    // Perfect fifth (E3)

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
            mount.innerHTML = '';
            const cleanClone = svg.cloneNode(true);
            mount.appendChild(cleanClone);
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
        renderSigil();
        renderGrimoire();
    });
})();
