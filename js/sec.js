var Security = (function(){
	var config = {
		initToken: 'ZTZiZGVjY2ItNzM1OC00OTk3LWIzYzAtODk2NDBhZjEyZGRlOmQ5OWNmMTU0LTFjZGYtNDRiMi04MDJmLWU1YzhiYmU5NjY5OA==',
		initType: 'Basic',
		paramGrantType: 'password',
		host: 'http://api-hck.hotmart.com/security/oauth/token'
	};

	var login = function(user, password){
		var def = new $.Deferred();
		$.ajax({
			url: config.host + '?grant_type=' + config.paramGrantType + '&username=' + user + '&password=' + password,
			dataType: 'json',
			headers: {
				Authorization : config.initType + ' ' + config.initToken
			},
			method: 'POST'
		}).done(function(data, textStatus, jqXHR){
			saveAuthInfo(data.token_type, data.access_token);
			def.resolve();
		}).fail(function(jqXHR, textStatus, errorThrown){
			//TODO: Handle Errors
			alert('Acesso Negado!');
			def.reject();
		});
		return def.promise();
	}

	var saveAuthInfo = function(tokenType, token){
		window.sessionStorage.setItem('authTokenType', tokenType);
		window.sessionStorage.setItem('authToken', token);
	};

	var getAuthorizationHeader = function(){
		var authType = window.sessionStorage.getItem('authTokenType');
		var authToken = window.sessionStorage.getItem('authToken');
		return (authType.charAt(0).toUpperCase() + authType.slice(1) + ' ' + authToken);
	};

	var logged = function(){
		var authType = window.sessionStorage.getItem('authTokenType');
		var authToken = window.sessionStorage.getItem('authToken');
		return (authType && authToken);
	};

	return {
		login: login,
		getAuthorizationHeader: getAuthorizationHeader,
		logged: logged
	};
})();
