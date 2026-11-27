/**
 * Generic Popup Handler
 * Reusable popup system for all pages
 * 
 * Usage:
 * PopupHandler.open(type, id, options)
 * PopupHandler.close()
 * PopupHandler.registerHandler(type, config)
 */

const PopupHandler = (function() {
    let currentPopup = null;
    let handlers = {};
    
    const defaultConfig = {
        popupClass: 'form-popup-wrapper',
        wrapperSelector: '.form-popup-wrapper',
        closeSelector: '.popup-close, .task-detail-close',
        deleteSelector: '.delete-btn, .task-delete-btn',
        saveSelector: '.btn-primary',
        backgroundClose: true
    };

    /**
     * Register a handler for a specific entity type
     * @param {string} type - Entity type (e.g., 'task', 'project')
     * @param {object} config - Handler configuration
     */
    function registerHandler(type, config) {
        handlers[type] = {
            ...defaultConfig,
            ...config
        };
    }

    /**
     * Open a popup for an entity
     * @param {string} type - Entity type
     * @param {number|string} id - Entity ID
     * @param {object} options - Additional options
     */
    function open(type, id, options = {}) {
        const config = handlers[type];
        if (!config) {
            console.error(`No handler registered for type: ${type}`);
            return;
        }

        // Get entity data
        config.fetchData(id, function(err, data) {
            if (err) {
                ts_alert(err, 'danger');
                return;
            }

            // Prepare template data
            const templateData = { ...data, ...options };
            
            // Render template
            ts_template(config.templateName, templateData, function(html) {
                // Create or reuse popup wrapper
                let $popup = $(`.${config.popupClass}.${type}-popup`);
                if ($popup.length === 0) {
                    $popup = $(`<div class="${config.popupClass} ${type}-popup" style="display:none;"></div>`);
                    $('body').append($popup);
                }

                currentPopup = { type, id, $popup, config };
                $popup.html(html);
                $popup.fadeToggle();

                // Setup close button
                $popup.find(config.closeSelector)
                    .off('click')
                    .on('click', function() {
                        close();
                    });

                // Setup delete button
                if (config.onDelete) {
                    $popup.find(config.deleteSelector)
                        .off('click')
                        .on('click', function(e) {
                            e.preventDefault();
                            handleDelete(type, id, config);
                        });
                }

                // Setup save button
                if (config.onSave) {
                    $popup.find(config.saveSelector)
                        .off('click')
                        .on('click', function(e) {
                            e.preventDefault();
                            handleSave(type, id, config, $popup);
                        });
                }

                // Setup background close
                if (config.backgroundClose) {
                    $popup.off('click.popup-close').on('click.popup-close', function(e) {
                        if ($(e.target).is(`.${config.popupClass}`)) {
                            close();
                        }
                    });
                }
            });
        });
    }

    /**
     * Close current popup
     */
    function close() {
        if (currentPopup) {
            currentPopup.$popup.fadeToggle();
            currentPopup = null;
        }
    }

    /**
     * Handle delete action
     */
    function handleDelete(type, id, config) {
        const confirmMessage = config.deleteConfirmMessage || ts_translate('Delete this item?');
        const confirmButton = config.deleteConfirmButton || ts_translate('Delete');
        const cancelButton = config.deleteCancelButton || ts_translate('Cancel');

        ts_confirm(confirmMessage, confirmButton, cancelButton).then(function(confirmed) {
            if (confirmed) {
                config.onDelete(id, function(err) {
                    if (err) {
                        ts_alert(err, 'danger');
                    } else {
                        ts_alert(config.deletedMessage || ts_translate('Item deleted'), 'success');
                        close();
                        if (config.onDeleteSuccess) {
                            config.onDeleteSuccess();
                        }
                    }
                });
            }
        });
    }

    /**
     * Handle save action
     */
    function handleSave(type, id, config, $popup) {
        const formData = config.collectFormData($popup, id);
        
        config.onSave(formData, function(err) {
            if (err) {
                ts_alert(err, 'danger');
            } else {
                ts_alert(config.savedMessage || ts_translate('Item saved'), 'success');
                close();
                if (config.onSaveSuccess) {
                    config.onSaveSuccess();
                }
            }
        });
    }

    /**
     * Attach click handlers to elements to open popup
     * @param {string} type - Entity type
     * @param {string} selector - CSS selector for clickable elements
     * @param {function} getIdFromElement - Function to extract ID from element
     */
    function attachClickHandler(type, selector, getIdFromElement) {
        $(document)
            .off(`click.popup-${type}`)
            .on(`click.popup-${type}`, selector, function(e) {
                // Check if clicking on excluded elements
                if ($(e.target).closest('.delete-btn, .task-delete-btn, input, button, [data-no-popup]').length) {
                    return;
                }

                const id = getIdFromElement($(this));
                if (id) {
                    open(type, id);
                }
            });
    }

    return {
        open,
        close,
        registerHandler,
        attachClickHandler,
        getCurrent: () => currentPopup
    };
})();
