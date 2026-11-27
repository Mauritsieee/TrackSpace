
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
