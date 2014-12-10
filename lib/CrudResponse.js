!function() {

    var   Class                 = require('ee-class')
        , type                  = require('ee-types')
        , log                   = require('ee-log')
        , clone                 = require('clone')
        , CrudMessage           = require('./CrudMessage')
        , crudStatus            = require('./crudStatus');


    var   CrudResponse
        , ClassDefinition;



    // the actual crudmessage class implementation
    ClassDefinition = {
        inherits: CrudMessage


        // status codes
        , statuses: crudStatus


        // sent flag
        , _isSent: false


        // flags if already a response was sent onn this message
        , _responseSent: false



        // response status
        , _status: null



        // status getter & setter
        , status: {
              get: function() { return this._status;}
            , set: function(status) {
                if (!type.string(status)) throw new Error('The status must be typeof string, «'+type(status)+'» given!');
                else if (!this.statuses[status]) throw new Error('Valid status are «'+Object.keys(this.statuses).join(', ')+'», «'+status+'» given!');
                else  this._status = status;
            }
        }



        /**
         * class constructor
         */
        , init: function init(options) {
            if (options && options.status) this.status = options.status;

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
            return !!ACTIONS[this.action];
        }



        /**
         * send this message, no furterh actions allowed
         */
        , end: function() {
            if (this._isSent) throw new Error('The message was sent already!');

            // sent flag
            this._isSent = true;

            // emit on myself :)
            this.emitMessage(this);
        }




        /**
         * clone this message. the content obejct, the filter object
         * and the selects get cloned
         *
         * @param <Boolean> byRef, if set to true only references will 
         *                  will be copied (not an actual clone)
         */
        , clone: function(byRef) {
            var message = new CrudResponse();

            message.status = this.status;

            // copy the reference to the headers object
            message.headers = byRef ? this.headers : clone(this.headers);

            // copy the reference to the content object
            message.content = byRef ? this.content : clone(this.content);

            return message;
        }






        /**
         * returns a clean json representation of this object
         *
         * @returns <Object> object representation
         */
        , toJSON: function toJSON() {
            var json = toJSON.super.call(this);

            json.status = this.status;

            return json;
        }
    };






    // create class
    CrudResponse = new Class(ClassDefinition);



    // expose statuscodes
    Object.keys(crudStatus).forEach(function(statusName) {
        CrudResponse[statusName.toUpperCase()] = statusName;
    });


    // export
    module.exports = CrudResponse;
}();
