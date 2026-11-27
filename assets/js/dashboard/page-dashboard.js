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





