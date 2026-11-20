<?php

require_once __DIR__ . '/../../core/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$user = auth_user();

$projects = db_select("
    SELECT p.id, p.name, p.description, p.color, p.priority, p.due_date
    FROM projects p
    WHERE p.created_by = ?
    ORDER BY p.created_at DESC
", [$user['id']]);

echo json_encode(['success' => true, 'projects' => $projects]);
