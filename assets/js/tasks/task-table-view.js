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
