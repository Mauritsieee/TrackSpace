<div class="login-card">
    <div class="login-card-header">
        <h1><?= __('Welcome back') ?></h1>
        <p><?= __('Sign in to your TrackSpace account') ?></p>
    </div>
    <div class="login-card-body">
        <form id="loginForm" method="POST">
            <?php
                $_SESSION['csrf_token'] ??= bin2hex(random_bytes(32));
                ?>

                <input type="hidden" name="csrf_token"
                    value="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8') ?>">
                    
            <div class="form-group">
                <label for="email"><?= __('Email address') ?></label>
                <input type="email" id="email" name="email" placeholder="name@example.com" autocomplete="email" required>
            </div>

            <div class="form-group">
                <label for="password"><?= __('Password') ?></label>
                <input type="password" id="password" name="password" autocomplete="current-password" required>
            </div>

            <button type="submit" class="btn-primary">
                <?= __('Sign in') ?>
            </button>
        </form>
    </div>
    <div class="login-card-footer">
        <p><?= __("Don't have an account?") ?> <a href="#"><?= __('Create account') ?></a></p>
    </div>
</div>