<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>TrackSpace</title>
    <link rel="stylesheet" href="<?= ts_url('/public/assets/css/main.css?v=' . $_ENV['APP_VERSION']); ?>">

    <!-- JQuery 4.0.0 -->
    <script src="https://code.jquery.com/jquery-4.0.0.min.js" integrity="sha256-OaVG6prZf4v69dPg6PhVattBXkcOWQB62pdZ3ORyrao=" crossorigin="anonymous"></script>

    <script>
        const TS_BASE_PATH = <?= json_encode(rtrim(TS_BASE_PATH, '/')) ?>;
    </script>
</head>

<?php

if (!isset($_COOKIE['sidebar-open'])) {
    setcookie('sidebar-open', 'true', time() + 31536000, '/');
    $_COOKIE['sidebar-open'] = 'true';
}

$sidebarOpen = $_COOKIE['sidebar-open'] === 'true';

?>
<body class="page-<?= htmlspecialchars(ts_page_slug(), ENT_QUOTES, 'UTF-8') ?> <?= $sidebarOpen ?: 'collapse-sidebar'; ?>">

    <?php require __DIR__ . '/sidebar.php'; ?>
    
    <div id="pageWrapper">
        <?php require __DIR__ . '/header.php'; ?>

        <main id="content">
            <?php require $page; ?>
        </main>

        <?php require __DIR__ . '/footer.php'; ?>
    </div>

    <script src="<?= ts_url('/public/assets/js/main.js?v=' . $_ENV['APP_VERSION']) ?>"></script>
</body>
</html>