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
