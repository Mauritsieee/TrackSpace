function ts_confirm(message, yesText = ts_translate('Yes'), noText = ts_translate('No')) {
    return new Promise(function(resolve) {
        const $confirm = $('<div class="ts-confirm"></div>')
            .html(`
                <div class="ts-confirm-content">
                    <p>${message}</p>
                    <div class="ts-confirm-buttons">
                        <button class="ts-confirm-yes">${yesText}</button>
                        <button class="ts-confirm-no">${noText}</button>
                    </div>
                </div>
            `)
            .hide()
            .appendTo('body')
            .fadeIn(200);
        
        $confirm.find('.ts-confirm-yes').on('click', function() {
            $confirm.fadeOut(200, function() { $(this).remove(); });
            resolve(true);
        });
        
        $confirm.find('.ts-confirm-no').on('click', function() {
            $confirm.fadeOut(200, function() { $(this).remove(); });
            resolve(false);
        });
    });
}

