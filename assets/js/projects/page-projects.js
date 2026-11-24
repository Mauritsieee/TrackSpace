jQuery(document).ready(function($) {

    function loadPriorities(callback) {
        $.get(ts_url('/api/tasks/priorities.php'), function(response) {
            if (response.success) {
                const $select = $('#projectPriority');
                $select.html('');
                response.priorities.forEach(function(priority) {
                    const isSelected = priority.slug === 'normal' ? 'selected' : '';
                    $select.append(`<option value="${priority.slug}" ${isSelected}>${priority.name}</option>`);
                });
                if (callback) callback();
            }
        });
    }

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
            
            const $list = $('#projectsList');
            $list.html('');
            
            projects.forEach(function(project) {
                const data = {
                    wrapperClass: 'col-12 col-md-6 col-lg-4',
                    title: project['name'],
                    description: project['description'],
                    priority: project['priority'],
                    color: project['color'],
                    id: project['id'],
                    due_date: project['due_date']
                };
                
                ts_template('project-card', data, function(html) {
                    $list.append(html);
                    
                    $list.find('.delete-project').last().on('click', function(e) {
                        e.preventDefault();
                        const id = $(this).data('id');
                        ts_confirm('Are you sure you want to delete this project?', 'Delete', 'Cancel').then(function(confirmed) {
                            if (confirmed) {
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
                });
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

    if ($('#projectsList').length > 0) {
        loadPriorities(function() {
            loadProjects();
        });
    }    

});