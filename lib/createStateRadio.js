//for debug purpose only
const util = require('util');
//sails logs are also commented for debug


module.exports = function(data){
	
console.log('Received data from Arduino ' + data);	
//	sails.log.info('Received data from Arduino ' + data);
	
	var param = {
		device: {
			name: 'Sensor',
			protocol: '433Mhz',
			service: 'rflink',
			identifier: '1234'
		},
		types: [
			{
				type: 'binary',
				identifier: '',
				sensor: true,
				min: 0,
				max: 1
			}
		]
	};

	var state = {
	  	value: 1
	};
	var res = data.split(";");
	if(parseInt(res[0])===20){
		param.device.protocol = res[2];
		var res2 = res[3].split("=");
		param.device.identifier = res2[1];
		var tmptype;
		for (var i = 4, len = res.length; i < len-1; i++) {
			var item = res[i].split("=");
			var type = item[0];
			var val;
			var tmpval;
			var update = true;
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
				case `RAIN`:
				case `RAINRATE`:
				case `RAINTOT`:
				case `WINSP`:
				case `AWINSP`:
					tmpval=hexval/10;
				break;
				case `WINDIR`:
					tmpval=tmpval*22.5;
				break;
				case `BARO`:
				case `UV`:
				case `LUX`:
				case `WINGS`:
				case `KWATT`:
				case `WATT`:
					tmpval=hexval;
				break;
				case `RGBW`:
				case `RGBWW`:
					tmpval=item[1];
				break;
				case `CMD`:
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
			switch(tmpval){
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
console.log(util.inspect(param, false, null));
console.log('datas:'+param.device.identifier+':'+param.device.service+':'+type);
/*				return gladys.utils.sqlUnique(queries.getDeviceTypeByIdentifierAndType, [param.device.identifier, param.device.service, type])
					.then(function(deviceType){
						// we create the deviceState
						state.devicetype = deviceType.id;
						return gladys.deviceState.create(val);
					})
					.catch(() => {
						// if it fails to create the state, the device does not exist
						return gladys.device.create(param)
							.then(function(result) {

								// we create the state
								return gladys.utils.sqlUnique(queries.getDeviceTypeByIdentifierAndType, [param.device.identifier, param.device.service, type])
									.then(function(deviceType){
									// we create the deviceState
									state.devicetype = deviceType.id;
									return gladys.deviceState.create(val);
								});
							});
					});
*/			}
			
        }
	}
};