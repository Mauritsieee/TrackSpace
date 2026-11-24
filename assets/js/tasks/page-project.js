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

            if (tasks.length === 0) {
                $('#tasksList').html('<p style="color: #999; padding: 1rem;">No tasks yet</p>');
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
        const view = $(this).text().toLowerCase();
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
                ts_alert('Task created', 'success');
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
                        ts_alert('Task created', 'success');
                        if (callback) callback();
                    });
                } else if (window.currentView === 'tabel') {
                    // Voeg rij toe aan de tabel
                    const status = window.statuses[newTask.status_id];
                    const dueDate = newTask.due_date ? new Date(newTask.due_date).toLocaleDateString('nl-NL') : '-';
                    
                    const $row = $(`<tr class="task-table-row task_details" data-task-id="${newTask.id}" data-status="${newTask.status_id}">
                        <td class="col-checkbox">
                            <input type="checkbox" class="task-checkbox" data-id="${newTask.id}">
                        </td>
                        <td class="col-title">${escapeHtml(newTask.title)}</td>
                        <td class="col-status">
                            <span class="status-badge" style="background-color: ${status.color}">
                                ${escapeHtml(status.name)}
                            </span>
                        </td>
                        <td class="col-deadline">
                            ${dueDate}
                        </td>
                        <td class="col-priority">
                            <span class="priority-badge" style="background-color: ${newTask.priority_color}">
                                ${capitalizeFirst(newTask.priority)}
                            </span>
                        </td>
                        <td class="col-actions">
                            <button class="delete-task" data-id="${newTask.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </td>
                    </tr>`);
                    
                    const $tbody = $('.tasks-table tbody');
                    $tbody.append($row);
                    attachTaskDetailHandlers();
                    ts_alert('Task created', 'success');
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
                        ts_alert('Task created', 'success');
                        if (callback) callback();
                    });
                }
            } else {
                ts_alert(response.message || 'Failed to create task', 'danger');
            }
        },
        error: function(xhr) {
            ts_alert('Error creating task', 'danger');
        }
    });
}
