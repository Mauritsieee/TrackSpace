
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
