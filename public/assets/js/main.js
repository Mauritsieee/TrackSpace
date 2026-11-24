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
                ts_alert('Er ging iets mis!');
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
                ts_alert(xhr.responseJSON?.message || 'Logout failed.', 'danger');
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
                ts_alert(xhr.responseJSON?.message || 'Er ging iets mis!', 'danger');
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
                        $calendar.html('<p>Error loading calendar</p>');
                    }
                },
                error: function() {
                    $calendar.html('<p>Error loading calendar</p>');
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

function ts_confirm(message, yesText = 'Yes', noText = 'No') {
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
function ts_template(templateName, data, callback) {
    console.log(templateName, data);
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
                    callback('Error loading projects');
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
                    callback('Error creating project');
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
                    callback('Error deleting project');
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
                $('#projectsList').html('<p style="color: #999;">No projects yet</p>');
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
                        ts_confirm('Are you sure you want to delete this project?', 'Delete', 'Cancel').then(function(confirmed) {
                            if (confirmed) {
                                ProjectManager.delete(id, function(err) {
                                    if (err) {
                                        ts_alert(err, 'danger');
                                    } else {
                                        ts_alert('Project deleted', 'success');
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
                ts_alert('Project created', 'success');
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
                alert('Error saving language');
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
jQuery(function($) {
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
                    callback('Error loading statuses');
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
                    callback('Error loading tasks');
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
                    callback('Error creating task');
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
                    callback('Error updating task');
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
                    callback('Error deleting task');
                }
            });
        }
    };
});


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
            <button class="kanban-add-task-btn" data-status="${statusId}">+ Add task</button>
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
                <input type="text" placeholder="Task title..." class="kanban-task-input" data-status="${statusId}">
                <div class="kanban-form-actions">
                    <button class="kanban-form-submit">Add</button>
                    <button class="kanban-form-cancel">Cancel</button>
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
                const taskId = taskRow.querySelector('.delete-task').dataset.id;
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
        ts_confirm('Delete this task?', 'Delete', 'Cancel').then(function(confirmed) {
            if (confirmed) {
                TaskManager.delete(id, function(err) {
                    if (err) {
                        ts_alert(err, 'danger');
                    } else {
                        ts_alert('Task deleted', 'success');
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
        
        if (statusTasks.length === 0) {
            renderNextStatus();
            return;
        }

        const $section = $(`<div class="task-list-section">
            <div class="task-list-section-header" style="background-color: color-mix(in srgb, ${status.color} 12%, white)">
                <button class="section-collapse-toggle">▼</button>
                <span class="section-status-icon" style="background-color: ${status.color}"></span>
                <h2 class="task-list-section-title" style="color: ${status.color}">${status.name}</h2>
                <span class="section-count">${statusTasks.length}</span>
            </div>
            <div class="task-list-section-body" data-status="${statusId}"></div>
            <button class="list-add-task-btn" data-status="${statusId}">+ Add task</button>
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
                    <input type="text" placeholder="New task..." class="list-task-input" data-status="${statusIdValue}">
                    <div class="list-form-actions">
                        <button class="list-form-submit">Add</button>
                        <button class="list-form-cancel">Cancel</button>
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
                const taskId = taskRow.querySelector('.delete-task').dataset.id;
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
        ts_confirm('Delete this task?', 'Delete', 'Cancel').then(function(confirmed) {
            if (confirmed) {
                TaskManager.delete(id, function(err) {
                    if (err) {
                        ts_alert(err, 'danger');
                    } else {
                        ts_alert('Task deleted', 'success');
                        loadTasks();
                    }
                });
            }
        });
    });
}


function openTaskDetail(taskId) {
  $.get(ts_url(`/api/tasks/get.php?id=${taskId}`), function (response) {
    if (response.success) {
      const task = response.task;
      task.statuses = window.statuses || {};
      task.priorities = window.priorities || {};
      task.users = window.users || {};

      // Render the template
      ts_template("task-detail", task, function (html) {
        // Create a temporary popup wrapper
        let $popup = $(".form-popup-wrapper.task-detail-popup");
        if ($popup.length === 0) {
          $popup = $(
            `<div class="form-popup-wrapper task-detail-popup" style="display:none;"></div>`,
          );
          $("body").append($popup);
        }

        $popup.html(html);
        $popup.fadeToggle();

        // Setup close button
        $popup
          .find(".task-detail-close")
          .off("click")
          .on("click", function () {
            $popup.fadeToggle();
          });

        // Setup delete button
        $popup
          .find(".task-delete-btn")
          .off("click")
          .on("click", function (e) {
            e.preventDefault();
            ts_confirm("Delete this task?", "Delete", "Cancel").then(
              function (confirmed) {
                if (confirmed) {
                  TaskManager.delete(taskId, function (err) {
                    if (err) {
                      ts_alert(err, "danger");
                    } else {
                      ts_alert("Task deleted", "success");
                      $popup.fadeToggle();
                      window.currentView && loadTasks(window.currentView);
                    }
                  });
                }
              },
            );
          });

        // Setup save button
        $popup
          .find(".btn-primary")
          .off("click")
          .on("click", function (e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('id', taskId);
            formData.append('title', $popup.find('h2').text() || task.title);
            formData.append('description', $popup.find('textarea[name="description"]').val());
            formData.append('status_id', $popup.find('#status').val());
            formData.append('priority', $popup.find('#priority').val());
            formData.append('start_date', $popup.find('#start_date').val());
            formData.append('due_date', $popup.find('#deadline').val());
            formData.append('estimated_minutes', $popup.find('#estimated_minutes').val());
            formData.append('assigned_to', $popup.find('#assigned_to').val());

            $.ajax({
              url: ts_url('/api/tasks/update.php'),
              type: 'POST',
              data: formData,
              processData: false,
              contentType: false,
              success: function (response) {
                if (response.success) {
                  ts_alert('Task saved', 'success');
                  $popup.fadeToggle();
                  if (window.currentView && window.loadTasks) {
                    window.loadTasks(window.currentView);
                  }
                } else {
                  ts_alert(response.message || 'Failed to save', 'danger');
                }
              },
              error: function () {
                ts_alert('Error saving task', 'danger');
              }
            });
          });

        // Close when clicking outside
        $popup.off("click.detail-close").on("click.detail-close", function (e) {
          if ($(e.target).is(".form-popup-wrapper.task-detail-popup")) {
            $popup.fadeToggle();
          }
        });
      });
    }
  });
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
                    <th class="col-checkbox"></th>
                    <th class="col-title">Titel</th>
                    <th class="col-status">Status</th>
                    <th class="col-deadline">Deadline</th>
                    <th class="col-priority">Prioriteit</th>
                    <th class="col-actions"></th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <button class="table-add-task-btn">+ Add task</button>
    </div>`);

    const $tbody = $container.find('tbody');
    const $addBtn = $container.find('.table-add-task-btn');

    tasks.forEach(task => {
        const status = statuses[task.status_id];
        const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString('nl-NL') : '-';

        const $row = $(`<tr class="task-table-row" data-task-id="${task.id}" data-status="${task.status_id}">
            <td class="col-checkbox">
                <input type="checkbox" class="task-checkbox" data-id="${task.id}">
            </td>
            <td class="col-title">${escapeHtml(task.title)}</td>
            <td class="col-status">
                <span class="status-badge" style="background-color: ${status.color}">
                    ${escapeHtml(status.name)}
                </span>
            </td>
            <td class="col-deadline">
                ${dueDate}
            </td>
            <td class="col-priority">
                <span class="priority-badge" style="background-color: ${task.priority_color}">
                    ${capitalizeFirst(task.priority)}
                </span>
            </td>
            <td class="col-actions">
                <button class="delete-task" data-id="${task.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        </tr>`);

        $tbody.append($row);
    });

    $addBtn.on('click', function(e) {
        e.preventDefault();
        const $btn = $(this);
        
        const $form = $(`
            <div class="table-add-task-form">
                <input type="text" placeholder="New task..." class="table-task-input">
                <div class="table-form-actions">
                    <button class="table-form-submit">Add</button>
                    <button class="table-form-cancel">Cancel</button>
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
        ts_confirm('Delete this task?', 'Delete', 'Cancel').then(function(confirmed) {
            if (confirmed) {
                TaskManager.delete(id, function(err) {
                    if (err) {
                        ts_alert(err, 'danger');
                    } else {
                        ts_alert('Task deleted', 'success');
                        loadTasks();
                    }
                });
            }
        });
    });
}
