<?php
$task = $data ?? [];
$projectColor = $task['project_color'] ?? '#7042d9';
$estimatedMinutes = $task['estimated_minutes'] ?? null;
$estimatedTime = '-';

if ($estimatedMinutes) {
    if ($estimatedMinutes >= 60) {
        $hours = intval($estimatedMinutes / 60);
        $minutes = $estimatedMinutes % 60;
        if ($minutes > 0) {
            $estimatedTime = $hours . 'h ' . $minutes . 'm';
        } else {
            $estimatedTime = $hours . 'h';
        }
    } else {
        $estimatedTime = $estimatedMinutes . 'm';
    }
}
?>

<tr class="dashboard-task-row" data-task-id="<?= $task['id'] ?>">
    <td class="task-name">
        <span><?= htmlspecialchars($task['title'] ?? '') ?></span>
    </td>
    <td class="task-estimated">
        <span><?= htmlspecialchars($estimatedTime) ?></span>
    </td>
    <td class="task-project">
        <span class="project-badge" style="--badge-color: <?= htmlspecialchars($projectColor) ?>;">
            <?= htmlspecialchars($task['project_name'] ?? '') ?>
        </span>
    </td>
</tr>
