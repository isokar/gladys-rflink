var shared = require('./shared.js');
var Promise = require('bluebird');

module.exports = function(code) {

	// geting the first arduino finded on usb
	var ports = shared.getPorts();
	Promise.map(ports, function(port) {
		// write the code to the arduino
		return port.write(code);
	}).then(function() {
		console.log("done");
	});
};