<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "127.0.0.1";
$user = "root";
$pass = "";
$db   = "triqui";

$con = new mysqli($host, $user, $pass, $db);
if ($con->connect_error) {
    echo json_encode(["status" => "error", "mensaje" => "Conexión fallida: " . $con->connect_error]);
    exit;
}

$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input) {
    echo json_encode(["status" => "error", "mensaje" => "JSON inválido. Raw: " . $raw]);
    exit;
}

$campos = ['nombreX', 'nombreO', 'resultado', 'modo'];
foreach ($campos as $c) {
    if (!isset($input[$c]) || $input[$c] === '') {
        echo json_encode(["status" => "error", "mensaje" => "Falta el campo: $c"]);
        exit;
    }
}

$jugador1  = $input['nombreX'];
$jugador2  = $input['nombreO'];
$resultado = $input['resultado'];
$modo      = $input['modo'];
$esBot     = ($jugador2 === 'Bot') ? 1 : 0;

$ganador = null;
if ($resultado === 'X') $ganador = $jugador1;
if ($resultado === 'O') $ganador = $jugador2;

$stmt = $con->prepare(
    "INSERT INTO partidas (jugador1, jugador2, es_bot, ganador, resultado, modo)
     VALUES (?, ?, ?, ?, ?, ?)"
);

if (!$stmt) {
    echo json_encode(["status" => "error", "mensaje" => "Error prepare: " . $con->error]);
    exit;
}

$stmt->bind_param("ssisss", $jugador1, $jugador2, $esBot, $ganador, $resultado, $modo);

if ($stmt->execute()) {
    echo json_encode([
        "status"  => "success",
        "mensaje" => "Partida guardada correctamente",
        "id"      => $stmt->insert_id
    ]);
} else {
    echo json_encode(["status" => "error", "mensaje" => "Error execute: " . $stmt->error]);
}

$stmt->close();
$con->close();
?>