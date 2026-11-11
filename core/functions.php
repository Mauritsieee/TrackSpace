<?php

function ts_url(string $path = ''): string
{
    return TS_BASE_PATH . '/' . ltrim($path, '/');
}

function ts_page_slug(): string
{
    $path = trim(substr(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), strlen(TS_BASE_PATH)), '/');

    return basename($path) ?: 'dashboard';
}