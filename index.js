

module.exports = function(sails) {
    
    var setup = require('./lib/setup.js');
    var connect = require('./lib/connect.js');
    var sendCode = require('./lib/sendCode.js');

    gladys.on('ready', function(){
        connect();
    });
    
    return {
        connect: connect,
        setup: setup,
        sendCode: sendCode
    };
};