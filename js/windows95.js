// Windows 95 Music Interface
// Data is loaded from desktop-data.json - no hardcoded duplicates

let desktopData = null;
let folderStructure = {};
let currentFolder = null;
let currentPath = [];

// Load desktop data from JSON
async function loadDesktopData() {
    try {
        const response = await fetch('/musica/desktop-data.json');
        desktopData = await response.json();
        
        // Transform JSON structure to folderStructure format
        desktopData.folders.forEach(folder => {
            folderStructure[folder.id] = {
                name: folder.name,
                icon: folder.icon,
                description: folder.description,
                items: folder.files.map(file => ({
                    name: file.name,
                    url: file.link,
                    icon: file.icon
                }))
            };
        });
    } catch (error) {
        console.error('Failed to load desktop data:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDesktopData().then(() => {
        initializeTransition();
        loadIconPositions();
        initializeEventListeners();
        updateClock(); // Update immediately on load
        setInterval(updateClock, 1000);
    });
});

// Transition animation
function initializeTransition() {
    const overlay = document.getElementById('transitionOverlay');
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 1250);
}

// Update clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

// Event listeners
function initializeEventListeners() {
    // Folder icons
    document.querySelectorAll('.folder-icon').forEach(icon => {
        const folderId = icon.dataset.folder;
        const folder = folderStructure[folderId];
        if (folder && folder.description) {
            icon.title = folder.description;
        }
        icon.addEventListener('click', openFolder);
        icon.addEventListener('dblclick', openFolder);
        setupDragAndDrop(icon);
    });

    // App icons
    document.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('click', handleAppDoubleClick);
        icon.addEventListener('dblclick', handleAppDoubleClick);
        setupDragAndDrop(icon);
    });

    // Home icon
    document.getElementById('homeIcon').addEventListener('click', goHome);
    document.getElementById('homeIcon').addEventListener('dblclick', goHome);
    setupDragAndDrop(document.getElementById('homeIcon'));

    // Start menu items
    document.querySelectorAll('.start-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const folder = e.target.closest('.start-menu-item').dataset.folder;
            openFolderFromMenu(folder);
            closeStartMenu();
        });
    });

    // Start menu favorites (applications)
    document.querySelectorAll('.start-menu-favorite').forEach(item => {
        item.addEventListener('click', (e) => {
            const appId = e.target.closest('.start-menu-favorite').dataset.app;
            launchAppFromMenu(appId);
            closeStartMenu();
        });
    });

    // Start button
    document.querySelector('.start-button').addEventListener('click', toggleStartMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const startMenu = document.getElementById('startMenu');
        const startButton = document.querySelector('.start-button');
        if (!startMenu.classList.contains('hidden') && 
            !startMenu.contains(e.target) && 
            !startButton.contains(e.target)) {
            closeStartMenu();
        }
    });

    // Close button
    document.querySelector('.close-btn').addEventListener('click', closeFolder);

    // Back button
    document.querySelector('.back-btn').addEventListener('click', goBack);

    // Window controls
    document.querySelector('.minimize-btn').addEventListener('click', minimizeWindow);
    document.querySelector('.maximize-btn').addEventListener('click', maximizeWindow);
}

// Open folder from menu (direct call, no event)
function openFolderFromMenu(folderKey) {
    if (currentFolder) {
        // Deselect previous
        document.querySelectorAll('.folder-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    const folderIcon = document.querySelector(`.folder-icon[data-folder="${folderKey}"]`);
    if (folderIcon) {
        folderIcon.classList.add('selected');
    }
    
    currentFolder = folderKey;
    currentPath = [folderKey];

    const window = document.getElementById('folderWindow');
    window.classList.remove('hidden');

    populateFolderContents(folderKey);
    updateWindowTitle();
    updateAddressBar();
    updateStatus();
}

// Open folder
function openFolder(e) {
    const folder = e.target.closest('.folder-icon').dataset.folder;
    
    if (currentFolder) {
        // Deselect previous
        document.querySelectorAll('.folder-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    e.target.closest('.folder-icon').classList.add('selected');
    
    currentFolder = folder;
    currentPath = [folder];

    const window = document.getElementById('folderWindow');
    window.classList.remove('hidden');

    populateFolderContents(folder);
    updateWindowTitle();
    updateAddressBar();
    updateStatus();
}

// Populate folder contents
function populateFolderContents(folderKey) {
    const folder = folderStructure[folderKey];
    const contents = document.getElementById('folderContents');
    contents.innerHTML = '';

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

// Select item
function selectItem(element, item) {
    document.querySelectorAll('.file-item').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.add('selected');
    updateStatus(`Selected: ${item.name}`);
}

// Open item
function openItem(item) {
    if (item.url && item.url !== '#') {
        window.open(item.url, '_blank');
    } else {
        showAlert(`"${item.name}" cannot be executed or opened.`);
    }
    updateStatus(`Opened: ${item.name}`);
}

// Close folder
function closeFolder() {
    const window = document.getElementById('folderWindow');
    window.classList.add('hidden');
    document.querySelectorAll('.folder-icon').forEach(icon => {
        icon.classList.remove('selected');
    });
    currentFolder = null;
    currentPath = [];
    updateStatus('Ready');
}

// Go back
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

// Update window title
function updateWindowTitle() {
    const titles = currentPath.map(path => folderStructure[path]?.name || path);
    document.getElementById('windowTitle').textContent = titles.join(' > ');
}

// Update address bar
function updateAddressBar() {
    const path = currentPath.map(path => folderStructure[path]?.name || path).join('\\');
    document.querySelector('.address-bar').value = `C:\\Music\\${path}`;
}

// Update status
function updateStatus(text = 'Ready') {
    document.getElementById('statusText').textContent = text;
}

// Minimize window
function minimizeWindow() {
    const window = document.getElementById('folderWindow');
    window.style.display = 'none';
    // In a real implementation, this would create a taskbar button
}

// Maximize window
function maximizeWindow() {
    const window = document.getElementById('folderWindow');
    window.style.width = 'calc(100% - 20px)';
    window.style.height = 'calc(100% - 52px)';
    window.style.top = '10px';
    window.style.left = '10px';
    window.style.transform = 'none';
}

// Show alert
function showAlert(message) {
    alert(message);
}

// Toggle Start Menu
function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.classList.toggle('hidden');
}

// Close Start Menu
function closeStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.classList.add('hidden');
}

// Go Home
function goHome() {
    window.location.href = '/';
}

// Drag and Drop functionality
let draggedElement = null;

function setupDragAndDrop(element) {
    element.draggable = true;
    
    element.addEventListener('dragstart', (e) => {
        draggedElement = element;
        element.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });
    
    element.addEventListener('dragend', (e) => {
        element.classList.remove('dragging');
        draggedElement = null;
    });
}

// Allow drop in desktop content area
document.addEventListener('dragover', (e) => {
    const desktopContent = document.querySelector('.desktop-content');
    if (draggedElement && desktopContent.contains(e.target) || e.target === desktopContent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
});

document.addEventListener('drop', (e) => {
    if (draggedElement) {
        const rect = draggedElement.getBoundingClientRect();
        const desktopContent = document.querySelector('.desktop-content');
        const desktopRect = desktopContent.getBoundingClientRect();
        
        // Calculate position relative to desktop content
        const x = e.clientX - desktopRect.left;
        const y = e.clientY - desktopRect.top;
        
        // Set absolute position within grid
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = Math.max(0, x) + 'px';
        draggedElement.style.top = Math.max(0, y) + 'px';
        
        // Save position to localStorage
        saveIconPosition(draggedElement);
    }
});

// Save icon position to localStorage
function saveIconPosition(element) {
    const id = element.id || element.dataset.folder;
    const positions = JSON.parse(localStorage.getItem('iconPositions') || '{}');
    positions[id] = {
        left: element.style.left,
        top: element.style.top
    };
    localStorage.setItem('iconPositions', JSON.stringify(positions));
}

// Load saved icon positions
function loadIconPositions() {
    const positions = JSON.parse(localStorage.getItem('iconPositions') || '{}');
    
    document.querySelectorAll('.folder-icon, .home-icon, .app-icon').forEach(icon => {
        const id = icon.id || icon.dataset.folder || icon.dataset.app;
        if (positions[id]) {
            icon.style.position = 'absolute';
            icon.style.left = positions[id].left;
            icon.style.top = positions[id].top;
        }
    });
}

// Handle app click
// Handle app double click (launch application)
function handleAppDoubleClick(e) {
    const app = e.target.closest('.app-icon');
    const appType = app.dataset.app;
    
    if (appType === 'minesweeper') {
        launchMinesweeper();
    } else if (appType === 'bpm') {
        launchBpmTapper();
    } else if (appType === 'drumtoy') {
        launchDrumToy();
    }
}

// Launch app from menu (direct call, no event)
function launchAppFromMenu(appId) {
    if (appId === 'minesweeper') {
        launchMinesweeper();
    } else if (appId === 'bpm') {
        launchBpmTapper();
    } else if (appId === 'drumtoy') {
        launchDrumToy();
    }
}

// Launch Minesweeper
function launchMinesweeper() {
    document.getElementById('minesweeperWindow').classList.remove('hidden');
    initializeMinesweeper();
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

function initializeMinesweeper() {
    if (board.length > 0) return;
    
    createBoard();
    renderBoard();
    setupMinesweeperEvents();
}

function createBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    revealed = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    flagged = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    
    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);
        
        if (board[r][c] !== 'M') {
            board[r][c] = 'M';
            minesPlaced++;
        }
    }
    
    // Calculate numbers
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

function setupMinesweeperEvents() {
    document.getElementById('minesweeperGrid').addEventListener('click', handleCellClick);
    document.getElementById('minesweeperGrid').addEventListener('contextmenu', handleRightClick);
    document.getElementById('newGameBtn').addEventListener('click', resetMinesweeper);
    document.querySelector('.close-btn-minesweeper').addEventListener('click', closeMinesweeper);
}

function handleCellClick(e) {
    const cell = e.target.closest('.minesweeper-cell');
    if (!cell || gameOver || gameWon) return;
    
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
        updateStatus('Jogo iniciado!');
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
    
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    
    if (!revealed[r][c]) {
        flagged[r][c] = !flagged[r][c];
        const minesLeft = MINES - flagged.flat().filter(f => f).length;
        document.getElementById('mineCount').textContent = Math.max(0, minesLeft);
        renderBoard();
    }
}

function revealCell(r, c) {
    if (revealed[r][c]) return;
    
    revealed[r][c] = true;
    
    if (board[r][c] === 'M') {
        revealAllMines();
        gameOver = true;
        updateStatus('💥 Perdeu! Clique em "Novo Jogo" para jogar novamente.');
        stopTimer();
        return;
    }
    
    if (board[r][c] === 0) {
        // Reveal adjacent cells
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
            if (board[r][c] === 'M') {
                revealed[r][c] = true;
            }
        }
    }
}

function checkGameState() {
    let revealedCount = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (revealed[r][c] && board[r][c] !== 'M') {
                revealedCount++;
            }
        }
    }
    
    if (revealedCount === ROWS * COLS - MINES) {
        gameWon = true;
        updateStatus('🎉 Ganhou! Parabéns!');
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
    document.getElementById('timer').textContent = '0';
    document.getElementById('mineCount').textContent = MINES;
    stopTimer();
    updateStatus('Clique em uma célula para começar');
    createBoard();
    renderBoard();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = timer;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

function updateStatus(msg) {
    document.getElementById('gameStatus').textContent = msg;
}

function closeMinesweeper() {
    document.getElementById('minesweeperWindow').classList.add('hidden');
    stopTimer();
}

// ========== BPM TAPPER ==========

let bpmTaps = [];
let bpmTimeout = null;

function launchBpmTapper() {
    document.getElementById('bpmWindow').classList.remove('hidden');
    initializeBpmTapper();
}

function initializeBpmTapper() {
    document.getElementById('bpmButton').addEventListener('click', handleBpmTap);
    document.getElementById('resetBpmBtn').addEventListener('click', resetBpm);
    document.querySelector('.close-btn-bpm').addEventListener('click', closeBpmTapper);
}

function handleBpmTap() {
    const now = Date.now();
    bpmTaps.push(now);
    
    // Keep only the last 10 taps
    if (bpmTaps.length > 10) {
        bpmTaps.shift();
    }
    
    // Clear existing timeout
    if (bpmTimeout) clearTimeout(bpmTimeout);
    
    // Calculate BPM if we have at least 2 taps
    if (bpmTaps.length >= 2) {
        calculateBpm();
    } else {
        document.getElementById('bpmInfo').textContent = `${bpmTaps.length} clique${bpmTaps.length > 1 ? 's' : ''}...`;
        document.getElementById('bpmStatus').textContent = 'Continue clicando...';
    }
    
    // Reset taps after 3 seconds of inactivity
    bpmTimeout = setTimeout(() => {
        if (bpmTaps.length > 0 && bpmTaps.length < 2) {
            resetBpm();
        }
    }, 3000);
}

function calculateBpm() {
    if (bpmTaps.length < 2) return;
    
    // Calculate average time between taps
    let totalDiff = 0;
    for (let i = 1; i < bpmTaps.length; i++) {
        totalDiff += bpmTaps[i] - bpmTaps[i - 1];
    }
    
    const avgTimeBetweenTaps = totalDiff / (bpmTaps.length - 1);
    const bpm = Math.round(60000 / avgTimeBetweenTaps);
    
    document.getElementById('bpmValue').textContent = bpm;
    document.getElementById('bpmInfo').textContent = `${bpmTaps.length} clique${bpmTaps.length > 1 ? 's' : ''} - ${(avgTimeBetweenTaps / 1000).toFixed(2)}s de intervalo`;
    document.getElementById('bpmStatus').textContent = `BPM: ${bpm}`;
}

function resetBpm() {
    bpmTaps = [];
    document.getElementById('bpmValue').textContent = '--';
    document.getElementById('bpmInfo').textContent = 'Clique para começar...';
    document.getElementById('bpmStatus').textContent = 'Pronto';
    
    if (bpmTimeout) clearTimeout(bpmTimeout);
}

function closeBpmTapper() {
    document.getElementById('bpmWindow').classList.add('hidden');
    resetBpm();
}

// ========== DRUM TOY SEQUENCER ENGINE ==========

let drumToyWindowInitialized = false;
let audioCtx = null;
let isPlaying = false;
let bpm = 120;
let currentStep = 0;
let schedulerIntervalId = null;
let nextStepTime = 0.0;
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (seconds)
const lookahead = 25.0; // How frequently to call scheduler function (ms)

// Step sequencer data: 7 channels x 16 steps
const sequencerData = {
    '808': Array(16).fill(false),
    kick: Array(16).fill(false),
    snap: Array(16).fill(false),
    snare: Array(16).fill(false),
    clap: Array(16).fill(false),
    hihat_closed: Array(16).fill(false),
    hihat_open: Array(16).fill(false)
};

// Volume levels (0.0 to 1.0)
const channelVolumes = {
    '808': 0.8,
    kick: 0.8,
    snap: 0.7,
    snare: 0.7,
    clap: 0.7,
    hihat_closed: 0.6,
    hihat_open: 0.6
};

// Sample buffers (decoded audio files)
const sampleBuffers = {
    '808': null,
    kick: null,
    snap: null,
    snare: null,
    clap: null,
    hihat_closed: null,
    hihat_open: null
};

// Try to pre-load samples
async function loadDrumSamples() {
    const samples = {
        '808': '/assets/drumtoy/808.wav',
        kick: '/assets/drumtoy/kick.wav',
        snap: '/assets/drumtoy/snap.wav',
        snare: '/assets/drumtoy/snare.wav',
        clap: '/assets/drumtoy/clap.wav',
        hihat_closed: '/assets/drumtoy/hihat_closed.wav',
        hihat_open: '/assets/drumtoy/hihat_open.wav'
    };

    for (const [key, url] of Object.entries(samples)) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            if (audioCtx) {
                audioCtx.decodeAudioData(arrayBuffer, (decodedBuffer) => {
                    sampleBuffers[key] = decodedBuffer;
                    console.log(`DrumToy: loaded sample for ${key}`);
                }, (e) => console.warn(`DrumToy: failed to decode ${key}:`, e));
            }
        } catch (err) {
            // Silently fail and fallback to synthesis!
            console.log(`DrumToy: using synthesized sound for ${key} (sample fetch failed or not present)`);
        }
    }
}

// Synthesis fallbacks using Web Audio API
function playSynthesizedSound(type, time) {
    if (!audioCtx) return;
    
    const vol = channelVolumes[type] || 0.7;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.5, time); // master gain attenuation to prevent clipping
    masterGain.connect(audioCtx.destination);

    if (type === '808') {
        // fat 808 sub bass/kick
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, time);
        // Fast pitch envelope drop
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);
        osc.frequency.setValueAtTime(0.01, time + 0.35);
        
        gain.gain.setValueAtTime(1.0, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(time);
        osc.stop(time + 0.55);
    } 
    else if (type === 'kick') {
        // punchy acoustic/electro kick drum
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.08); // quick pitch drop
        
        gain.gain.setValueAtTime(1.0, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(time);
        osc.stop(time + 0.15);
    }
    else if (type === 'snap') {
        // crisp snap (high-passed noise with steep decay)
        const bufferSize = audioCtx.sampleRate * 0.1; // 0.1 seconds
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, time);
        filter.Q.setValueAtTime(3, time);
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.8, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        noise.start(time);
        noise.stop(time + 0.1);
    } 
    else if (type === 'snare') {
        // snare drum: punchy triangle osc + noise rattle
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, time);
        osc.frequency.exponentialRampToValueAtTime(100, time + 0.08);
        
        oscGain.gain.setValueAtTime(0.7, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        
        // noise component
        const bufferSize = audioCtx.sampleRate * 0.2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, time);
        
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.8, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);
        
        osc.start(time);
        osc.stop(time + 0.15);
        
        noise.start(time);
        noise.stop(time + 0.2);
    }
    else if (type === 'clap') {
        // realistic multi-pulse clap
        const bufferSize = audioCtx.sampleRate * 0.25; // 0.25 seconds
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, time);
        filter.Q.setValueAtTime(2, time);
        
        const gain = audioCtx.createGain();
        // FL Studio style clap: 3 quick pre-bursts of noise, then a main body
        const now = time;
        gain.gain.setValueAtTime(0.0, now);
        // Pulse 1
        gain.gain.linearRampToValueAtTime(0.4, now + 0.005);
        gain.gain.linearRampToValueAtTime(0.0, now + 0.010);
        // Pulse 2
        gain.gain.linearRampToValueAtTime(0.5, now + 0.015);
        gain.gain.linearRampToValueAtTime(0.0, now + 0.020);
        // Pulse 3
        gain.gain.linearRampToValueAtTime(0.6, now + 0.025);
        gain.gain.linearRampToValueAtTime(0.0, now + 0.030);
        // Main hit & decay
        gain.gain.linearRampToValueAtTime(0.9, now + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        noise.start(time);
        noise.stop(time + 0.25);
    } 
    else if (type === 'hihat_closed') {
        // closed metal hihat
        const bufferSize = audioCtx.sampleRate * 0.05;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(8000, time);
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.6, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        noise.start(time);
        noise.stop(time + 0.05);
    }
    else if (type === 'hihat_open') {
        // open metal hihat
        const bufferSize = audioCtx.sampleRate * 0.3;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(6500, time);
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        noise.start(time);
        noise.stop(time + 0.3);
    }
}

// Play sample or synthesized sound
function playDrumSound(type, time) {
    if (sampleBuffers[type]) {
        // Play sample buffer
        const playTime = time || (audioCtx ? audioCtx.currentTime : 0);
        const bufferSource = audioCtx.createBufferSource();
        bufferSource.buffer = sampleBuffers[type];
        
        const vol = channelVolumes[type] || 0.8;
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(vol, playTime);
        
        bufferSource.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        bufferSource.start(playTime);
    } else {
        // Fallback to synthesis
        playSynthesizedSound(type, time);
    }
}

// Scheduler loop
function scheduler() {
    if (!audioCtx) return;
    
    // While there are notes to play before the next interval
    while (nextStepTime < audioCtx.currentTime + scheduleAheadTime) {
        scheduleNextStep(currentStep, nextStepTime);
        advanceStep();
    }
}

function scheduleNextStep(step, time) {
    // Play active steps
    for (const [instrument, steps] of Object.entries(sequencerData)) {
        if (steps[step]) {
            playDrumSound(instrument, time);
        }
    }
    
    // UI playhead indicator updates must be synchronized with animation frames
    // We pass the playhead time to schedule a visual class update
    const secondsPerStep = 60.0 / bpm / 4.0; // 16th notes
    const delayMs = (time - audioCtx.currentTime) * 1000;
    
    setTimeout(() => {
        if (!isPlaying) return;
        updatePlayheadUI(step);
    }, Math.max(0, delayMs));
}

function advanceStep() {
    const secondsPerStep = 60.0 / bpm / 4.0; // 16th notes
    nextStepTime += secondsPerStep;
    
    currentStep = (currentStep + 1) % 16;
}

function updatePlayheadUI(step) {
    // Remove "playing" class from all pads
    document.querySelectorAll('.step-pad').forEach(pad => {
        pad.classList.remove('playing');
    });
    
    // Add "playing" class to the pads of the current step
    document.querySelectorAll(`.step-pad[data-step="${step}"]`).forEach(pad => {
        pad.classList.add('playing');
    });
    
    // Update statusbar step text
    const status = document.getElementById('drumToyStatus');
    if (status) {
        status.textContent = `Tocando a ${bpm} BPM - Passo ${step + 1}/16`;
    }
}

// Launch Drum Toy
function launchDrumToy() {
    const windowEl = document.getElementById('drumToyWindow');
    windowEl.classList.remove('hidden');
    initializeDrumToy();
}

// Initialize Drum Toy UI & Events
function initializeDrumToy() {
    if (drumToyWindowInitialized) return;
    
    // Add click listener to step pads to toggle active state
    document.querySelectorAll('.step-pad').forEach(pad => {
        pad.addEventListener('click', (e) => {
            const channelRow = e.target.closest('.channel-row');
            const channel = channelRow.dataset.channel;
            const step = parseInt(e.target.dataset.step);
            
            // Toggle step state
            sequencerData[channel][step] = !sequencerData[channel][step];
            e.target.classList.toggle('active', sequencerData[channel][step]);
            
            // Resume AudioContext on user interaction just in case
            initAudioContext();
            
            // Play preview sound immediately on pad activation
            if (sequencerData[channel][step]) {
                playDrumSound(channel);
            }
        });
    });
    
    // Knobs (volumes)
    document.querySelectorAll('.channel-volume').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const channelRow = e.target.closest('.channel-row');
            const channel = channelRow.dataset.channel;
            channelVolumes[channel] = parseFloat(e.target.value);
        });
    });
    
    // Transport controls
    document.getElementById('drumToyPlayBtn').addEventListener('click', startSequencer);
    document.getElementById('drumToyStopBtn').addEventListener('click', stopSequencer);
    document.getElementById('drumToyResetBtn').addEventListener('click', resetSequencer);
    document.getElementById('drumToyDemoBtn').addEventListener('click', loadDemoBeat);
    document.getElementById('drumToyExportBtn').addEventListener('click', exportToWav);
    
    // BPM adjustment
    const bpmInput = document.getElementById('drumToyBpm');
    bpmInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 120;
        val = Math.max(60, Math.min(240, val));
        bpm = val;
        e.target.value = val;
    });
    
    document.getElementById('drumToyBpmMinus').addEventListener('click', () => {
        if (bpm > 60) {
            bpm--;
            bpmInput.value = bpm;
        }
    });
    
    document.getElementById('drumToyBpmPlus').addEventListener('click', () => {
        if (bpm < 240) {
            bpm++;
            bpmInput.value = bpm;
        }
    });
    
    // Close button
    document.querySelector('.close-btn-drumtoy').addEventListener('click', closeDrumToy);
    
    drumToyWindowInitialized = true;
}

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // Start loading drum samples asynchronously
        loadDrumSamples();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Sequencer control actions
function startSequencer() {
    initAudioContext();
    
    if (isPlaying) return;
    
    isPlaying = true;
    currentStep = 0;
    nextStepTime = audioCtx.currentTime;
    
    // Update play button text to show pause state or keep it retro
    document.getElementById('drumToyPlayBtn').textContent = '⏸ Pause';
    document.getElementById('drumToyPlayBtn').classList.add('selected');
    
    // Launch scheduler
    schedulerIntervalId = setInterval(scheduler, lookahead);
}

function stopSequencer() {
    if (!isPlaying) {
        // If already paused/stopped, reset to step 0
        currentStep = 0;
        updatePlayheadUI(0);
        document.querySelectorAll('.step-pad').forEach(pad => pad.classList.remove('playing'));
        return;
    }
    
    isPlaying = false;
    if (schedulerIntervalId) {
        clearInterval(schedulerIntervalId);
        schedulerIntervalId = null;
    }
    
    document.getElementById('drumToyPlayBtn').textContent = '▶ Play';
    document.getElementById('drumToyPlayBtn').classList.remove('selected');
    
    const status = document.getElementById('drumToyStatus');
    if (status) {
        status.textContent = 'Pausado.';
    }
}

function resetSequencer() {
    // Clear all steps
    for (const instrument of Object.keys(sequencerData)) {
        sequencerData[instrument].fill(false);
    }
    
    // Clear step active classes
    document.querySelectorAll('.step-pad').forEach(pad => {
        pad.classList.remove('active');
        pad.classList.remove('playing');
    });
    
    stopSequencer();
    currentStep = 0;
    
    const status = document.getElementById('drumToyStatus');
    if (status) {
        status.textContent = 'Sequência limpa.';
    }
}

function loadDemoBeat() {
    resetSequencer();
    
    // Trap-style beat demo
    // 808 on 1, 9, 11 (steps 0, 8, 10)
    sequencerData['808'][0] = true;
    sequencerData['808'][8] = true;
    sequencerData['808'][11] = true;
    
    // Kick on 1 (step 0) and 9 (step 8)
    sequencerData.kick[0] = true;
    sequencerData.kick[8] = true;
    
    // Snare on 5, 13 (steps 4, 12)
    sequencerData.snare[4] = true;
    sequencerData.snare[12] = true;
    
    // Clap on 13 (step 12 - layered) and 16 (step 15)
    sequencerData.clap[12] = true;
    sequencerData.clap[15] = true;
    
    // Snap on 4, 12 (steps 3, 11)
    sequencerData.snap[3] = true;
    sequencerData.snap[11] = true;
    
    // Hi-hat closed on odd beats
    for (let i = 0; i < 16; i += 2) {
        sequencerData.hihat_closed[i] = true;
    }
    
    // Hi-hat open on steps 6 and 14
    sequencerData.hihat_open[6] = true;
    sequencerData.hihat_open[14] = true;
    
    // Sync to UI
    for (const [instrument, steps] of Object.entries(sequencerData)) {
        steps.forEach((active, step) => {
            if (active) {
                const pad = document.querySelector(`.channel-row[data-channel="${instrument}"] .step-pad[data-step="${step}"]`);
                if (pad) pad.classList.add('active');
            }
        });
    }
    
    const status = document.getElementById('drumToyStatus');
    if (status) {
        status.textContent = 'Batida Demo carregada! Clique em Play.';
    }
}

function closeDrumToy() {
    stopSequencer();
    document.getElementById('drumToyWindow').classList.add('hidden');
}

// WAV Export with metadata (frateroutis.github.io)
async function exportToWav() {
    // Calculate duration
    const secondsPerStep = 60.0 / bpm / 4.0;
    const totalBarDuration = 16 * secondsPerStep;
    const renderDuration = totalBarDuration + 1.0; // 1s tail for release
    const sampleRate = 44100;
    const numChannels = 2; // Stereo
    
    // Create OfflineAudioContext
    const offlineCtx = new OfflineAudioContext(numChannels, sampleRate * renderDuration, sampleRate);
    
    // Set up master gain in offline context
    const masterGain = offlineCtx.createGain();
    masterGain.gain.setValueAtTime(0.5, 0); // master gain attenuation to prevent clipping
    masterGain.connect(offlineCtx.destination);
    
    // Schedule all active steps
    for (const [instrument, steps] of Object.entries(sequencerData)) {
        steps.forEach((active, step) => {
            if (active) {
                const stepTime = step * secondsPerStep;
                
                if (sampleBuffers[instrument]) {
                    // Play sample buffer
                    const bufferSource = offlineCtx.createBufferSource();
                    bufferSource.buffer = sampleBuffers[instrument];
                    
                    const vol = channelVolumes[instrument] || 0.8;
                    const gainNode = offlineCtx.createGain();
                    gainNode.gain.setValueAtTime(vol, stepTime);
                    
                    bufferSource.connect(gainNode);
                    gainNode.connect(masterGain);
                    bufferSource.start(stepTime);
                } else {
                    // Play synthesized fallback in offline context
                    playOfflineSynthesizedSound(offlineCtx, masterGain, instrument, stepTime);
                }
            }
        });
    }
    
    const status = document.getElementById('drumToyStatus');
    if (status) {
        status.textContent = 'Renderizando batida retro em WAV...';
    }
    
    try {
        const renderedBuffer = await offlineCtx.startRendering();
        
        // Encode to WAV with Metadata
        const wavBlob = bufferToWavWithMetadata(renderedBuffer);
        
        // Trigger download
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'beat que fiz no site do frater.wav';
        a.click();
        
        if (status) {
            status.textContent = 'WAV exportado e baixado com sucesso!';
        }
    } catch (err) {
        console.error('Failed to render WAV:', err);
        if (status) {
            status.textContent = 'Erro ao exportar batida em WAV.';
        }
    }
}

// Play offline synthesized sounds for offline context
function playOfflineSynthesizedSound(ctx, destination, type, time) {
    const vol = channelVolumes[type] || 0.7;
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(vol * 0.5, time); // voice level attenuation
    voiceGain.connect(destination);

    if (type === '808') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);
        osc.frequency.setValueAtTime(0.01, time + 0.35);
        
        gain.gain.setValueAtTime(1.0, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
        
        osc.connect(gain);
        gain.connect(voiceGain);
        
        osc.start(time);
        osc.stop(time + 0.55);
    } 
    else if (type === 'kick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.08);
        
        gain.gain.setValueAtTime(1.0, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
        
        osc.connect(gain);
        gain.connect(voiceGain);
        
        osc.start(time);
        osc.stop(time + 0.15);
    }
    else if (type === 'snap') {
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, time);
        filter.Q.setValueAtTime(3, time);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.8, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(voiceGain);
        
        noise.start(time);
        noise.stop(time + 0.1);
    } 
    else if (type === 'snare') {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, time);
        osc.frequency.exponentialRampToValueAtTime(100, time + 0.08);
        
        oscGain.gain.setValueAtTime(0.7, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        osc.connect(oscGain);
        oscGain.connect(voiceGain);
        
        const bufferSize = ctx.sampleRate * 0.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, time);
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.8, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(voiceGain);
        
        osc.start(time);
        osc.stop(time + 0.15);
        
        noise.start(time);
        noise.stop(time + 0.2);
    }
    else if (type === 'clap') {
        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, time);
        filter.Q.setValueAtTime(2, time);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(0.4, time + 0.005);
        gain.gain.linearRampToValueAtTime(0.0, time + 0.010);
        gain.gain.linearRampToValueAtTime(0.5, time + 0.015);
        gain.gain.linearRampToValueAtTime(0.0, time + 0.020);
        gain.gain.linearRampToValueAtTime(0.6, time + 0.025);
        gain.gain.linearRampToValueAtTime(0.0, time + 0.030);
        gain.gain.linearRampToValueAtTime(0.9, time + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(voiceGain);
        
        noise.start(time);
        noise.stop(time + 0.25);
    } 
    else if (type === 'hihat_closed') {
        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(8000, time);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.6, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(voiceGain);
        
        noise.start(time);
        noise.stop(time + 0.05);
    }
    else if (type === 'hihat_open') {
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(6500, time);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(voiceGain);
        
        noise.start(time);
        noise.stop(time + 0.3);
    }
}

// Encode rendered AudioBuffer to 16-bit stereo PCM WAV with RIFF LIST INFO metadata
function bufferToWavWithMetadata(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // 16-bit PCM
    const bitDepth = 16;
    
    let result;
    if (numOfChan === 2) {
        result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
        result = buffer.getChannelData(0);
    }
    
    const tags = [
        { type: 'ISFT', value: 'frateroutis.github.io - DRUM TOy' },
        { type: 'IART', value: 'Frater Outis' },
        { type: 'ICMT', value: 'Criado em frateroutis.github.io' }
    ];
    
    let listSize = 4; // for 'INFO'
    const encodedTags = tags.map(t => {
        let val = t.value + '\0';
        if (val.length % 2 !== 0) val += '\0'; // pad even length
        listSize += 8 + val.length;
        return { type: t.type, val: val };
    });
    
    const dataSize = result.length * 2;
    const headerSize = 44;
    const totalSize = headerSize + dataSize + 8 + listSize;
    
    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);
    
    // Write RIFF identifier
    for (let i = 0; i < 4; i++) {
        view.setUint8(i, 'RIFF'.charCodeAt(i));
    }
    view.setUint32(4, totalSize - 8, true);
    for (let i = 0; i < 4; i++) {
        view.setUint8(8 + i, 'WAVE'.charCodeAt(i));
    }
    
    // Write fmt chunk
    for (let i = 0; i < 4; i++) {
        view.setUint8(12 + i, 'fmt '.charCodeAt(i));
    }
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChan * (bitDepth / 8), true);
    view.setUint16(32, numOfChan * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    
    // Write data chunk
    for (let i = 0; i < 4; i++) {
        view.setUint8(36 + i, 'data'.charCodeAt(i));
    }
    view.setUint32(40, dataSize, true);
    
    // Write audio PCM data
    let offset = 44;
    for (let i = 0; i < result.length; i++) {
        let s = Math.max(-1, Math.min(1, result[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
    }
    
    // Write LIST INFO metadata chunk
    for (let i = 0; i < 4; i++) {
        view.setUint8(offset + i, 'LIST'.charCodeAt(i));
    }
    view.setUint32(offset + 4, listSize, true);
    for (let i = 0; i < 4; i++) {
        view.setUint8(offset + 8 + i, 'INFO'.charCodeAt(i));
    }
    offset += 12;
    
    encodedTags.forEach(t => {
        for (let i = 0; i < 4; i++) {
            view.setUint8(offset + i, t.type.charCodeAt(i));
        }
        view.setUint32(offset + 4, t.val.length, true);
        for (let i = 0; i < t.val.length; i++) {
            view.setUint8(offset + 8 + i, t.val.charCodeAt(i));
        }
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
