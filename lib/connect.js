var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var shared = require('./shared.js');
var createStateRadio = require('./createStateRadio.js');
var Promise = require('bluebird');

module.exports = function() {
	
	gladys.param.getValue('RFLink_tty')
		.then(function(value){
			
			var port = new SerialPort(value, {
			  autoOpen: false,
			  parser: serialport.parsers.readline('\n')
			});
			// We close connection
			port.close(function (err) {
			  if (err) {
				return console.log('Error closing port: ', err.message);
			  }
			});
			// Then we connect to the device
			port.open(function (err) {
			  if (err) {
				return console.log('Error opening port: ', err.message);
			  }
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