jQuery(document).ready(function($) {
    
    $('.tab-menu-button').on('click', function() {
        const tabName = $(this).data('tabmenu');
        const $menu = $(this).closest('.tab-menu');
        
        $menu.find('.tab-menu-button').removeClass('active');
        $(this).addClass('active');
        
        $menu.find('.tab-menu-panel').hide();
        $menu.find('[data-tabmenu="' + tabName + '"]').fadeIn(200);
    });
    
    $('.tab-menu-button').first().trigger('click');
    
});