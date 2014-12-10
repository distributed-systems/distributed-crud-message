!function() {
	'use strict';

	// export the request message directly
	// export the response as property of its constructor

	module.exports  			= require('./lib/CrudRequest');
	module.exports.CrudResponse = require('./lib/CrudResponse');
}();
