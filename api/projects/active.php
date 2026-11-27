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

// Get all projects with task counts (total, completed, in progress)
$projects = db_select("
    SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.color, 
        p.priority,
        p.due_date,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN ts.slug = 'done' THEN 1 ELSE 0 END) as completed_tasks
    FROM projects p
    LEFT JOIN tasks t ON p.id = t.project_id
    LEFT JOIN task_statuses ts ON t.status_id = ts.id
    WHERE p.created_by = ?
    GROUP BY p.id
    ORDER BY p.created_at DESC
", [$user['id']]);

// Filter to only active projects (has tasks in backlog, todo, or in_progress)
// and calculate progress percentage
$activeProjects = [];
foreach ($projects as $project) {
    if ($project['total_tasks'] > 0) {
        $completedTasks = $project['completed_tasks'] ?? 0;
        $incompleteTasks = $project['total_tasks'] - $completedTasks;
        
        // Only include if there are incomplete tasks
        if ($incompleteTasks > 0) {
            $project['progress'] = round(($completedTasks / $project['total_tasks']) * 100);
            $project['incomplete_tasks'] = $incompleteTasks;
            $activeProjects[] = $project;
        }
    }
}

echo json_encode(['success' => true, 'projects' => $activeProjects]);
