<?php
require __DIR__ . '/../../core/bootstrap.php';
auth_required();

header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$template = $input['template'] ?? null;
$data = $input['data'] ?? [];

if (!$template || !preg_match('/^[a-z0-9\-]+$/', $template)) {
    echo json_encode(['success' => false, 'error' => __('Invalid template')]);
    exit;
}

$templatePath = __DIR__ . '/../../layouts/templates/' . $template . '.php';

if (!file_exists($templatePath)) {
    echo json_encode(['success' => false, 'error' => __('Template not found')]);
    exit;
}

require_once TS_ROOT . '/handlers/template-functions.php';
ob_start();
include $templatePath;
$html = ob_get_clean();

echo json_encode(['success' => true, 'html' => $html]);
