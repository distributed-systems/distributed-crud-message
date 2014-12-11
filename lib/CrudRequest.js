!function() {

    var   Class                 = require('ee-class')
        , type                  = require('ee-types')
        , log                   = require('ee-log')
        , clone                 = require('clone')
        , Arguments             = require('ee-arguments')
        , RequestMessage        = require('distributed-request-message')
        , CrudFilter            = require('./CrudFilter')
        , CrudResponse          = require('./CrudResponse');


    var   CrudRequest
        , actions;




    // Actions available on the crud request
    actions = new RequestMessage.ActionSet([
          'list'
        , 'create'
        , 'createOrUpdate'
        , 'update'
        , 'delete'
        , 'seeOther'
        , 'clone'
    ]);





    // the actual crudmessage class implementation
    CrudRequest = module.exports = new Class({
        inherits: RequestMessage


        // filter methods to build valid filter objects
        , filters: new CrudFilter()

        // expose the actions
        , actions: actions


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
        , _selectedFields: undefined


        // filters applied to this resource
        , _filter: undefined





        // action getter & setter
        , action: {
              get: actions.getter()
            , set: actions.setter()
        }


        // filter getter & setter
        , filter: {
            set: function(filter) {
                if (type.null(filter)) this._filter = {};
                else if (type.object(filter)) this._filter = filter;
                else throw new Error('The filter must be type of object or null, «'+type(filter)+'» given!');
            }
            , get: function() {return this._filter;}
        }


        // selected getter & setter
        , selected: {
            set: function(selected) {
                if (type.null(selected)) this._selectedFields = [];
                else if (type.array(selected)) this._selectedFields = selected;
                else throw new Error('The selected fields must be type of array or null, «'+type(selected)+'» given!');
            }
            , get: function() {return this._selectedFields;}
        }



        // resource getter & setter
        , resource: {
            set: function(resource) {
                if (type.string(resource) || resource === null) this._resource = resource;
                else throw new Error('The resource must be typeof string or null, «'+type(resource)+'» given!');
            }
            , get: function() {return this._resource;}
        }

        // resource id getter & setter
        , resourceId: {
            set: function(resource) {
                if (type.number(resource)) this._resourceId = resource;
                else if (type.null(resource)) this._resourceId = null;
                else if (type.string(resource)) {
                    if (!/[^0-9]/gi.test(resource)) this._resourceId = parseInt(resource, 10);
                    if (!/[^0-9\.]/gi.test(resource)) this._resourceId = parseFloat(resource);
                    else this._resourceId = resource;
                }
                else throw new Error('The resource id must be typeof number, string or null, «'+type(resource)+'» given!');
            }
            , get: function() {return this._resourceId;}
        }


        // related resource getter & setter
        , relatedResource: {
            set: function(resource) {
                if (type.string(resource) || resource === null) this._relatedResource = resource;
                else throw new Error('The resource must be typeof string or null, «'+type(resource)+'» given!');
            }
            , get: function() {return this._relatedResource;}
        }

        // related resource id getter & setter
        , relatedResourceId: {
            set: function(resource) {
                if (type.number(resource)) this._relatedResourceId = resource;
                else if (type.null(resource)) this._relatedResourceId = null;
                else if (type.string(resource)) {
                    if (!/[^0-9]/gi.test(resource)) this._relatedResourceId = parseInt(resource, 10);
                    if (!/[^0-9\.]/gi.test(resource)) this._relatedResourceId = parseFloat(resource);
                    else this._relatedResourceId = resource;
                }
                else throw new Error('The resource id must be typeof number, string or null, «'+type(resource)+'» given!');
            }
            , get: function() {return this._relatedResourceId;}
        }





        /**
         * class constructor
         */
        , init: function init(options) {
            // need to create new object instances, else they 
            // will be shared across all messages
            Class(this, '_selectedFields', Class([]).Writable());
            Class(this, '_filter', Class({}).Writable());

            // construcotr can set
            if (options) {
                if (options.action)             this.action = options.action;
                if (options.filter)             this.filter = options.filter;
                if (options.selected)           this.selected = options.selected;

                if (options.resource)           this.resource = options.resource;
                if (options.resourceId)         this.resourceId = options.resourceId;
                if (options.relatedResource)    this.relatedResource = options.relatedResource;
                if (options.relatedResourceId)  this.relatedResourceId = options.relatedResourceId;
            }


            init.super.call(this, options);
        }



        /**
         * validate this message
         */
        , isValid: function isValid() {
            return isValid.super.call(this);
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

                // pass messages down
                message.on('message', this.emitMessage.bind(this));

                messages.push(message);
            }.bind(this));


            // return 0 or more messages
            return messages;
        }





        /**
         * clone this message. the content obejct, the filter object
         * and the selects get cloned
         *
         * @param <Boolean> byRef, if set to true only references will 
         *                  will be copied (not an actual clone)
         */
        , clone: function(byRef) {
            var message = new CrudRequest();

             // select fields, use a shallow copy
            message.select(byRef ? this._selectedFields : this._selectedFields.slice());

            // filters
            message.filters = byRef ? this.filters : clone(this.filters);

            // set action
            message.action = this.action;

             // resource related
            message.resource            = this.resource;
            message.resourceId          = this.resourceId;
            message.relatedResource     = this.relatedResource;
            message.relatedResourceId   = this.relatedResourceId;
           

            // copy the reference to the headers object
            message.headers = byRef ? this.headers : clone(this.headers);

            // copy the reference to the content object
            message.content = byRef ? this.content : clone(this.content);

            // pass messages down
            message.on('message', this.emitMessage.bind(this));

            return message;
        }




        /**
         * send a response to this message
         *
         * @param <Mixed> first object or any array or null found: content
         * @apram <Mixed> second object or first object in combination with null encountered: headers
         * @param <Mixed> first string encountered: status
         */
        , sendResponse: function() {
            return this.createResponse.apply(this, Array.prototype.slice.call(arguments)).send();
        }




        /**
         * create a response for this message
         *
         * @param <Mixed> first object or any array or null found: content
         * @apram <Mixed> second object or first object in combination with null encountered: headers
         * @param <Mixed> first string encountered: status
         */
        , createResponse: function() {
            var   message   = new CrudResponse()
                , args      = new Arguments(arguments)
                , content   = args.get('array', args.get('null', args.get('object')))
                , headers   = (content === null || type.array(content)) ? args.get('object') : args.getByIndex('object', 1)
                , status    = args.get('string');

            
            // validate, set flags
            this._prepareResponse(message);


            // set data ion it
            if (content) message.content = content;
            if (headers) message.headers = headers;
            if (status)  message.status  = status;

            if (this.recipient  && (this.recipient.uid  || this.recipient.id))  message.sender     = this.recipient;
            if (this.sender     && (this.sender.uid     || this.sender.id))     message.recipient  = this.sender;
            
            return message;
        }





        , addSelected: function(selection) {
            throw new Error('not implemented yet!');
        }


        , removeSelected: function(selection) {
            throw new Error('not implemented yet!');
        }



        , addFilter: function(resource, filter) {
            throw new Error('not implemented yet!');
        }


        , removeFilter: function(resource, filterId) {
            throw new Error('not implemented yet!');
        }




        /**
         * returns a clean json representation of this object
         *
         * @returns <Object> object representation
         */
        , toJSON: function toJSON() {
            var json = toJSON.super.call(this);

            json.action             = this.action;

            json.resource           = this.resource;
            json.resourceId         = this.resourceId;
            json.relatedResource    = this.relatedResource;
            json.relatedResourceId  = this.relatedResourceId;

            json.selected           = this.selected;
            json.filter             = this.filter;

            return json;
        }
    });



    //apply actions
    actions.applyTo(CrudRequest);


    // expose filter methods
    CrudRequest.filters = new CrudFilter();
}();
