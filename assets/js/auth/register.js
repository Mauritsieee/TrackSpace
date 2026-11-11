
jQuery(function($) {
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();

        const $form = $(this);
        const $button = $form.find('[type="submit"]');

        $button.prop('disabled', true);

        $.ajax({
            url: ts_url('/api/auth/register.php'),
            type: 'POST',
            data: $form.serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    window.location.href = response.redirect;
                } else {
                    ts_alert(response.message, 'danger');
                }
            },
            error: function(xhr) {
                ts_alert(xhr.responseJSON?.message || 'Er ging iets mis!', 'danger');
            },
            complete: function() {
                $button.prop('disabled', false);
            }
        });
    });
});
