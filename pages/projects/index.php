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
</div>
<div class="page-main">
    <div class="container--fluid mt-30">
        <div class="row">
            <div class="col-5 mb-16">
                
            </div>

            <div class="col-7 mb-16">
                <div class="card">
                    <h2><?= __('Projects') ?></h2>
                    <div id="projectsList" style="margin-top: 1rem;"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="form-popup-wrapper" id="">
    <div class="card func-card">
        <div class="card-header">
            <div class="card-title">
                <?= ts_icon('plus'); ?>
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
                    <select id="projectPriority" name="priority">
                        <option value="low">Low</option>
                        <option value="normal" selected>Normal</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="projectColor"><?= __('Color') ?></label>
                    <input type="color" id="projectColor" name="color" value="#7042D9">
                </div>
                
                <input type="submit" value="<?= __('Create') ?>" class="btn-outline">
            </form>
        </div>
    </div>
</div>

<script src="<?= ts_url('/assets/js/projects/manager.js') ?>"></script>