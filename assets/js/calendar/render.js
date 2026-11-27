jQuery(function($) {
    const $calendar = $('#DashboardCalendar');
    
    if ($calendar.length) {
        let currentMonth = new Date().getMonth() + 1;
        let currentYear = new Date().getFullYear();

        function loadCalendar(month, year) {
            $.ajax({
                url: ts_url('/api/calendar/render.php'),
                type: 'POST',
                data: { month, year },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        $calendar.html(response.html);
                        attachButtonHandlers();
                    } else {
                        $calendar.empty().append($('<p></p>').text(ts_translate('Error loading calendar')));
                    }
                },
                error: function() {
                    $calendar.empty().append($('<p></p>').text(ts_translate('Error loading calendar')));
                }
            });
        }

        function attachButtonHandlers() {
            $('.calendar-prev').on('click', function() {
                currentMonth--;
                if (currentMonth < 1) {
                    currentMonth = 12;
                    currentYear--;
                }
                loadCalendar(currentMonth, currentYear);
            });

            $('.calendar-next').on('click', function() {
                currentMonth++;
                if (currentMonth > 12) {
                    currentMonth = 1;
                    currentYear++;
                }
                loadCalendar(currentMonth, currentYear);
            });
        }

        loadCalendar(currentMonth, currentYear);
    }
});