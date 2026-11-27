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
