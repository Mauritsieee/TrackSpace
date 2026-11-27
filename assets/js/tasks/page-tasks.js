jQuery(function($) {
    function loadTasksData() {
        return $.when(
            $.ajax({
                url: ts_url('/api/tasks/statuses.php'),
                type: 'GET',
                dataType: 'json'
            }),
            $.ajax({
                url: ts_url('/api/users/list.php'),
                type: 'GET',
                dataType: 'json'
            })
        ).done(function(statusRes, userRes) {
            // Populate status filter
            if (statusRes[0].success) {
                const $statusFilter = $('#statusFilter');
                $statusFilter.html('');
                statusRes[0].statuses.forEach(function(status) {
                    $statusFilter.append(`
                        <label><input type="checkbox" name="status" value="${status.id}"> ${escapeHtml(status.name)}</label>
                    `);
                });
            }

            // Populate assigned to filter
            if (userRes[0].success) {
                const $assignedFilter = $('#assignedToFilter');
                $assignedFilter.html('');
                userRes[0].users.forEach(function(user) {
                    $assignedFilter.append(`
                        <label><input type="checkbox" name="assigned_to" value="${user.id}"> ${escapeHtml(user.name)}</label>
                    `);
                });
            }
        });
    }

    function updateActiveFilterCount() {
        const totalFilters = 
            $('input[name="priority"]:checked').length +
            $('input[name="status"]:checked').length +
            $('input[name="assigned_to"]:checked').length +
            ($('#sortByFilter').val() !== 'created_at:desc' ? 1 : 0);

        const $count = $('#activeFiltersCount');
        if (totalFilters > 0) {
            $count.text(totalFilters).show();
        } else {
            $count.hide();
        }
    }

    function buildFilterParams() {
        const filters = { all: 1 };
        
        // Priority filter
        const selectedPriorities = $('input[name="priority"]:checked').map((i, el) => $(el).val()).get();
        if (selectedPriorities.length > 0) {
            filters.priorities = selectedPriorities;
        }

        // Status filter
        const selectedStatuses = $('input[name="status"]:checked').map((i, el) => parseInt($(el).val())).get();
        if (selectedStatuses.length > 0) {
            filters.statuses = selectedStatuses;
        }

        // Assigned to filter
        const selectedAssigned = $('input[name="assigned_to"]:checked').map((i, el) => parseInt($(el).val())).get();
        if (selectedAssigned.length > 0) {
            filters.assigned_to = selectedAssigned;
        }

        // Sort filter
        const sortValue = $('#sortByFilter').val();
        if (sortValue === 'priority') {
            filters.sortBy = 'priority';
            filters.sortOrder = ['high', 'medium', 'low', 'normal'];
        } else {
            filters.orderBy = sortValue;
        }

        return filters;
    }

    function loadTasks() {
        const filters = buildFilterParams();

        TaskManager.listAll(filters, function(err, tasks) {
            if (err) {
                ts_alert(err, 'danger');
                return;
            }
            
            const $table = $('#task-table');
            $table.html('');
            
            if (!tasks || tasks.length === 0) {
                $table.append($('<tr><td colspan="9" style="text-align: center; color: #999;"></td></tr>').find('td').text(ts_translate('No tasks found')).end());
                return;
            }
            
            tasks.forEach(function(task) {
                ts_template('task-table-detailed', task, function(html) {
                    $table.append(html);
                });
            });
            
            if (typeof attachTaskDetailHandlers === 'function') {
                attachTaskDetailHandlers();
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
                        $table.append($('<tr><td colspan="2" style="text-align: center; color: #999;"></td></tr>').find('td').text(ts_translate('No projects yet')).end());
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
                    ts_alert(response.message || ts_translate('Error loading projects'), 'danger');
                }
            },
            error: function() {
                ts_alert(ts_translate('Error loading projects'), 'danger');
            }
        });
    }

    // Initialize page
    if ($('#task-table').length > 0) {
        loadTasksData().done(function() {
            const statusId = new URLSearchParams(window.location.search).get('status');
            if (statusId && /^\d+$/.test(statusId)) {
                $('#statusFilter input').filter(function() {
                    return this.value === statusId;
                }).prop('checked', true);
                updateActiveFilterCount();
                $('#filtersContainer').show();
            }
            loadTasks();

            // Set up filter event listeners AFTER page is loaded
            $('#priorityFilter').on('change', 'input[type="checkbox"]', function() {
                updateActiveFilterCount();
                loadTasks();
            });

            $('#statusFilter').on('change', 'input[type="checkbox"]', function() {
                updateActiveFilterCount();
                loadTasks();
            });

            $('#assignedToFilter').on('change', 'input[type="checkbox"]', function() {
                updateActiveFilterCount();
                loadTasks();
            });

            $('#sortByFilter').on('change', function() {
                updateActiveFilterCount();
                loadTasks();
            });

            // Toggle filters visibility
            $('#toggleFilters').on('click', function() {
                $('#filtersContainer').slideToggle(300);
            });

            $('#closeFilters').on('click', function() {
                $('#filtersContainer').slideUp(300);
            });

            // Reset filters
            $('#resetFilters').on('click', function() {
                $('input[type="checkbox"]').prop('checked', false);
                $('#sortByFilter').val('created_at:desc');
                updateActiveFilterCount();
                loadTasks();
            });
        });
    }
    
    if ($('#projects-counter').length > 0) {
        loadProjectsCounter();
    }
    
    window.loadAllTasks = function() {
        loadTasks();
    };
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
