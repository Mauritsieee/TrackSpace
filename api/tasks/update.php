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
$taskId = (int) ($_POST['id'] ?? 0);

$task = db_select(
    "SELECT t.id, s.is_completed FROM tasks t
     JOIN projects p ON t.project_id = p.id 
     JOIN task_statuses s ON t.status_id = s.id
     WHERE t.id = ? AND p.created_by = ?",
    [$taskId, $user['id']]
);

if (empty($task)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => __('Task not found.')]);
    exit;
}

$updateData = [];

if (isset($_POST['title'])) {
    $title = trim($_POST['title']);
    if (!$title) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => __('Task title cannot be empty.')]);
        exit;
    }
    $updateData['title'] = $title;
}

if (isset($_POST['description'])) {
    $updateData['description'] = $_POST['description'] ?: null;
}

if (isset($_POST['priority'])) {
    $updateData['priority'] = $_POST['priority'];
}

if (isset($_POST['status_id'])) {
    $statusId = (int) $_POST['status_id'];
    $status = db_select("SELECT is_completed FROM task_statuses WHERE id = ?", [$statusId]);
    if (empty($status)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => __('Invalid task status.')]);
        exit;
    }

    $updateData['status_id'] = $statusId;
    if (!(bool) $status[0]['is_completed']) {
        $updateData['completed_at'] = null;
    } elseif (!(bool) $task[0]['is_completed']) {
        $updateData['completed_at'] = db_select("SELECT NOW() AS completed_at")[0]['completed_at'];
    }
}

if (isset($_POST['due_date'])) {
    $updateData['due_date'] = $_POST['due_date'] ?: null;
}

if (isset($_POST['start_date'])) {
    $updateData['start_date'] = $_POST['start_date'] ?: null;
}

if (isset($_POST['estimated_minutes'])) {
    $updateData['estimated_minutes'] = (int) $_POST['estimated_minutes'] ?: null;
}

if (isset($_POST['assigned_to'])) {
    $updateData['assigned_to'] = (int) $_POST['assigned_to'] ?: null;
}

if (empty($updateData)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => __('No fields to update.')]);
    exit;
}

db_update('tasks', $updateData, 'id = ?', [$taskId]);

echo json_encode(['success' => true, 'message' => __('Task updated.')]);
