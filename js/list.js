var Delete = (function(){

	var deleteAddress = function(id){
		var def = new $.Deferred();
		$.ajax({
			url: Util.config.addressHost + id,
				headers: {
					Authorization : Security.getAuthorizationHeader(),
					Accept: 'application/json'
				},
				method: 'DELETE'
		}).done(function(data, textStatus, jqXHR){
			def.resolve(data);
		}).fail(function(jqXHR, textStatus, errorThrown){
			//TODO: Handle errors
			def.reject();
		});
		return def.promise();
	};

	return {
		deleteAddress: deleteAddress
	};

})();

var Redirect = (function(){

	var editAddress = function(id){
		window.sessionStorage.setItem('addressId', id);
		window.location.href = 'edit.html';
	};

	return {
		editAddress: editAddress
	};

})();

var List =  (function(){

	var getAddresses = function(){
		var def = new $.Deferred();
		$.ajax({
			url: Util.config.addressHost,
				headers: {
					Authorization : Security.getAuthorizationHeader(),
					Accept: 'application/json'
				},
				method: 'GET'
		}).done(function(data, textStatus, jqXHR){
			def.resolve(data);
		}).fail(function(jqXHR, textStatus, errorThrown){
			//TODO: Handle errors
			def.reject();
		});
		return def.promise();
	};

	var loadAddresses = function(data){
		var divAddresses = $('#divAddresses');
		$.each(data.data, function(index, value){
			var divItem = $('<div/>')
				.attr('id', value.id)
				.text(value.label)
				.appendTo(divAddresses);
			var editItem = $('<a></a>')
				.attr('href', '#')
				.text(' Edit')
				.appendTo(divItem);
			editItem.click(function(){
				Redirect.editAddress(value.id);
			})
			var deleteItem = $('<a></a>')
				.attr('href', '#')
				.text(' Delete')
				.appendTo(divItem);
			deleteItem.click(function(){
				if (confirm('Deseja realmente apagar o endereço?')){
					Delete.deleteAddress(value.id).done(function(){
						$('#divAddresses > div').remove();
						getAddresses().done(function(reloadedData){
							loadAddresses(reloadedData);
						}).fail(function(){
							//TODO: Handle errors
						});
					}).fail(function(){
						//TODO: Handle errors
					});
				}
			});
		});
	};

	return {
		getAddresses: getAddresses,
		loadAddresses: loadAddresses
	};

})();

var Main = (function(List, Redirect, Delete, Util, Security){

	var init = function(){
		initControls();
		List.getAddresses().done(function(data){
			List.loadAddresses(data);
		}).fail(function(){

		});
	};

	var initControls = function(){
		$('#btnAdd').click(function(){
			window.location.href = 'edit.html';
		});
	};

	return {
		init: init
	};

})(List, Redirect, Delete, Util, Security);

$(document).ready(function(){
	if (!Security.logged()){
		window.location.href = 'index.html';
	}
	Main.init();
});
