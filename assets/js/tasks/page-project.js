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
