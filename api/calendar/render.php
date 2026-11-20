
<?php

require_once __DIR__ . '/../../core/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$month = (int)($_POST['month'] ?? date('m'));
$year = (int)($_POST['year'] ?? date('Y'));
$firstDay = mktime(0, 0, 0, $month, 1, $year);
$daysInMonth = date('t', $firstDay);
$startingDayOfWeek = (date('w', $firstDay) + 6) % 7;

function has_event($day, $month, $year) {
    return false;
}

$html = '<table class="calendar-table"><thead><tr>';
$html .= '<th><button class="btn-colored calendar-prev"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left preview-icon"><path d="m15 18-6-6 6-6"/></svg></button></th>';
$html .= '<th colspan="5">' . date('F Y', $firstDay) . '</th>';
$html .= '<th><button class="btn-colored calendar-next"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right preview-icon"><path d="m9 18 6-6-6-6"/></svg></button></th>';
$html .= '</tr><tr>';

foreach (['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as $day) {
    $html .= '<th>' . __($day) . '</th>';
}

$html .= '</tr></thead><tbody><tr>';

for ($i = 0; $i < $startingDayOfWeek; $i++) {
    $html .= '<td class="empty"></td>';
}

$dayCount = $startingDayOfWeek;

for ($day = 1; $day <= $daysInMonth; $day++) {
    if ($dayCount % 7 == 0 && $dayCount != $startingDayOfWeek) {
        $html .= '</tr><tr>';
    }
    $class = 'day';
    if ($day == date('j') && $month == date('m') && $year == date('Y')) {
        $class .= ' today';
    }
    if (has_event($day, $month, $year)) {
        $class .= ' has-event';
    }
    $html .= '<td class="' . $class . '"><span>' . $day . '</span></td>';
    $dayCount++;
}

while ($dayCount % 7 != 0) {
    $html .= '<td class="empty"></td>';
    $dayCount++;
}

$html .= '</tr></tbody></table>';

echo json_encode(['success' => true, 'html' => $html]);
exit;