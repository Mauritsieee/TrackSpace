<?php

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (TS_BASE_PATH !== '' && (
    $path === TS_BASE_PATH ||
    str_starts_with($path, TS_BASE_PATH . '/')
)) {
    $path = substr($path, strlen(TS_BASE_PATH));
}

$path = rtrim($path, '/') ?: '/';

switch ($path) {
    case '/': // Homepage
    case '/dashboard':
        $page = TS_ROOT . '/pages/dashboard/index.php';
        break;

    case '/projects':
        $page = TS_ROOT . '/pages/projects/index.php';
        break;

    case '/settings':
        $page = TS_ROOT . '/pages/settings/index.php';
        break;
    case '/login':
        $page = TS_ROOT . '/pages/login/index.php';
        break;

    case '/register':
        $page = TS_ROOT . '/pages/register/index.php';
        break;

    default:
        http_response_code(404);
        $page = TS_ROOT . '/pages/errors/404.php';
        break;
}

require TS_ROOT . '/layouts/app.php';