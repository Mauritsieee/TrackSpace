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
                    callback(ts_translate('Error loading projects'));
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
                    callback(ts_translate('Error creating project'));
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
                    callback(ts_translate('Error deleting project'));
                }
            });
        }
    };
});
