<?php
$task = $data ?? [];
$status = $task['status_name'] ?? '-';
$statusColor = $task['status_color'] ?? '#7042d9';
$priorityColor = $task['priority_color'] ?? '#7042d9';
$projectColor = $task['project_color'] ?? '#7042d9';
$taskId = $task['id'] ?? 0;
$dueDate = $task['due_date'] ? date('d-m-Y', strtotime($task['due_date'])) : '-';
$startDate = $task['start_date'] ? date('d-m-Y', strtotime($task['start_date'])) : '-';
$createdAt = $task['created_at'] ? date('d-m-Y', strtotime($task['created_at'])) : '-';
$priority = $task['priority'] ?? 'normal';
?>
<tr class="task-table-row" data-task-id="<?= $taskId ?>" data-status="<?= $task['status_id'] ?? 0 ?>">
    <td class="col-title"><?= htmlspecialchars($task['title'] ?? '') ?></td>
    <td class="col-project">
        <span class="project-badge" style="--badge-color: <?= htmlspecialchars($projectColor) ?>">
            <?= htmlspecialchars($task['project_name'] ?? '-') ?>
        </span>
    </td>
    <td class="col-priority">
        <span class="priority-badge" style="--badge-color: <?= htmlspecialchars($priorityColor) ?>">
            <?= htmlspecialchars(ucfirst($priority)) ?>
        </span>
    </td>
    <td class="col-estimated"><?= htmlspecialchars($task['estimated_minutes'] ?? '-') ?></td>
    <td class="col-start-date"><?= htmlspecialchars($startDate) ?></td>
    <td class="col-deadline"><?= htmlspecialchars($dueDate) ?></td>
    <td class="col-assigned"><?= htmlspecialchars($task['assigned_to_name'] ?? '-') ?></td>
    <td class="col-created-by"><?= htmlspecialchars($task['created_by_name'] ?? '-') ?></td>
    <td class="col-created-at"><?= htmlspecialchars($createdAt) ?></td>
</tr>

