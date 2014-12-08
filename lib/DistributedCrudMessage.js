!function() {

	var   Class 				= require('ee-class')
		, type 					= require('ee-types')
		, log 					= require('ee-log')
		, DistributedMessage 	= require('../../distributed-message');





	var DistributedCrudMessage = module.exports = new Class({
		inherits: DistributedMessage


		// constants
		, LIST 		: 'list'
		, CREATE 	: 'create'
		, UPDATE 	: 'update'
		, DELETE 	: 'delete'
		, CLONE 	: 'clone'

		// used for action validation
		, _validActions: {
			  list 		: true
			, create	: true
			, update	: true
			, delete	: true
			, clone 	: true
		}


		// the resource to work on, must be set
		, _resource: null

		// the resource id to work on, may be set if we're
		// working on one single resource
		, _resourceId: null

		// related resource, optional, set if this resource
		// is somehow related to another resource
		, _relatedResource: null

		// related resource id, optional, set if this resource
		// is somehow related to another resource
		, _relatedResourceId: null



		// the action to execute on the resource
		, _action: null



		// selected fields on this resource
		, _selectedFields: []


		// filters applied to this resource
		, _filters: {
			  type: 'and'
			, items: {
				  'id': {fn: '=', value: 4}
				, 'name': {fn: 'like', value: '%ficken%'}
				, 'event.eventData.title': {fn: 'in', value: '1,2,3,4,5,6'}
				, _: {
					  type: 'or'
					, items: {
						
					}
				}
			}
		}



		/**
		 *class constructor
		 */
		, init: function init(options) {
			init.super.call(this, options);
		}



		/**
		 * validate this message
		 */
		, isValid: function isValid() {
			return isValid.super.call(this) && this._isValidCrudMessage();
		}


		/**
		 * crud message validation
		 */
		, _isValidCrudMessage: function() {
			return this._validActions(this._action);
		}


		/**
		 * returns messages for subselected items, does partially clone this message
		 * for each submessage
		 *
		 * @param <string> optional subselected entity to returns
		 * 
		 * @returns <Array> 0 or more CRUD messages
		 */
		, getMessageForSubSelected: function(filter) {
			var   subSelects = {}
				, messages = [];

			// first we nede to get an object of subselected items
			this._selectedFields.forEach(function(field) {
				field = field.exec(/^([^\.]+)\.(.+)/gi);

				if (field && (!filter || field[1] === filter)) {
					if (!subSelects[field[1]]) subSelects[field[1]] = [];
					subSelects[field[1]].push(subSelects[field[2]]);
				}
			}.bind(this));


			// build message for each subselected entity
			Object.keys(subSelects).forEach(function(resource) {
				var message = new DistributedCrudMessage();

				// add selection
				message.select(subSelects[resource]);

				// set action
				message.action = this.action;

				// set headers
				message.headers = this.headers;

				// clone content, altough it should be empty in any case
				message.content = this.content;
			}.bind(this));


			// return 0 or more messages
			return messages;
		}





		/**
		 * clone this message. the content obejct, the filter object
		 * and the selects get cloned
		 */
		, clone: function() {

		}




		, addSelected: function(selection) {

		}


		, removeSelected: function(selection) {

		}



		, addFilter: function(resource, filter) {

		}


		, removeFilter: function(resource, filterId) {

		}
	});

	

	
	// publis on class contructor too
	module.exports.LIST 	= 'list';
	module.exports.CREATE 	= 'create';
	module.exports.UPDATE 	= 'update';
	module.exports.DELETE 	= 'delete';
	module.exports.CLONE 	= 'clone';
}();
