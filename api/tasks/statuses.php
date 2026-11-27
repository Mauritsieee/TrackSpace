<?php
require __DIR__ . '/../../core/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

$statuses = db_select("SELECT id, name, slug, color FROM task_statuses ORDER BY position ASC");
foreach ($statuses as &$status) {
    $status['name'] = __($status['name']);
}
unset($status);

echo json_encode(['success' => true, 'statuses' => $statuses]);
