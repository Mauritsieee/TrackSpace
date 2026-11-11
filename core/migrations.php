
<?php

function ts_migrate(): void
{
    $db = db();

    $db->exec("
        CREATE TABLE IF NOT EXISTS migrations (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    $executed = $db->query("SELECT migration FROM migrations")
        ->fetchAll(PDO::FETCH_COLUMN);

    $files = glob(__DIR__ . '/../database/migrations/*.php') ?: [];
    sort($files);

    foreach ($files as $file) {
        $name = basename($file);

        if (in_array($name, $executed, true)) {
            continue;
        }

        $migration = require $file;

        $migration($db);

        $stmt = $db->prepare("INSERT INTO migrations (migration) VALUES (?)");
        $stmt->execute([$name]);
    }
}
