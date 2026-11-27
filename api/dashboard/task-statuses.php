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
$statuses = db_select(
    "SELECT s.id, s.name, s.color, COUNT(t.id) AS task_count
     FROM task_statuses s
     LEFT JOIN (
         SELECT t.id, t.status_id
         FROM tasks t
         JOIN projects p ON t.project_id = p.id
         WHERE p.created_by = ? AND t.parent_id IS NULL
     ) t ON t.status_id = s.id
     GROUP BY s.id, s.name, s.color, s.position
     ORDER BY s.position ASC, s.id ASC",
    [$user['id']]
);
foreach ($statuses as &$status) {
    $status['name'] = __($status['name']);
}
unset($status);

echo json_encode(['success' => true, 'statuses' => $statuses]);
