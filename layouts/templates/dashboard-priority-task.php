<?php
$task = $data ?? [];
$priorityColor = $task['priority_color'] ?? '#7042d9';
$projectColor = $task['project_color'] ?? '#7042d9';
$priority = $task['priority'] ?? 'normal';
?>

<tr class="dashboard-task-row" data-task-id="<?= $task['id'] ?>">
    <td class="task-name">
        <span><?= htmlspecialchars($task['title'] ?? '') ?></span>
    </td>
    <td class="task-priority">
        <span class="priority-badge" style="background-color: <?= htmlspecialchars($priorityColor) ?>;">
            <?= htmlspecialchars(__(ucfirst($priority))) ?>
        </span>
    </td>
    <td class="task-project">
        <span class="project-badge" style="--badge-color: <?= htmlspecialchars($projectColor) ?>;">
            <?= htmlspecialchars($task['project_name'] ?? '') ?>
        </span>
    </td>
</tr>
