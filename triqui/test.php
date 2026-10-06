<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ── 1. Prueba de conexión ─────────────────────────────────────────────────────
$con = new mysqli("localhost", "root", "", "triqui");

if ($con->connect_error) {
    die(json_encode(["paso" => "1-CONEXION", "error" => $con->connect_error]));
}
echo "✅ Conexión OK<br>";

// ── 2. Prueba que la tabla existe ─────────────────────────────────────────────
$res = $con->query("SHOW TABLES LIKE 'partidas'");
if ($res->num_rows === 0) {
    die("❌ La tabla 'partidas' NO existe en la base de datos 'triqui'");
}
echo "✅ Tabla 'partidas' existe<br>";

// ── 3. Prueba de INSERT directo sin prepared statement ────────────────────────
$sql = "INSERT INTO partidas (jugador1, jugador2, es_bot, ganador, resultado, modo)
        VALUES ('TestX', 'TestO', 0, 'TestX', 'X', 'vs_humano')";

if ($con->query($sql)) {
    echo "✅ INSERT directo OK — ID: " . $con->insert_id . "<br>";
} else {
    die("❌ INSERT falló: " . $con->error);
}

// ── 4. Prueba de SELECT para confirmar que quedó guardado ─────────────────────
$res = $con->query("SELECT * FROM partidas ORDER BY id DESC LIMIT 3");
echo "<br><strong>Últimos registros:</strong><br>";
while ($row = $res->fetch_assoc()) {
    echo json_encode($row) . "<br>";
}

$con->close();
?>