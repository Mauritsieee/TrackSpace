<?php

if (!isset($_COOKIE['language'])) {
    setcookie('language', 'en', time() + 31536000, '/');
    $_COOKIE['language'] = 'en';
}

$lang = $_COOKIE['language'];
$file = __DIR__ . "/../languages/{$lang}.php";

$translations = [];

if ($lang !== 'en' && preg_match('/^[a-z]{2}$/', $lang) && is_file($file)) {
    $translations = require $file;
}

function __(string $key): string
{
    global $translations;

    return $translations[$key] ?? $key;
}