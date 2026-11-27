jQuery(function($) {
    const $container = $('#dashboard-status-chart');
    if (!$container.length) return;

    const $message = $container.find('.dashboard-status-message');
    const $donut = $container.find('.dashboard-status-donut');
    const $canvas = $container.find('#dashboard-status-canvas');
    let chart;
    let request;

    function taskUrl(statusId) {
        return ts_url('/tasks') + '?status=' + encodeURIComponent(statusId);
    }

    function loadTaskStatusChart() {
        if (request) request.abort();
        $message.text($container.data('loading')).show();

        request = $.ajax({
            url: ts_url('/api/dashboard/task-statuses.php'),
            type: 'GET',
            dataType: 'json'
        }).done(function(response) {
            if (!response.success || !Array.isArray(response.statuses)) {
                $donut.prop('hidden', true);
                $message.text($container.data('error')).show();
                return;
            }

            const statuses = response.statuses;
            const total = statuses.reduce((sum, status) => sum + Number(status.task_count), 0);
            $canvas.attr('aria-label', statuses.map(status => status.name + ': ' + status.task_count).join(', '));

            if (chart) {
                chart.destroy();
                chart = null;
            }

            if (total === 0) {
                $donut.prop('hidden', true);
                $message.text($container.data('empty')).show();
                return;
            }

            if (typeof Chart === 'undefined') {
                $donut.prop('hidden', true);
                $message.text($container.data('error')).show();
                return;
            }

            $container.find('.dashboard-status-total strong').text(total);
            $message.hide();
            $donut.prop('hidden', false);
            chart = new Chart(document.getElementById('dashboard-status-canvas'), {
                type: 'doughnut',
                data: {
                    labels: statuses.map(status => status.name),
                    datasets: [{
                        data: statuses.map(status => Number(status.task_count)),
                        backgroundColor: statuses.map(status => status.color),
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '72%',
                    plugins: { legend: { display: false } },
                    onClick: function(event, elements) {
                        if (elements.length) {
                            window.location.href = taskUrl(statuses[elements[0].index].id);
                        }
                    }
                }
            });
        }).fail(function(xhr, status) {
            if (status !== 'abort') {
                $donut.prop('hidden', true);
                $message.text($container.data('error')).show();
            }
        }).always(function() {
            request = null;
        });
    }

    window.reloadTaskStatusChart = loadTaskStatusChart;
    loadTaskStatusChart();
});
