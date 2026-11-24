<?php
require __DIR__ . '/../../core/bootstrap.php';
auth_required();

$projectId = (int) ($_GET['project_id'] ?? 0);
$user = auth_user();

$tasks = db_select(
    "SELECT t.*, ts.name as status_name, ts.color as status_color, pl.color as priority_color
     FROM tasks t 
     JOIN projects p ON t.project_id = p.id 
     JOIN task_statuses ts ON t.status_id = ts.id
     LEFT JOIN priority_levels pl ON LOWER(pl.slug) = LOWER(t.priority)
     WHERE t.project_id = ? AND p.created_by = ? AND t.parent_id IS NULL 
     ORDER BY t.position ASC",
    [$projectId, $user['id']]
);

echo json_encode(['success' => true, 'tasks' => $tasks]);
