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
