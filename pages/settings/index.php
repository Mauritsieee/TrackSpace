<div class="page-header">
    <div class="page-header-text">
        <div class="page-header-text-title">
            <?= ts_icon('settings'); ?>
            <h1><?= __('Settings') ?></h1>
        </div>
        <p class="page-header-text-description">
            <?= __('Manage your user settings.'); ?>
        </p>
    </div>
</div>
<div class="page-main">
    <div class="container--fluid mt-30">
        <div class="row">
            <div class="col-5 mb-16">
                <div class="card--full func-card">
                    <div class="card-header">
                        <div class="card-title">
                            <?= ts_icon('earth'); ?>
                            <h2><?= __('Language') ?></h2>
                        </div>
                    </div>
                    <div class="card-main">
                        <form id="languageForm">
                            <select name="language" id="languageSelect">
                                <?php foreach (AVAILABLE_LANGUAGES as $v => $t): ?>
                                    <option value="<?= $v; ?>" <?= ($_COOKIE['language'] === $v) ? 'selected' : ''; ?>><?= $t; ?></option>
                                <?php endforeach; ?>
                            </select>
                            <input type="submit" value="<?= __('Save') ?>" class="btn-outline">
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>