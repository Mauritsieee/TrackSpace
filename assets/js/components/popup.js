jQuery(document).ready(function($) {
    
    // Find all popups with data-ts_popup attribute
    $('[data-ts_popup]').each(function() {
        const popupClass = $(this).data('ts_popup');
        const $popup = $(this);
        
        // Click handler for elements with the class matching the data-ts_popup value
        $(document).on('click', '.' + popupClass, function(e) {
            e.preventDefault();
            $popup.fadeToggle();
        });
        
        // Close popup when clicking on the wrapper itself (outside the card)
        $popup.on('click', function(e) {
            if ($(e.target).is('[data-ts_popup]')) {
                $popup.fadeToggle();
            }
        });
    });
    
});