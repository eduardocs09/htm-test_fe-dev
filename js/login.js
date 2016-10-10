$(document).ready(function() {
    $('#btnLogin').click(function() {
        var user = $('#txtUser').val();
        var password = $('#txtPassword').val();
        if (user && password) {
            Security.login(user, password).done(function() {
                window.location.href = 'list.html';
            }).fail(function() {
                //TODO: Handle errors
            });
        }
    });
});
