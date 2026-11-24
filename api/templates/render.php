<?php
require __DIR__ . '/../../core/bootstrap.php';
auth_required();

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$template = $input['template'] ?? null;
$data = $input['data'] ?? [];

if (!$template || !preg_match('/^[a-z0-9\-]+$/', $template)) {
    die(json_encode(['success' => false, 'error' => 'Invalid template']));
}

$templatePath = __DIR__ . '/../../layouts/templates/' . $template . '.php';

if (!file_exists($templatePath)) {
    die(json_encode(['success' => false, 'error' => 'Template not found']));
}

require_once TS_ROOT . '/handlers/template-functions.php';
ob_start();
include $templatePath;
$html = ob_get_clean();

echo json_encode(['success' => true, 'html' => $html]);
