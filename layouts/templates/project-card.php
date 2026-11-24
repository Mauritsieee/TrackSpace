<?php
$i = $data ?? [];

?>

<div class="<?= $i['wrapperClass'] ?>">

    <a class="project-card" href="<?= ts_url('/project?id=' .$i['id']); ?>">
        <div class="text-wrapper">
            <?php title($i['title'], 'h3'); ?>
            <?php text($i['description']); ?>
        </div>
        <div class="tags-wrapper">
            <?php tag($i['priority'], $i['color']); ?>
        </div>
        <div class="project-card-footer">
        
        </div>
        <div class="project-card-actions">
            <div class="delete-project" data-id="<?= $i['id']; ?>">
                <?= ts_icon('trash'); ?>
            </div>
        </div>
    </a>
</div>