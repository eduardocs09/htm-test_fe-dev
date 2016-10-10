var Edit = (function(){

	var getAddressObjectToSave = function(){
		var items = $('#divAvailableItems > a.active');
		var itemsIds = new Array();

		$.each(items, function(index, value){
			itemsIds.push(value.id);
		});

		var address = JSON.stringify({
  		'label': $('#txtName').val(),
  		'latitude': 0,
  		'longitude': 0,
  		'city': $('#txtCity').val(),
  		'zipCode': $('#txtCep').val(),
  		'state': $('#txtState').val(),
  		'complement': $('#txtComplement').val(),
  		'address': $('#txtAdress').val(),
  		'neighborhood': $('#txtNeighborhood').val(),
  		'number': $('#txtNumber').val(),
  		'country': 'Brasil',
			'availableItems': itemsIds
		})
		return address;

	};

	var getAddressToEdit = function(id){
		var def = new $.Deferred();
		$.ajax({
			url: Util.config.addressHost + id,
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

	var loadAddressData = function(data){
		$('#txtName').val(data.label);
		$('#txtCep').val(data.zipCode);
		$('#txtAdress').val(data.address);
		$('#txtNumber').val(data.number);
		$('#txtComplement').val(data.complement);
		$('#txtNeighborhood').val(data.neighborhood);
		$('#txtCity').val(data.city);
		$('#txtState').val(data.state);

		renderCheckListItems(data.checklistItems)
	};

	var renderCheckListItems = function(items){
		var divItems = $('#divAvailableItems');
		$.each(items, function(index, value){
			var anchorItem = $('<a></a>')
				.attr('id', value.id)
				.attr('href', '#')
				.text(value.name)
				.appendTo(divItems);
			if (value.available){
				anchorItem.attr('class', 'list-group-item active');
			}
			else{
				anchorItem.attr('class', 'list-group-item');
			}
			//var breakObj = $('<br/>').appendTo(anchorItem);
			anchorItem.click(function(){
				if (anchorItem.hasClass('active')){
					anchorItem.removeClass('active');
				}
				else{
					anchorItem.addClass('active');
				}
			});
		});
	};

	return {
		getAddressObjectToSave: getAddressObjectToSave,
		getAddressToEdit: getAddressToEdit,
		loadAddressData: loadAddressData
	};

})();

var Add = (function(){

	var getAddressObjectToSave = function(){
		var address = JSON.stringify({
  		'label': $('#txtName').val(),
  		'latitude': 0,
  		'longitude': 0,
  		'city': $('#txtCity').val(),
  		'zipCode': $('#txtCep').val(),
  		'state': $('#txtState').val(),
  		'complement': $('#txtComplement').val(),
  		'address': $('#txtAdress').val(),
  		'neighborhood': $('#txtNeighborhood').val(),
  		'number': $('#txtNumber').val(),
  		'country': 'Brasil'
		})
		return address;
	};

	return {
		getAddressObjectToSave: getAddressObjectToSave
	};

})();

var Main = (function(Add, Edit, Security, Util){
	var config = {
		addressId: null
	};

	var init = function(){
		getAddressId();
		initControls();

		if (config.addressId) {
			Edit.getAddressToEdit(config.addressId).done(function(data){
				Edit.loadAddressData(data);
			}).fail(function(){
				//TODO: Handle errors
			});
		}
	};

	var initControls = function(){

		$('#lblTitle').text(function(){
			if (config.addressId){
				return 'Atualização de Endereço';
			}
			else {
				return 'Cadastro de Endereço';
			}
		});

		$('input.form-auto').attr('disabled', true);

		if (!config.addressId){
				$('h6').hide();
		}

		$('#txtCep').blur(function(){
			var cep = $('#txtCep').val();
			getAddressByCep(cep).done(function(data){
				loadAddress(data);
			}).fail(function(){
				//TODO: Handle errors
			});
		});

		$('#btnSave').click(function(){
			var addressToSave = config.addressId ? Edit.getAddressObjectToSave() : Add.getAddressObjectToSave();
			saveAddress(addressToSave).done(function(data){
				if (config.addressId){
					window.sessionStorage.removeItem('addressId');
				}
				window.location.href = 'list.html';
			}).fail(function(){
				//TODO: Handle errors
			});
		});

		$('#btnCancel').click(function(){
			if (config.addressId){
				window.sessionStorage.removeItem('addressId');
			}
			window.location.href = 'list.html';
		});
	};

	var getAddressByCep = function(cep){
		var def = new $.Deferred();
		$.ajax({
			url: Util.config.cepHost + cep + '.json'
		}).done(function(data, textStatus, jqXHR){
			def.resolve(data);
		}).fail(function(jqXHR, textStatus, errorThrown){
			//TODO: Handle errors
			def.reject();
		});
		return def.promise();
	};

	var loadAddress = function(data){
		$('#txtAdress').val(data.address);
		$('#txtNeighborhood').val(data.district);
		$('#txtCity').val(data.city);
		$('#txtState').val(data.state);
	};

	var getAddressId = function(){
		var id = window.sessionStorage.getItem('addressId');
		if (id) {
			config.addressId = id;
		}
	};

	var saveAddress = function(address){
		var def = new $.Deferred();
		$.ajax({
			url: (config.addressId ? Util.config.addressHost + config.addressId : Util.config.addressHost) ,
			dataType: 'json',
			data: address,
			headers: {
				Authorization : Security.getAuthorizationHeader(),
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: (config.addressId ? 'PUT' : 'POST')
		}).done(function(data, textStatus, jqXHR){
			alert('Endereço salvo com sucesso!');
			def.resolve(data);
		}).fail(function(jqXHR, textStatus, errorThrown){
			//TODO: Handle errors
			def.reject();
		});
		return def.promise();
	}

	return{
		init: init
	};

})(Add, Edit, Security, Util);

$(document).ready(function(){
	if (!Security.logged()){
		window.location.href = 'index.html';
	}
	Main.init();
});
