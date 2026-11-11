jQuery(function($) {
    $('.toggle-aside').click(() => {
        $('body').toggleClass('collapse-sidebar');
        document.cookie = `sidebar-open=${!$('body').hasClass('collapse-sidebar')}; path=/; max-age=31536000`;
    });
});