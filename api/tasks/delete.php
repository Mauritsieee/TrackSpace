<?php
require __DIR__ . '/../../core/bootstrap.php';
auth_required();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$user = auth_user();
$taskId = (int) ($_POST['id'] ?? 0);

$task = db_select(
    "SELECT t.id FROM tasks t 
     JOIN projects p ON t.project_id = p.id 
     WHERE t.id = ? AND p.created_by = ?",
    [$taskId, $user['id']]
);

if (empty($task)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Task not found.']);
    exit;
}

db_delete('tasks', 'id = ?', [$taskId]);

echo json_encode(['success' => true, 'message' => 'Task deleted.']);
