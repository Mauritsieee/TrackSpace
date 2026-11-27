<?php
require __DIR__ . '/../../core/bootstrap.php';
auth_required();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => __('Method not allowed.')]);
    exit;
}

$user = auth_user();
$all = (int) ($_GET['all'] ?? 0);

// Parse filters
$statuses = isset($_GET['statuses']) ? array_filter(array_map('intval', (array)$_GET['statuses'])) : [];
$priorities = isset($_GET['priorities']) ? array_filter(array_map('strtolower', (array)$_GET['priorities'])) : [];
$assignedTo = (int) ($_GET['assigned_to'] ?? 0);
$projectId = (int) ($_GET['project_id'] ?? 0);

// Sorting
$sortBy = $_GET['sortBy'] ?? null;
$orderBy = $_GET['orderBy'] ?? 'created_at DESC';
$sortOrder = isset($_GET['sortOrder']) ? (array)$_GET['sortOrder'] : [];

// Pagination
$page = max(1, (int) ($_GET['page'] ?? 1));
$limit = max(1, min(100, (int) ($_GET['limit'] ?? 50)));
$offset = ($page - 1) * $limit;

// Build WHERE clause with ONLY filter params
$where = "p.created_by = ? AND t.parent_id IS NULL";
$whereParams = [$user['id']];

// Multiple status_ids
if (!empty($statuses)) {
    $placeholders = implode(',', array_fill(0, count($statuses), '?'));
    $where .= " AND t.status_id IN ($placeholders)";
    $whereParams = array_merge($whereParams, $statuses);
}

// Multiple priorities
if (!empty($priorities)) {
    $placeholders = implode(',', array_fill(0, count($priorities), '?'));
    $where .= " AND LOWER(t.priority) IN ($placeholders)";
    $whereParams = array_merge($whereParams, $priorities);
}

// Single assigned_to
if ($assignedTo > 0) {
    $where .= " AND t.assigned_to = ?";
    $whereParams[] = $assignedTo;
}

// Build ORDER BY (with separate params)
$orderByClause = "t.created_at DESC";
$orderParams = [];

if ($sortBy === 'priority' && !empty($sortOrder)) {
    // Custom priority order: HIGH, MEDIUM, LOW
    $caseClauses = [];
    foreach ($sortOrder as $i => $priority) {
        $caseClauses[] = "WHEN LOWER(t.priority) = ? THEN ?";
        $orderParams[] = strtolower($priority);
        $orderParams[] = $i;
    }
    $orderByClause = "CASE " . implode(' ', $caseClauses) . " ELSE 999 END ASC, t.created_at DESC";
} elseif ($orderBy) {
    // Parse orderBy like "created_at:desc" - default to DESC if no direction given
    if (strpos($orderBy, ':') !== false) {
        list($field, $direction) = explode(':', $orderBy);
        $orderByClause = "t.$field " . strtoupper($direction);
    } else {
        // If no colon, use as-is (e.g., "t.position ASC" or just "created_at DESC")
        if (strpos($orderBy, 't.') === 0) {
            $orderByClause = $orderBy;
        } else {
            $orderByClause = "t.$orderBy";
        }
    }
}

// Get total count for pagination (only uses WHERE params)
$countResult = db_select(
    "SELECT COUNT(*) as total FROM tasks t 
     JOIN projects p ON t.project_id = p.id 
     WHERE $where",
    $whereParams
);
$totalCount = $countResult[0]['total'] ?? 0;
$totalPages = ceil($totalCount / $limit);

// Get tasks with pagination (WHERE + ORDER + LIMIT params)
$allParams = array_merge($whereParams, $orderParams, [$limit, $offset]);

$tasks = db_select(
    "SELECT t.*, p.name as project_name, p.color as project_color, u.name as created_by_name, ua.name as assigned_to_name, 
            ts.name as status_name, ts.color as status_color, pl.color as priority_color
     FROM tasks t 
     JOIN projects p ON t.project_id = p.id 
     JOIN users u ON t.created_by = u.id
     LEFT JOIN users ua ON t.assigned_to = ua.id
     JOIN task_statuses ts ON t.status_id = ts.id
     LEFT JOIN priority_levels pl ON LOWER(pl.slug) = LOWER(t.priority)
     WHERE $where 
     ORDER BY $orderByClause
     LIMIT ? OFFSET ?",
    $allParams
);

echo json_encode([
    'success' => true, 
    'tasks' => $tasks,
    'pagination' => [
        'page' => $page,
        'limit' => $limit,
        'total' => $totalCount,
        'pages' => $totalPages,
        'hasMore' => $page < $totalPages
    ]
]);
