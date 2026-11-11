<?php

require_once __DIR__ . '/../../core/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

auth_logout();

echo json_encode([
    'success' => true,
    'redirect' => ts_url('login')
]);
exit;