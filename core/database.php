
<?php

function db(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $pdo = new PDO(
            "mysql:host={$_ENV['DB_HOST']};port={$_ENV['DB_PORT']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
            $_ENV['DB_USER'],
            $_ENV['DB_PASSWORD'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    }

    return $pdo;
}

function db_select(string $sql, array $params = []): array
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);

    return $stmt->fetchAll();
}

function db_insert(string $table, array $data): string
{
    $columns = array_keys($data);
    $fields = implode(', ', array_map(fn($col) => "`$col`", $columns));
    $placeholders = implode(', ', array_fill(0, count($data), '?'));

    $stmt = db()->prepare("INSERT INTO `$table` ($fields) VALUES ($placeholders)");
    $stmt->execute(array_values($data));

    return db()->lastInsertId();
}

function db_update(string $table, array $data, string $where, array $params = []): int
{
    $set = implode(', ', array_map(fn($col) => "`$col` = ?", array_keys($data)));

    $stmt = db()->prepare("UPDATE `$table` SET $set WHERE $where");
    $stmt->execute([...array_values($data), ...$params]);

    return $stmt->rowCount();
}

function db_delete(string $table, string $where, array $params = []): int
{
    $stmt = db()->prepare("DELETE FROM `$table` WHERE $where");
    $stmt->execute($params);

    return $stmt->rowCount();
}
