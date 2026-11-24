<?php
require __DIR__ . '/../../core/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

$users = db_select("SELECT id, name FROM users ORDER BY name ASC");

echo json_encode(['success' => true, 'users' => $users]);
?>
