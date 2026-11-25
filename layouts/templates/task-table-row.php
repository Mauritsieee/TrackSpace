<?php
$task = $data ?? [];
$status = $task['status_name'] ?? '-';
$statusColor = $task['status_color'] ?? '#7042d9';
$priorityColor = $task['priority_color'] ?? '#7042d9';
$taskId = $task['id'] ?? 0;
$dueDate = $task['due_date'] ? date('d-m-Y', strtotime($task['due_date'])) : '-';
$priority = $task['priority'] ?? 'normal';
?>
<tr class="task-table-row" data-task-id="<?= $taskId ?>" data-status="<?= $task['status_id'] ?? 0 ?>">
    <td class="col-title"><?= htmlspecialchars($task['title'] ?? '') ?></td>
    <td class="col-status">
        <span class="status-badge" style="--badge-color: <?= htmlspecialchars($statusColor) ?>">
            <?= htmlspecialchars($status) ?>
        </span>
    </td>
    <td class="col-deadline"><?= htmlspecialchars($dueDate) ?></td>
    <td class="col-priority">
        <span class="priority-badge" style="--badge-color: <?= htmlspecialchars($priorityColor) ?>">
            <?= htmlspecialchars(ucfirst($priority)) ?>
        </span>
    </td>
</tr>
