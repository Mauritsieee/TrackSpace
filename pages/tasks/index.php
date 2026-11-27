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
        <!-- Table & Projects -->
        <div class="row">
            <div class="col-9">
                <!-- Filter Toggle Bar -->
                <div class="filter-toggle-bar">
                    <button id="toggleFilters" class="btn-outline">
                        <?= ts_icon('list-filter'); ?>
                        <span id="activeFiltersCount" class="filter-count" style="display: none;">0</span>
                    </button>
                </div>

                <!-- Filters (Hidden by default) -->
                <div class="row mb-16" id="filtersContainer" style="display: none;">
                    <div class="col-12">
                        <div class="filters-card card--full">
                            <div class="card-header">
                                <span><?= __('Filter Tasks') ?></span>
                                <div class="header-actions">
                                    <button id="resetFilters" class="btn-link"><?= __('Reset all') ?></button>
                                    <button id="closeFilters" class="btn-link"><?= ts_icon('x'); ?></button>
                                </div>
                            </div>
                            
                            <div class="filters-grid">
                                <!-- Priority Filter -->
                                <div class="filter-group">
                                    <label class="filter-label">
                                        <?= ts_icon('flag'); ?> <?= __('Priority') ?>
                                    </label>
                                    <div class="filter-checkboxes" id="priorityFilter">
                                        <label><input type="checkbox" name="priority" value="high"> <?= __('High') ?></label>
                                        <label><input type="checkbox" name="priority" value="medium"> <?= __('Medium') ?></label>
                                        <label><input type="checkbox" name="priority" value="low"> <?= __('Low') ?></label>
                                        <label><input type="checkbox" name="priority" value="normal"> <?= __('Normal') ?></label>
                                    </div>
                                </div>

                                <!-- Status Filter -->
                                <div class="filter-group">
                                    <label class="filter-label">
                                        <?= ts_icon('circle-check'); ?> <?= __('Status') ?>
                                    </label>
                                    <div class="filter-checkboxes" id="statusFilter">
                                        <!-- Filled via AJAX -->
                                    </div>
                                </div>

                                <!-- Assigned To Filter -->
                                <div class="filter-group">
                                    <label class="filter-label">
                                        <?= ts_icon('user'); ?> <?= __('Assigned to') ?>
                                    </label>
                                    <div class="filter-checkboxes" id="assignedToFilter">
                                        <!-- Filled via AJAX -->
                                    </div>
                                </div>

                                <!-- Sort By -->
                                <div class="filter-group">
                                    <label class="filter-label">
                                        <?= ts_icon('arrow-up-down'); ?> <?= __('Sort by') ?>
                                    </label>
                                    <select id="sortByFilter">
                                        <option value="created_at:desc"><?= __('Newest first') ?></option>
                                        <option value="created_at:asc"><?= __('Oldest first') ?></option>
                                        <option value="priority"><?= __('Priority (High to Low)') ?></option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table class="task-table">
                    <thead>
                        <tr>
                            <th><?= __('Task') ?></th>
                            <th><?= __('Project') ?></th>
                            <th><?= __('Priority') ?></th>
                            <th><?= __('Estimated minutes') ?></th>
                            <th><?= __('Start date') ?></th>
                            <th><?= __('Due date') ?></th>
                            <th><?= __('Assigned to') ?></th>
                            <th><?= __('Created by') ?></th>
                            <th><?= __('Created at') ?></th>
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
                        <span><?= __('Projects') ?></span>
                    </div>
                    <table class="project-table">
                        <thead>
                            <tr>
                                <th><?= __('Project') ?></th>
                                <th><?= __('Tasks') ?></th>
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