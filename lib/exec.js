const Promise = require('bluebird');
var sendCode = require('./sendCode.js');
const recep = require('./createStateRadio.js');

module.exports = function(params){
	
	var protocol = params.deviceType.protocol;
	var res = params.deviceType.identifier.split(".");
	var address = res[0];
	var unit = res[1];
	var type = params.deviceType.type;
	var val = '';
	var value = parseInt(params.state.value);
	switch(type){
		case 'binary':
			switch(value){
				case 0:
					val = `OFF`;
				break;
				case 1:
					val = `ON`;
				break;
				default:
					sails.log.error(`value must be 0 or 1`);
				break;
			}
		break;
		case 'binall':
			switch(value){
				case 0:
					val = `ALLOFF`;
				break;
				case 1:
					val = `ALLON`;
				break;
				default:
					sails.log.error(`value must be 0 or 1`);
				break;
			}
		break;
		case 'dimmer':
			if(value>0 && value<16){
				var val = `${value}`;
			}else{
				sails.log.error(`incorrect dimmer value`);
			}
		break;
		case 'mode':
			if(value>0 && value<9){
				var val = `MODE`+value;
			}else{
				sails.log.error(`incorrect dimmer value`);
			}
		break;
		case 'pair':
			switch(value){
				case 0:
					val = `UNPAIR`;
				break;
				case 1:
					val = `PAIR`;
				break;
				default:
					sails.log.error(`value must be 0 or 1`);
				break;
			}
			
		break;
		case 'updown':
			switch(value){
				case 0:
					val = `STOP`;
				break;
				case 1:
					val = `UP`;
				break;
				case -1:
					val = `DOWN`;
				break;
				default:
					sails.log.error(`value must be between -1 and 1`);
				break;
			}
		break;
		default:
			sails.log.error(`unrecognised type`);
		break;
	}
	if(val != ''){
		switch(protocol){

			case 'DELTRONIC':
			case 'Selectplus':
				var msg = `10;${protocol};${address};`;
			break;

			case 'MERTIK':
				var msg = `10;${protocol};${address};{updown};`;
			break;

			case 'RTS':
				var msg = `10;${protocol};${address};0;${val};`;
			break;

			case 'MiLightv1':
				var msg = `10;${protocol};${address};${unit};${val};`;
			break;
			
			default:			
				var msg = `10;${protocol};${address};${unit};${val};`;
			break;
		}
	}
	if(msg!==''){
		sails.log.info(`Sending datas to arduino:` + msg);
		sendCode(msg + '\n');
	}
	
	return Promise.resolve();
};

