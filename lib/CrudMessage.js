!function() {

    var   Class                 = require('ee-class')
        , type                  = require('ee-types')
        , log                   = require('ee-log')
        , DistributedMessage    = require('distributed-message');



    module.exports = new Class({
        inherits: DistributedMessage


        /**
         * emits a message 
         *
         * @param <Message> message to emit
         */
        , emitMessage: function(message) {
            this.emit('message', message);
        }
    });
}();
