USE triqui;

DROP TABLE IF EXISTS partidas;
DROP TABLE IF EXISTS jugadores;
DROP VIEW  IF EXISTS ranking;

CREATE TABLE IF NOT EXISTS partidas (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    jugador1     VARCHAR(50) NOT NULL,                    
    jugador2     VARCHAR(50) NOT NULL,                    
    es_bot       TINYINT(1)  NOT NULL DEFAULT 0,          
    ganador      VARCHAR(50) DEFAULT NULL,                
    resultado    ENUM('X', 'O', 'empate') NOT NULL,       
    modo         ENUM('vs_humano', 'vs_bot') NOT NULL,    
    jugada_en    TIMESTAMP DEFAULT CURRENT_TIMESTAMP      
);



SELECT * FROM partidas;

SELECT
    ganador,
    COUNT(*) AS victorias
FROM partidas
WHERE resultado != 'empate'
GROUP BY ganador
ORDER BY victorias DESC;

SELECT COUNT(*) AS empates FROM partidas WHERE resultado = 'empate';
