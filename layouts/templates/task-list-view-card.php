<?php
$task = $data ?? [];
$createdAt = $task['created_at'] ? date('d-m-Y', strtotime($task['created_at'])) : '-';
$estimated = $task['estimated_minutes'] ? $task['estimated_minutes'] . 'm' : '-';
$priorityColor = $task['priority_color'];
?>

<div class="task-list-card task_details" data-task-id="<?= $task['id'] ?>">
    <?= ts_icon('grip-horizontal'); ?>
    <div class="task-title">
        <?= htmlspecialchars($task['title'] ?? '') ?>
    </div>
    
    <div class="task-meta">
        <span class="task-meta-item" title="Created">
            <?= ts_icon('calendar'); ?> <?= $createdAt ?>
        </span>
        <span class="task-meta-item" title="Estimated">
            <?= ts_icon('clock'); ?> <?= $estimated ?>
        </span>
        <?php if ($task['assigned_to'] ?? null): ?>
            <span class="task-meta-item" title="Assigned to">
                <?= ts_icon('user'); ?> <?= htmlspecialchars($task['assigned_to']) ?>
            </span>
        <?php endif; ?>
    </div>
    
    <div class="task-tags">
        <span class="priority-badge" style="background-color: <?= $priorityColor ?>;">
            <?= ucfirst(htmlspecialchars($task['priority'] ?? 'normal')) ?>
        </span>
    </div>
</div>
