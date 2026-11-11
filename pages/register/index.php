
<div class="login-card">
    <div class="login-card-header">
        <h1><?= __('Create an account') ?></h1>
        <p><?= __('Create your TrackSpace account to get started') ?></p>
    </div>
    <div class="login-card-body">
        <form id="registerForm" method="POST">
            <?php $_SESSION['csrf_token'] ??= bin2hex(random_bytes(32)); ?>

            <input type="hidden" name="csrf_token"
                value="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8') ?>">

            <div class="form-group">
                <label for="name"><?= __('Full name') ?></label>
                <input type="text" id="name" name="name" placeholder="John Doe" autocomplete="name" required>
            </div>

            <div class="form-group">
                <label for="email"><?= __('Email address') ?></label>
                <input type="email" id="email" name="email" placeholder="name@example.com" autocomplete="email" required>
            </div>

            <div class="form-group">
                <label for="password"><?= __('Password') ?></label>
                <input type="password" id="password" name="password" autocomplete="new-password" minlength="8" required>
            </div>

            <div class="form-group">
                <label for="confirm_password"><?= __('Confirm password') ?></label>
                <input type="password" id="confirm_password" name="confirm_password" autocomplete="new-password" minlength="8" required>
            </div>

            <button type="submit" class="btn-primary">
                <?= __('Create account') ?>
            </button>
        </form>
    </div>
    <div class="login-card-footer">
        <p><?= __('Already have an account?') ?> <a href="/login"><?= __('Sign in') ?></a></p>
    </div>
</div>
