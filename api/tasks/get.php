<?php
require __DIR__ . '/../../core/bootstrap.php';
auth_required();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => __('Method not allowed.')]);
    exit;
}

$user = auth_user();
$taskId = (int) ($_GET['id'] ?? 0);

if (!$taskId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => __('Task ID is required.')]);
    exit;
}

$task = db_select("
    SELECT 
        t.*,
        u.name as created_by_name,
        ts.name as status_name,
        ts.color as status_color,
        pl.color as priority_color
    FROM tasks t
    JOIN users u ON t.created_by = u.id
    JOIN task_statuses ts ON t.status_id = ts.id
    JOIN priority_levels pl ON t.priority = pl.slug
    WHERE t.id = ?
", [$taskId]);

if (empty($task)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => __('Task not found.')]);
    exit;
}

echo json_encode(['success' => true, 'task' => $task[0]]);
