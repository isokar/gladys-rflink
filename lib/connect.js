var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var shared = require('./shared.js');
var createStateRadio = require('./createStateRadio.js');
var Promise = require('bluebird');

module.exports = function() {
	
	gladys.param.getValue('RFLink_tty')
		.then(function(value){
			
			// we connect to the device
			var port = new SerialPort(device.identifier, {
			  baudRate: 57600 , parser: serialport.parsers.readline('\n')
			});

			port.on('error', function(err) {
			  sails.log.warn('RFLink serial error : ', err.message);
			});

			// if we receive data, we parse it
			port.on('data', createStateRadio);

			// we add the port object to the shared list
			shared.addPort(port);

			return port;
			
		})
};