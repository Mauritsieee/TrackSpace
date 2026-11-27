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
                ts_alert(ts_translate('Something went wrong.'), 'danger');
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
                ts_alert(xhr.responseJSON?.message || ts_translate('Logout failed.'), 'danger');
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
                ts_alert(xhr.responseJSON?.message || ts_translate('Something went wrong.'), 'danger');
            },
            complete: function() {
                $button.prop('disabled', false);
            }
        });
    });
});

jQuery(function($) {
    const $calendar = $('#DashboardCalendar');
    
    if ($calendar.length) {
        let currentMonth = new Date().getMonth() + 1;
        let currentYear = new Date().getFullYear();

        function loadCalendar(month, year) {
            $.ajax({
                url: ts_url('/api/calendar/render.php'),
                type: 'POST',
                data: { month, year },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        $calendar.html(response.html);
                        attachButtonHandlers();
                    } else {
                        $calendar.empty().append($('<p></p>').text(ts_translate('Error loading calendar')));
                    }
                },
                error: function() {
                    $calendar.empty().append($('<p></p>').text(ts_translate('Error loading calendar')));
                }
            });
        }

        function attachButtonHandlers() {
            $('.calendar-prev').on('click', function() {
                currentMonth--;
                if (currentMonth < 1) {
                    currentMonth = 12;
                    currentYear--;
                }
                loadCalendar(currentMonth, currentYear);
            });

            $('.calendar-next').on('click', function() {
                currentMonth++;
                if (currentMonth > 12) {
                    currentMonth = 1;
                    currentYear++;
                }
                loadCalendar(currentMonth, currentYear);
            });
        }

        loadCalendar(currentMonth, currentYear);
    }
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
jQuery(function($) {
    
    // Load statuses, priorities, and users for popup
    function loadPopupData() {
        return $.when(
            $.ajax({
                url: ts_url('/api/tasks/statuses.php'),
                type: 'GET',
                dataType: 'json'
            }),
            $.ajax({
                url: ts_url('/api/tasks/priorities.php'),
                type: 'GET',
                dataType: 'json'
            }),
            $.ajax({
                url: ts_url('/api/users/list.php'),
                type: 'GET',
                dataType: 'json'
            })
        ).done(function(statusRes, priorityRes, userRes) {
            // Set window variables for popup handler
            if (statusRes[0].success) {
                window.statuses = {};
                statusRes[0].statuses.forEach(status => {
                    window.statuses[status.id] = status;
                });
            }
            
            if (priorityRes[0].success) {
                window.priorities = {};
                priorityRes[0].priorities.forEach(priority => {
                    window.priorities[priority.slug] = priority.color;
                });
            }
            
            if (userRes[0].success) {
                window.users = {};
                userRes[0].users.forEach(user => {
                    window.users[user.id] = user.name;
                });
            }
        });
    }
    
    // Load dashboard statistics
    function loadDashboardStats() {
        $.ajax({
            url: ts_url('/api/dashboard/stats.php'),
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    // Update open tasks count
                    $('.link-card:has(.icon-wrapper[style*="primary-5"]) .value').text(response.open_tasks);
                    
                    // Update active projects count
                    $('.link-card:has(.icon-wrapper[style*="primary-6"]) .value').text(response.active_projects);
                    
                    // Update scheduled time (convert minutes to hours and minutes)
                    const totalMinutes = response.scheduled_minutes || 0;
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    let timeText = '';
                    if (hours > 0) {
                        timeText = hours + 'h';
                        if (minutes > 0) timeText += ' ' + minutes + 'm';
                    } else {
                        timeText = minutes + 'm';
                    }
                    $('.link-card:has(.icon-wrapper[style*="warning"]) .value').text(timeText);
                }
            },
            error: function() {
                console.error('Error loading dashboard stats');
            }
        });
    }
    
    // Reload all dashboard data (used after task updates)
    function reloadDashboardData() {
        loadDashboardStats();
        loadPriorityTasks();
        loadNewestTasks();
        loadActiveProjects();
        if (window.reloadTaskStatusChart) {
            window.reloadTaskStatusChart();
        }
        if (window.reloadTaskActivityChart) {
            window.reloadTaskActivityChart();
        }
    }
    
    // Expose reload function globally for popup handler
    window.reloadDashboardData = reloadDashboardData;
    
    // Load priority tasks
    function loadPriorityTasks() {
        const priorityFilters = {
            sortBy: 'priority',
            sortOrder: ['high', 'normal', 'low'],
            limit: 6,
            page: 1,
            statuses: [1, 2, 3, 5]
        };
        
        TaskManager.listAll(priorityFilters, function(err, tasks) {
            const $tbody = $('#dashboard-priority-tasks');
            
            if (err) {
                return $tbody.html(`<tr><td colspan="3" style="text-align: center; color: #999;">${err}</td></tr>`);
            }
            
            if (!tasks || tasks.length === 0) {
                return $tbody.empty().append($('<tr><td colspan="3" style="text-align: center; color: #999;"></td></tr>').find('td').text(ts_translate('No tasks yet')).end());
            }
            
            $tbody.html('');
            tasks.forEach(function(task) {
                ts_template('dashboard-priority-task', task, function(html) {
                    $tbody.append(html);
                });
            });
            
            // Attach click handlers for task popups
            PopupHandler.attachClickHandler('task', '.dashboard-task-row', function($element) {
                return $element.data('task-id');
            });
        });
    }
    
    // Load newest tasks
    function loadNewestTasks() {
        const newestFilters = {
            orderBy: 'created_at:desc',
            limit: 6,
            page: 1,
            statuses: [1, 2, 3, 5]
        };
        
        TaskManager.listAll(newestFilters, function(err, tasks) {
            const $tbody = $('#dashboard-newest-tasks');
            
            if (err) {
                return $tbody.html(`<tr><td colspan="3" style="text-align: center; color: #999;">${err}</td></tr>`);
            }
            
            if (!tasks || tasks.length === 0) {
                return $tbody.empty().append($('<tr><td colspan="3" style="text-align: center; color: #999;"></td></tr>').find('td').text(ts_translate('No tasks yet')).end());
            }
            
            $tbody.html('');
            tasks.forEach(function(task) {
                ts_template('dashboard-newest-task', task, function(html) {
                    $tbody.append(html);
                });
            });
            
            // Attach click handlers for task popups
            PopupHandler.attachClickHandler('task', '.dashboard-task-row', function($element) {
                return $element.data('task-id');
            });
        });
    }
    
    // Load active projects
    function loadActiveProjects() {
        $.ajax({
            url: ts_url('/api/projects/active.php'),
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    const $wrapper = $('.projects-wrapper');
                    $wrapper.html('');
                    
                    if (response.projects.length === 0) {
                        $wrapper.append($('<p style="color: #999; padding: 1rem;"></p>').text(ts_translate('No active projects')));
                        return;
                    }
                    
                    response.projects.forEach(function(project) {
                        const $project = $(`
                            <a href="${ts_url(`/project?id=${project.id}`)}" class="project">
                                <p class="name">${escapeHtml(project.name)}</p>
                                <div>
                                    <progress min="0" max="100" value="${project.progress}" style="flex: 1;"></progress>
                                    
                                </div>
                            </a>
                        `);
                        $wrapper.append($project);
                    });
                } else {
                    console.error('Failed to load projects:', response.message);
                }
            },
            error: function() {
                console.error('Error loading active projects');
            }
        });
    }
    
    // Load priority tasks (sorted by priority: high > medium > low)
    if ($('#dashboard-priority-tasks').length > 0 || $('#dashboard-newest-tasks').length > 0) {
        loadPopupData().done(function() {
            loadPriorityTasks();
            loadNewestTasks();
            
            // Attach click handlers for task popups
            PopupHandler.attachClickHandler('task', '.dashboard-task-row', function($element) {
                return $element.data('task-id');
            });
        });
    }
    
    // Load dashboard statistics
    loadDashboardStats();
    
    // Load active projects
    if ($('.projects-wrapper').length > 0) {
        loadActiveProjects();
    }
});

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}






jQuery(function($) {
    const $container = $('#dashboard-activity-chart');
    if (!$container.length) return;

    const $message = $container.find('.dashboard-activity-message');
    const $graph = $container.find('.dashboard-activity-graph');
    const $canvas = $container.find('#dashboard-activity-canvas');
    let chart;
    let request;

    function loadTaskActivityChart() {
        if (request) request.abort();
        request = $.ajax({
            url: ts_url('/api/dashboard/task-activity.php'),
            type: 'GET',
            dataType: 'json'
        }).done(function(response) {
            if (!response.success || !Array.isArray(response.weeks) || typeof Chart === 'undefined') {
                $graph.prop('hidden', true);
                $message.text($container.data('error')).show();
                return;
            }

            const weeks = response.weeks;
            const createdLabel = $container.data('created');
            const completedLabel = $container.data('completed');
            const labels = weeks.map(week => week.week_start.slice(8, 10) + '-' + week.week_start.slice(5, 7));
            $canvas.attr('aria-label', weeks.map((week, index) =>
                labels[index] + ': ' + createdLabel + ' ' + week.created + ', ' + completedLabel + ' ' + week.completed
            ).join('; '));

            if (chart) chart.destroy();
            $message.hide();
            $graph.prop('hidden', false);
            chart = new Chart(document.getElementById('dashboard-activity-canvas'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: createdLabel,
                            data: weeks.map(week => week.created),
                            borderColor: '#7042D9',
                            backgroundColor: '#7042D9',
                            tension: 0.25
                        },
                        {
                            label: completedLabel,
                            data: weeks.map(week => week.completed),
                            borderColor: '#1CBD15',
                            backgroundColor: '#1CBD15',
                            tension: 0.25
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 } }
                    }
                }
            });
        }).fail(function(xhr, status) {
            if (status !== 'abort') {
                $graph.prop('hidden', true);
                $message.text($container.data('error')).show();
            }
        }).always(function() {
            request = null;
        });
    }

    window.reloadTaskActivityChart = loadTaskActivityChart;
    loadTaskActivityChart();
});

jQuery(function($) {
    const $container = $('#dashboard-status-chart');
    if (!$container.length) return;

    const $message = $container.find('.dashboard-status-message');
    const $donut = $container.find('.dashboard-status-donut');
    const $canvas = $container.find('#dashboard-status-canvas');
    let chart;
    let request;

    function taskUrl(statusId) {
        return ts_url('/tasks') + '?status=' + encodeURIComponent(statusId);
    }

    function loadTaskStatusChart() {
        if (request) request.abort();
        $message.text($container.data('loading')).show();

        request = $.ajax({
            url: ts_url('/api/dashboard/task-statuses.php'),
            type: 'GET',
            dataType: 'json'
        }).done(function(response) {
            if (!response.success || !Array.isArray(response.statuses)) {
                $donut.prop('hidden', true);
                $message.text($container.data('error')).show();
                return;
            }

            const statuses = response.statuses;
            const total = statuses.reduce((sum, status) => sum + Number(status.task_count), 0);
            $canvas.attr('aria-label', statuses.map(status => status.name + ': ' + status.task_count).join(', '));

            if (chart) {
                chart.destroy();
                chart = null;
            }

            if (total === 0) {
                $donut.prop('hidden', true);
                $message.text($container.data('empty')).show();
                return;
            }

            if (typeof Chart === 'undefined') {
                $donut.prop('hidden', true);
                $message.text($container.data('error')).show();
                return;
            }

            $container.find('.dashboard-status-total strong').text(total);
            $message.hide();
            $donut.prop('hidden', false);
            chart = new Chart(document.getElementById('dashboard-status-canvas'), {
                type: 'doughnut',
                data: {
                    labels: statuses.map(status => status.name),
                    datasets: [{
                        data: statuses.map(status => Number(status.task_count)),
                        backgroundColor: statuses.map(status => status.color),
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '72%',
                    plugins: { legend: { display: false } },
                    onClick: function(event, elements) {
                        if (elements.length) {
                            window.location.href = taskUrl(statuses[elements[0].index].id);
                        }
                    }
                }
            });
        }).fail(function(xhr, status) {
            if (status !== 'abort') {
                $donut.prop('hidden', true);
                $message.text($container.data('error')).show();
            }
        }).always(function() {
            request = null;
        });
    }

    window.reloadTaskStatusChart = loadTaskStatusChart;
    loadTaskStatusChart();
});

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

function ts_template(templateName, data, callback) {
    $.ajax({
        url: ts_url('/api/templates/render.php'),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            template: templateName,
            data: data
        }),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                callback(response.html);
            }
        },
        error: function() {
            console.error('Template render error');
        }
    });
}

function ts_url(path = '') {
    return TS_BASE_PATH.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '');
}
jQuery(function($) {
    window.ProjectManager = {
        list: function(callback) {
            $.ajax({
                url: ts_url('/api/projects/list.php'),
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        callback(null, response.projects);
                    } else {
                        callback(response.message);
                    }
                },
                error: function() {
                    callback(ts_translate('Error loading projects'));
                }
            });
        },

        create: function($form, callback) {
            $.ajax({
                url: ts_url('/api/projects/create.php'),
                type: 'POST',
                data: $form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        callback(null, response);
                    } else {
                        callback(response.message);
                    }
                },
                error: function() {
                    callback(ts_translate('Error creating project'));
                }
            });
        },

        delete: function(id, callback) {
            $.ajax({
                url: ts_url('/api/projects/delete.php'),
                type: 'POST',
                data: { id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        callback(null, response);
                    } else {
                        callback(response.message);
                    }
                },
                error: function() {
                    callback(ts_translate('Error deleting project'));
                }
            });
        }
    };
});

jQuery(document).ready(function($) {

    function loadPriorities(callback) {
        $.get(ts_url('/api/tasks/priorities.php'), function(response) {
            if (response.success) {
                const $select = $('#projectPriority');
                $select.html('');
                response.priorities.forEach(function(priority) {
                    const isSelected = priority.slug === 'normal' ? 'selected' : '';
                    $select.append(`<option value="${priority.slug}" ${isSelected}>${priority.name}</option>`);
                });
                if (callback) callback();
            }
        });
    }

    function loadProjects() {
        ProjectManager.list(function(err, projects) {
            if (err) {
                ts_alert(err, 'danger');
                return;
            }
            
            if (projects.length === 0) {
                $('#projectsList').empty().append($('<p style="color: #999;"></p>').text(ts_translate('No projects yet')));
                return;
            }
            
            const $list = $('#projectsList');
            $list.html('');
            
            projects.forEach(function(project) {
                const data = {
                    wrapperClass: 'col-12 col-md-6 col-lg-4',
                    title: project['name'],
                    description: project['description'],
                    priority: project['priority'],
                    color: project['color'],
                    id: project['id'],
                    due_date: project['due_date']
                };
                
                ts_template('project-card', data, function(html) {
                    $list.append(html);
                    
                    $list.find('.delete-project').last().on('click', function(e) {
                        e.preventDefault();
                        const id = $(this).data('id');
                        ts_confirm(ts_translate('Are you sure you want to delete this project?'), ts_translate('Delete'), ts_translate('Cancel')).then(function(confirmed) {
                            if (confirmed) {
                                ProjectManager.delete(id, function(err) {
                                    if (err) {
                                        ts_alert(err, 'danger');
                                    } else {
                                        ts_alert(ts_translate('Project deleted'), 'success');
                                        loadProjects();
                                    }
                                });
                            }
                        });
                    });
                });
            });
        });
    }
    
    $('#createProjectForm').on('submit', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const $submit = $form.find('[type="submit"]');
        
        $submit.prop('disabled', true);
        
        ProjectManager.create($form, function(err) {
            $submit.prop('disabled', false);
            
            if (err) {
                ts_alert(err, 'danger');
            } else {
                ts_alert(ts_translate('Project created'), 'success');
                $form[0].reset();
                loadProjects();
            }
        });
    });

    if ($('#projectsList').length > 0) {
        loadPriorities(function() {
            loadProjects();
        });
    }    

});
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
                alert(ts_translate('Error saving language'));
            },
            complete: function() {
                $submit.prop('disabled', false);
            }
        });
    });
});
jQuery(function($) {
    $('.toggle-aside').click(() => {
        $('body').toggleClass('collapse-sidebar');
        document.cookie = `sidebar-open=${!$('body').hasClass('collapse-sidebar')}; path=/; max-age=31536000`;
    });
});

    window.TaskManager = {
        statuses: function(callback) {
            $.ajax({
                url: ts_url('/api/tasks/statuses.php'),
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        callback(null, response.statuses);
                    } else {
                        callback(response.message);
                    }
                },
                error: function() {
                    callback(ts_translate('Error loading statuses'));
                }
            });
        },

        list: function(projectId, callback) {
            $.ajax({
                url: ts_url('/api/tasks/list.php'),
                type: 'GET',
                data: { project_id: projectId },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        callback(null, response.tasks);
                    } else {
                        callback(response.message);
                    }
                },
                error: function() {
                    callback(ts_translate('Error loading tasks'));
                }
            });
        },

        listAll: function(filters, callback) {
            // Backward compatibility: if filters is a function, it's the callback
            if (typeof filters === 'function') {
                callback = filters;
                filters = {};
            }
            
            const queryParams = $.extend({ all: 1 }, filters);
            
            $.ajax({
                url: ts_url('/api/tasks/list.php'),
                type: 'GET',
                data: $.param(queryParams), // Without true, arrays become statuses[]=1&statuses[]=2 etc
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        callback(null, response.tasks);
                    } else {
                        callback(response.message);
                    }
                },
                error: function() {
                    callback(ts_translate('Error loading tasks'));
                }
            });
        },

        create: function($form, callback) {
            $.ajax({
                url: ts_url('/api/tasks/create.php'),
                type: 'POST',
                data: $form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        callback(null, response);
                    } else {
                        callback(response.message);
                    }
                },
                error: function() {
                    callback(ts_translate('Error creating task'));
                }
            });
        },

        update: function(id, data, callback) {
            $.ajax({
                url: ts_url('/api/tasks/update.php'),
                type: 'POST',
                data: $.extend({ id: id }, data),
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        callback(null, response);
                    } else {
                        callback(response.message);
                    }
                },
                error: function() {
                    callback(ts_translate('Error updating task'));
                }
            });
        },

        delete: function(id, callback) {
            $.ajax({
                url: ts_url('/api/tasks/delete.php'),
                type: 'POST',
                data: { id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        callback(null, response);
                    } else {
                        callback(response.message);
                    }
                },
                error: function() {
                    callback(ts_translate('Error deleting task'));
                }
            });
        }
    };



jQuery(function($) {
    const projectId = new URLSearchParams(window.location.search).get('id');
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    function setCookie(name, value) {
        document.cookie = `${name}=${value}; path=/; max-age=31536000`;
    }
    
    window.currentView = getCookie(`taskView-${projectId}`) || 'list';
    window.statuses = {};
    window.projectId = projectId;

    function loadPriorities(callback) {
        $.get(ts_url('/api/tasks/priorities.php'), function(response) {
            if (response.success) {
                window.priorities = {};
                const $select = $('#taskPriority');
                $select.html('');
                response.priorities.forEach(function(priority) {
                    const isSelected = priority.slug === 'normal' ? 'selected' : '';
                    $select.append(`<option value="${priority.slug}" ${isSelected}>${priority.name}</option>`);
                    window.priorities[priority.slug] = priority.color;
                });
                if (callback) callback();
            }
        });
    }

    function loadStatuses(callback) {
        $.get(ts_url('/api/tasks/statuses.php'), function(response) {
            if (response.success) {
                window.statuses = {};
                const $select = $('#taskStatus');
                $select.html('');
                response.statuses.forEach(status => {
                    window.statuses[status.id] = status;
                    $select.append(`<option value="${status.id}">${status.name}</option>`);
                });
                if (callback) callback();
            }
        });
    }

    function loadUsers(callback) {
        $.get(ts_url('/api/users/list.php'), function(response) {
            if (response.success) {
                window.users = {};
                response.users.forEach(user => {
                    window.users[user.id] = user.name;
                });
                if (callback) callback();
            }
        });
    }

    function loadTasks(view = 'list') {
        window.currentView = view;
        setCookie(`taskView-${projectId}`, view);
        
        TaskManager.list(projectId, function(err, tasks) {
            if (err) {
                ts_alert(err, 'danger');
                return;
            }

            if (tasks.length === 0 && view !== 'list') {
                $('#tasksList').empty().append($('<p style="color: #999; padding: 1rem;"></p>').text(ts_translate('No tasks yet')));
                return;
            }

            if (view === 'kanban') {
                renderTaskKanbanView(tasks, window.statuses);
            } else if (view === 'tabel') {
                renderTaskTableView(tasks, window.statuses);
            } else {
                renderTaskListView(tasks, window.statuses);
            }
        });
    }

    $('.tasks-view-toggle button').on('click', function() {
        const view = $(this).data('view');
        
        // Update the 'current' class
        $('.tasks-view-toggle button').removeClass('current');
        $(this).addClass('current');
        
        loadTasks(view);
    });

    $('#createTaskForm').on('submit', function(e) {
        e.preventDefault();

        const $form = $(this);
        const $submit = $form.find('[type="submit"]');

        $submit.prop('disabled', true);

        TaskManager.create($form, function(err) {
            $submit.prop('disabled', false);

            if (err) {
                ts_alert(err, 'danger');
            } else {
                ts_alert(ts_translate('Task created'), 'success');
                $form[0].reset();
                loadTasks(currentView);
            }
        });
    });

    if ($('#tasksList').length > 0) {
        loadPriorities(function() {
            loadStatuses(function() {
                loadUsers(function() {
                    loadTasks(currentView);
                });
            });
        });
    }

    window.loadTasks = loadTasks;
});

function createTaskQuick(title, statusId, callback) {
    const projectId = window.projectId;
    
    $.ajax({
        url: ts_url('/api/tasks/create.php'),
        type: 'POST',
        dataType: 'json',
        data: {
            project_id: projectId,
            title: title,
            status_id: statusId,
            priority: 'normal'
        },
        success: function(response) {
            if (response.success) {
                // Voeg de nieuwe taak direct toe aan de view
                const newTask = response.task;
                
                if (window.currentView === 'kanban') {
                    // Voeg kaart toe aan de juiste kolom
                    const $column = $(`.kanban-column-body[data-status="${statusId}"]`);
                    ts_template('task-kanban-card', newTask, function(html) {
                        $column.append(html);
                        attachTaskHandlers();
                        ts_alert(ts_translate('Task created'), 'success');
                        if (callback) callback();
                    });
                } else if (window.currentView === 'tabel') {
                    // Use template for table row
                    const $tbody = $('.tasks-table tbody');
                    ts_template('task-table-row', newTask, function(html) {
                        $tbody.append(html);
                        attachTaskHandlers();
                        attachTaskDetailHandlers();
                        ts_alert(ts_translate('Task created'), 'success');
                        if (callback) callback();
                    });
                    ts_alert(ts_translate('Task created'), 'success');
                    if (callback) callback();
                } else {
                    // List view - voeg kaart toe aan de sectie
                    const $section = $(`.task-list-section-body[data-status="${statusId}"]`).closest('.task-list-section');
                    
                    ts_template('task-list-view-card', newTask, function(html) {
                        const $body = $section.find('.task-list-section-body');
                        $body.append(html);
                        
                        // Update count
                        const $count = $section.find('.section-count');
                        $count.text(parseInt($count.text()) + 1);
                        
                        attachTaskHandlers();
                        ts_alert(ts_translate('Task created'), 'success');
                        if (callback) callback();
                    });
                }
            } else {
                ts_alert(response.message || ts_translate('Failed to create task'), 'danger');
            }
        },
        error: function(xhr) {
            ts_alert(ts_translate('Error creating task'), 'danger');
        }
    });
}

jQuery(function($) {
    function loadTasksData() {
        return $.when(
            $.ajax({
                url: ts_url('/api/tasks/statuses.php'),
                type: 'GET',
                dataType: 'json'
            }),
            $.ajax({
                url: ts_url('/api/users/list.php'),
                type: 'GET',
                dataType: 'json'
            })
        ).done(function(statusRes, userRes) {
            // Populate status filter
            if (statusRes[0].success) {
                const $statusFilter = $('#statusFilter');
                $statusFilter.html('');
                statusRes[0].statuses.forEach(function(status) {
                    $statusFilter.append(`
                        <label><input type="checkbox" name="status" value="${status.id}"> ${escapeHtml(status.name)}</label>
                    `);
                });
            }

            // Populate assigned to filter
            if (userRes[0].success) {
                const $assignedFilter = $('#assignedToFilter');
                $assignedFilter.html('');
                userRes[0].users.forEach(function(user) {
                    $assignedFilter.append(`
                        <label><input type="checkbox" name="assigned_to" value="${user.id}"> ${escapeHtml(user.name)}</label>
                    `);
                });
            }
        });
    }

    function updateActiveFilterCount() {
        const totalFilters = 
            $('input[name="priority"]:checked').length +
            $('input[name="status"]:checked').length +
            $('input[name="assigned_to"]:checked').length +
            ($('#sortByFilter').val() !== 'created_at:desc' ? 1 : 0);

        const $count = $('#activeFiltersCount');
        if (totalFilters > 0) {
            $count.text(totalFilters).show();
        } else {
            $count.hide();
        }
    }

    function buildFilterParams() {
        const filters = { all: 1 };
        
        // Priority filter
        const selectedPriorities = $('input[name="priority"]:checked').map((i, el) => $(el).val()).get();
        if (selectedPriorities.length > 0) {
            filters.priorities = selectedPriorities;
        }

        // Status filter
        const selectedStatuses = $('input[name="status"]:checked').map((i, el) => parseInt($(el).val())).get();
        if (selectedStatuses.length > 0) {
            filters.statuses = selectedStatuses;
        }

        // Assigned to filter
        const selectedAssigned = $('input[name="assigned_to"]:checked').map((i, el) => parseInt($(el).val())).get();
        if (selectedAssigned.length > 0) {
            filters.assigned_to = selectedAssigned;
        }

        // Sort filter
        const sortValue = $('#sortByFilter').val();
        if (sortValue === 'priority') {
            filters.sortBy = 'priority';
            filters.sortOrder = ['high', 'medium', 'low', 'normal'];
        } else {
            filters.orderBy = sortValue;
        }

        return filters;
    }

    function loadTasks() {
        const filters = buildFilterParams();

        TaskManager.listAll(filters, function(err, tasks) {
            if (err) {
                ts_alert(err, 'danger');
                return;
            }
            
            const $table = $('#task-table');
            $table.html('');
            
            if (!tasks || tasks.length === 0) {
                $table.append($('<tr><td colspan="9" style="text-align: center; color: #999;"></td></tr>').find('td').text(ts_translate('No tasks found')).end());
                return;
            }
            
            tasks.forEach(function(task) {
                ts_template('task-table-detailed', task, function(html) {
                    $table.append(html);
                });
            });
            
            if (typeof attachTaskDetailHandlers === 'function') {
                attachTaskDetailHandlers();
            }
        });
    }
    
    function loadProjectsCounter() {
        $.ajax({
            url: ts_url('/api/projects/list.php'),
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    const projects = response.projects;
                    const $table = $('#projects-counter');
                    $table.html('');
                    
                    if (projects.length === 0) {
                        $table.append($('<tr><td colspan="2" style="text-align: center; color: #999;"></td></tr>').find('td').text(ts_translate('No projects yet')).end());
                        return;
                    }
                    
                    projects.forEach(function(project) {
                        const $row = $(`<tr>
                            <td>${escapeHtml(project.name)}</td>
                            <td>${project.task_count || 0}</td>
                        </tr>`);
                        
                        $table.append($row);
                    });
                } else {
                    ts_alert(response.message || ts_translate('Error loading projects'), 'danger');
                }
            },
            error: function() {
                ts_alert(ts_translate('Error loading projects'), 'danger');
            }
        });
    }

    // Initialize page
    if ($('#task-table').length > 0) {
        loadTasksData().done(function() {
            const statusId = new URLSearchParams(window.location.search).get('status');
            if (statusId && /^\d+$/.test(statusId)) {
                $('#statusFilter input').filter(function() {
                    return this.value === statusId;
                }).prop('checked', true);
                updateActiveFilterCount();
                $('#filtersContainer').show();
            }
            loadTasks();

            // Set up filter event listeners AFTER page is loaded
            $('#priorityFilter').on('change', 'input[type="checkbox"]', function() {
                updateActiveFilterCount();
                loadTasks();
            });

            $('#statusFilter').on('change', 'input[type="checkbox"]', function() {
                updateActiveFilterCount();
                loadTasks();
            });

            $('#assignedToFilter').on('change', 'input[type="checkbox"]', function() {
                updateActiveFilterCount();
                loadTasks();
            });

            $('#sortByFilter').on('change', function() {
                updateActiveFilterCount();
                loadTasks();
            });

            // Toggle filters visibility
            $('#toggleFilters').on('click', function() {
                $('#filtersContainer').slideToggle(300);
            });

            $('#closeFilters').on('click', function() {
                $('#filtersContainer').slideUp(300);
            });

            // Reset filters
            $('#resetFilters').on('click', function() {
                $('input[type="checkbox"]').prop('checked', false);
                $('#sortByFilter').val('created_at:desc');
                updateActiveFilterCount();
                loadTasks();
            });
        });
    }
    
    if ($('#projects-counter').length > 0) {
        loadProjectsCounter();
    }
    
    window.loadAllTasks = function() {
        loadTasks();
    };
    window.loadProjectsCounter = loadProjectsCounter;
});

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}



function renderTaskKanbanView(tasks, statuses) {
    const $kanban = $('#tasksList');
    $kanban.html('');

    const $container = $('<div class="kanban-board"></div>');

    Object.entries(statuses).forEach(([statusId, status]) => {
        const statusTasks = tasks.filter(t => t.status_id == statusId);
        const count = statusTasks.length;
        
        const $column = $(`<div class="kanban-column" style="--status-color: ${status.color}">
            <div class="kanban-column-header">
                <div class="kanban-header-left">
                    <span class="kanban-status-icon"></span>
                    <span class="kanban-status-name">${status.name}</span>
                </div>
                <span class="kanban-status-count">${count}</span>
            </div>
            <div class="kanban-column-body" data-status="${statusId}"></div>
            <button class="kanban-add-task-btn" data-status="${statusId}">+ ${ts_translate('Add task')}</button>
        </div>`);

        const $body = $column.find('.kanban-column-body');
        
        statusTasks.forEach(task => {
            ts_template('task-kanban-card', task, function(html) {
                $body.append(html);
            });
        });

        $container.append($column);
    });

    $kanban.append($container);
    
    initKanbanDragDrop();
    attachTaskHandlers();
    attachTaskDetailHandlers();
}

function attachKanbanAddTaskHandlers() {
    $('.kanban-add-task-btn').on('click', function(e) {
        e.preventDefault();
        const statusId = $(this).data('status');
        const $btn = $(this);
        
        const $form = $(`
            <div class="kanban-add-task-form">
                <input type="text" placeholder="${ts_translate('Task title...')}" class="kanban-task-input" data-status="${statusId}">
                <div class="kanban-form-actions">
                    <button class="kanban-form-submit">${ts_translate('Add')}</button>
                    <button class="kanban-form-cancel">${ts_translate('Cancel')}</button>
                </div>
            </div>
        `);
        
        $btn.before($form);
        $btn.hide();
        $form.find('.kanban-task-input').focus();
        
        $form.find('.kanban-form-submit').on('click', function() {
            const title = $form.find('.kanban-task-input').val().trim();
            if (title) {
                createTaskQuick(title, statusId, function() {
                    $form.remove();
                    $btn.show();
                });
            }
        });
        
        $form.find('.kanban-form-cancel').on('click', function() {
            $form.remove();
            $btn.show();
        });
        
        $form.find('.kanban-task-input').on('keypress', function(e) {
            if (e.which === 13) {
                $form.find('.kanban-form-submit').click();
            }
        });
    });
}

function initKanbanDragDrop() {
    const columns = document.querySelectorAll('.kanban-column-body');
    
    columns.forEach(column => {
        new Sortable(column, {
            group: 'kanban-tasks',
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: function(evt) {
                const taskRow = evt.item;
                const taskId = taskRow.dataset.taskId;
                const newStatusId = evt.to.dataset.status;
                
                TaskManager.update(taskId, { status_id: newStatusId }, function(err) {
                    if (err) {
                        ts_alert(err, 'danger');
                        loadTasks();
                    }
                });
            }
        });
    });
}

function attachTaskHandlers() {
    $('.delete-task').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const id = $(this).data('id');
        ts_confirm(ts_translate('Delete this task?'), ts_translate('Delete'), ts_translate('Cancel')).then(function(confirmed) {
            if (confirmed) {
                TaskManager.delete(id, function(err) {
                    if (err) {
                        ts_alert(err, 'danger');
                    } else {
                        ts_alert(ts_translate('Task deleted'), 'success');
                        loadTasks();
                    }
                });
            }
        });
    });
}

function renderTaskListView(tasks, statuses) {
    const $list = $('#tasksList');
    $list.html('');

    let currentStatusIndex = 0;
    const statusIds = Object.keys(statuses);

    function renderStatus(statusId) {
        const status = statuses[statusId];
        const statusTasks = tasks.filter(t => t.status_id == statusId);

        const $section = $(`<div class="task-list-section">
            <div class="task-list-section-header" style="background-color: color-mix(in srgb, ${status.color} 12%, white)">
                <button class="section-collapse-toggle">▼</button>
                <span class="section-status-icon" style="background-color: ${status.color}"></span>
                <h2 class="task-list-section-title" style="color: ${status.color}">${status.name}</h2>
                <span class="section-count">${statusTasks.length}</span>
            </div>
            <div class="task-list-section-body" data-status="${statusId}"></div>
            <button class="list-add-task-btn" data-status="${statusId}">+ ${ts_translate('Add task')}</button>
        </div>`);

        const $body = $section.find('.task-list-section-body');
        const $toggle = $section.find('.section-collapse-toggle');
        const $addBtn = $section.find('.list-add-task-btn');
        
        let tasksPending = statusTasks.length;

        statusTasks.forEach(task => {
            ts_template('task-list-view-card', task, function(html) {
                $body.append(html);
                tasksPending--;
                if (tasksPending === 0) renderNextStatus();
            });
        });

        $toggle.on('click', function() {
            $body.toggleClass('collapsed');
            $toggle.text($body.hasClass('collapsed') ? '▶' : '▼');
        });

        $addBtn.on('click', function(e) {
            e.preventDefault();
            const statusIdValue = $(this).data('status');
            const $btn = $(this);
            
            const $form = $(`
                <div class="list-add-task-form">
                    <input type="text" placeholder="${ts_translate('New task...')}" class="list-task-input" data-status="${statusIdValue}">
                    <div class="list-form-actions">
                        <button class="list-form-submit">${ts_translate('Add')}</button>
                        <button class="list-form-cancel">${ts_translate('Cancel')}</button>
                    </div>
                </div>
            `);
            
            $btn.before($form);
            $btn.hide();
            $form.find('.list-task-input').focus();
            
            $form.find('.list-form-submit').on('click', function() {
                const title = $form.find('.list-task-input').val().trim();
                if (title) {
                    createTaskQuick(title, statusIdValue, function() {
                        $form.remove();
                        $btn.show();
                    });
                }
            });
            
            $form.find('.list-form-cancel').on('click', function() {
                $form.remove();
                $btn.show();
            });
            
            $form.find('.list-task-input').on('keypress', function(e) {
                if (e.which === 13) {
                    $form.find('.list-form-submit').click();
                }
            });
        });

        $list.append($section);
        if (tasksPending === 0) {
            renderNextStatus();
        }
    }

    function renderNextStatus() {
        currentStatusIndex++;
        if (currentStatusIndex < statusIds.length) {
            renderStatus(statusIds[currentStatusIndex]);
        } else {
            initDragDrop();
            attachTaskHandlers();
            attachTaskDetailHandlers();
        }
    }

    renderStatus(statusIds[0]);
}

function initDragDrop() {
    const sections = document.querySelectorAll('.task-list-section-body');
    
    sections.forEach(section => {
        new Sortable(section, {
            group: 'tasks',
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: function(evt) {
                const taskRow = evt.item;
                const taskId = taskRow.dataset.taskId;
                const newStatusId = evt.to.dataset.status;
                
                TaskManager.update(taskId, { status_id: newStatusId }, function(err) {
                    if (err) {
                        ts_alert(err, 'danger');
                        loadTasks();
                    }
                });
            }
        });
    });
}

function attachTaskHandlers() {
    $('.delete-task').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const id = $(this).data('id');
        ts_confirm(ts_translate('Delete this task?'), ts_translate('Delete'), ts_translate('Cancel')).then(function(confirmed) {
            if (confirmed) {
                TaskManager.delete(id, function(err) {
                    if (err) {
                        ts_alert(err, 'danger');
                    } else {
                        ts_alert(ts_translate('Task deleted'), 'success');
                        loadTasks();
                    }
                });
            }
        });
    });
}


// Initialize task popup handler
PopupHandler.registerHandler('task', {
    templateName: 'task-detail',
    deleteConfirmMessage: ts_translate('Delete this task?'),
    deletedMessage: ts_translate('Task deleted'),
    savedMessage: ts_translate('Task saved'),
    fetchData: function(taskId, callback) {
        $.when(
            $.getJSON(ts_url(`/api/tasks/get.php?id=${encodeURIComponent(taskId)}`)),
            $.getJSON(ts_url('/api/tasks/statuses.php')),
            $.getJSON(ts_url('/api/tasks/priorities.php')),
            $.getJSON(ts_url('/api/users/list.php'))
        ).done(function(taskRes, statusRes, priorityRes, userRes) {
            const [taskResponse, statusResponse, priorityResponse, userResponse] =
                [taskRes[0], statusRes[0], priorityRes[0], userRes[0]];
            if (!taskResponse.success || !taskResponse.task ||
                !statusResponse.success || !Array.isArray(statusResponse.statuses) ||
                !priorityResponse.success || !Array.isArray(priorityResponse.priorities) ||
                !userResponse.success || !Array.isArray(userResponse.users)) {
                callback(ts_translate('Failed to load task'));
                return;
            }
            const task = taskResponse.task;
            task.statuses = Object.fromEntries(statusResponse.statuses.map(status => [status.id, status]));
            task.priorities = Object.fromEntries(priorityResponse.priorities.map(priority => [priority.slug, priority.color]));
            task.users = Object.fromEntries(userResponse.users.map(user => [user.id, user.name]));
            callback(null, task);
        }).fail(function() {
            callback(ts_translate('Failed to load task'));
        });
    },
    onDelete: function(taskId, callback) {
        TaskManager.delete(taskId, callback);
    },
    onDeleteSuccess: function() {
        if (window.currentView && window.loadTasks) {
            window.loadTasks(window.currentView);
        }
        // Reload dashboard if on dashboard page
        if (window.reloadDashboardData) {
            window.reloadDashboardData();
        }
    },
    onSave: function(formData, callback) {
        $.ajax({
            url: ts_url('/api/tasks/update.php'),
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    callback(null);
                    if (window.currentView && window.loadTasks) {
                        window.loadTasks(window.currentView);
                    }
                    // Reload dashboard if on dashboard page
                    if (window.reloadDashboardData) {
                        window.reloadDashboardData();
                    }
                } else {
                    callback(response.message || ts_translate('Failed to save'));
                }
            },
            error: function() {
                callback(ts_translate('Error saving task'));
            }
        });
    },
    collectFormData: function($popup, taskId) {
        const formData = new FormData();
        formData.append('id', taskId);
        formData.append('title', $popup.find('h2').text() || '');
        formData.append('description', $popup.find('textarea[name="description"]').val());
        formData.append('status_id', $popup.find('#status').val());
        formData.append('priority', $popup.find('#priority').val());
        formData.append('start_date', $popup.find('#start_date').val());
        formData.append('due_date', $popup.find('#deadline').val());
        formData.append('estimated_minutes', $popup.find('#estimated_minutes').val());
        formData.append('assigned_to', $popup.find('#assigned_to').val());
        return formData;
    }
});

function openTaskDetail(taskId) {
    PopupHandler.open('task', taskId);
}

function attachTaskDetailHandlers() {
  $(document)
    .off("click.detail")
    .on(
      "click.detail",
      ".task-table-row, .task-list-card, .kanban-task-card",
      function (e) {
        // Don't open detail if clicking on action buttons or form elements
        if (
          $(e.target).closest(
            ".delete-task, .table-add-task-btn, .list-add-task-btn, .kanban-add-task-btn, input, button",
          ).length
        ) {
          return;
        }

        const $element = $(this);
        const taskId = $element.data("task-id");

        if (taskId) {
          openTaskDetail(taskId);
        }
      },
    );
}

function renderTaskTableView(tasks, statuses) {
    const $table = $('#tasksList');
    $table.html('');

    const $container = $(`<div class="table-view">
        <table class="tasks-table">
            <thead>
                <tr>
                    <th class="col-title">${ts_translate('Title')}</th>
                    <th class="col-status">${ts_translate('Status')}</th>
                    <th class="col-deadline">${ts_translate('Deadline')}</th>
                    <th class="col-priority">${ts_translate('Priority')}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <button class="table-add-task-btn">+ ${ts_translate('Add task')}</button>
    </div>`);

    const $tbody = $container.find('tbody');
    const $addBtn = $container.find('.table-add-task-btn');

    tasks.forEach(task => {
        ts_template('task-table-row', task, function(html) {
            $tbody.append(html);
        });
    });

    $addBtn.on('click', function(e) {
        e.preventDefault();
        const $btn = $(this);
        
        const $form = $(`
            <div class="table-add-task-form">
                <input type="text" placeholder="${ts_translate('New task...')}" class="table-task-input">
                <div class="table-form-actions">
                    <button class="table-form-submit">${ts_translate('Add')}</button>
                    <button class="table-form-cancel">${ts_translate('Cancel')}</button>
                </div>
            </div>
        `);
        
        $btn.before($form);
        $btn.hide();
        $form.find('.table-task-input').focus();
        
        $form.find('.table-form-submit').on('click', function() {
            const title = $form.find('.table-task-input').val().trim();
            if (title) {
                createTaskQuick(title, 1, function() {
                    $form.remove();
                    $btn.show();
                });
            }
        });
        
        $form.find('.table-form-cancel').on('click', function() {
            $form.remove();
            $btn.show();
        });
        
        $form.find('.table-task-input').on('keypress', function(e) {
            if (e.which === 13) {
                $form.find('.table-form-submit').click();
            }
        });
    });

    $table.append($container);
    attachTaskHandlers();
    attachTaskDetailHandlers();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function capitalizeFirst(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function attachTaskHandlers() {
    $('.delete-task').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const id = $(this).data('id');
        ts_confirm(ts_translate('Delete this task?'), ts_translate('Delete'), ts_translate('Cancel')).then(function(confirmed) {
            if (confirmed) {
                TaskManager.delete(id, function(err) {
                    if (err) {
                        ts_alert(err, 'danger');
                    } else {
                        ts_alert(ts_translate('Task deleted'), 'success');
                        loadTasks();
                    }
                });
            }
        });
    });
}
