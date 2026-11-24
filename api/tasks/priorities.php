<?php
require __DIR__ . '/../../core/bootstrap.php';
header('Content-Type: application/json; charset=utf-8');

$priorities = db_select("SELECT id, name, slug, color FROM priority_levels ORDER BY position ASC");

echo json_encode(['success' => true, 'priorities' => $priorities]);
