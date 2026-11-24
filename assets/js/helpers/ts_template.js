function ts_template(templateName, data, callback) {
    console.log(templateName, data);
    $.ajax({
        url: ts_url('/api/templates/render.php'),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            template: templateName,
            data: data
        }),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                callback(response.html);
            }
        },
        error: function() {
            console.error('Template render error');
        }
    });
}
