window.addEventListener('DOMContentLoaded', () => {

    // ─── Pantalla de selección de modo ────
    const modeScreen   = document.querySelector('#modeScreen');
    const gameScreen   = document.querySelector('#gameScreen');
    const btnVsHuman   = document.querySelector('#btnVsHuman');
    const btnVsBot     = document.querySelector('#btnVsBot');

    let vsBot = false;
    let nombreX = '';
    let nombreO = '';

    btnVsHuman.addEventListener('click', () => {
        vsBot = false;
        nombreX = prompt("Nombre del Jugador X:", "Persona 1") || "Persona 1";
        nombreO = prompt("Nombre del Jugador O:", "Persona 2") || "Persona 2";
        startGame();
    });

    btnVsBot.addEventListener('click', () => {
        vsBot = true;
        nombreX = prompt("Tu nombre (jugas como X):", "Jugador") || "Jugador";
        nombreO = "Bot";
        startGame();
    });

    function startGame() {
        modeScreen.classList.add('hide');
        gameScreen.classList.remove('hide');
        initGame();
    }

    // ─── Referencias al DOM ────────
    const tiles         = Array.from(document.querySelectorAll('.tile'));
    const turnDisplay   = document.querySelector('#turnName');
    const nameXDisplay  = document.querySelector('#nameX');
    const nameODisplay  = document.querySelector('#nameO');
    const attXDisplay   = document.querySelector('#attX');
    const attODisplay   = document.querySelector('#attO');
    const announcer     = document.querySelector('.announcer');
    const resetButton   = document.querySelector('#reset');

    let board         = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive  = true;
    let winsX         = 0;
    let winsO         = 0;

    const winningConditions = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    function initGame() {
        nameXDisplay.innerText = nombreX;
        nameODisplay.innerText = nombreO;
        turnDisplay.innerText  = nombreX;
        turnDisplay.className  = 'display-player playerX';
        attXDisplay.innerText  = '0';
        attODisplay.innerText  = '0';
    }

    // ─── Minimax ──────────────────────────────────────────────────────────────
    function checkWinner(b) {
        for (const [a, c, d] of winningConditions) {
            if (b[a] && b[a] === b[c] && b[c] === b[d]) return b[a];
        }
        return b.includes('') ? null : 'draw';
    }

    function minimax(b, isMaximizing) {
        const result = checkWinner(b);
        if (result === 'O')    return  10;
        if (result === 'X')    return -10;
        if (result === 'draw') return   0;

        if (isMaximizing) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!b[i]) {
                    b[i] = 'O';
                    best = Math.max(best, minimax(b, false));
                    b[i] = '';
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!b[i]) {
                    b[i] = 'X';
                    best = Math.min(best, minimax(b, true));
                    b[i] = '';
                }
            }
            return best;
        }
    }

    function bestBotMove() {
        let bestVal = -Infinity, bestIdx = -1;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'O';
                const val = minimax(board, false);
                board[i] = '';
                if (val > bestVal) { bestVal = val; bestIdx = i; }
            }
        }
        return bestIdx;
    }

    // ─── Lógica del juego ─────────────────────────────────────────────────────
    function handleResultValidation() {
        let roundWon = false;
        for (const cond of winningConditions) {
            const [a, b2, c] = cond;
            if (!board[a] || !board[b2] || !board[c]) continue;
            if (board[a] === board[b2] && board[b2] === board[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            const ganadorReal = (currentPlayer === 'X' ? nombreX : nombreO);
            announce(`¡GANÓ ${ganadorReal.toUpperCase()}!`);
            updateAttempts(currentPlayer);
            isGameActive = false;
            return;
        }

        if (!board.includes('')) {
            announce('¡Empate!');
            isGameActive = false;
            // ← Guardar empate en BD
            const modo = vsBot ? 'vs_bot' : 'vs_humano';
            saveToDatabase(nombreX, nombreO, 'empate', modo);
        }
    }

    // ─── Actualizar marcador y guardar en BD ──────────────────────────────────
    function updateAttempts(player) {
        const modo = vsBot ? 'vs_bot' : 'vs_humano';

        if (player === 'X') {
            winsX++;
            attXDisplay.innerText = winsX;
        } else {
            winsO++;
            attODisplay.innerText = winsO;
        }

        // Enviar resultado completo al servidor
        saveToDatabase(nombreX, nombreO, player, modo);
    }

    function changePlayer() {
        turnDisplay.classList.remove('playerX', 'playerO');
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        turnDisplay.innerText = (currentPlayer === 'X' ? nombreX : nombreO);
        turnDisplay.classList.add(`player${currentPlayer}`);
    }

    const announce = (msg) => {
        announcer.innerHTML = msg;
        announcer.classList.remove('hide');
    };

    function userAction(tile, index) {
        if (!isGameActive || board[index]) return;
        placeMove(index, currentPlayer);
        handleResultValidation();
        if (isGameActive) {
            changePlayer();
            if (vsBot && currentPlayer === 'O') {
                setTimeout(botMove, 400);
            }
        }
    }

    function placeMove(index, player) {
        board[index] = player;
        tiles[index].innerText = player;
        tiles[index].classList.add(`player${player}`);
    }

    function botMove() {
        if (!isGameActive) return;
        const idx = bestBotMove();
        if (idx === -1) return;
        placeMove(idx, 'O');
        handleResultValidation();
        if (isGameActive) changePlayer();
    }

    function resetBoard() {
        board         = ['', '', '', '', '', '', '', '', ''];
        isGameActive  = true;
        announcer.classList.add('hide');
        currentPlayer = 'X';
        turnDisplay.innerText = nombreX;
        turnDisplay.className = 'display-player playerX';
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX', 'playerO');
        });
    }

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});

// ─── Guardar en BD ────────────────────────────────────────────────────────────
// resultado: 'X' | 'O' | 'empate'
// modo:      'vs_humano' | 'vs_bot'
function saveToDatabase(nombreX, nombreO, resultado, modo) {
    fetch('guardar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombreX:   nombreX,
            nombreO:   nombreO,
            resultado: resultado,
            modo:      modo
        })
    })
    .then(res => res.json())
    .then(data => console.log('DB:', data.mensaje))
    .catch(err => console.error('Error al guardar:', err));
}