!function() {

    var   Class         = require('ee-class')
        , type          = require('ee-types')
        , log           = require('ee-log');


    var   map
        , actionList;


    // statuscodes that will be returned on crud message responses
    actionList = [
          'list'
        , 'create'
        , 'overwrite'
        , 'update'
        , 'delete'
        , 'seeOther'
        , 'clone'
    ];



    // class implementation
    map = {};



    // apply status properties
    actionList.forEach(function(actionName) {
        Object.defineProperty(map, actionName, {
              value: actionName
            , enumerable: true
        });
    });



    // export
    module.exports = map;
}();
