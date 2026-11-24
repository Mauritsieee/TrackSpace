<?php

return function (PDO $db): void {
    $db->exec("
        CREATE TABLE IF NOT EXISTS project_statuses (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            slug VARCHAR(50) NOT NULL UNIQUE,
            color VARCHAR(7) NOT NULL DEFAULT '#7042D9',
            position INT UNSIGNED NOT NULL DEFAULT 0,
            is_completed BOOLEAN NOT NULL DEFAULT FALSE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS task_statuses (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            slug VARCHAR(50) NOT NULL UNIQUE,
            color VARCHAR(7) NOT NULL DEFAULT '#7042D9',
            position INT UNSIGNED NOT NULL DEFAULT 0,
            is_completed BOOLEAN NOT NULL DEFAULT FALSE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS priority_levels (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            slug VARCHAR(50) NOT NULL UNIQUE,
            color VARCHAR(7) NOT NULL DEFAULT '#a78bfa',
            position INT UNSIGNED NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS projects (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            description TEXT NULL,
            icon VARCHAR(100) NULL,
            color VARCHAR(7) NOT NULL DEFAULT '#7042D9',
            status_id INT UNSIGNED NOT NULL,
            priority VARCHAR(20) NOT NULL DEFAULT 'normal',
            start_date DATE NULL,
            due_date DATE NULL,
            created_by INT UNSIGNED NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            completed_at DATETIME NULL,
            INDEX (status_id),
            INDEX (created_by),
            FOREIGN KEY (status_id) REFERENCES project_statuses(id),
            FOREIGN KEY (created_by) REFERENCES users(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS tasks (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            project_id BIGINT UNSIGNED NULL,
            parent_id BIGINT UNSIGNED NULL,
            title VARCHAR(200) NOT NULL,
            description TEXT NULL,
            status_id INT UNSIGNED NOT NULL,
            priority VARCHAR(20) NOT NULL DEFAULT 'normal',
            start_date DATETIME NULL,
            due_date DATETIME NULL,
            estimated_minutes INT UNSIGNED NULL,
            completed_at DATETIME NULL,
            created_by INT UNSIGNED NOT NULL,
            assigned_to INT UNSIGNED NULL,
            position INT UNSIGNED NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX (project_id),
            INDEX (parent_id),
            INDEX (status_id),
            INDEX (created_by),
            INDEX (assigned_to),
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
            FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (status_id) REFERENCES task_statuses(id),
            FOREIGN KEY (created_by) REFERENCES users(id),
            FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS labels (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            slug VARCHAR(50) NOT NULL UNIQUE,
            color VARCHAR(7) NOT NULL DEFAULT '#7042D9',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS project_labels (
            project_id BIGINT UNSIGNED NOT NULL,
            label_id INT UNSIGNED NOT NULL,
            PRIMARY KEY (project_id, label_id),
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS task_labels (
            task_id BIGINT UNSIGNED NOT NULL,
            label_id INT UNSIGNED NOT NULL,
            PRIMARY KEY (task_id, label_id),
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    // Insert default project statuses
    $db->exec("
        INSERT IGNORE INTO project_statuses (id, name, slug, color, position, is_completed) VALUES
        (1, 'Planning', 'planning', '#7042D9', 0, 0),
        (2, 'Active', 'active', '#1CBD15', 1, 0),
        (3, 'Completed', 'completed', '#439DFF', 2, 1)
    ");

    // Insert default task statuses
    $db->exec("
        INSERT IGNORE INTO task_statuses (id, name, slug, color, position, is_completed) VALUES
        (1, 'Backlog', 'backlog', '#94A3B8', 0, 0),
        (2, 'To Do', 'todo', '#7042D9', 1, 0),
        (3, 'In Progress', 'in_progress', '#1CBD15', 2, 0),
        (4, 'Done', 'done', '#439DFF', 4, 1),
        (5, 'On Hold', 'on_hold', '#F59E0B', 3, 0),
        (6, 'Cancelled', 'cancelled', '#EF4444', 5, 0)
    ");

    // Insert default priority levels
    $db->exec("
        INSERT IGNORE INTO priority_levels (id, name, slug, color, position) VALUES
        (1, 'Low', 'low', '#69db7c', 0),
        (2, 'Normal', 'normal', '#a78bfa', 1),
        (3, 'High', 'high', '#ff6b6b', 2)
    ");
};
