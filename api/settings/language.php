<?php

require_once __DIR__ . '/../../core/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => __('Method not allowed.')]);
    exit;
}

$language = $_POST['language'] ?? '';

if (!array_key_exists($language, AVAILABLE_LANGUAGES)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => __('Invalid language.')]);
    exit;
}

setcookie('language', $language, time() + 31536000, '/');

echo json_encode(['success' => true, 'message' => __('Language saved.')]);
exit;
