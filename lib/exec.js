const Promise = require('bluebird');
var sendCode = require('./sendCode.js');
const recep = require('./createStateRadio.js');

module.exports = function (params) {
	return switchType(params)
	.then(function (params) {
		var msg = switchProtocol(params);
		if (msg !== '') {
			sails.log.info(`Sending datas to arduino: ${msg}`);
			return sendCode(msg + '\n');
		}
	});
};

function switchType(params) {
	var value = parseInt(params.state.value);
	var deviceId = params.deviceType.device;
	var protocol = params.deviceType.protocol;
	var deviceId = params.deviceType.device;
	params.val = '';
	params.tmpcolor = '';
	params.tmpbright = '';

	switch (params.deviceType.type) {
	case 'binary':
		switch (value) {
		case 0:
			params.val = 'OFF';
			break;
		case 1:
			params.val = 'ON';
			break;
		default:
			sails.log.error('value must be 0 or 1');
			return Promise.reject('value must be 0 or 1');
		}
		return Promise.resolve(params);

	case 'binall':
		switch (value) {
		case 0:
			params.val = 'ALLOFF';
			break;
		case 1:
			params.val = 'ALLON';
			break;
		default:
			sails.log.error('value must be 0 or 1');
			return Promise.reject('value must be 0 or 1');
		}
		return Promise.resolve(params);

	case 'dimmer':
		if (value > 0 && value < 16) {
			params.val = value;
		} else {
			sails.log.error('incorrect dimmer value');
			return Promise.reject('incorrect dimmer value');
		}
		return Promise.resolve(params);

	case 'mode':
		if (value > 0 && value < 9) {
			params.val = 'MODE' + value;
		} else {
			sails.log.error('incorrect mode value');
			return Promise.reject('incorrect mode value');
		}
		return Promise.resolve(params);

	case 'pair':
		switch (value) {
		case 0:
			params.val = 'UNPAIR';
			break;
		case 1:
			params.val = 'PAIR';
			break;
		default:
			sails.log.error('value must be 0 or 1');
			return Promise.reject('value must be 0 or 1');
		}
		return Promise.resolve(params);

	case 'updown':
		switch (value) {
		case 0:
			params.val = 'STOP';
			break;
		case 1:
			params.val = 'UP';
			break;
		case -1:
			params.val = 'DOWN';
			break;
		default:
			sails.log.error('value must be between -1 and 1');
			return Promise.reject('value must be between -1 and 1');
		}
		return Promise.resolve(params);

	case 'COLOR':
		params.val = 'COLOR';
		if (protocol == 'MiLightv1') {
			params.tmpcolor = (value).toString(16);

			let device = {
				type: "BRIGHT"
			};

			return gladys.deviceType.getByType(device)
			.then(function (deviceTypes) {
				for (i = 0; i < deviceTypes.length; i++) {
					let devicetype = JSON.parse(JSON.stringify(deviceTypes[i]));
					if (devicetype.device == deviceId) {
						params.tmpbright = ((devicetype.lastValue).toString(16)).concat('0');
						sails.log.info('tmpbright : ' + params.tmpbright);

						return Promise.resolve(params);
					}
				};
			})
			.catch(function (err) {
				sails.log.error(err);
				return Promise.reject(err);
			});

		}
		return Promise.resolve(params);

	case 'BRIGHT':
		params.val = 'BRIGHT';
		if (protocol == 'MiLightv1') {
			params.tmpbright = ((value).toString(16)).concat('0');
			sails.log.info('tmpbright : ' + params.tmpbright);
			let device = {
				type: "COLOR"
			};

			return gladys.deviceType.getByType(device)
			.then(function (deviceTypes) {
				for (i = 0; i < deviceTypes.length; i++) {
					let devicetype = JSON.parse(JSON.stringify(deviceTypes[i]));
					if (devicetype.device == deviceId) {
						params.tmpcolor = ((devicetype.lastValue).toString(16));
						sails.log.info('tmpcolor : ' + params.tmpcolor);

						return Promise.resolve(params);
					}
				};
			})
			.catch(function (err) {
				sails.log.error(err);
				return Promise.reject(err);
			});
		}
		return Promise.resolve(params);

	default:
		sails.log.error('unrecognised type');
		return Promise.reject('unrecognised type');
	}
};

function switchProtocol(params) {
	var res = params.deviceType.identifier.split(".");
	var address = res[0];
	var unit = res[1];
	var protocol = params.deviceType.protocol;

	switch (protocol) {
	case 'DELTRONIC':
	case 'Selectplus':
		return `10;${protocol};${address};`;

	case 'MERTIK':
		return `10;${protocol};${address};{updown};`;

	case 'RTS':
		return `10;${protocol};${address};0;${params.val};`;

	case 'MiLightv1':
		return `10;${protocol};${address};${unit};${params.tmpcolor}${params.tmpbright};${params.val};`;

	default:
		return `10;${protocol};${address};${unit};${params.val};`;
	}
};
