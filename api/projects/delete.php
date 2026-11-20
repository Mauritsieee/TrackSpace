<?php

require_once __DIR__ . '/../../core/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$user = auth_user();
$projectId = $_POST['id'] ?? 0;

$project = db_select("SELECT id FROM projects WHERE id = ? AND created_by = ?", [$projectId, $user['id']]);

if (empty($project)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Project not found.']);
    exit;
}

db_delete('projects', 'id = ? AND created_by = ?', [$projectId, $user['id']]);

echo json_encode(['success' => true, 'message' => 'Project deleted.']);
