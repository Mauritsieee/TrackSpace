<?php auth_required(); ?>

<div class="page-header">
    <div class="page-header-text">
        <div class="page-header-text-title">
            <?= ts_icon('folder-open'); ?>
            <h1><?= __('Projects') ?></h1>
        </div>
        <p class="page-header-text-description">
            <?= __('Manage all your projects.'); ?>
        </p>
    </div>
    <div class="page-header-actions">
        <button class="add_project_form btn-primary"><?= ts_icon('plus'); ?> <?= __('New project') ?></button>
    </div>
</div>
<div class="page-main">
    <div class="container--fluid mt-30">
        <div id="projectsList" class="row" style="margin-top: 1rem;"></div>
    </div>
</div>

<div class="form-popup-wrapper" data-ts_popup="add_project_form" style="display:none;">
    <div class="card func-card">
        <div class="card-header">
            <div class="card-title">
                <h2><?= __('New project') ?></h2>
            </div>
        </div>
        <div class="card-main">
            <form id="createProjectForm">
                <div class="form-group">
                    <label for="projectName"><?= __('Project name') ?></label>
                    <input type="text" id="projectName" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="projectDescription"><?= __('Description') ?></label>
                    <textarea id="projectDescription" name="description" rows="3"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="projectPriority"><?= __('Priority') ?></label>
                    <select id="projectPriority" name="priority"></select>
                </div>

                <div class="form-group">
                    <label for="projectColor"><?= __('Color') ?></label>
                    <input type="color" id="projectColor" name="color">
                </div>
                
                <input type="submit" value="<?= __('Create') ?>" class="btn-outline">
            </form>
        </div>
    </div>
</div>