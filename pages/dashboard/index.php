<div class="container--fluid dashboard-grid">
    <div class="row small-gutters">
        <div class="col-12 mb-16">
            <div class="card">
                <div class="username">
                    <?= htmlspecialchars(auth_user()['name'] ?? '', ENT_QUOTES, 'UTF-8') ?>
                </div>
            </div>
        </div>
        <div class="col-3 mb-16">
            <div class="card link-card">
                <div class="icon-wrapper" style="--color:var(--primary-5);">
                    <?= ts_icon('square-check'); ?>
                </div>
                <div class="text-wrapper">
                    <div class="h4 value">-</div>
                    <p class="description"><?= __('Open tasks') ?></p>
                </div>
            </div>
        </div>
        <div class="col-3 mb-16">
            <div class="card link-card">
                <div class="icon-wrapper" style="--color:var(--success);">
                    <?= ts_icon('calendar'); ?>
                </div>
                <div class="text-wrapper">
                    <div class="h4 value">-</div>
                    <p class="description"><?= __('Appointments today') ?></p>
                </div>
            </div>
        </div>
        <div class="col-3 mb-16">
            <div class="card link-card">
                <div class="icon-wrapper" style="--color:var(--primary-6);">
                    <?= ts_icon('folder-open'); ?>
                </div>
                <div class="text-wrapper">
                    <div class="h4 value">-</div>
                    <p class="description"><?= __('Active projects') ?></p>
                </div>
            </div>
        </div>
        <div class="col-3 mb-16">
            <div class="card link-card">
                <div class="icon-wrapper" style="--color:var(--warning);">
                    <?= ts_icon('clock'); ?>
                </div>
                <div class="text-wrapper">
                    <div class="h4 value">0m</div>
                    <p class="description"><?= __('Scheduled time') ?></p>
                </div>
            </div>
        </div>

        <div class="col-4 mb-16">
            <div class="card func-card">
                <div class="card-header">
                    <div class="card-title">
                        <?= ts_icon('square-text'); ?>
                        <h2><?= __('Priority tasks') ?></h2>
                    </div>
                </div>
                <div class="card-main">
                    <table class="dashboard-tasks-table">
                        <thead>
                            <tr>
                                <th><?= __('Name') ?></th>
                                <th><?= __('Priority') ?></th>
                                <th><?= __('Project') ?></th>
                            </tr>
                        </thead>
                        <tbody id="dashboard-priority-tasks">
                            <tr><td colspan="3" style="text-align: center; color: #999;"><?= __('Loading tasks...') ?></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-4 mb-16">
            <div class="card func-card">
                <div class="card-header">
                    <div class="card-title">
                        <?= ts_icon('square-text'); ?>
                        <h2><?= __('Newest tasks') ?></h2>
                    </div>
                </div>
                <div class="card-main">
                    <table class="dashboard-tasks-table">
                        <thead>
                            <tr>
                                <th><?= __('Name') ?></th>
                                <th><?= __('Est. time') ?></th>
                                <th><?= __('Project') ?></th>
                            </tr>
                        </thead>
                        <tbody id="dashboard-newest-tasks">
                            <tr><td colspan="3" style="text-align: center; color: #999;"><?= __('Loading tasks...') ?></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-4 mb-16">
            <div class="card">
                <div class="dashboard-calendar">
                    <div id="DashboardCalendar"></div>
                </div>
            </div>
        </div>
        <div class="col-4 mb-16">
            <div class="card func-card">
                <div class="card-header">
                    <div class="card-title">
                        <?= ts_icon('folder'); ?>
                        <h2><?= __('Projects') ?></h2>
                    </div>
                </div>
                <div class="card-main">
                    <div class="projects-wrapper">
                        <!-- Filled in using AJAX -->
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4 mb-16">
            <div class="card func-card">
                <div class="card-header">
                    <div class="card-title">
                        <?= ts_icon('square-check'); ?>
                        <h2><?= __('Tasks by status') ?></h2>
                    </div>
                </div>
                <div class="card-main" id="dashboard-status-chart"
                     data-loading="<?= htmlspecialchars(__('Loading task statuses...'), ENT_QUOTES, 'UTF-8') ?>"
                     data-empty="<?= htmlspecialchars(__('No tasks yet'), ENT_QUOTES, 'UTF-8') ?>"
                     data-error="<?= htmlspecialchars(__('Unable to load task statuses.'), ENT_QUOTES, 'UTF-8') ?>">
                    <p class="dashboard-status-message" role="status"><?= __('Loading task statuses...') ?></p>
                    <div class="dashboard-status-donut" hidden>
                        <canvas id="dashboard-status-canvas" role="img"></canvas>
                        <div class="dashboard-status-total" aria-hidden="true">
                            <strong>0</strong>
                            <span><?= __('Tasks') ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4 mb-16">
            <div class="card func-card">
                <div class="card-header">
                    <div class="card-title">
                        <?= ts_icon('square-check'); ?>
                        <h2><?= __('Task activity per week') ?></h2>
                    </div>
                </div>
                <div class="card-main" id="dashboard-activity-chart"
                     data-created="<?= htmlspecialchars(__('Created'), ENT_QUOTES, 'UTF-8') ?>"
                     data-completed="<?= htmlspecialchars(__('Completed'), ENT_QUOTES, 'UTF-8') ?>"
                     data-error="<?= htmlspecialchars(__('Unable to load task activity.'), ENT_QUOTES, 'UTF-8') ?>">
                    <p class="dashboard-activity-message" role="status"><?= __('Loading task activity...') ?></p>
                    <div class="dashboard-activity-graph" hidden>
                        <canvas id="dashboard-activity-canvas" role="img"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>