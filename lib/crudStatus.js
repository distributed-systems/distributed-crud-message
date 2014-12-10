!function() {

    var   Class         = require('ee-class')
        , type          = require('ee-types')
        , log           = require('ee-log');


    var   map
        , statusList;


    // statuscodes that will be returned on crud message responses
    statusList = [
          'ok'                  // http 200, everything is fine
        , 'created'             // http 201, the resource was created
        , 'accepted'            // http 202, data was accepted for processing, but the action as not completed, returns a url where the status can be polled
        , 'movedPermanently'    // http 301, the resource has moved and wil lnot return to its original location
        , 'moved'               // http 207, perform the exact same action on another resource
        , 'seeOther'            // http 303, get the resource under a new url, always using the list action
        , 'notModified'         // http 304, the reource was not modified 
        , 'badRequest'          // http 400, the request could not be processed (client error)
        , 'unauthorized'        // http 401, the client is not authorized
        , 'invalidAction'       // http 405, the action is not implemented
        , 'notAcceptable'       // http 406, the request was not acceptable (applies to headers only)
        , 'conflict'            // http 409, the action is in conflict with an exisitng resource
        , 'gone'                // http 410, the resource is gone
        , 'error'               // http 500, the service errorred
        , 'notImplemented'      // http 501, the action cannot be completed because its not implemented
    ];




    // class implementation
    map = {};



    // apply status properties
    statusList.forEach(function(statusName) {
        Object.defineProperty(map, statusName, {
              value: statusName
            , enumerable: true
        });
    }.bind(this));



    // export
    module.exports = map;
}();
