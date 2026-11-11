jQuery(function($) {
    $('#logoutButton').on('click', function() {
        $.ajax({
            url: ts_url('api/auth/logout.php'),
            type: 'POST',
            dataType: 'json',
            data: {
                csrf_token: $(this).attr('data-csrf')
            },
            success: function(response) {
                if (response.success) {
                    window.location.href = response.redirect;
                }
            },
            error: function(xhr) {
                ts_alert(xhr.responseJSON?.message || 'Logout failed.', 'danger');
            }
        });
    });
});