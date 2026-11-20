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
            
            let html = '';
            projects.forEach(function(p) {
                html += '<div style="background: ' + p.color + '; padding: 1rem; margin-bottom: 1rem; border: 1px solid #ddd;">';
                html += '<div style="display: flex; justify-content: space-between; align-items: start;">';
                html += '<div>';
                html += '<strong>' + p.name + '</strong>';
                if (p.description) html += '<p style="margin: 0.5rem 0; font-size: 0.9rem; color: #666;">' + p.description + '</p>';
                html += '<small style="color: #999;">Priority: ' + p.priority + (p.due_date ? ' | Due: ' + p.due_date : '') + '</small>';
                html += '</div>';
                html += '<button class="delete-project" data-id="' + p.id + '" style="background: none; border: none; color: #dc3545; cursor: pointer; font-weight: bold; font-size: 1.5rem; padding: 0; line-height: 1;">×</button>';
                html += '</div></div>';
            });
            
            $('#projectsList').html(html);
            
            $('.delete-project').on('click', function(e) {
                e.preventDefault();
                const id = $(this).data('id');
                if (confirm('Are you sure you want to delete this project?')) {
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
    
    loadProjects();
});
