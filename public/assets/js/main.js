jQuery(function($) {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();

        const $form = $(this);
        const $button = $form.find('[type="submit"]');

        $button.prop('disabled', true);

        $.ajax({
            url: ts_url('/api/auth/login.php'),
            type: 'POST',
            data: $form.serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    window.location.href = response.redirect;
                } else {
                    alert(response.message);
                }
            },
            error: function(xhr) {
                ts_alert('Er ging iets mis!');
            },
            complete: function() {
                $button.prop('disabled', false);
            }
        });
    });
});
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

function ts_alert(message, type = "success", duration = 2000) {
  const $alert = $('<div class="ts-alert"></div>')
    .addClass("ts-alert-" + type)
    .text(message)
    .hide()
    .appendTo("body")
    .fadeIn(200);

  if (duration > 0) {
    setTimeout(() => {
      $alert.fadeOut(200, function () {
        $(this).remove();
      });
    }, duration);
  }

  return $alert;
}

function ts_url(path = '') {
    return TS_BASE_PATH.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '');
}
jQuery(function($) {
    $('.toggle-aside').click(() => {
        $('body').toggleClass('collapse-sidebar');
        document.cookie = `sidebar-open=${!$('body').hasClass('collapse-sidebar')}; path=/; max-age=31536000`;
    });
});