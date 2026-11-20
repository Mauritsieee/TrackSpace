jQuery(function($) {
    $('#languageForm').on('submit', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const $submit = $form.find('[type="submit"]');
        
        $submit.prop('disabled', true);
        
        $.ajax({
            url: ts_url('/api/settings/language.php'),
            type: 'POST',
            data: $form.serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    location.reload();
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Error saving language');
            },
            complete: function() {
                $submit.prop('disabled', false);
            }
        });
    });
});