/**
 * Poema Digital Combinatório — Frater Outis
 * Ciclo infinito de 7 segundos permutando o léxico de 16 substantivos
 * com concordância de artigo (o/a) e campo magnético sutil ao cursor.
 */
(function () {
    'use strict';

    const CYCLE_MS = 7000;
    const FADEOUT_MS = 920;

    // Léxico exato de 16 palavras e seus respectivos artigos definidos
    const LEXICON = [
        { word: 'alento', article: 'o' },
        { word: 'amor',   article: 'o' },
        { word: 'cor',    article: 'a' },
        { word: 'dia',    article: 'o' },
        { word: 'fama',   article: 'a' },
        { word: 'fome',   article: 'a' },
        { word: 'força',  article: 'a' },
        { word: 'guerra', article: 'a' },
        { word: 'jogo',   article: 'o' },
        { word: 'pão',    article: 'o' },
        { word: 'paz',    article: 'a' },
        { word: 'senso',  article: 'o' },
        { word: 'sono',   article: 'o' },
        { word: 'tempo',  article: 'o' },
        { word: 'vez',    article: 'a' },
        { word: 'vida',   article: 'a' }
    ];

    const ARTICLE_MAP = Object.fromEntries(LEXICON.map(item => [item.word, item.article]));
    const ALL_WORDS = LEXICON.map(item => item.word);

    document.addEventListener('DOMContentLoaded', () => {
        const sanctum = document.getElementById('poemSanctum');
        const poemRoot = document.getElementById('digitalPoem');
        const cadenceFill = document.getElementById('poemCadenceFill');
        const cadenceSigil = document.getElementById('poemCadenceSigil');

        if (!sanctum || !poemRoot) return;

        const lineEls = Array.from(poemRoot.querySelectorAll('.poem-line'));
        const slots = lineEls.map((lineEl, index) => {
            const wordEl = lineEl.querySelector('.poem-word');
            const articleEl = lineEl.querySelector('.poem-article');
            const verbEl = lineEl.querySelector('.poem-verb');
            const stanzaEl = lineEl.closest('.poem-stanza');
            return {
                index,
                stanzaIndex: Math.floor(index / 2),
                lineEl,
                stanzaEl,
                verbEl,
                articleEl,
                wordEl,
                word: wordEl.dataset.word || wordEl.textContent.trim(),
                busy: false,
                hovered: false
            };
        });

        // Helper: twin slot in the same 2-line stanza
        function partnerSlot(slotIndex) {
            return slots[slotIndex % 2 === 0 ? slotIndex + 1 : slotIndex - 1];
        }

        // Count current occurrences of each word across all 16 slots
        function getWordCounts() {
            const counts = {};
            ALL_WORDS.forEach(w => { counts[w] = 0; });
            slots.forEach(s => { counts[s.word] = (counts[s.word] || 0) + 1; });
            return counts;
        }

        // Smoothly transmute a single slot to a new word
        function transmuteSlot(slot, nextWord) {
            if (!slot || slot.busy || !nextWord || slot.word === nextWord) return;
            const currentArticle = ARTICLE_MAP[slot.word] || slot.articleEl.textContent.trim();
            const nextArticle = ARTICLE_MAP[nextWord] || 'a';
            const articleChanges = currentArticle !== nextArticle;

            slot.busy = true;
            slot.wordEl.dataset.ghost = slot.word;
            slot.wordEl.classList.add('is-fading-out');
            if (articleChanges) {
                slot.articleEl.classList.add('is-fading');
            }

            setTimeout(() => {
                slot.word = nextWord;
                slot.wordEl.textContent = nextWord;
                slot.wordEl.dataset.word = nextWord;
                slot.wordEl.dataset.ghost = nextWord;
                if (articleChanges) {
                    slot.articleEl.textContent = nextArticle;
                }

                // Prepare materializing state from opposite vertical drift
                slot.wordEl.classList.remove('is-fading-out');
                slot.wordEl.classList.add('is-materializing');

                // Force reflow so transition engages cleanly
                void slot.wordEl.offsetWidth;

                requestAnimationFrame(() => {
                    slot.wordEl.classList.remove('is-materializing');
                    slot.wordEl.classList.add('just-transmuted');
                    if (articleChanges) {
                        slot.articleEl.classList.remove('is-fading');
                    }

                    setTimeout(() => {
                        slot.wordEl.classList.remove('just-transmuted');
                        slot.busy = false;
                    }, 980);
                });
            }, FADEOUT_MS);
        }

        // Execute one algorithmic permutation step (every 7 seconds)
        function runPermutationCycle() {
            const eligible = slots.filter(s => !s.busy && !s.hovered);
            if (eligible.length < 2) return;

            // Pulse subtle cadence sigil
            if (cadenceSigil) {
                cadenceSigil.classList.add('is-pulsing');
                setTimeout(() => cadenceSigil.classList.remove('is-pulsing'), 1100);
            }

            const counts = getWordCounts();
            const dormantWords = ALL_WORDS.filter(w => counts[w] === 0);

            // Shuffle helper
            const shuffle = (arr) => {
                const copy = arr.slice();
                for (let i = copy.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [copy[i], copy[j]] = [copy[j], copy[i]];
                }
                return copy;
            };

            // Choose 3 or 4 slots from distinct stanzas so the whole poem breathes quietly
            const numChanges = Math.random() < 0.55 ? 3 : 4;
            const byStanza = shuffle(eligible);
            const chosen = [];
            const usedStanzas = new Set();

            for (const candidate of byStanza) {
                if (chosen.length >= numChanges) break;
                if (!usedStanzas.has(candidate.stanzaIndex)) {
                    // Prefer replacing duplicated words first when dormant words exist
                    if (dormantWords.length > 0 && counts[candidate.word] > 1) {
                        chosen.unshift(candidate);
                    } else {
                        chosen.push(candidate);
                    }
                    usedStanzas.add(candidate.stanzaIndex);
                }
            }

            if (chosen.length < 2) return;

            // Build pool of replacement words: include dormant words + words currently in chosen slots
            const currentWords = chosen.map(s => s.word);
            const candidatePool = shuffle([...dormantWords, ...currentWords]);

            // Assign a valid replacement for each chosen slot (no self-match, no stanza-twin collision)
            const assignments = [];
            const usedTargets = new Set();

            for (let i = 0; i < chosen.length; i++) {
                const slot = chosen[i];
                const twinWord = partnerSlot(slot.index).word;

                let pick = candidatePool.find(w =>
                    !usedTargets.has(w) &&
                    w !== slot.word &&
                    w !== twinWord
                );

                // Fallback to any word from full 16-word lexicon that avoids collision
                if (!pick) {
                    const fallbackLexicon = shuffle(ALL_WORDS);
                    pick = fallbackLexicon.find(w =>
                        !usedTargets.has(w) &&
                        w !== slot.word &&
                        w !== twinWord
                    ) || fallbackLexicon.find(w => w !== slot.word);
                }

                if (pick) {
                    usedTargets.add(pick);
                    assignments.push({ slot, nextWord: pick });
                }
            }

            // Stagger transitions softly like ink dissolving in water
            assignments.forEach(({ slot, nextWord }, idx) => {
                setTimeout(() => {
                    if (!slot.hovered) {
                        transmuteSlot(slot, nextWord);
                    }
                }, idx * 210);
            });
        }

        // Interactive hover, focus & click on individual words
        slots.forEach(slot => {
            slot.wordEl.addEventListener('mouseenter', () => {
                slot.hovered = true;
                slot.stanzaEl.classList.add('is-resonating');
            });

            slot.wordEl.addEventListener('mouseleave', () => {
                slot.hovered = false;
                slot.stanzaEl.classList.remove('is-resonating');
                slot.wordEl.style.setProperty('--ghost-opacity', '0');
            });

            slot.wordEl.addEventListener('focus', () => {
                slot.hovered = true;
                slot.stanzaEl.classList.add('is-resonating');
            });

            slot.wordEl.addEventListener('blur', () => {
                slot.hovered = false;
                slot.stanzaEl.classList.remove('is-resonating');
            });

            // Clicking or pressing Enter/Space gently invokes an immediate transmutation
            const triggerSingleTransmutation = () => {
                if (slot.busy) return;
                const counts = getWordCounts();
                const twinWord = partnerSlot(slot.index).word;
                const dormant = ALL_WORDS.filter(w => counts[w] === 0 && w !== slot.word && w !== twinWord);
                const pool = dormant.length > 0
                    ? dormant
                    : ALL_WORDS.filter(w => w !== slot.word && w !== twinWord);
                const nextWord = pool[Math.floor(Math.random() * pool.length)];
                transmuteSlot(slot, nextWord);
            };

            slot.wordEl.addEventListener('click', triggerSingleTransmutation);
            slot.wordEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerSingleTransmutation();
                }
            });
        });

        // Cursor field: magnetic whisper & spectral double-exposure
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let pointerX = -9999;
        let pointerY = -9999;
        let pointerActive = false;
        let rafPending = false;

        function updateCursorField() {
            rafPending = false;
            if (!pointerActive || prefersReducedMotion) return;

            const sanctumRect = sanctum.getBoundingClientRect();
            sanctum.style.setProperty('--cursor-x', `${pointerX - sanctumRect.left}px`);
            sanctum.style.setProperty('--cursor-y', `${pointerY - sanctumRect.top}px`);

            const radius = 145;
            for (let i = 0; i < slots.length; i++) {
                const slot = slots[i];
                if (slot.busy) continue;
                const rect = slot.wordEl.getBoundingClientRect();
                const cx = rect.left + rect.width * 0.5;
                const cy = rect.top + rect.height * 0.5;
                const dx = pointerX - cx;
                const dy = pointerY - cy;
                const dist = Math.hypot(dx, dy);

                if (dist < radius) {
                    const strength = 1 - dist / radius;
                    const pullX = (dx / radius) * 3.2 * strength;
                    const pullY = (dy / radius) * 2.2 * strength;
                    const ghostX = -(dx / radius) * 5.5 * strength;
                    const ghostY = -(dy / radius) * 3.5 * strength;

                    slot.wordEl.style.setProperty('--pull-x', `${pullX.toFixed(2)}px`);
                    slot.wordEl.style.setProperty('--pull-y', `${pullY.toFixed(2)}px`);
                    slot.wordEl.style.setProperty('--ghost-opacity', (strength * 0.85).toFixed(2));
                    slot.wordEl.style.setProperty('--ghost-x', `${ghostX.toFixed(2)}px`);
                    slot.wordEl.style.setProperty('--ghost-y', `${ghostY.toFixed(2)}px`);
                    slot.verbEl.style.setProperty('--pull-x', `${(pullX * 0.35).toFixed(2)}px`);
                    slot.verbEl.style.setProperty('--pull-y', `${(pullY * 0.35).toFixed(2)}px`);
                } else {
                    slot.wordEl.style.setProperty('--pull-x', '0px');
                    slot.wordEl.style.setProperty('--pull-y', '0px');
                    slot.wordEl.style.setProperty('--ghost-opacity', '0');
                    slot.verbEl.style.setProperty('--pull-x', '0px');
                    slot.verbEl.style.setProperty('--pull-y', '0px');
                }
            }
        }

        sanctum.addEventListener('pointermove', (e) => {
            pointerX = e.clientX;
            pointerY = e.clientY;
            if (!pointerActive) {
                pointerActive = true;
                sanctum.classList.add('has-cursor');
            }
            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(updateCursorField);
            }
        });

        sanctum.addEventListener('pointerleave', () => {
            pointerActive = false;
            sanctum.classList.remove('has-cursor');
            slots.forEach(slot => {
                slot.wordEl.style.setProperty('--pull-x', '0px');
                slot.wordEl.style.setProperty('--pull-y', '0px');
                slot.wordEl.style.setProperty('--ghost-opacity', '0');
                slot.verbEl.style.setProperty('--pull-x', '0px');
                slot.verbEl.style.setProperty('--pull-y', '0px');
            });
        });

        // Precision 7-second clockwork loop (handles tab visibility smoothly)
        let cycleStart = performance.now();

        function tick(now) {
            const elapsed = now - cycleStart;
            const progress = Math.min(elapsed / CYCLE_MS, 1);

            if (cadenceFill) {
                cadenceFill.style.transform = `scaleX(${progress.toFixed(3)})`;
            }

            if (elapsed >= CYCLE_MS) {
                cycleStart = now;
                if (!document.hidden) {
                    runPermutationCycle();
                }
            }
            requestAnimationFrame(tick);
        }

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                cycleStart = performance.now();
            }
        });

        requestAnimationFrame(tick);
    });
})();
