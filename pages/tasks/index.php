<?php auth_required(); ?>

<div class="page-header">
    <div class="page-header-text">
        <div class="page-header-text-title">
            <?= ts_icon('square-check'); ?>
            <h1><?= __('Tasks') ?></h1>
        </div>
        <p class="page-header-text-description">
            <?= __('Manage all your tasks, including tasks inside projects.'); ?>
        </p>
    </div>
    <div class="page-header-actions">
        <div class="btn-primary"><?= ts_icon('plus'); ?> <?= __('New task'); ?></div>
    </div>
</div>
<div class="page-main">
    <div class="container--fluid">
        <div class="row">
            <div class="col-9">
                <table class="task-table">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Project</th>
                            <th>Priority</th>
                            <th>Estimated minutes</th>
                            <th>Start date</th>
                            <th>Due date</th>
                            <th>Assigned to</th>
                            <th>Created by</th>
                            <th>Created at</th>
                        </tr>
                    </thead>
                    <tbody id="task-table">
                        <?php /* Filled in using AJAX */ ?>
                    </tbody>
                </table>
            </div>
            <div class="col-3">
                <div class="card--full">
                    <div class="task-widget-header">
                        <?= ts_icon('folder'); ?>
                        <span>Projecten</span>
                    </div>
                    <table class="project-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Tasks</th>
                            </tr>
                        </thead>
                        <tbody id="projects-counter">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>