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
            if (!type.object(items) && !type.null(items) && !type.undefined(items)) throw new Error('The AND filter group accepts null, undefined or an object as its parameter. «'+type(items)+'» given!');

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
            if (!type.object(items) && !type.null(items) && !type.undefined(items)) throw new Error('The OR filter group accepts null, undefined or an object as its parameter. «'+type(items)+'» given!');

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
            if (functions.indexOf(name) === -1) throw new Error('The function «'+name+'» is not supported by CRUD messages!');

            return {
                  fn    : name
                , value : arguments.length === 2 ? value : Array.prototype.slice(1)
            };
        }
    };



    // apply function contructors
    functions.forEach(function(functionName) {
        ClassDefinition[functionName] = function(value) {
            var args = Array.prototype.slice();

            args.unshift(functionName);

            return this.fn.apply(this, args);
        }
    }.bind(this));



    // export
    module.exports = new Class(ClassDefinition);
}();
