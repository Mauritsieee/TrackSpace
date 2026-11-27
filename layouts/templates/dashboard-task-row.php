<?php
$task = $data ?? [];
$priorityColor = $task['priority_color'];
$projectColor = $task['project_color'];
?>

<tr class="dashboard-task-row" data-task-id="<?= $task['id'] ?>">
    <td class="task-name">
        <span><?= htmlspecialchars($task['title'] ?? '') ?></span>
    </td>
    <td class="task-priority">
        <span class="priority-badge" style="background-color: <?= $priorityColor ?>;">
            <?= htmlspecialchars(__(ucfirst($task['priority'] ?? 'normal'))) ?>
        </span>
    </td>
    <td class="task-project">
        <span class="project-badge" style="--badge-color: <?= $projectColor ?>;">
            <?= htmlspecialchars($task['project_name'] ?? '') ?>
        </span>
    </td>
</tr>
