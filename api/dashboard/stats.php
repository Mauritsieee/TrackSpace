<?php

require_once __DIR__ . '/../../core/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => __('Method not allowed.')]);
    exit;
}

auth_required();
$user = auth_user();

// Count open tasks (all tasks where status is not 'done')
$openTasks = db_select("
    SELECT COUNT(t.id) as count
    FROM tasks t
    LEFT JOIN task_statuses ts ON t.status_id = ts.id
    WHERE t.created_by = ? AND ts.slug != 'done'
", [$user['id']]);

$open_tasks = $openTasks[0]['count'] ?? 0;

// Count active projects (projects with at least one incomplete task)
$activeProjects = db_select("
    SELECT COUNT(DISTINCT p.id) as count
    FROM projects p
    LEFT JOIN tasks t ON p.id = t.project_id
    LEFT JOIN task_statuses ts ON t.status_id = ts.id
    WHERE p.created_by = ? AND t.id IS NOT NULL AND ts.slug != 'done'
", [$user['id']]);

$active_projects = $activeProjects[0]['count'] ?? 0;

// Sum estimated time (in minutes) of all open tasks
$scheduledTime = db_select("
    SELECT SUM(COALESCE(t.estimated_minutes, 0)) as total_minutes
    FROM tasks t
    LEFT JOIN task_statuses ts ON t.status_id = ts.id
    WHERE t.created_by = ? AND ts.slug != 'done'
", [$user['id']]);

$scheduled_minutes = $scheduledTime[0]['total_minutes'] ?? 0;

echo json_encode([
    'success' => true,
    'open_tasks' => (int)$open_tasks,
    'active_projects' => (int)$active_projects,
    'scheduled_minutes' => (int)$scheduled_minutes
]);
