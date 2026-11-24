<?php

function title(string $text = '', string $tag = 'h2') {
    if ($text !== '') {
        echo '<' . $tag . '>';
        echo htmlspecialchars($text);
        echo '</' . $tag . '>';
    }
}

function text(string $text = '', string $tag = 'p') {
    if ($text !== '') {
        echo '<' . $tag . '>';
        echo htmlspecialchars($text);
        echo '</' . $tag . '>';
    }
}

function tag(string $text = '', string $color = null) {
    if ($text !== '') {
        $displayColor = $color ?? '#7042d9';
        echo '<span class="tag" style="--color: '.$displayColor.'">';
        echo htmlspecialchars($text);
        echo '</span>';
    }
}