<?php
$task = $data ?? [];
$dueDate = $task['due_date'] ? date('Y-m-d', strtotime($task['due_date'])) : '';
$createdBy = $task['created_by_name'] ?? __('Unknown');
$taskId = $task['id'] ?? 0;
?>

<div class="task-detail-card" data-ts_popup="task_details">
    <div class="task-detail-header">
        <div class="text">
            <h2><?= htmlspecialchars($task['title'] ?? '') ?></h2>
            <p><?= htmlspecialchars($task['description'] ?? '') ?></p>
        </div>
        <div class="actions">
            <button class="btn-colored task-delete-btn" data-task-id="<?= $taskId ?>"><?= ts_icon('trash'); ?></button>
        </div>
    </div>
    <div class="task-detail-main">
        <div class="container--fluid">
            <div class="row">
                <div class="col-8">
                    <div class="description">
                        <h3><?= __('Description') ?></h3>
                        <textarea name="description"><?= htmlspecialchars($task['description'] ?? '') ?></textarea>
                    </div>
                </div>
                <div class="col-4">
                    <div class="task-detail-form">
                        <label for="status"><?= __('Status') ?></label>
                        <select id="status" data-task-id="<?= $taskId ?>">
                            <?php foreach ($task['statuses'] ?? [] as $statusId => $status): ?>
                                <option value="<?= $statusId ?>" <?= ($task['status_id'] == $statusId) ? 'selected' : '' ?> style="background-color: <?= $status['color'] ?>">
                                    <?= htmlspecialchars($status['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="task-detail-form">
                        <label for="priority"><?= __('Priority') ?></label>
                        <select id="priority" data-task-id="<?= $taskId ?>">
                            <?php foreach ($task['priorities'] ?? [] as $priorityName => $priorityColor): ?>
                                <option value="<?= htmlspecialchars($priorityName) ?>" <?= ($task['priority'] == $priorityName) ? 'selected' : '' ?> style="background-color: <?= $priorityColor ?>">
                                    <?= htmlspecialchars(__(ucfirst($priorityName))) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="task-detail-form">
                        <label for="start_date"><?= __('Start date') ?></label>
                        <input type="date" id="start_date" data-task-id="<?= $taskId ?>" value="<?= $task['start_date'] ? date('Y-m-d', strtotime($task['start_date'])) : '' ?>">
                    </div>
                    <div class="task-detail-form">
                        <label for="deadline"><?= __('Deadline') ?></label>
                        <input type="date" id="deadline" value="<?= htmlspecialchars($dueDate) ?>" data-task-id="<?= $taskId ?>">
                    </div>
                    <div class="task-detail-form">
                        <label for="estimated_minutes"><?= __('Estimated time (minutes)') ?></label>
                        <input type="number" id="estimated_minutes" value="<?= htmlspecialchars($task['estimated_minutes'] ?? '') ?>" data-task-id="<?= $taskId ?>" min="0">
                    </div>
                    <div class="task-detail-form">
                        <label for="created_by"><?= __('Created by') ?></label>
                        <input type="text" id="created_by" value="<?= htmlspecialchars($createdBy) ?>" disabled>
                    </div>
                    <div class="task-detail-form">
                        <label for="assigned_to"><?= __('Assigned to') ?></label>
                        <select id="assigned_to" data-task-id="<?= $taskId ?>">
                            <option value=""><?= __('None') ?></option>
                            <?php foreach ($task['users'] ?? [] as $userId => $userName): ?>
                                <option value="<?= htmlspecialchars($userId) ?>" <?= ($task['assigned_to'] == $userId) ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($userName) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="task-detail-footer">
        <button class="btn-primary" data-task-id="<?= $taskId ?>"><?= __('Save') ?></button>
    </div>
</div>