jQuery(function($) {
    const $container = $('#dashboard-activity-chart');
    if (!$container.length) return;

    const $message = $container.find('.dashboard-activity-message');
    const $graph = $container.find('.dashboard-activity-graph');
    const $canvas = $container.find('#dashboard-activity-canvas');
    let chart;
    let request;

    function loadTaskActivityChart() {
        if (request) request.abort();
        request = $.ajax({
            url: ts_url('/api/dashboard/task-activity.php'),
            type: 'GET',
            dataType: 'json'
        }).done(function(response) {
            if (!response.success || !Array.isArray(response.weeks) || typeof Chart === 'undefined') {
                $graph.prop('hidden', true);
                $message.text($container.data('error')).show();
                return;
            }

            const weeks = response.weeks;
            const createdLabel = $container.data('created');
            const completedLabel = $container.data('completed');
            const labels = weeks.map(week => week.week_start.slice(8, 10) + '-' + week.week_start.slice(5, 7));
            $canvas.attr('aria-label', weeks.map((week, index) =>
                labels[index] + ': ' + createdLabel + ' ' + week.created + ', ' + completedLabel + ' ' + week.completed
            ).join('; '));

            if (chart) chart.destroy();
            $message.hide();
            $graph.prop('hidden', false);
            chart = new Chart(document.getElementById('dashboard-activity-canvas'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: createdLabel,
                            data: weeks.map(week => week.created),
                            borderColor: '#7042D9',
                            backgroundColor: '#7042D9',
                            tension: 0.25
                        },
                        {
                            label: completedLabel,
                            data: weeks.map(week => week.completed),
                            borderColor: '#1CBD15',
                            backgroundColor: '#1CBD15',
                            tension: 0.25
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 } }
                    }
                }
            });
        }).fail(function(xhr, status) {
            if (status !== 'abort') {
                $graph.prop('hidden', true);
                $message.text($container.data('error')).show();
            }
        }).always(function() {
            request = null;
        });
    }

    window.reloadTaskActivityChart = loadTaskActivityChart;
    loadTaskActivityChart();
});
