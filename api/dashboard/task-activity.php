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
$today = new DateTimeImmutable(db_select("SELECT CURRENT_DATE() AS today")[0]['today']);
$currentWeek = $today->modify('monday this week');
$firstWeek = $currentWeek->modify('-7 weeks');
$nextWeek = $currentWeek->modify('+1 week');
$params = [$user['id'], $firstWeek->format('Y-m-d'), $nextWeek->format('Y-m-d')];

$created = db_select(
    "SELECT DATE_SUB(DATE(t.created_at), INTERVAL WEEKDAY(t.created_at) DAY) AS week_start, COUNT(*) AS total
     FROM tasks t JOIN projects p ON t.project_id = p.id
     WHERE p.created_by = ? AND t.parent_id IS NULL AND t.created_at >= ? AND t.created_at < ?
     GROUP BY week_start",
    $params
);
$completed = db_select(
    "SELECT DATE_SUB(DATE(t.completed_at), INTERVAL WEEKDAY(t.completed_at) DAY) AS week_start, COUNT(*) AS total
     FROM tasks t JOIN projects p ON t.project_id = p.id
     WHERE p.created_by = ? AND t.parent_id IS NULL AND t.completed_at >= ? AND t.completed_at < ?
     GROUP BY week_start",
    $params
);

$weeks = [];
for ($week = $firstWeek; $week < $nextWeek; $week = $week->modify('+1 week')) {
    $key = $week->format('Y-m-d');
    $weeks[$key] = ['week_start' => $key, 'created' => 0, 'completed' => 0];
}
foreach ($created as $row) {
    $weeks[$row['week_start']]['created'] = (int) $row['total'];
}
foreach ($completed as $row) {
    $weeks[$row['week_start']]['completed'] = (int) $row['total'];
}

echo json_encode(['success' => true, 'weeks' => array_values($weeks)]);
