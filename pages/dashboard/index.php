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
                <div class="icon-wrapper" style="--color:#da42fb;">
                    <?= ts_icon('square-check'); ?>
                </div>
                <div class="text-wrapper">
                    <div class="h4 value">25</div>
                    <p class="description"><?= __('Open tasks') ?></p>
                </div>
            </div>
        </div>
        <div class="col-3 mb-16">
            <div class="card link-card">
                <div class="icon-wrapper" style="--color:#1cbd15;">
                    <?= ts_icon('calendar'); ?>
                </div>
                <div class="text-wrapper">
                    <div class="h4 value">4</div>
                    <p class="description"><?= __('Appointments today') ?></p>
                </div>
            </div>
        </div>
        <div class="col-3 mb-16">
            <div class="card link-card">
                <div class="icon-wrapper" style="--color:#439dff;">
                    <?= ts_icon('folder-open'); ?>
                </div>
                <div class="text-wrapper">
                    <div class="h4 value">4</div>
                    <p class="description"><?= __('Active projects') ?></p>
                </div>
            </div>
        </div>
        <div class="col-3 mb-16">
            <div class="card link-card">
                <div class="icon-wrapper" style="--color:#ff8c43;">
                    <?= ts_icon('clock'); ?>
                </div>
                <div class="text-wrapper">
                    <div class="h4 value">6,5 u</div>
                    <p class="description"><?= __('Scheduled time') ?></p>
                </div>
            </div>
        </div>

        <div class="col-5 mb-16">
            <div class="card func-card">
                <div class="card-header">
                    <div class="card-title">
                        <?= ts_icon('square-text'); ?>
                        <h2><?= __('My tasks') ?></h2>
                    </div>
                    <div class="btn-colored">
                        <?= ts_icon('plus'); ?>
                    </div>
                </div>
                <div class="card-main">
                    <div class="tasklist-wrapper">
                        <div class="task">
                            <input type="checkbox" id="dummy-task-1" checked>
                            <label for="dummy-task-1">Lorem ipsum dolor sit amet.</label>
                            <span><?= __('Today') ?></span>
                        </div>
                    
                        <div class="task">
                            <input type="checkbox" id="dummy-task-2">
                            <label for="dummy-task-2">Lorem ipsum dolor sit amet.</label>
                            <span><?= __('Today') ?></span>
                        </div>
                    
                        <div class="task">
                            <input type="checkbox" id="dummy-task-3">
                            <label for="dummy-task-3">Lorem ipsum dolor sit amet.</label>
                            <span><?= __('Today') ?></span>
                        </div>
                    
                        <div class="task">
                            <input type="checkbox" id="dummy-task-4">
                            <label for="dummy-task-4">Lorem ipsum dolor sit amet.</label>
                            <span><?= __('Today') ?></span>
                        </div>
                    
                        <div class="task">
                            <input type="checkbox" id="dummy-task-5">
                            <label for="dummy-task-5">Lorem ipsum dolor sit amet.</label>
                            <span><?= __('Today') ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-3 mb-16">
            <div class="card">
                <h2><?= __('Schedule today') ?></h2>
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
                    <div class="btn-colored">
                        <?= ts_icon('plus'); ?>
                    </div>
                </div>
                <div class="card-main">
                    <div class="projects-wrapper">
                        <div class="project">
                            <p class="name">Project 1</p>
                            <progress min="0" max="100" value="8">8%</progress>
                        </div>
                        <div class="project">
                            <p class="name">Project 2</p>
                            <progress min="0" max="100" value="100">100%</progress>
                        </div>
                        <div class="project">
                            <p class="name">Project 3</p>
                            <progress min="0" max="100" value="95">95%</progress>
                        </div>
                        <div class="project">
                            <p class="name">Project 4</p>
                            <progress min="0" max="100" value="55">55%</progress>
                        </div>
                        <div class="project">
                            <p class="name">Project 5</p>
                            <progress min="0" max="100" value="23">23%</progress>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4 mb-16">
            <div class="card">
                <h2><?= __('Activity') ?></h2>
            </div>
        </div>
        <div class="col-4 mb-16">
            <div class="card">
                <h2><?= __('Notes') ?></h2>
            </div>
        </div>
    </div>
</div>