
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
                    callback(ts_translate('Error loading statuses'));
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
                    callback(ts_translate('Error loading tasks'));
                }
            });
        },

        listAll: function(filters, callback) {
            // Backward compatibility: if filters is a function, it's the callback
            if (typeof filters === 'function') {
                callback = filters;
                filters = {};
            }
            
            const queryParams = $.extend({ all: 1 }, filters);
            
            $.ajax({
                url: ts_url('/api/tasks/list.php'),
                type: 'GET',
                data: $.param(queryParams), // Without true, arrays become statuses[]=1&statuses[]=2 etc
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        callback(null, response.tasks);
                    } else {
                        callback(response.message);
                    }
                },
                error: function() {
                    callback(ts_translate('Error loading tasks'));
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
                    callback(ts_translate('Error creating task'));
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
                    callback(ts_translate('Error updating task'));
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
                    callback(ts_translate('Error deleting task'));
                }
            });
        }
    };


