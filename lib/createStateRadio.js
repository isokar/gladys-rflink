
module.exports = function(data){
		
	sails.log.info('Received data from Arduino ' + data);
	
	var param = {
		device: {
			name: 'Sensor',
			protocol: '433Mhz',
			service: 'rflink',
			identifier: '1234'
		},
		types: []
	};
	var statelist = {
		states: [
		]
	};

	var res = data.split(";");
	if(parseInt(res[0])===20){
		param.device.protocol = res[2];
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
					val = 0;
				break;
				case `ON`:
				case `OK`:
				case `UP`:
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
				param.types.push({type: 'binary',identifier: '',sensor: true,unit:'',min: -99,max: 99});
				param.types[nbtype].type = type;
				param.types[nbtype].unit = unit;
				param.types[nbtype].sensor = sensor;
				statelist.states.push({value:''});
				statelist.states[nbtype].value=val;

				// try to create the state
				gladys.deviceState.createByIdentifier(param.device.identifier, param.device.service, param.types[nbtype].type, statelist.states[nbtype])
					.catch(() => {

						// if it fails to create the state, the device does not exist
						return gladys.device.create(param)
							.then(function(result) {

								// we create the state
								return gladys.deviceState.createByIdentifier(param.device.identifier, param.device.service, param.types[nbtype].type, statelist.states[nbtype])
							});
					});
				nbtype++;
			}
			
       	}
	}
};
