$(document).ready(function(){
	$('#btnLogin').click(function(){
		var user = $('#txtUser').val();
		var password = $('#txtPassword').val();
		//TODO:Validate fields
		Security.login('desafio.front@hotmart.com.br','123456').done(function(){
			window.location.href = 'list.html';
		}).fail(function(){
			//TODO: Handle errors
		});
	});
});
