

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
