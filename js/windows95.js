// Froutis 95 Music OS Interface
// Data is loaded from /musica/desktop-data.json

let desktopData = null;
let folderStructure = {};
let currentFolder = null;
let currentPath = [];

// Window Manager state
const WINDOW_IDS = [
    'folderWindow',
    'minesweeperWindow',
    'bpmWindow',
    'drumToyWindow',
    'promoPopupWindow',
    'exitPopupWindow'
];
let topZIndex = 1005;
let activeWindowId = null;
let lastIconDragEndAt = 0;

// Boot timers
let bootTimers = [];
let bootCompleted = false;
let promoAutoShownThisBoot = false;
let promoCountdownInterval = null;
let promoCountdownSec = 59;
let promoVisitorCount = 999999;

// Load desktop data from JSON
async function loadDesktopData() {
    try {
        const response = await fetch('/musica/desktop-data.json');
        desktopData = await response.json();

        if (desktopData && Array.isArray(desktopData.folders)) {
            desktopData.folders.forEach(folder => {
                folderStructure[folder.id] = {
                    name: folder.name,
                    icon: folder.icon,
                    description: folder.description,
                    items: (folder.files || []).map(file => ({
                        name: file.name,
                        url: file.link,
                        icon: file.icon
                    }))
                };
            });
        }
    } catch (error) {
        console.error('Failed to load desktop data:', error);
    }
}

// Initialize in browser only (guards headless Node unit checks)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        loadDesktopData().then(() => {
            initializeTransition();
            loadIconPositions();
            initializeWindowManager();
            initializeEventListeners();
            initializeMinesweeperEventsOnce();
            initializeBpmTapper();
            initializeDrumToy();
            initializePopups();
            preloadDrumSampleBytes();
            updateClock();
            setInterval(updateClock, 1000);
        });
    });
}

// ========== AUTHENTIC OS BOOT SEQUENCE ==========

function clearBootTimers() {
    bootTimers.forEach(id => clearTimeout(id));
    bootTimers = [];
}

function finishBootSequence(openPromoImmediately = false) {
    if (bootCompleted) return;
    bootCompleted = true;
    clearBootTimers();

    const overlay = document.getElementById('transitionOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }

    // Show promo popup gracefully after arriving on desktop (once per boot)
    const promoDelay = openPromoImmediately ? 220 : 800;
    const t = setTimeout(() => {
        const promoEl = document.getElementById('promoPopupWindow');
        if (!promoAutoShownThisBoot && promoEl && promoEl.classList.contains('hidden')) {
            promoAutoShownThisBoot = true;
            launchPromoPopup();
        }
    }, promoDelay);
    bootTimers.push(t);
}

function initializeTransition() {
    const overlay = document.getElementById('transitionOverlay');
    const stagePost = document.getElementById('bootStagePost');
    const stageWin95 = document.getElementById('bootStageWin95');
    const memCounter = document.getElementById('bootMemCounter');
    const driverStatus = document.getElementById('bootDriverStatus');
    const skipBtn = document.getElementById('skipBootBtn');

    if (!overlay || !stagePost || !stageWin95) return;

    bootCompleted = false;
    promoAutoShownThisBoot = false;
    clearBootTimers();

    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    stagePost.classList.remove('hidden');
    stageWin95.classList.add('hidden');
    if (memCounter) memCounter.textContent = '00640K';
    if (driverStatus) driverStatus.textContent = 'Carregando interface gráfica...';

    // Reset delayed POST lines
    document.querySelectorAll('.post-delayed').forEach(line => {
        line.classList.remove('visible');
    });

    // Memory count steps
    const memSteps = [
        [60, '16384K'],
        [130, '32768K'],
        [200, '49152K'],
        [280, '65536K']
    ];
    memSteps.forEach(([ms, label]) => {
        bootTimers.push(setTimeout(() => {
            if (memCounter) memCounter.textContent = label;
        }, ms));
    });

    // Staged BIOS output lines
    document.querySelectorAll('.post-delayed').forEach(line => {
        const delay = parseInt(line.dataset.delay || '200', 10);
        bootTimers.push(setTimeout(() => {
            line.classList.add('visible');
        }, delay));
    });

    // Switch to classic Win95 Splash
    bootTimers.push(setTimeout(() => {
        stagePost.classList.add('hidden');
        stageWin95.classList.remove('hidden');
    }, 880));

    // Splash driver status rotation
    const statusMessages = [
        [980, 'Carregando DRUMTOY.DRV (Canal 808)...'],
        [1420, 'Calibrando BPMTAP.VXD em AudioClock...'],
        [1850, 'Preparando área de trabalho Froutis 95...']
    ];
    statusMessages.forEach(([ms, msg]) => {
        bootTimers.push(setTimeout(() => {
            if (driverStatus) driverStatus.textContent = msg;
        }, ms));
    });

    // Complete boot
    bootTimers.push(setTimeout(() => {
        finishBootSequence(false);
    }, 2380));

    if (skipBtn && !skipBtn.dataset.bound) {
        skipBtn.dataset.bound = '1';
        skipBtn.addEventListener('click', () => finishBootSequence(true));
    }
}

function restartBootSequence() {
    closeStartMenu();
    closePromoPopup();
    closeExitPopup();
    initializeTransition();
}

// ========== CLOCK ==========

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

// ========== MULTI-WINDOW MANAGER & TASKBAR ==========

function initializeWindowManager() {
    WINDOW_IDS.forEach(winId => {
        const winEl = document.getElementById(winId);
        if (!winEl) return;

        // Bring to front on interaction
        winEl.addEventListener('pointerdown', () => focusWindow(winId));

        // Draggable titlebar
        const titlebar = winEl.querySelector('.window-titlebar');
        if (titlebar) {
            setupWindowDrag(winEl, titlebar);
        }

        // Minimize button
        const minBtn = winEl.querySelector('.minimize-btn');
        if (minBtn) {
            minBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                minimizeWindowById(winId);
            });
        }

        // Maximize button
        const maxBtn = winEl.querySelector('.maximize-btn');
        if (maxBtn) {
            maxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMaximizeWindowById(winId);
            });
        }
    });
}

function setupWindowDrag(winEl, handle) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let initLeft = 0;
    let initTop = 0;

    handle.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button')) return;
        if (winEl.classList.contains('maximized')) return;

        dragging = true;
        const rect = winEl.getBoundingClientRect();
        winEl.classList.add('positioned');
        winEl.style.left = `${rect.left}px`;
        winEl.style.top = `${rect.top}px`;
        winEl.style.right = 'auto';
        winEl.style.bottom = 'auto';
        winEl.style.transform = 'none';

        initLeft = rect.left;
        initTop = rect.top;
        startX = e.clientX;
        startY = e.clientY;
        focusWindow(winEl.id);

        try {
            handle.setPointerCapture(e.pointerId);
        } catch (_) {}
    });

    handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const maxLeft = Math.max(8, window.innerWidth - Math.min(winEl.offsetWidth, 140));
        const maxTop = Math.max(8, window.innerHeight - 68);
        const clampedLeft = Math.min(maxLeft, Math.max(-winEl.offsetWidth + 120, initLeft + dx));
        const clampedTop = Math.min(maxTop, Math.max(4, initTop + dy));
        winEl.style.left = `${clampedLeft}px`;
        winEl.style.top = `${clampedTop}px`;
    });

    const endDrag = () => {
        dragging = false;
    };
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
}

function openWindow(winId) {
    const winEl = document.getElementById(winId);
    if (!winEl) return;

    winEl.classList.remove('hidden');
    winEl.dataset.taskOpen = '1';
    winEl.dataset.taskMinimized = '0';

    focusWindow(winId);
    renderTaskbarButtons();
}

function focusWindow(winId) {
    const winEl = document.getElementById(winId);
    if (!winEl || winEl.classList.contains('hidden')) return;

    topZIndex += 1;
    winEl.style.zIndex = String(topZIndex);
    activeWindowId = winId;

    WINDOW_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.toggle('inactive', id !== winId);
    });

    renderTaskbarButtons();
}

function minimizeWindowById(winId) {
    const winEl = document.getElementById(winId);
    if (!winEl) return;

    winEl.classList.add('hidden');
    winEl.dataset.taskOpen = '1';
    winEl.dataset.taskMinimized = '1';

    if (activeWindowId === winId) {
        activeWindowId = findTopVisibleWindowId(winId);
        if (activeWindowId) focusWindow(activeWindowId);
    }
    renderTaskbarButtons();
}

function toggleMaximizeWindowById(winId) {
    const winEl = document.getElementById(winId);
    if (!winEl) return;
    winEl.classList.toggle('maximized');
    focusWindow(winId);
}

function closeWindowById(winId) {
    const winEl = document.getElementById(winId);
    if (!winEl) return;

    winEl.classList.add('hidden');
    winEl.dataset.taskOpen = '0';
    winEl.dataset.taskMinimized = '0';

    if (activeWindowId === winId) {
        activeWindowId = findTopVisibleWindowId(winId);
        if (activeWindowId) focusWindow(activeWindowId);
    }
    renderTaskbarButtons();
}

function findTopVisibleWindowId(excludeId) {
    let bestId = null;
    let bestZ = -1;
    WINDOW_IDS.forEach(id => {
        if (id === excludeId) return;
        const el = document.getElementById(id);
        if (!el || el.classList.contains('hidden')) return;
        const z = parseInt(el.style.zIndex || '1000', 10);
        if (z > bestZ) {
            bestZ = z;
            bestId = id;
        }
    });
    return bestId;
}

function renderTaskbarButtons() {
    const container = document.getElementById('taskbarButtons');
    if (!container) return;
    container.innerHTML = '';

    WINDOW_IDS.forEach(winId => {
        const el = document.getElementById(winId);
        if (!el || el.dataset.taskOpen !== '1') return;

        const isVisible = !el.classList.contains('hidden');
        const isActive = isVisible && activeWindowId === winId;
        const icon = el.dataset.winIcon || '🪟';
        const title = el.dataset.winTitle || winId;

        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = `taskbar-tab${isActive ? ' active' : ''}`;
        tab.textContent = `${icon} ${title}`;
        tab.addEventListener('click', () => {
            if (!isVisible) {
                openWindow(winId);
            } else if (isActive) {
                minimizeWindowById(winId);
            } else {
                focusWindow(winId);
            }
        });
        container.appendChild(tab);
    });
}

// ========== DESKTOP EVENT LISTENERS ==========

function initializeEventListeners() {
    // Folder icons
    document.querySelectorAll('.folder-icon').forEach(icon => {
        const folderId = icon.dataset.folder;
        const folder = folderStructure[folderId];
        if (folder && folder.description) {
            icon.title = folder.description;
        }
        icon.addEventListener('click', (e) => {
            if (Date.now() - lastIconDragEndAt < 200) return;
            openFolder(e);
        });
        setupDragAndDrop(icon);
    });

    // App icons
    document.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            if (Date.now() - lastIconDragEndAt < 200) return;
            handleAppLaunch(e);
        });
        setupDragAndDrop(icon);
    });

    // Home icon -> open satirical Exit Promo Popup
    const homeIcon = document.getElementById('homeIcon');
    if (homeIcon) {
        homeIcon.addEventListener('click', () => {
            if (Date.now() - lastIconDragEndAt < 200) return;
            launchExitPopup();
        });
        setupDragAndDrop(homeIcon);
    }

    // Start menu folder items
    document.querySelectorAll('.start-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const folder = e.target.closest('.start-menu-item').dataset.folder;
            openFolderFromMenu(folder);
            closeStartMenu();
        });
    });

    // Start menu favorites
    document.querySelectorAll('.start-menu-favorite').forEach(item => {
        item.addEventListener('click', (e) => {
            const appId = e.target.closest('.start-menu-favorite').dataset.app;
            launchAppById(appId);
            closeStartMenu();
        });
    });

    // Start menu actions
    const rebootBtn = document.getElementById('startMenuRebootBtn');
    if (rebootBtn) rebootBtn.addEventListener('click', restartBootSequence);

    const startHomeBtn = document.getElementById('startMenuHomeBtn');
    if (startHomeBtn) {
        startHomeBtn.addEventListener('click', () => {
            closeStartMenu();
            launchExitPopup();
        });
    }

    // Start button
    const startBtn = document.querySelector('.start-button');
    if (startBtn) {
        startBtn.addEventListener('click', toggleStartMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const startMenu = document.getElementById('startMenu');
        const startButton = document.querySelector('.start-button');
        if (startMenu && startButton &&
            !startMenu.classList.contains('hidden') &&
            !startMenu.contains(e.target) &&
            !startButton.contains(e.target)) {
            closeStartMenu();
        }
    });

    // Folder close & back
    const closeFolderBtn = document.querySelector('.close-btn');
    if (closeFolderBtn) closeFolderBtn.addEventListener('click', closeFolder);

    const backBtn = document.querySelector('.back-btn');
    if (backBtn) backBtn.addEventListener('click', goBack);

    // Global keyboard shortcuts (ESC boot skip, BPM Spacebar, DRUM TOy Spacebar)
    document.addEventListener('keydown', handleGlobalKeydown);
}

function handleGlobalKeydown(e) {
    // Allow ESC to skip OS boot screen immediately
    if (e.key === 'Escape' && !bootCompleted) {
        e.preventDefault();
        finishBootSequence(true);
        return;
    }

    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    if (activeTag === 'INPUT' || activeTag === 'SELECT' || activeTag === 'TEXTAREA') {
        return;
    }

    const bpmEl = document.getElementById('bpmWindow');
    const drumEl = document.getElementById('drumToyWindow');
    const bpmVisible = bpmEl && !bpmEl.classList.contains('hidden');
    const drumVisible = drumEl && !drumEl.classList.contains('hidden');

    if ((e.code === 'Space' || e.key === 't' || e.key === 'T') &&
        bpmVisible && (activeWindowId === 'bpmWindow' || !drumVisible)) {
        e.preventDefault();
        if (!e.repeat) handleBpmTap();
        return;
    }

    if (e.code === 'Space' && drumVisible && activeWindowId === 'drumToyWindow') {
        e.preventDefault();
        if (!e.repeat) togglePlayPauseSequencer();
    }
}

// ========== FOLDER BROWSER ==========

function openFolderFromMenu(folderKey) {
    document.querySelectorAll('.folder-icon').forEach(icon => icon.classList.remove('selected'));
    const folderIcon = document.querySelector(`.folder-icon[data-folder="${folderKey}"]`);
    if (folderIcon) folderIcon.classList.add('selected');

    currentFolder = folderKey;
    currentPath = [folderKey];

    const folderWin = document.getElementById('folderWindow');
    const meta = folderStructure[folderKey];
    if (folderWin && meta) {
        folderWin.dataset.winTitle = meta.name;
        folderWin.dataset.winIcon = '📁';
    }

    openWindow('folderWindow');
    populateFolderContents(folderKey);
    updateWindowTitle();
    updateAddressBar();
    updateStatus();
}

function openFolder(e) {
    const icon = e.target.closest('.folder-icon');
    if (!icon) return;
    const folderKey = icon.dataset.folder;

    document.querySelectorAll('.folder-icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');

    currentFolder = folderKey;
    currentPath = [folderKey];

    const folderWin = document.getElementById('folderWindow');
    const meta = folderStructure[folderKey];
    if (folderWin && meta) {
        folderWin.dataset.winTitle = meta.name;
        folderWin.dataset.winIcon = '📁';
    }

    openWindow('folderWindow');
    populateFolderContents(folderKey);
    updateWindowTitle();
    updateAddressBar();
    updateStatus();
}

function populateFolderContents(folderKey) {
    const folder = folderStructure[folderKey];
    const contents = document.getElementById('folderContents');
    if (!contents) return;
    contents.innerHTML = '';

    if (!folder || !folder.items || folder.items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'folder-empty-msg';
        empty.textContent = 'Esta pasta ainda está vazia. Novos uploads em breve no SoundCloud!';
        contents.appendChild(empty);
        return;
    }

    folder.items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.innerHTML = `
            <div class="file-icon">${item.icon}</div>
            <div class="file-name">${item.name}</div>
        `;
        div.addEventListener('click', () => selectItem(div, item));
        div.addEventListener('dblclick', () => openItem(item));
        contents.appendChild(div);
    });
}

function selectItem(element, item) {
    document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    updateStatus(`Selecionado: ${item.name} (duplo clique para abrir)`);
}

function openItem(item) {
    if (item.url && item.url !== '#') {
        window.open(item.url, '_blank', 'noopener');
    } else {
        alert(`"${item.name}" não pôde ser aberto.`);
    }
    updateStatus(`Aberto: ${item.name}`);
}

function closeFolder() {
    closeWindowById('folderWindow');
    document.querySelectorAll('.folder-icon').forEach(icon => icon.classList.remove('selected'));
    currentFolder = null;
    currentPath = [];
    updateStatus('Pronto');
}

function goBack() {
    if (currentPath.length > 1) {
        currentPath.pop();
        const parentFolder = currentPath[currentPath.length - 1];
        populateFolderContents(parentFolder);
        updateWindowTitle();
        updateAddressBar();
        updateStatus();
    }
}

function updateWindowTitle() {
    const titles = currentPath.map(p => folderStructure[p]?.name || p);
    const el = document.getElementById('windowTitle');
    if (el) el.textContent = `📁 ${titles.join(' > ')}`;
}

function updateAddressBar() {
    const path = currentPath.map(p => folderStructure[p]?.name || p).join('\\');
    const bar = document.querySelector('#folderWindow .address-bar');
    if (bar) bar.value = `C:\\Music\\${path}`;
}

function updateStatus(text = 'Pronto') {
    const el = document.getElementById('statusText');
    if (el) el.textContent = text;
}

// ========== START MENU & NAVIGATION ==========

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    const startBtn = document.querySelector('.start-button');
    if (!startMenu) return;
    const willOpen = startMenu.classList.contains('hidden');
    startMenu.classList.toggle('hidden');
    if (startBtn) startBtn.classList.toggle('open', willOpen);
}

function closeStartMenu() {
    const startMenu = document.getElementById('startMenu');
    const startBtn = document.querySelector('.start-button');
    if (startMenu) startMenu.classList.add('hidden');
    if (startBtn) startBtn.classList.remove('open');
}

function goHome() {
    window.location.href = '/';
}

// ========== DESKTOP ICON DRAG & DROP ==========

let draggedElement = null;

function setupDragAndDrop(element) {
    element.draggable = true;

    element.addEventListener('dragstart', (e) => {
        draggedElement = element;
        element.classList.add('dragging');
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    });

    element.addEventListener('dragend', () => {
        element.classList.remove('dragging');
        draggedElement = null;
        lastIconDragEndAt = Date.now();
    });
}

if (typeof document !== 'undefined') {
    document.addEventListener('dragover', (e) => {
        const desktopContent = document.querySelector('.desktop-content');
        if (draggedElement && desktopContent && (desktopContent.contains(e.target) || e.target === desktopContent)) {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        }
    });

    document.addEventListener('drop', (e) => {
        if (!draggedElement) return;
        const desktopContent = document.querySelector('.desktop-content');
        if (!desktopContent) return;
        const desktopRect = desktopContent.getBoundingClientRect();
        const x = Math.min(desktopRect.width - 96, Math.max(4, e.clientX - desktopRect.left - 44));
        const y = Math.min(desktopRect.height - 96, Math.max(4, e.clientY - desktopRect.top - 40));

        draggedElement.style.position = 'absolute';
        draggedElement.style.left = `${x}px`;
        draggedElement.style.top = `${y}px`;
        draggedElement.style.right = 'auto';
        draggedElement.style.bottom = 'auto';

        saveIconPosition(draggedElement);
    });
}

function getIconStorageKey(element) {
    return element.id || element.dataset.folder || element.dataset.app;
}

function saveIconPosition(element) {
    const id = getIconStorageKey(element);
    if (!id) return;
    const positions = JSON.parse(localStorage.getItem('iconPositions') || '{}');
    positions[id] = {
        left: element.style.left,
        top: element.style.top
    };
    localStorage.setItem('iconPositions', JSON.stringify(positions));
}

function loadIconPositions() {
    const positions = JSON.parse(localStorage.getItem('iconPositions') || '{}');
    document.querySelectorAll('.folder-icon, .home-icon, .app-icon').forEach(icon => {
        const id = getIconStorageKey(icon);
        if (id && positions[id]) {
            icon.style.position = 'absolute';
            icon.style.left = positions[id].left;
            icon.style.top = positions[id].top;
            icon.style.right = 'auto';
            icon.style.bottom = 'auto';
        }
    });
}

function handleAppLaunch(e) {
    const app = e.target.closest('.app-icon');
    if (!app) return;
    launchAppById(app.dataset.app);
}

function launchAppById(appId) {
    if (appId === 'minesweeper') {
        launchMinesweeper();
    } else if (appId === 'bpm') {
        launchBpmTapper();
    } else if (appId === 'drumtoy') {
        launchDrumToy();
    } else if (appId === 'promo') {
        launchPromoPopup();
    }
}

// ========== SATIRICAL POPUPS (SUPERFICIAL + HOME EXIT) ==========

let popupsInitialized = false;

function initializePopups() {
    if (popupsInitialized) return;
    popupsInitialized = true;

    const closePromoBtn = document.querySelector('.close-btn-promo');
    const promoDismissBtn = document.getElementById('promoDismissBtn');
    const promoGoHomeBtn = document.getElementById('promoGoHomeBtn');
    const promoOpenExitBtn = document.getElementById('promoOpenExitBtn');

    if (closePromoBtn) closePromoBtn.addEventListener('click', closePromoPopup);
    if (promoDismissBtn) promoDismissBtn.addEventListener('click', closePromoPopup);
    if (promoGoHomeBtn) {
        promoGoHomeBtn.addEventListener('click', () => {
            goHome();
        });
    }
    if (promoOpenExitBtn) {
        promoOpenExitBtn.addEventListener('click', () => {
            launchExitPopup();
        });
    }

    const closeExitBtn = document.querySelector('.close-btn-exit');
    const cancelExitBtn = document.getElementById('cancelGoHomeBtn');
    const confirmExitBtn = document.getElementById('confirmGoHomeBtn');

    if (closeExitBtn) closeExitBtn.addEventListener('click', closeExitPopup);
    if (cancelExitBtn) cancelExitBtn.addEventListener('click', closeExitPopup);
    if (confirmExitBtn) confirmExitBtn.addEventListener('click', goHome);
}

function launchPromoPopup() {
    openWindow('promoPopupWindow');
    promoCountdownSec = 59;
    promoVisitorCount += 1;
    const odometer = document.querySelector('.counter-odometer');
    if (odometer) odometer.textContent = String(promoVisitorCount).padStart(8, '0');

    if (promoCountdownInterval) clearInterval(promoCountdownInterval);
    promoCountdownInterval = setInterval(() => {
        promoCountdownSec -= 1;
        if (promoCountdownSec <= 0) promoCountdownSec = 59;
        const el = document.getElementById('promoCountdown');
        if (el) el.textContent = `00:${String(promoCountdownSec).padStart(2, '0')}`;
    }, 1000);
}

function closePromoPopup() {
    closeWindowById('promoPopupWindow');
    if (promoCountdownInterval) {
        clearInterval(promoCountdownInterval);
        promoCountdownInterval = null;
    }
}

function launchExitPopup() {
    openWindow('exitPopupWindow');
}

function closeExitPopup() {
    closeWindowById('exitPopupWindow');
}

// ========== MINESWEEPER GAME ==========

const ROWS = 8;
const COLS = 8;
const MINES = 10;

let board = [];
let revealed = [];
let flagged = [];
let gameOver = false;
let gameWon = false;
let gameStarted = false;
let timer = 0;
let timerInterval = null;
let minesweeperInitialized = false;

function initializeMinesweeperEventsOnce() {
    if (minesweeperInitialized) return;
    minesweeperInitialized = true;

    const grid = document.getElementById('minesweeperGrid');
    const newBtn = document.getElementById('newGameBtn');
    const closeBtn = document.querySelector('.close-btn-minesweeper');

    if (grid) {
        grid.addEventListener('click', handleCellClick);
        grid.addEventListener('contextmenu', handleRightClick);
    }
    if (newBtn) newBtn.addEventListener('click', resetMinesweeper);
    if (closeBtn) closeBtn.addEventListener('click', closeMinesweeper);
}

function launchMinesweeper() {
    openWindow('minesweeperWindow');
    if (board.length === 0) {
        createBoard();
        renderBoard();
    }
}

function createBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    revealed = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    flagged = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));

    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);
        if (board[r][c] !== 'M') {
            board[r][c] = 'M';
            minesPlaced++;
        }
    }

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== 'M') {
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === 'M') {
                            count++;
                        }
                    }
                }
                board[r][c] = count;
            }
        }
    }
}

function renderBoard() {
    const grid = document.getElementById('minesweeperGrid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'minesweeper-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (revealed[r][c]) {
                cell.classList.add('revealed');
                if (board[r][c] === 'M') {
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                } else if (board[r][c] === 0) {
                    cell.classList.add('empty');
                } else {
                    cell.classList.add(`cell-${board[r][c]}`);
                    cell.textContent = board[r][c];
                }
            } else if (flagged[r][c]) {
                cell.classList.add('flagged');
                cell.textContent = '🚩';
            }

            grid.appendChild(cell);
        }
    }
}

function handleCellClick(e) {
    const cell = e.target.closest('.minesweeper-cell');
    if (!cell || gameOver || gameWon) return;

    const r = parseInt(cell.dataset.row, 10);
    const c = parseInt(cell.dataset.col, 10);

    if (!gameStarted) {
        gameStarted = true;
        startTimer();
        updateGameStatus('Jogo iniciado!');
    }

    if (flagged[r][c] || revealed[r][c]) return;

    revealCell(r, c);
    renderBoard();
    checkGameState();
}

function handleRightClick(e) {
    e.preventDefault();
    const cell = e.target.closest('.minesweeper-cell');
    if (!cell || gameOver || gameWon) return;

    const r = parseInt(cell.dataset.row, 10);
    const c = parseInt(cell.dataset.col, 10);

    if (!revealed[r][c]) {
        flagged[r][c] = !flagged[r][c];
        const minesLeft = MINES - flagged.flat().filter(Boolean).length;
        const countEl = document.getElementById('mineCount');
        if (countEl) countEl.textContent = String(Math.max(0, minesLeft));
        renderBoard();
    }
}

function revealCell(r, c) {
    if (revealed[r][c]) return;
    revealed[r][c] = true;

    if (board[r][c] === 'M') {
        revealAllMines();
        gameOver = true;
        updateGameStatus('💥 Perdeu! Clique em "Novo Jogo" para tentar novamente.');
        stopTimer();
        return;
    }

    if (board[r][c] === 0) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !revealed[nr][nc]) {
                    revealCell(nr, nc);
                }
            }
        }
    }
}

function revealAllMines() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 'M') revealed[r][c] = true;
        }
    }
}

function checkGameState() {
    let revealedCount = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (revealed[r][c] && board[r][c] !== 'M') revealedCount++;
        }
    }

    if (revealedCount === ROWS * COLS - MINES) {
        gameWon = true;
        updateGameStatus('🎉 Ganhou! Parabéns!');
        stopTimer();
    }
}

function resetMinesweeper() {
    board = [];
    revealed = [];
    flagged = [];
    gameOver = false;
    gameWon = false;
    gameStarted = false;
    timer = 0;
    const timerEl = document.getElementById('timer');
    const mineEl = document.getElementById('mineCount');
    if (timerEl) timerEl.textContent = '0';
    if (mineEl) mineEl.textContent = String(MINES);
    stopTimer();
    updateGameStatus('Clique em uma célula para começar');
    createBoard();
    renderBoard();
}

function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        timer += 1;
        const el = document.getElementById('timer');
        if (el) el.textContent = String(timer);
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateGameStatus(msg) {
    const el = document.getElementById('gameStatus');
    if (el) el.textContent = msg;
}

function closeMinesweeper() {
    closeWindowById('minesweeperWindow');
    stopTimer();
}

// ========== BPM TAPPER PRO 95 ==========

let bpmWindowInitialized = false;
let bpmTaps = [];
let currentTappedBpm = null;
let bpmInactivityTimer = null;
let bpmLedTimer = null;
let bpmClickEnabled = false;
let bpmMetronomeTimer = null;

/**
 * Computes smoothed BPM and stability percentage from high-resolution tap timestamps (ms).
 * Rejects extreme single-tap outliers when >= 4 intervals exist.
 */
function computeBpmMetrics(taps) {
    if (!Array.isArray(taps) || taps.length < 2) {
        return null;
    }

    const intervals = [];
    for (let i = 1; i < taps.length; i++) {
        const dt = taps[i] - taps[i - 1];
        if (dt >= 140 && dt <= 2400) {
            intervals.push(dt);
        }
    }

    if (intervals.length === 0) return null;

    let clean = intervals;
    if (intervals.length >= 4) {
        const sorted = [...intervals].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const filtered = intervals.filter(dt => dt >= median * 0.65 && dt <= median * 1.35);
        if (filtered.length >= 2) clean = filtered;
    }

    const avgMs = clean.reduce((acc, v) => acc + v, 0) / clean.length;
    const exactBpm = Math.min(320, Math.max(20, 60000 / avgMs));
    const roundedBpm = Math.round(exactBpm);

    // Coefficient of variation -> stability percentage
    const variance = clean.reduce((acc, v) => acc + Math.pow(v - avgMs, 2), 0) / clean.length;
    const stdDev = Math.sqrt(variance);
    const cv = avgMs > 0 ? stdDev / avgMs : 0;
    const stability = clean.length === 1 ? 85 : Math.max(0, Math.min(100, Math.round(100 - cv * 260)));

    return {
        exactBpm,
        roundedBpm,
        avgMs,
        stability,
        tapCount: taps.length
    };
}

function launchBpmTapper() {
    openWindow('bpmWindow');
}

function initializeBpmTapper() {
    if (bpmWindowInitialized) return;
    bpmWindowInitialized = true;

    const tapBtn = document.getElementById('bpmButton');
    const resetBtn = document.getElementById('resetBpmBtn');
    const halfBtn = document.getElementById('bpmHalfBtn');
    const doubleBtn = document.getElementById('bpmDoubleBtn');
    const downBtn = document.getElementById('bpmNudgeDown');
    const upBtn = document.getElementById('bpmNudgeUp');
    const clickToggleBtn = document.getElementById('bpmClickToggle');
    const syncBtn = document.getElementById('sendBpmToDrumToyBtn');
    const closeBtn = document.querySelector('.close-btn-bpm');

    if (tapBtn) {
        tapBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            handleBpmTap();
        });
    }
    if (resetBtn) resetBtn.addEventListener('click', resetBpm);
    if (halfBtn) halfBtn.addEventListener('click', () => scaleTappedBpm(0.5));
    if (doubleBtn) doubleBtn.addEventListener('click', () => scaleTappedBpm(2.0));
    if (downBtn) downBtn.addEventListener('click', () => nudgeTappedBpm(-1));
    if (upBtn) upBtn.addEventListener('click', () => nudgeTappedBpm(1));
    if (clickToggleBtn) clickToggleBtn.addEventListener('click', toggleBpmMetronome);
    if (syncBtn) syncBtn.addEventListener('click', applyTappedBpmToDrumToy);
    if (closeBtn) closeBtn.addEventListener('click', closeBpmTapper);
}

function handleBpmTap() {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const last = bpmTaps.length > 0 ? bpmTaps[bpmTaps.length - 1] : null;

    if (last !== null) {
        const delta = now - last;
        if (delta < 140) return; // Ignore hardware/double-tap bounce
        if (delta > 2200) {
            // Start a clean new phrase automatically after >2.2s pause
            bpmTaps = [];
        }
    }

    bpmTaps.push(now);
    if (bpmTaps.length > 12) {
        bpmTaps.shift();
    }

    flashBpmPadFeedback();

    if (bpmInactivityTimer) clearTimeout(bpmInactivityTimer);
    bpmInactivityTimer = setTimeout(() => {
        if (bpmTaps.length === 1) {
            bpmTaps = [];
            updateBpmStatusText('Aguardando nova sequência...');
        }
    }, 2400);

    const metrics = computeBpmMetrics(bpmTaps);
    if (!metrics) {
        updateBpmDisplayOnly({
            countText: `Cliques: ${bpmTaps.length}`,
            infoText: 'Continue batendo no ritmo...',
            statusText: '1º toque registrado — bata novamente no tempo 2!'
        });
        return;
    }

    currentTappedBpm = metrics.exactBpm;
    renderBpmReadout(metrics);
    if (bpmClickEnabled) restartBpmMetronomeLoop();
}

function renderBpmReadout(metrics) {
    const whole = Math.floor(metrics.exactBpm);
    const dec = `.${Math.floor((metrics.exactBpm - whole) * 10)}`;

    const valEl = document.getElementById('bpmValue');
    const decEl = document.getElementById('bpmDecimal');
    const intervalEl = document.getElementById('bpmInterval');
    const countEl = document.getElementById('bpmCount');
    const confEl = document.getElementById('bpmConfidence');
    const infoEl = document.getElementById('bpmInfo');
    const syncBtn = document.getElementById('sendBpmToDrumToyBtn');

    if (valEl) valEl.textContent = String(whole);
    if (decEl) decEl.textContent = dec;
    if (intervalEl) intervalEl.textContent = `Intervalo: ${Math.round(metrics.avgMs)} ms`;
    if (countEl) countEl.textContent = `Cliques: ${metrics.tapCount}`;
    if (confEl) confEl.textContent = `Estab.: ${metrics.stability}%`;
    if (infoEl) infoEl.textContent = `Tempo detectado: ${metrics.exactBpm.toFixed(1)} BPM (${metrics.roundedBpm} arredondado)`;
    if (syncBtn) syncBtn.disabled = false;

    updateBpmStatusText(`BPM: ${metrics.roundedBpm} (${metrics.exactBpm.toFixed(1)}) • Estabilidade ${metrics.stability}%`);
}

function updateBpmDisplayOnly({ countText, infoText, statusText }) {
    const countEl = document.getElementById('bpmCount');
    const infoEl = document.getElementById('bpmInfo');
    if (countEl && countText) countEl.textContent = countText;
    if (infoEl && infoText) infoEl.textContent = infoText;
    if (statusText) updateBpmStatusText(statusText);
}

function updateBpmStatusText(text) {
    const statusEl = document.getElementById('bpmStatus');
    if (statusEl) statusEl.textContent = text;
}

function flashBpmPadFeedback() {
    const tapBtn = document.getElementById('bpmButton');
    const led = document.getElementById('bpmBeatLed');
    const pulseBar = document.getElementById('bpmPulseBar');

    if (tapBtn) tapBtn.classList.add('tap-flash');
    if (led) led.classList.add('lit');
    if (pulseBar) pulseBar.style.width = '100%';

    if (bpmLedTimer) clearTimeout(bpmLedTimer);
    bpmLedTimer = setTimeout(() => {
        if (tapBtn) tapBtn.classList.remove('tap-flash');
        if (led) led.classList.remove('lit');
        if (pulseBar) pulseBar.style.width = '18%';
    }, 110);
}

function scaleTappedBpm(factor) {
    if (currentTappedBpm === null) return;
    currentTappedBpm = Math.min(320, Math.max(20, currentTappedBpm * factor));
    const avgMs = 60000 / currentTappedBpm;
    renderBpmReadout({
        exactBpm: currentTappedBpm,
        roundedBpm: Math.round(currentTappedBpm),
        avgMs,
        stability: 100,
        tapCount: bpmTaps.length
    });
    if (bpmClickEnabled) restartBpmMetronomeLoop();
}

function nudgeTappedBpm(delta) {
    if (currentTappedBpm === null) currentTappedBpm = bpm || 120;
    currentTappedBpm = Math.min(320, Math.max(20, currentTappedBpm + delta));
    const avgMs = 60000 / currentTappedBpm;
    renderBpmReadout({
        exactBpm: currentTappedBpm,
        roundedBpm: Math.round(currentTappedBpm),
        avgMs,
        stability: 100,
        tapCount: bpmTaps.length
    });
    if (bpmClickEnabled) restartBpmMetronomeLoop();
}

function toggleBpmMetronome() {
    bpmClickEnabled = !bpmClickEnabled;
    const btn = document.getElementById('bpmClickToggle');
    if (btn) btn.classList.toggle('active', bpmClickEnabled);

    if (bpmClickEnabled) {
        initAudioContext();
        if (currentTappedBpm === null) currentTappedBpm = bpm || 120;
        restartBpmMetronomeLoop();
        updateBpmStatusText(`Metrônomo ativo a ${Math.round(currentTappedBpm)} BPM`);
    } else {
        stopBpmMetronomeLoop();
        updateBpmStatusText('Metrônomo desligado');
    }
}

function playMetronomeTick() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1180, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.03);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
    flashBpmPadFeedback();
}

function restartBpmMetronomeLoop() {
    stopBpmMetronomeLoop();
    if (!bpmClickEnabled || currentTappedBpm === null) return;
    const intervalMs = Math.max(180, Math.round(60000 / currentTappedBpm));
    playMetronomeTick();
    bpmMetronomeTimer = setInterval(playMetronomeTick, intervalMs);
}

function stopBpmMetronomeLoop() {
    if (bpmMetronomeTimer) {
        clearInterval(bpmMetronomeTimer);
        bpmMetronomeTimer = null;
    }
}

function applyTappedBpmToDrumToy() {
    if (currentTappedBpm === null) return;
    const clamped = Math.max(40, Math.min(240, Math.round(currentTappedBpm)));
    bpm = clamped;
    const drumInput = document.getElementById('drumToyBpm');
    if (drumInput) drumInput.value = String(clamped);

    launchDrumToy();
    const drumStatus = document.getElementById('drumToyStatus');
    if (drumStatus) drumStatus.textContent = `BPM sincronizado via Tapper: ${clamped} BPM!`;
    updateBpmStatusText(`${clamped} BPM aplicado no DRUM TOy!`);
}

function resetBpm() {
    bpmTaps = [];
    currentTappedBpm = null;
    stopBpmMetronomeLoop();
    bpmClickEnabled = false;

    const clickBtn = document.getElementById('bpmClickToggle');
    const valEl = document.getElementById('bpmValue');
    const decEl = document.getElementById('bpmDecimal');
    const intervalEl = document.getElementById('bpmInterval');
    const countEl = document.getElementById('bpmCount');
    const confEl = document.getElementById('bpmConfidence');
    const infoEl = document.getElementById('bpmInfo');
    const syncBtn = document.getElementById('sendBpmToDrumToyBtn');
    const pulseBar = document.getElementById('bpmPulseBar');

    if (clickBtn) clickBtn.classList.remove('active');
    if (valEl) valEl.textContent = '--';
    if (decEl) decEl.textContent = '';
    if (intervalEl) intervalEl.textContent = 'Intervalo: -- ms';
    if (countEl) countEl.textContent = 'Cliques: 0';
    if (confEl) confEl.textContent = 'Estab.: --%';
    if (infoEl) infoEl.textContent = 'Toque no pad ou use a Barra de Espaço no ritmo da música.';
    if (syncBtn) syncBtn.disabled = true;
    if (pulseBar) pulseBar.style.width = '0%';
    if (bpmInactivityTimer) clearTimeout(bpmInactivityTimer);

    updateBpmStatusText('Pronto • Aguardando primeira batida');
}

function closeBpmTapper() {
    stopBpmMetronomeLoop();
    bpmClickEnabled = false;
    closeWindowById('bpmWindow');
}

// ========== DRUM TOy SEQUENCER ENGINE ==========

let drumToyWindowInitialized = false;
let audioCtx = null;
let masterGainNode = null;
let masterCompressorNode = null;
let isPlaying = false;
let bpm = 120;
let swingPercent = 0;
let useSynthOnly = false;
let currentStep = 0;
let schedulerIntervalId = null;
let nextStepTime = 0.0;
const scheduleAheadTime = 0.12;
const lookahead = 22.0;

// Painting drag state across step pads
let isPaintingPads = false;
let paintTargetState = true;

// rAF Playhead queue synced tightly to AudioContext time
const visualStepQueue = [];
let playheadRafId = null;
let lastDrawnStep = -1;

const sequencerData = {
    '808': Array(16).fill(false),
    kick: Array(16).fill(false),
    snap: Array(16).fill(false),
    snare: Array(16).fill(false),
    clap: Array(16).fill(false),
    hihat_closed: Array(16).fill(false),
    hihat_open: Array(16).fill(false)
};

const channelVolumes = {
    '808': 0.8,
    kick: 0.8,
    snap: 0.7,
    snare: 0.7,
    clap: 0.7,
    hihat_closed: 0.6,
    hihat_open: 0.6
};

const channelMuted = {
    '808': false,
    kick: false,
    snap: false,
    snare: false,
    clap: false,
    hihat_closed: false,
    hihat_open: false
};

const channelSolo = {
    '808': false,
    kick: false,
    snap: false,
    snare: false,
    clap: false,
    hihat_closed: false,
    hihat_open: false
};

const SAMPLE_URLS = {
    '808': '/assets/drumtoy/808.wav',
    kick: '/assets/drumtoy/kick.wav',
    snap: '/assets/drumtoy/snap.wav',
    snare: '/assets/drumtoy/snare.wav',
    clap: '/assets/drumtoy/clap.wav',
    hihat_closed: '/assets/drumtoy/hihat_closed.wav',
    hihat_open: '/assets/drumtoy/hihat_open.wav'
};

const rawSampleData = {};
const sampleBuffers = {};
let samplesPreloadPromise = null;

function preloadDrumSampleBytes() {
    if (samplesPreloadPromise) return samplesPreloadPromise;
    samplesPreloadPromise = Promise.all(
        Object.entries(SAMPLE_URLS).map(async ([key, url]) => {
            try {
                const res = await fetch(url);
                if (!res.ok) return;
                rawSampleData[key] = await res.arrayBuffer();
                if (audioCtx) {
                    await decodeSampleKey(key);
                }
            } catch (_) {
                // Fallback synth remains seamlessly active
            }
        })
    );
    return samplesPreloadPromise;
}

async function decodeSampleKey(key) {
    if (!audioCtx || !rawSampleData[key] || sampleBuffers[key]) return;
    try {
        sampleBuffers[key] = await audioCtx.decodeAudioData(rawSampleData[key].slice(0));
    } catch (err) {
        console.warn(`DrumToy: failed decoding ${key}`, err);
    }
}

async function decodeAllCachedSamples() {
    await Promise.all(Object.keys(SAMPLE_URLS).map(key => decodeSampleKey(key)));
}

function isChannelAudible(channel) {
    const anySolo = Object.values(channelSolo).some(Boolean);
    if (anySolo) {
        return Boolean(channelSolo[channel]) && !channelMuted[channel];
    }
    return !channelMuted[channel];
}

function computeStepSwingOffsetSec(step, secondsPerStep, swingPct) {
    if (step % 2 === 1 && swingPct > 0) {
        return (swingPct / 100) * (secondsPerStep * 0.65);
    }
    return 0;
}

function initAudioContext() {
    if (!audioCtx) {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return;
        audioCtx = new AudioCtor();

        masterCompressorNode = audioCtx.createDynamicsCompressor();
        masterCompressorNode.threshold.setValueAtTime(-10, audioCtx.currentTime);
        masterCompressorNode.knee.setValueAtTime(18, audioCtx.currentTime);
        masterCompressorNode.ratio.setValueAtTime(4, audioCtx.currentTime);
        masterCompressorNode.attack.setValueAtTime(0.003, audioCtx.currentTime);
        masterCompressorNode.release.setValueAtTime(0.18, audioCtx.currentTime);

        masterGainNode = audioCtx.createGain();
        masterGainNode.gain.setValueAtTime(0.9, audioCtx.currentTime);

        masterCompressorNode.connect(masterGainNode);
        masterGainNode.connect(audioCtx.destination);

        preloadDrumSampleBytes().then(() => decodeAllCachedSamples());
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function flashChannelLed(channel) {
    const led = document.querySelector(`.channel-row[data-channel="${channel}"] .channel-led`);
    if (!led) return;
    led.classList.add('hit');
    setTimeout(() => led.classList.remove('hit'), 105);
}

// Unified synthesis voices (usable live & offline)
function renderSynthVoice(ctx, destNode, type, time, vol) {
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime((vol || 0.7) * 0.75, time);
    voiceGain.connect(destNode);

    if (type === '808') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(118, time);
        osc.frequency.exponentialRampToValueAtTime(36, time + 0.14);
        osc.frequency.exponentialRampToValueAtTime(28, time + 0.45);
        gain.gain.setValueAtTime(1.0, time);
        gain.gain.exponentialRampToValueAtTime(0.008, time + 0.52);
        osc.connect(gain);
        gain.connect(voiceGain);
        osc.start(time);
        osc.stop(time + 0.55);
    } else if (type === 'kick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(175, time);
        osc.frequency.exponentialRampToValueAtTime(46, time + 0.075);
        gain.gain.setValueAtTime(1.0, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.14);
        osc.connect(gain);
        gain.connect(voiceGain);
        osc.start(time);
        osc.stop(time + 0.16);
    } else if (type === 'snap') {
        const buf = createNoiseBuffer(ctx, 0.09);
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1250, time);
        filter.Q.setValueAtTime(3.2, time);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.9, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.075);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(voiceGain);
        noise.start(time);
        noise.stop(time + 0.09);
    } else if (type === 'snare') {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(190, time);
        osc.frequency.exponentialRampToValueAtTime(95, time + 0.08);
        oscGain.gain.setValueAtTime(0.75, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.11);
        osc.connect(oscGain);
        oscGain.connect(voiceGain);
        osc.start(time);
        osc.stop(time + 0.14);

        const buf = createNoiseBuffer(ctx, 0.18);
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1100, time);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.85, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.16);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(voiceGain);
        noise.start(time);
        noise.stop(time + 0.18);
    } else if (type === 'clap') {
        const buf = createNoiseBuffer(ctx, 0.24);
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1350, time);
        filter.Q.setValueAtTime(2.0, time);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(0.45, time + 0.005);
        gain.gain.linearRampToValueAtTime(0.0, time + 0.010);
        gain.gain.linearRampToValueAtTime(0.55, time + 0.015);
        gain.gain.linearRampToValueAtTime(0.0, time + 0.020);
        gain.gain.linearRampToValueAtTime(0.65, time + 0.025);
        gain.gain.linearRampToValueAtTime(0.0, time + 0.030);
        gain.gain.linearRampToValueAtTime(0.95, time + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.19);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(voiceGain);
        noise.start(time);
        noise.stop(time + 0.24);
    } else if (type === 'hihat_closed') {
        const buf = createNoiseBuffer(ctx, 0.055);
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(7800, time);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.65, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.045);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(voiceGain);
        noise.start(time);
        noise.stop(time + 0.055);
    } else if (type === 'hihat_open') {
        const buf = createNoiseBuffer(ctx, 0.28);
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(6400, time);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.58, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(voiceGain);
        noise.start(time);
        noise.stop(time + 0.28);
    }
}

function createNoiseBuffer(ctx, durationSec) {
    const length = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

function playDrumSound(type, scheduledTime) {
    if (!audioCtx || !masterCompressorNode) return;
    const playTime = scheduledTime || audioCtx.currentTime;
    const vol = channelVolumes[type] !== undefined ? channelVolumes[type] : 0.8;

    if (!useSynthOnly && sampleBuffers[type]) {
        const src = audioCtx.createBufferSource();
        src.buffer = sampleBuffers[type];
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(vol * 0.85, playTime);
        src.connect(gainNode);
        gainNode.connect(masterCompressorNode);
        src.start(playTime);
    } else {
        renderSynthVoice(audioCtx, masterCompressorNode, type, playTime, vol);
    }
}

function scheduler() {
    if (!audioCtx || !isPlaying) return;
    while (nextStepTime < audioCtx.currentTime + scheduleAheadTime) {
        scheduleNextStep(currentStep, nextStepTime);
        advanceStep();
    }
}

function scheduleNextStep(step, baseTime) {
    const secondsPerStep = 60.0 / bpm / 4.0;
    const swingOffset = computeStepSwingOffsetSec(step, secondsPerStep, swingPercent);
    const playTime = baseTime + swingOffset;

    for (const [instrument, steps] of Object.entries(sequencerData)) {
        if (steps[step] && isChannelAudible(instrument)) {
            playDrumSound(instrument, playTime);
            const ledDelayMs = Math.max(0, (playTime - audioCtx.currentTime) * 1000);
            setTimeout(() => {
                if (isPlaying) flashChannelLed(instrument);
            }, ledDelayMs);
        }
    }

    visualStepQueue.push({ step, time: playTime });
}

function advanceStep() {
    const secondsPerStep = 60.0 / bpm / 4.0;
    nextStepTime += secondsPerStep;
    currentStep = (currentStep + 1) % 16;
}

function drawPlayheadLoop() {
    if (!isPlaying) return;
    const now = audioCtx ? audioCtx.currentTime : 0;
    let nextVisible = lastDrawnStep;

    while (visualStepQueue.length > 0 && visualStepQueue[0].time <= now + 0.01) {
        nextVisible = visualStepQueue.shift().step;
    }

    if (nextVisible !== lastDrawnStep && nextVisible >= 0) {
        lastDrawnStep = nextVisible;
        updatePlayheadUI(nextVisible);
    }

    playheadRafId = requestAnimationFrame(drawPlayheadLoop);
}

function updatePlayheadUI(step) {
    document.querySelectorAll('.step-pad.playing').forEach(p => p.classList.remove('playing'));
    document.querySelectorAll('.ruler-step.playing').forEach(r => r.classList.remove('playing'));

    document.querySelectorAll(`.step-pad[data-step="${step}"]`).forEach(p => p.classList.add('playing'));
    const rulerStep = document.querySelector(`.ruler-step[data-step="${step}"]`);
    if (rulerStep) rulerStep.classList.add('playing');

    const status = document.getElementById('drumToyStatus');
    if (status) {
        status.textContent = `Tocando ${bpm} BPM (Swing ${swingPercent}%) • Passo ${step + 1}/16`;
    }
}

function launchDrumToy() {
    openWindow('drumToyWindow');
    preloadDrumSampleBytes();
}

function initializeDrumToy() {
    if (drumToyWindowInitialized) return;
    drumToyWindowInitialized = true;

    // Pad click & drag-to-paint
    document.querySelectorAll('.step-pad').forEach(pad => {
        pad.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            initAudioContext();
            const row = pad.closest('.channel-row');
            if (!row) return;
            const channel = row.dataset.channel;
            const step = parseInt(pad.dataset.step, 10);

            paintTargetState = !sequencerData[channel][step];
            isPaintingPads = true;

            sequencerData[channel][step] = paintTargetState;
            pad.classList.toggle('active', paintTargetState);
            if (paintTargetState) {
                playDrumSound(channel);
                flashChannelLed(channel);
            }
        });

        pad.addEventListener('pointerenter', () => {
            if (!isPaintingPads) return;
            const row = pad.closest('.channel-row');
            if (!row) return;
            const channel = row.dataset.channel;
            const step = parseInt(pad.dataset.step, 10);
            if (sequencerData[channel][step] !== paintTargetState) {
                sequencerData[channel][step] = paintTargetState;
                pad.classList.toggle('active', paintTargetState);
            }
        });
    });

    window.addEventListener('pointerup', () => {
        isPaintingPads = false;
    });

    // Click channel name to audition sound
    document.querySelectorAll('.channel-name-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            initAudioContext();
            const row = btn.closest('.channel-row');
            if (!row) return;
            const ch = row.dataset.channel;
            playDrumSound(ch);
            flashChannelLed(ch);
        });
    });

    // Mute / Solo / Clear line buttons
    document.querySelectorAll('.ch-mute-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('.channel-row');
            if (!row) return;
            const ch = row.dataset.channel;
            channelMuted[ch] = !channelMuted[ch];
            btn.classList.toggle('active', channelMuted[ch]);
            row.classList.toggle('is-muted', channelMuted[ch]);
        });
    });

    document.querySelectorAll('.ch-solo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('.channel-row');
            if (!row) return;
            const ch = row.dataset.channel;
            channelSolo[ch] = !channelSolo[ch];
            btn.classList.toggle('active', channelSolo[ch]);
            row.classList.toggle('is-solo', channelSolo[ch]);
        });
    });

    document.querySelectorAll('.ch-clear-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('.channel-row');
            if (!row) return;
            const ch = row.dataset.channel;
            sequencerData[ch].fill(false);
            row.querySelectorAll('.step-pad').forEach(p => p.classList.remove('active'));
        });
    });

    // Channel volume faders
    document.querySelectorAll('.channel-volume').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const row = e.target.closest('.channel-row');
            if (!row) return;
            channelVolumes[row.dataset.channel] = parseFloat(e.target.value);
        });
    });

    // Transport & Toolbar
    const playBtn = document.getElementById('drumToyPlayBtn');
    const stopBtn = document.getElementById('drumToyStopBtn');
    const resetBtn = document.getElementById('drumToyResetBtn');
    const demoBtn = document.getElementById('drumToyDemoBtn');
    const presetSel = document.getElementById('drumToyPresetSelect');
    const kitBtn = document.getElementById('drumToyKitBtn');
    const exportBtn = document.getElementById('drumToyExportBtn');
    const tapperLinkBtn = document.getElementById('drumToyOpenTapperBtn');
    const closeBtn = document.querySelector('.close-btn-drumtoy');

    if (playBtn) playBtn.addEventListener('click', togglePlayPauseSequencer);
    if (stopBtn) stopBtn.addEventListener('click', stopAndRewindSequencer);
    if (resetBtn) resetBtn.addEventListener('click', resetSequencer);
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            const key = presetSel ? presetSel.value : 'demo';
            loadPresetBeat(key);
        });
    }
    if (presetSel) {
        presetSel.addEventListener('change', (e) => {
            loadPresetBeat(e.target.value);
        });
    }
    if (kitBtn) {
        kitBtn.addEventListener('click', () => {
            useSynthOnly = !useSynthOnly;
            kitBtn.textContent = useSynthOnly ? 'Kit: Synth' : 'Kit: WAV';
            kitBtn.classList.toggle('selected', useSynthOnly);
            const status = document.getElementById('drumToyStatus');
            if (status) {
                status.textContent = useSynthOnly
                    ? 'Modo Síntese Retro WebAudio ativado!'
                    : 'Modo Samples WAV 808 ativado!';
            }
        });
    }
    if (exportBtn) exportBtn.addEventListener('click', exportToWav);
    if (tapperLinkBtn) tapperLinkBtn.addEventListener('click', launchBpmTapper);
    if (closeBtn) closeBtn.addEventListener('click', closeDrumToy);

    // BPM input & buttons
    const bpmInput = document.getElementById('drumToyBpm');
    if (bpmInput) {
        const applyBpmInput = (valStr) => {
            const val = parseInt(valStr, 10);
            if (!isNaN(val)) {
                bpm = Math.max(40, Math.min(240, val));
            }
        };
        bpmInput.addEventListener('input', (e) => applyBpmInput(e.target.value));
        bpmInput.addEventListener('change', (e) => {
            applyBpmInput(e.target.value);
            e.target.value = String(bpm);
        });
    }

    const bpmMinus = document.getElementById('drumToyBpmMinus');
    const bpmPlus = document.getElementById('drumToyBpmPlus');
    if (bpmMinus) {
        bpmMinus.addEventListener('click', (e) => {
            const delta = e.shiftKey ? 5 : 1;
            bpm = Math.max(40, bpm - delta);
            if (bpmInput) bpmInput.value = String(bpm);
        });
    }
    if (bpmPlus) {
        bpmPlus.addEventListener('click', (e) => {
            const delta = e.shiftKey ? 5 : 1;
            bpm = Math.min(240, bpm + delta);
            if (bpmInput) bpmInput.value = String(bpm);
        });
    }

    // Swing slider
    const swingInput = document.getElementById('drumToySwing');
    const swingValEl = document.getElementById('drumToySwingVal');
    if (swingInput) {
        swingInput.addEventListener('input', (e) => {
            swingPercent = parseInt(e.target.value, 10) || 0;
            if (swingValEl) swingValEl.textContent = `${swingPercent}%`;
        });
    }
}

function togglePlayPauseSequencer() {
    if (isPlaying) {
        pauseSequencer();
    } else {
        startSequencer();
    }
}

function startSequencer() {
    initAudioContext();
    if (isPlaying || !audioCtx) return;

    isPlaying = true;
    nextStepTime = audioCtx.currentTime + 0.02;
    lastDrawnStep = -1;

    const playBtn = document.getElementById('drumToyPlayBtn');
    if (playBtn) {
        playBtn.textContent = '⏸ Pause';
        playBtn.classList.add('selected');
    }

    schedulerIntervalId = setInterval(scheduler, lookahead);
    playheadRafId = requestAnimationFrame(drawPlayheadLoop);
}

function pauseSequencer() {
    isPlaying = false;
    if (schedulerIntervalId) {
        clearInterval(schedulerIntervalId);
        schedulerIntervalId = null;
    }
    if (playheadRafId) {
        cancelAnimationFrame(playheadRafId);
        playheadRafId = null;
    }
    visualStepQueue.length = 0;

    const playBtn = document.getElementById('drumToyPlayBtn');
    if (playBtn) {
        playBtn.textContent = '▶ Play';
        playBtn.classList.remove('selected');
    }

    const status = document.getElementById('drumToyStatus');
    if (status) {
        status.textContent = `Pausado no passo ${currentStep + 1}/16.`;
    }
}

function stopAndRewindSequencer() {
    pauseSequencer();
    currentStep = 0;
    lastDrawnStep = -1;
    document.querySelectorAll('.step-pad.playing').forEach(p => p.classList.remove('playing'));
    document.querySelectorAll('.ruler-step.playing').forEach(r => r.classList.remove('playing'));

    const status = document.getElementById('drumToyStatus');
    if (status) {
        status.textContent = 'Parado (passo 1). Clique em Play para iniciar.';
    }
}

function clearPatternsOnly() {
    for (const inst of Object.keys(sequencerData)) {
        sequencerData[inst].fill(false);
    }
    document.querySelectorAll('.step-pad').forEach(p => {
        p.classList.remove('active');
    });
}

function resetSequencer() {
    stopAndRewindSequencer();
    clearPatternsOnly();
    const status = document.getElementById('drumToyStatus');
    if (status) status.textContent = 'Sequência limpa.';
}

const DRUM_PRESETS = {
    demo: {
        label: 'Trap 808',
        bpm: 132,
        swing: 10,
        steps: {
            '808': [0, 8, 11],
            kick: [0, 8],
            snare: [4, 12],
            clap: [12, 15],
            snap: [3, 11],
            hihat_closed: [0, 2, 4, 5, 6, 8, 10, 11, 12, 14],
            hihat_open: [6, 14]
        }
    },
    mtg: {
        label: 'MTG Funk 130',
        bpm: 130,
        swing: 5,
        steps: {
            '808': [0, 3, 6, 10, 12],
            kick: [0, 3, 6, 8, 10],
            snare: [3, 6, 12, 14],
            clap: [4, 12],
            snap: [2, 10],
            hihat_closed: [0, 2, 4, 6, 8, 10, 12, 14],
            hihat_open: [14]
        }
    },
    house: {
        label: 'House 95',
        bpm: 124,
        swing: 15,
        steps: {
            '808': [0, 4, 8, 12],
            kick: [0, 4, 8, 12],
            clap: [4, 12],
            hihat_closed: [0, 2, 4, 6, 8, 10, 12, 14],
            hihat_open: [2, 6, 10, 14]
        }
    },
    electro: {
        label: 'Miami Electro',
        bpm: 128,
        swing: 0,
        steps: {
            '808': [0, 6, 10],
            kick: [0, 6, 10],
            snare: [4, 12],
            clap: [4, 12, 15],
            snap: [7, 15],
            hihat_closed: [0, 1, 2, 4, 6, 8, 9, 10, 12, 14],
            hihat_open: [14]
        }
    },
    boombap: {
        label: 'Boom Bap 90',
        bpm: 92,
        swing: 30,
        steps: {
            '808': [0, 7, 10],
            kick: [0, 7, 10],
            snare: [4, 12],
            snap: [2, 14],
            hihat_closed: [0, 2, 4, 6, 8, 10, 12, 14],
            hihat_open: [6]
        }
    }
};

function loadPresetBeat(presetKey) {
    const preset = DRUM_PRESETS[presetKey] || DRUM_PRESETS.demo;
    clearPatternsOnly();

    bpm = preset.bpm;
    swingPercent = preset.swing;

    const bpmInput = document.getElementById('drumToyBpm');
    const swingInput = document.getElementById('drumToySwing');
    const swingValEl = document.getElementById('drumToySwingVal');
    if (bpmInput) bpmInput.value = String(bpm);
    if (swingInput) swingInput.value = String(swingPercent);
    if (swingValEl) swingValEl.textContent = `${swingPercent}%`;

    for (const [instrument, activeIndices] of Object.entries(preset.steps)) {
        if (!sequencerData[instrument]) continue;
        activeIndices.forEach(stepIdx => {
            if (stepIdx >= 0 && stepIdx < 16) {
                sequencerData[instrument][stepIdx] = true;
                const pad = document.querySelector(`.channel-row[data-channel="${instrument}"] .step-pad[data-step="${stepIdx}"]`);
                if (pad) pad.classList.add('active');
            }
        });
    }

    const status = document.getElementById('drumToyStatus');
    if (status) {
        status.textContent = `Preset "${preset.label}" carregado (${bpm} BPM, Swing ${swingPercent}%).`;
    }
}

function closeDrumToy() {
    stopAndRewindSequencer();
    closeWindowById('drumToyWindow');
}

// Offline WAV Export matching live Swing, Mute/Solo, and Kit mode
async function exportToWav() {
    const status = document.getElementById('drumToyStatus');
    const anySteps = Object.entries(sequencerData).some(([ch, arr]) => isChannelAudible(ch) && arr.some(Boolean));
    if (!anySteps) {
        if (status) status.textContent = 'Ative ao menos um pad audível antes de exportar WAV!';
        return;
    }

    if (status) status.textContent = 'Renderizando beat em WAV 16-bit...';

    const OfflineCtor = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const secondsPerStep = 60.0 / bpm / 4.0;
    const totalBarDuration = 16 * secondsPerStep;
    const renderDuration = totalBarDuration + 1.0;
    const sampleRate = 44100;
    const numChannels = 2;

    const offlineCtx = new OfflineCtor(numChannels, Math.ceil(sampleRate * renderDuration), sampleRate);
    const offlineMaster = offlineCtx.createGain();
    offlineMaster.gain.setValueAtTime(0.85, 0);
    offlineMaster.connect(offlineCtx.destination);

    for (const [instrument, steps] of Object.entries(sequencerData)) {
        if (!isChannelAudible(instrument)) continue;
        steps.forEach((active, step) => {
            if (!active) return;
            const swingOffset = computeStepSwingOffsetSec(step, secondsPerStep, swingPercent);
            const stepTime = step * secondsPerStep + swingOffset;
            const vol = channelVolumes[instrument] !== undefined ? channelVolumes[instrument] : 0.8;

            if (!useSynthOnly && sampleBuffers[instrument]) {
                const src = offlineCtx.createBufferSource();
                src.buffer = sampleBuffers[instrument];
                const gainNode = offlineCtx.createGain();
                gainNode.gain.setValueAtTime(vol * 0.85, stepTime);
                src.connect(gainNode);
                gainNode.connect(offlineMaster);
                src.start(stepTime);
            } else {
                renderSynthVoice(offlineCtx, offlineMaster, instrument, stepTime, vol);
            }
        });
    }

    try {
        const renderedBuffer = await offlineCtx.startRendering();
        const wavBlob = bufferToWavWithMetadata(renderedBuffer);
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'beat que fiz no site do frater.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1500);

        if (status) status.textContent = 'WAV exportado com sucesso!';
    } catch (err) {
        console.error('Failed to render WAV:', err);
        if (status) status.textContent = 'Erro ao exportar beat em WAV.';
    }
}

function bufferToWavWithMetadata(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;

    const result = numOfChan === 2
        ? interleave(buffer.getChannelData(0), buffer.getChannelData(1))
        : buffer.getChannelData(0);

    const tags = [
        { type: 'ISFT', value: 'frateroutis.github.io - DRUM TOy' },
        { type: 'IART', value: 'Frater Outis' },
        { type: 'ICMT', value: 'Criado em frateroutis.github.io' }
    ];

    let listSize = 4;
    const encodedTags = tags.map(t => {
        let val = `${t.value}\0`;
        if (val.length % 2 !== 0) val += '\0';
        listSize += 8 + val.length;
        return { type: t.type, val };
    });

    const dataSize = result.length * 2;
    const headerSize = 44;
    const totalSize = headerSize + dataSize + 8 + listSize;

    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    for (let i = 0; i < 4; i++) view.setUint8(i, 'RIFF'.charCodeAt(i));
    view.setUint32(4, totalSize - 8, true);
    for (let i = 0; i < 4; i++) view.setUint8(8 + i, 'WAVE'.charCodeAt(i));

    for (let i = 0; i < 4; i++) view.setUint8(12 + i, 'fmt '.charCodeAt(i));
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChan * (bitDepth / 8), true);
    view.setUint16(32, numOfChan * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);

    for (let i = 0; i < 4; i++) view.setUint8(36 + i, 'data'.charCodeAt(i));
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < result.length; i++) {
        const s = Math.max(-1, Math.min(1, result[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
    }

    for (let i = 0; i < 4; i++) view.setUint8(offset + i, 'LIST'.charCodeAt(i));
    view.setUint32(offset + 4, listSize, true);
    for (let i = 0; i < 4; i++) view.setUint8(offset + 8 + i, 'INFO'.charCodeAt(i));
    offset += 12;

    encodedTags.forEach(t => {
        for (let i = 0; i < 4; i++) view.setUint8(offset + i, t.type.charCodeAt(i));
        view.setUint32(offset + 4, t.val.length, true);
        for (let i = 0; i < t.val.length; i++) view.setUint8(offset + 8 + i, t.val.charCodeAt(i));
        offset += 8 + t.val.length;
    });

    return new Blob([view], { type: 'audio/wav' });
}

function interleave(inputL, inputR) {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;

    while (index < length) {
        result[index++] = inputL[inputIndex];
        result[index++] = inputR[inputIndex];
        inputIndex++;
    }
    return result;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        computeBpmMetrics,
        computeStepSwingOffsetSec,
        interleave,
        DRUM_PRESETS
    };
}
