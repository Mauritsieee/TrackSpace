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
        <span class="task-meta-item" title="<?= htmlspecialchars(__('Created'), ENT_QUOTES, 'UTF-8') ?>">
            <?= ts_icon('calendar'); ?> <?= $createdAt ?>
        </span>
        <span class="task-meta-item" title="<?= htmlspecialchars(__('Estimated'), ENT_QUOTES, 'UTF-8') ?>">
            <?= ts_icon('clock'); ?> <?= $estimated ?>
        </span>
        <?php if ($task['assigned_to'] ?? null): ?>
            <span class="task-meta-item" title="<?= htmlspecialchars(__('Assigned to'), ENT_QUOTES, 'UTF-8') ?>">
                <?= ts_icon('user'); ?> <?= htmlspecialchars($task['assigned_to']) ?>
            </span>
        <?php endif; ?>
    </div>
    
    <div class="task-tags">
        <span class="priority-badge" style="background-color: <?= $priorityColor ?>;">
            <?= htmlspecialchars(__(ucfirst($task['priority'] ?? 'normal'))) ?>
        </span>
    </div>
</div>
