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
    }
}

// Launch app from menu (direct call, no event)
function launchAppFromMenu(appId) {
    if (appId === 'minesweeper') {
        launchMinesweeper();
    } else if (appId === 'bpm') {
        launchBpmTapper();
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
