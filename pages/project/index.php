<?php
include_once __DIR__ . '/handler.php';
?>

<div class="page-header">
    <div class="page-header-text">
        <div class="page-header-text-title">
            <?= ts_icon('folder-open'); ?>
            <h1><?= htmlspecialchars($project['name']) ?></h1>
        </div>
        <p class="page-header-text-description">
            <?= htmlspecialchars($project['description'] ?? '') ?>
        </p>
    </div>
    <div class="page-header-actions">
        <button class="add_task_form btn-primary"><?= ts_icon('plus'); ?> <?= __('New task') ?></button>
        <button class="btn-outline"><?= ts_icon('pencil'); ?> <?= __('Settings') ?></button>
    </div>
</div>
<div class="page-main">
    <div class="tab-menu">
        <div class="tab-menu-headers">
            <button class="tab-menu-button" data-tabmenu="Tasks">
                <?= __('Tasks') ?>
            </button>
            <button class="tab-menu-button" data-tabmenu="Overview">
                <?= __('Overview') ?>
            </button>
            <button class="tab-menu-button" data-tabmenu="Files">
                <?= __('Files') ?>
            </button>
            <button class="tab-menu-button" data-tabmenu="Settings">
                <?= __('Settings') ?>
            </button>
        </div>
        <div class="tab-menu-body">
            <section class="tab-menu-panel" data-tabmenu="Tasks">
                <div class="tasks-panel">
                    <div class="tasks-panel-header">
                        <h2><?= __('Tasks') ?></h2>
                        <div class="tasks-view-toggle btns-connected-wrapper">
                            <button data-view="kanban"<?= (($_COOKIE['taskView-' . $project_id] ?? 'list') === 'kanban') ? ' class="current"' : '' ?>><?= __('Kanban') ?></button>
                            <button data-view="list"<?= (($_COOKIE['taskView-' . $project_id] ?? 'list') === 'list') ? ' class="current"' : '' ?>><?= __('List') ?></button>
                            <button data-view="tabel"<?= (($_COOKIE['taskView-' . $project_id] ?? 'list') === 'tabel') ? ' class="current"' : '' ?>><?= __('Table') ?></button>
                        </div>
                    </div>
                </div>
                <div id="tasksList"></div>
            </section>
            <section class="tab-menu-panel" data-tabmenu="Overview">
                <h2><?= __('Overview') ?></h2>
            </section>
            <section class="tab-menu-panel" data-tabmenu="Files">
                <h2><?= __('Files') ?></h2>
            </section>
            <section class="tab-menu-panel" data-tabmenu="Settings">
                <h2><?= __('Settings') ?></h2>
            </section>
        </div>
    </div>
</div>

<div class="form-popup-wrapper" data-ts_popup="add_task_form" style="display:none;">
    <div class="card func-card">
        <div class="card-header">
            <div class="card-title">
                <h2><?= __('New task') ?></h2>
            </div>
        </div>
        <div class="card-main">
            <form id="createTaskForm">
                <input type="hidden" name="project_id" value="<?= $project['id'] ?>">
                
                <div class="form-group">
                    <label for="taskTitle"><?= __('Task title') ?></label>
                    <input type="text" id="taskTitle" name="title" required>
                </div>
                
                <div class="form-group">
                    <label for="taskDescription"><?= __('Description') ?></label>
                    <textarea id="taskDescription" name="description" rows="3"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="taskPriority"><?= __('Priority') ?></label>
                    <select id="taskPriority" name="priority"></select>
                </div>

                <div class="form-group">
                    <label for="taskStatus"><?= __('Status') ?></label>
                    <select id="taskStatus" name="status_id"></select>
                </div>

                <div class="form-group">
                    <label for="taskDueDate"><?= __('Due date') ?></label>
                    <input type="date" id="taskDueDate" name="due_date">
                </div>
                
                <input type="submit" value="<?= __('Create') ?>" class="btn-outline">
            </form>
        </div>
    </div>
</div>



