<?php 
    $asideMenuItems = array(
        'dashboard' => "Dashboard",
        'projects' => "Projects",
        'settings' => "Settings",
    );
?>

<aside>
    <nav>
        <ul>
            <?php foreach ($asideMenuItems as $s => $n) : ?>
                <li>
                    <a <?= ts_page_slug() === $s ? 'class="active"' : ''; ?> href="<?= ts_url($s); ?>"><?= __($n); ?></a>
                </li>
            <?php endforeach; ?>
        </ul>
    </nav>
</aside>