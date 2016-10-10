var Util = (function(){
	var config = {
		cepHost: 'http://apps.widenet.com.br/busca-cep/api/cep/',
		addressHost: 'http://54.159.182.138/hack-dragonfly/rest/v1/address/'
	};

	var getFullAddress = function(obj){
		var result = obj.address + ', ' + obj.number;
		if (obj.complement){
			result += ', ' + obj.complement;
		}
		result += ' ' + obj.neighborhood + ' - ' + obj.city + '-' + obj.state + ' ' + obj.country;
		return result;
	};

	return {
		config: config,
		getFullAddress: getFullAddress
	}
})();
