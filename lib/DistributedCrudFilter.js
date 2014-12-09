!function() {

    var   Class         = require('ee-class')
        , type          = require('ee-types')
        , log           = require('ee-log');


    var   ClassDefinition
        , functions;


    // functions available on the crud request
    // used to validate input and create methods
    // on the classdefinition
    functions = [
          '='
        , '>'
        , '<'
        , '<='
        , '>='
        , '!='
        , 'like'
        , 'in'
        , 'notIn'
    ];




    // class implementation
    ClassDefinition = {

        /**
         * creates an «and» group of filters
         *
         * @param <Array> optional items
         *
         * @returns <Object> «and» group object
         */
        and: function(items) {
            if (!type.array(items) && !type.null(items) && !type.undefined(items)) throw new Error('The AND filter group accepts null, undefined or an array as its parameter. «'+type(items)+'» given!');

            return {
                  type: 'and'
                , items: items || []
            };
        }


        /**
         * creates an «or» group of filters
         *
         * @param <Array> optional items
         *
         * @returns <Object> «or» group object
         */
        , or: function(items) {
            if (!type.array(items) && !type.null(items) && !type.undefined(items)) throw new Error('The OR filter group accepts null, undefined or an array as its parameter. «'+type(items)+'» given!');

            return {
                  type: 'or'
                , items: items || []
            };
        }



        /**
         * returns a function object
         *
         * @param <String> function name
         * @param <Mixed> function value
         *
         * @returns <Object> function object
         */
        , fn: function(name, value) {
            if (!type.string(name)) throw new Error('The function name must be typeof string, «'+type(name)+'» given!');
            if (!functions[name]) throw new Error('The function «'+name+'» is not supported by CRUD messages!');

            return {
                  fn    : name
                , value : value
            };
        }
    };



    // apply function contructors
    functions.forEach(function(functionName) {
        ClassDefinition[functionName] = function(value) {
            return this.fn(functionName, value);
        }
    }.bind(this));



    // export
    return new Class(ClassDefinition);
}();
