!function() {

    var   Class                 = require('ee-class')
        , type                  = require('ee-types')
        , log                   = require('ee-log')
        , clone                 = require('clone')
        , RequestMessage        = require('distributed-request-message');


    var   CrudResponse
        , statuses;




    statuses = new RequestMessage.StatusSet([
          'ok'                      // http 200, everything is fine
        , 'created'                 // http 201, the resource was created
        , 'accepted'                // http 202, data was accepted for processing, but the action as not completed, returns a url where the status can be polled
        , 'moved_permanently'       // http 301, the resource has moved and wil lnot return to its original location
        , 'moved'                   // http 207, perform the exact same action on another resource
        , 'see_other'               // http 303, get the resource under a new url, always using the list action
        , 'not_modified'            // http 304, the reource was not modified 
        , 'bad_request'             // http 400, the request could not be processed (client error)
        , 'unauthorized'            // http 401, the client is not authorized
        , 'not_found'               // http 404, resource was not found
        , 'not_acceptable'          // http 406, the request was not acceptable (applies to headers only)
        , 'conflict'                // http 409, the action is in conflict with an exisitng resource
        , 'gone'                    // http 410, the resource is gone
        , 'error'                   // http 500, the service errorred
        , 'not_implemented'         // http 501, the action cannot be completed because its not implemented
        , 'invalid_message_type'    // http 500, message cannot be accepted by a specific service because its in the wrong format
        , 'action_not_implemented'  // http 501, action is not implemented
    ]);




    // the actual crudmessage class implementation
    CrudResponse = module.exports = new Class({
        inherits: RequestMessage.Response


        // status codes
        , statuses: statuses



        // response status
        , _status: null



        // status getter & setter
        , status: {
              get: statuses.getter()
            , set: statuses.setter()
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
            return isValid.super.call(this);
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
    });



    // apply statusvcodes to class construcztor
    statuses.applyTo(CrudResponse);
}();
