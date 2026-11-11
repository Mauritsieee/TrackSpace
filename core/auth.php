
<?php

function auth_user(): ?array
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $users = db_select(
        "SELECT id, name, email, created_at FROM users WHERE id = ?",
        [$_SESSION['user_id']]
    );

    return $users[0] ?? null;
}

function auth_check(): bool
{
    return auth_user() !== null;
}

function auth_register(string $name, string $email, string $password): int
{
    $name = trim($name);
    $email = strtolower(trim($email));

    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Invalid name or email.');
    }

    if (strlen($password) < 8) {
        throw new InvalidArgumentException('Password must contain at least 8 characters.');
    }

    return (int) db_insert('users', [
        'name' => $name,
        'email' => $email,
        'password' => password_hash($password, PASSWORD_DEFAULT)
    ]);
}

function auth_login(string $email, string $password): bool
{
    $users = db_select(
        "SELECT id, password FROM users WHERE email = ?",
        [strtolower(trim($email))]
    );

    $user = $users[0] ?? null;

    if (!$user || !password_verify($password, $user['password'])) {
        return false;
    }

    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $user['id'];

    return true;
}

function auth_logout(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();

        setcookie(session_name(), '', [
            'expires' => time() - 3600,
            'path' => $params['path'],
            'domain' => $params['domain'],
            'secure' => $params['secure'],
            'httponly' => $params['httponly'],
            'samesite' => $params['samesite'] ?? 'Lax'
        ]);
    }

    session_destroy();
}

function auth_required(): void
{
    if (!auth_check()) {
        header('Location: /login');
        exit;
    }
}
