const Promise = require('bluebird');
var sendCode = require('./sendCode.js');
//for debug purpose only
const util = require('util');
const test = require('../test2/exec.js');
//sails logs are also commented for debug

module.exports = function(params){
	
console.log(util.inspect(params, false, null));
	
	var protocol = params.deviceType.protocol;
	var res = params.deviceType.identifier.split(".");
	var address = res[0];
	var unit = res[1];
	var type = params.deviceType.type;
	var val = '';

	switch(type){
		case 'binary':
			var value = parseInt(params.state.value);
			switch(value){
				case 0:
					val = `OFF`;
				break;
				case 1:
					val = `ON`;
				break;
				default:
console.log(`value must be 0 or 1`);
//					sails.log.error(`value must be 0 or 1`);
				break;
			}
		break;
		case 'binall':
			var value = parseInt(params.state.value);
			switch(value){
				case 0:
					val = `ALLOFF`;
				break;
				case 1:
					val = `ALLON`;
				break;
				default:
console.log(`value must be 0 or 1`);
//					sails.log.error(`value must be 0 or 1`);
				break;
			}
		break;
		case 'dimmer':
			var value = params.state.value;
			if(value>0 && value<16){
				var val = `${value}`;
			}else{
console.log(`incorrect dim value`);
//				sails.log.error(`incorrect dim value`);
			}
			
		break;
		case 'pair':
			var value = parseInt(params.state.value);
			switch(value){
				case 0:
					val = `UNPAIR`;
				break;
				case 1:
					val = `PAIR`;
				break;
				default:
console.log(`value must be 0 or 1`);
//					sails.log.error(`value must be 0 or 1`);
				break;
			}
			
		break;
		case 'updown':
			var value = parseInt(params.state.value);
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
console.log(`value must be between -1 and 1`);
//					sails.log.error(`value must be between -1 and 1`);
				break;
			}
		break;
		default:
console.log(`unrecognised type`);
//			sails.log.error(`unrecognised type`);
		break;
	}
	if(val != ''){
		switch(protocol){
			//1
			case 'NewKaku':
			case 'Eurodomest':
			case 'Blyss':
			case 'Conrad':
			case 'FA20RF':
			case 'Kambrook':
			case 'EV1527':
			case 'BYRON':
			case 'UNITEC':
				var msg = `10;${protocol};${address};${unit};${val};`;
			break;
			//2
			case 'DELTRONIC':
			case 'Selectplus':
				var msg = `10;${protocol};${address};`;
			break;
			//3
			case 'MERTIK':
				var msg = `10;${protocol};${address};{updown};`;
			break;
			//4
			case 'RTS':
				var msg = `10;${protocol};${address};0;${val};`;
			break;
			//5
			case 'Kaku':
			case 'AB400D':
			case 'Impuls':
			case 'X10':
			case 'HomeConfort':
			case 'FA500':
			case 'Powerfix':
			case 'Ikea Koppla':
			case 'HomeEasy':
			case 'Chuango':
			case 'Byron':
				var msg = `10;${protocol};${address};${unit};${val};`;
			break;
			
			
			case 'MiLightv1':
				//var msg = `10;${protocol};${address};${unit};{val}`;complex
			break;
			
			case 'XtestX':
				test();
			break;
			
			default:
console.log(`error: protocol not in the list`);
//				sails.log.error(`error: protocol not in the list`);
				var msg = '';
			break;
		}
	}
	if(msg!==''){
console.log(`Sending datas to arduino:` + msg);
//		sails.log.info(`Sending datas to arduino:` + msg);
//		sendCode(msg);
	}
	
	return Promise.resolve();
};
