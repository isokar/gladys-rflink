var Promise = require('bluebird');
var shared = require('./shared.js');

module.exports = function(data){
	
	sails.log.info('Received data from RFLINK ' + data);
	
	var param = {
		device: {
			name: 'Sensor',
			protocol: '433Mhz',
			service: 'rflink',
			identifier: '1234'
		},
		types: []
	};

	var res = data.split(";");
	if(parseInt(res[0])===20 && parseInt(res[1])!==0 && res[2]!=='OK'){
		param.device.protocol = res[2];
		if(param.device.protocol !== 'Debug' && param.device.protocol !== 'Slave'){
		
			var res2 = res[3].split("=");
			param.device.identifier = res2[1];
			var tmptype;
			var nbtype = 0;
			var maxlength = res.length;
			res.splice(maxlength-1,1);
			maxlength = res.length;
			for (var i = 4, len = maxlength; i < len; i++) {
				var item = res[i].split("=");
				var type = item[0];
				var val;
				var tmpval;
				var update = true;
				var unit = '';
				var sensor = 1;
				var debug = false;
				txtval = item[1];
				tmpval = parseInt(item[1],10);
				hexval = parseInt(item[1],16);
				switch(item[0]){
					case `SWITCH`:
						update = false;
						param.device.identifier = param.device.identifier + `.` + item[1];
						tmptype = 'binary';
					break;
					case `TEMP`:
					case `WINCHL`:
					case `WINTMP`:
						if(hexval>32768){
							hexval=-(hexval-32768);
						}
						unit='°C';
						tmpval=hexval/10;
					break;
					case `RAIN`:
					case `RAINRATE`:
					case `RAINTOT`:
						unit='mm';
						tmpval=hexval/10;
					break;
					case `WINSP`:
					case `AWINSP`:
						unit='km/h';
						tmpval=hexval/10;
					break;
					case `WINDIR`:
						tmpval=tmpval*22.5;
						unit='°';
						break;
					case `BARO`:
						unit='hPa';
						tmpval=hexval;
					break;
					case 'WINGS':
						unit='km/h';
						tmpval=hexval;
					break;
					case `UV`:
					case `LUX`:
						tmpval=hexval;
					break;
					case `KWATT`:
						hexval=hexval*1000;
					case `WATT`:
						unit='W';
						tmpval=hexval;
					break;
					case 'RGB':
						sensor=0;
						tmpval=hexval;
					break;
					case `RGBW`:
					case `RGBWW`:
						sensor=0;
						type = 'COLOR';
						tmpval=parseInt(txtval.substring(0,2),16);
						res.push('BRIGHTNESS='+txtval.substring(2,4));					
						len++;
					break;
					case 'BRIGHTNESS':
						sensor=0;
						type = 'BRIGHTNESS';
						tmpval=hexval;
					break;
					case `CMD`:
						update=true;
						sensor=0;
						if(item[1]==='SET_LEVEL'){
							type = `dimmer`;
							tmpval = parseInt(item[2]);
						}else{
							type = tmptype;
						}
						
						break;
					default:
						type = item[0];
						break;
				}
				switch(txtval){
					case `OFF`:
					case `LOW`:
					case `STOP`:
						val = 0;
					break;
					case `ON`:
					case `OK`:
					case `UP`:
					case `START`:
						val = 1;
					break;
					case `UNKOWN`:
					case `DOWN`:
						val = -1;
					break;
					case `ALLOFF`:
						val = 0;
						type = 'binall';
					break;
					case `ALLON`:
						val = 1;
						type = 'binall';
					break;
					default:
						val=tmpval;
					break;
				}
				if(update){
					var ident = param.device.protocol + '_' + param.device.identifier + '_' + type;
					param.types.push({state:'',type: 'binary',identifier: '',sensor: true,unit:'',min: -99,max: 99});
					param.types[nbtype].type = type;
					param.types[nbtype].unit = unit;
					param.types[nbtype].sensor = sensor;
					param.types[nbtype].identifier = ident;
					param.types[nbtype].state=val;

					nbtype++;
				}
				
			}
		}
	}
	
	if(shared.getConfEn()){
		gladys.device.create(param);
	}
	return Promise.map(param.types, function(typ){
		var state = {
			value:1
		};
		state.value = typ.state;
		var key = "state";
		delete typ[key];
		return gladys.deviceState.createByIdentifier(param.device.identifier, param.device.service, typ.type, state);
	})
	.catch(function(e) {
		sails.log.warn('RFLink error during creation or update of device : ' + e + '.');
		sails.log.warn('Pass to configuration mode if you want to add new devices.');
	});
};