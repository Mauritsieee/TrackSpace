<?php
require __DIR__ . '/../../core/bootstrap.php';
auth_required();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$projectId = (int) ($_GET['project_id'] ?? 0);
$all = (int) ($_GET['all'] ?? 0);
$user = auth_user();

if ($all) {
    // Get all tasks for the user across all projects
    $tasks = db_select(
        "SELECT t.*, p.name as project_name, p.color as project_color, u.name as created_by_name, ua.name as assigned_to_name, 
                ts.name as status_name, ts.color as status_color, pl.color as priority_color
         FROM tasks t 
         JOIN projects p ON t.project_id = p.id 
         JOIN users u ON t.created_by = u.id
         LEFT JOIN users ua ON t.assigned_to = ua.id
         JOIN task_statuses ts ON t.status_id = ts.id
         LEFT JOIN priority_levels pl ON LOWER(pl.slug) = LOWER(t.priority)
         WHERE p.created_by = ? AND t.parent_id IS NULL 
         ORDER BY t.created_at DESC",
        [$user['id']]
    );
} else {
    // Get tasks for a specific project
    $tasks = db_select(
        "SELECT t.*, p.name as project_name, p.color as project_color, ts.name as status_name, ts.color as status_color, pl.color as priority_color
         FROM tasks t 
         JOIN projects p ON t.project_id = p.id 
         JOIN task_statuses ts ON t.status_id = ts.id
         LEFT JOIN priority_levels pl ON LOWER(pl.slug) = LOWER(t.priority)
         WHERE t.project_id = ? AND p.created_by = ? AND t.parent_id IS NULL 
         ORDER BY t.position ASC",
        [$projectId, $user['id']]
    );
}

echo json_encode(['success' => true, 'tasks' => $tasks]);

