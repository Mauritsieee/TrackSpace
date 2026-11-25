jQuery(function($) {
    function loadTasksData() {
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
            window.statuses = {};
            if (statusRes[0].success) {
                statusRes[0].statuses.forEach(function(status) {
                    window.statuses[status.id] = status;
                });
            }
            
            window.priorities = {};
            if (priorityRes[0].success) {
                priorityRes[0].priorities.forEach(function(priority) {
                    window.priorities[priority.slug] = priority.color;
                });
            }
            
            window.users = {};
            if (userRes[0].success) {
                userRes[0].users.forEach(function(user) {
                    window.users[user.id] = user.name;
                });
            }
        });
    }

    function loadTasks() {
        $.ajax({
            url: ts_url('/api/tasks/list.php?all=1'),
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    const tasks = response.tasks;
                    const $table = $('#task-table');
                    $table.html('');
                    
                    if (tasks.length === 0) {
                        $table.html('<tr><td colspan="9" style="text-align: center; color: #999;">No tasks yet</td></tr>');
                        return;
                    }
                    
                    tasks.forEach(function(task) {
                        ts_template('task-table-detailed', task, function(html) {
                            $table.append(html);
                        });
                    });
                    
                    attachTaskDetailHandlers();
                } else {
                    ts_alert(response.message || 'Error loading tasks', 'danger');
                }
            },
            error: function() {
                ts_alert('Error loading tasks', 'danger');
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
                        $table.html('<tr><td colspan="2" style="text-align: center; color: #999;">No projects yet</td></tr>');
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
                    ts_alert(response.message || 'Error loading projects', 'danger');
                }
            },
            error: function() {
                ts_alert('Error loading projects', 'danger');
            }
        });
    }
    
    if ($('#task-table').length > 0) {
        loadTasksData().done(function() {
            loadTasks();
        });
    }
    
    if ($('#projects-counter').length > 0) {
        loadProjectsCounter();
    }
    
    window.loadAllTasks = loadTasks;
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

