<?php
$task = $data ?? [];
$createdAt = $task['created_at'] ? date('d-m-Y', strtotime($task['created_at'])) : '-';
$priorityColor = $task['priority_color'];
?>

<div class="kanban-task-card task_details" data-task-id="<?= $task['id'] ?>">
    <div class="kanban-task-header">
        <h4><?= htmlspecialchars($task['title'] ?? '') ?></h4>
    </div>
    
    <div class="kanban-task-info">
        <span class="kanban-date">
            <?= ts_icon('calendar'); ?> <?= $createdAt ?>
        </span>
    </div>
    
    <span class="priority-badge" style="background-color: <?= $priorityColor ?>;">
        <?= ucfirst(htmlspecialchars($task['priority'] ?? 'normal')) ?>
    </span>
</div>
