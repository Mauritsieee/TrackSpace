<?php
$task = $data ?? [];
$dueDate = $task['due_date'] ? date('Y-m-d', strtotime($task['due_date'])) : '';
$createdBy = $task['created_by_name'] ?? 'Unknown';
$statusName = $task['status_name'] ?? '-';
$statusColor = $task['status_color'] ?? '#7042d9';
$priorityColor = $task['priority_color'] ?? '#7042d9';
$taskId = $task['id'] ?? 0;
$priority = $task['priority'] ?? 'normal';
$statuses = $task['statuses'] ?? [];
$priorities = $task['priorities'] ?? [];
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
                        <h3>Beschrijving</h3>
                        <textarea name="description"><?= htmlspecialchars($task['description'] ?? '') ?></textarea>
                    </div>
                </div>
                <div class="col-4">
                    <div class="task-detail-form">
                        <label for="status">Status</label>
                        <select id="status" data-task-id="<?= $taskId ?>">
                            <?php foreach ($task['statuses'] ?? [] as $statusId => $status): ?>
                                <option value="<?= $statusId ?>" <?= ($task['status_id'] == $statusId) ? 'selected' : '' ?> style="background-color: <?= $status['color'] ?>">
                                    <?= htmlspecialchars($status['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="task-detail-form">
                        <label for="priority">Prioriteit</label>
                        <select id="priority" data-task-id="<?= $taskId ?>">
                            <?php foreach ($task['priorities'] ?? [] as $priorityName => $priorityColor): ?>
                                <option value="<?= htmlspecialchars($priorityName) ?>" <?= ($task['priority'] == $priorityName) ? 'selected' : '' ?> style="background-color: <?= $priorityColor ?>">
                                    <?= ucfirst(htmlspecialchars($priorityName)) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="task-detail-form">
                        <label for="start_date">Start datum</label>
                        <input type="date" id="start_date" data-task-id="<?= $taskId ?>" value="<?= $task['start_date'] ? date('Y-m-d', strtotime($task['start_date'])) : '' ?>">
                    </div>
                    <div class="task-detail-form">
                        <label for="deadline">Deadline</label>
                        <input type="date" id="deadline" value="<?= htmlspecialchars($dueDate) ?>" data-task-id="<?= $taskId ?>">
                    </div>
                    <div class="task-detail-form">
                        <label for="estimated_minutes">Geschatte tijd (minuten)</label>
                        <input type="number" id="estimated_minutes" value="<?= htmlspecialchars($task['estimated_minutes'] ?? '') ?>" data-task-id="<?= $taskId ?>" min="0">
                    </div>
                    <div class="task-detail-form">
                        <label for="created_by">Aangemaakt door</label>
                        <input type="text" id="created_by" value="<?= htmlspecialchars($createdBy) ?>" disabled>
                    </div>
                    <div class="task-detail-form">
                        <label for="assigned_to">Verantwoordelijke</label>
                        <select id="assigned_to" data-task-id="<?= $taskId ?>">
                            <option value="">Geen</option>
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
        <button class="btn-primary" data-task-id="<?= $taskId ?>">Opslaan</button>
    </div>
</div>