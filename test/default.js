
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert');



	var CRUDMessage = require('../')
		, message;



	describe('CRUDMessage', function(){
		it('shoud not crash when instantiated', function(){
			new CRUDMessage();
		});


		it('shoud not crash when instantiated with options', function(){
			message = new CRUDMessage({
				  action 			: CRUDMessage.LIST
				, resource 			: 'broker'
				, resourceId 		: 23
				, relatedResource 	: 'etp'
				, relatedResourceId : 'stringId'
				, selected 			: ['*', 'api.*']
				, filter 			: CRUDMessage.filters.and({
					'api.key' 		: CRUDMessage.filters.in('a', 'b')
				})
				, sender 			: 'uid--sender-----------D'
				, recipient	 		: 'uid--recipient--------D'
			});

			assert.equal(JSON.stringify(message.toJSON()), '{"sender":{"uid":"uid--sender-----------D"},"recipient":{"uid":"uid--recipient--------D"},"headers":{},"content":null,"action":"list","resource":"broker","resourceId":23,"relatedResource":"etp","relatedResourceId":"stringId","selected":["*","api.*"],"filter":{"type":"and","items":{"api.key":{"fn":"in","value":[]}}}}');
		});



		it('should be able to create a response', function(){
			response = message.createResponse([{im:'data'}], {header: 3}, 'ok');

			assert.equal(JSON.stringify(response.toJSON()), '{"sender":{"uid":"uid--recipient--------D"},"recipient":{"uid":"uid--sender-----------D"},"headers":{"header":3},"content":[{"im":"data"}],"status":"ok"}');
		});
	});
	