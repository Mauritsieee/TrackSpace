<?php

auth_required();

if (isset($_GET['id'])) {
    $project_id = (int) $_GET['id'];
} else {
    header('Location: ' . ts_url('/projects'));
    exit;
}

$user = auth_user();
$projects = db_select(
    "SELECT * FROM projects WHERE id = ? AND created_by = ?",
    [$project_id, $user['id']]
);

if (empty($projects)) {
    header('Location: ' . ts_url('/projects'));
    exit;
}

$project = $projects[0];