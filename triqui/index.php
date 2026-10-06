<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Triqui</title>
</head>
<body>
    <main class="background">

        <!-- ░░ PANTALLA DE SELECCIÓN DE MODO ░░ -->
        <section id="modeScreen">
            <h1 class="title-text">Triqui</h1>
            <p class="mode-subtitle">¿Cómo quieres jugar?</p>
            <div class="mode-buttons">
                <button id="btnVsHuman" class="mode-btn">
                    <span class="mode-label">Vs Humano</span>
                    <span class="mode-desc">2 jugadores</span>
                </button>
                <button id="btnVsBot" class="mode-btn">
                    <span class="mode-label">Vs Bot</span>
                    <span class="mode-desc">Difícil</span>
                </button>
            </div>
        </section>

        <!-- ░░ PANTALLA DE JUEGO ░░ -->
        <section id="gameScreen" class="hide">

            <h1 class="title-text">Triqui</h1>

            <!-- Marcador: partidas jugadas contra el bot -->
            <section class="score-board">
                <div class="score-col">
                    <span id="nameX" class="score-name">X</span>
                    <span class="score-label">victorias</span>
                    <span id="attX" class="score-val playerX">0</span>
                </div>
                <div class="score-divider">VS</div>
                <div class="score-col">
                    <span id="nameO" class="score-name">O</span>
                    <span class="score-label">victorias</span>
                    <span id="attO" class="score-val playerO">0</span>
                </div>
            </section>

            <!-- Turno actual -->
            <section class="display">
                Turno de: <span class="display-player playerX" id="turnName">Cargando...</span>
            </section>

            <!-- Tablero -->
            <section class="container">
                <div class="tile"></div><div class="tile"></div><div class="tile"></div>
                <div class="tile"></div><div class="tile"></div><div class="tile"></div>
                <div class="tile"></div><div class="tile"></div><div class="tile"></div>
            </section>

            <section class="announcer hide"></section>

            <section class="controls">
                <button id="reset">Reiniciar Partida</button>
            </section>

        </section>

    </main>
    <script src="./index.js"></script>
</body>
</html>