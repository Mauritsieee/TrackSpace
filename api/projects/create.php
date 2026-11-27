<?php

require_once __DIR__ . '/../../core/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => __('Method not allowed.')]);
    exit;
}

$user = auth_user();
$name = trim($_POST['name'] ?? '');
$description = trim($_POST['description'] ?? '');
$color = $_POST['color'] ?? null;
$priority = $_POST['priority'] ?? 'normal';

if (empty($name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => __('Project name is required.')]);
    exit;
}

$id = db_insert('projects', [
    'name' => $name,
    'description' => $description ?: null,
    'color' => $color,
    'priority' => $priority,
    'status_id' => 1,
    'created_by' => $user['id']
]);

echo json_encode(['success' => true, 'message' => __('Project created.'), 'id' => $id]);
