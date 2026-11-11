<?php

// Root directory
define('TS_ROOT', dirname(__DIR__));

// Load environment variables
$env = parse_ini_file(TS_ROOT . '/.env', false, INI_SCANNER_RAW);

if ($env === false) {
    throw new RuntimeException('Unable to load .env file');
}

foreach ($env as $key => $value) {
    $_ENV[$key] = $value;
}

// Base URL path
$documentRoot = realpath($_SERVER['DOCUMENT_ROOT']);
$basePath = str_replace('\\', '/', substr(TS_ROOT, strlen($documentRoot)));

define('TS_BASE_PATH', rtrim($basePath, '/'));

// Load core functions
require_once TS_ROOT . '/core/translations.php';
require_once TS_ROOT . '/core/database.php';
require_once TS_ROOT . '/core/functions.php';
require_once TS_ROOT . '/core/migrations.php';

ts_migrate();

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/auth.php';