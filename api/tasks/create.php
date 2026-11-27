<?php
require __DIR__ . '/../../core/bootstrap.php';
auth_required();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => __('Method not allowed.')]);
    exit;
}

$user = auth_user();
$projectId = (int) ($_POST['project_id'] ?? 0);
$title = trim($_POST['title'] ?? '');
$description = $_POST['description'] ?? null;
$priority = $_POST['priority'] ?? 'normal';
$statusId = (int) ($_POST['status_id'] ?? 1);
$dueDate = $_POST['due_date'] ?? null;

if (!$title) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => __('Task title is required.')]);
    exit;
}

$project = db_select("SELECT id FROM projects WHERE id = ? AND created_by = ?", [$projectId, $user['id']]);

if (empty($project)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => __('Project not found.')]);
    exit;
}

$status = db_select("SELECT is_completed FROM task_statuses WHERE id = ?", [$statusId]);
if (empty($status)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => __('Invalid task status.')]);
    exit;
}

$taskData = [
    'project_id' => $projectId,
    'title' => $title,
    'description' => $description ?: null,
    'priority' => $priority,
    'status_id' => $statusId,
    'due_date' => $dueDate ?: null,
    'created_by' => $user['id']
];
if ((bool) $status[0]['is_completed']) {
    $taskData['completed_at'] = db_select("SELECT NOW() AS completed_at")[0]['completed_at'];
}
$taskId = db_insert('tasks', $taskData);

// Fetch the created task with priority color
$task = db_select("
    SELECT 
        t.*,
        pl.color as priority_color
    FROM tasks t
    JOIN priority_levels pl ON t.priority = pl.slug
    WHERE t.id = ?
", [$taskId]);

echo json_encode(['success' => true, 'task_id' => $taskId, 'task' => $task[0] ?? null, 'message' => __('Task created.')]);
