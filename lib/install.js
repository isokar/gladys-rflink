// Create parameters
module.exports = function(){
	
	var param = {
		name: 'RFLink_tty',
		value: '/dev/ttyACM0'
	};
	//then we check if the parameters exists
	return gladys.param.getValue(param.name)
		.catch(() => {
			//is they doesn't, we create them
			return gladys.param.setValue(param);
		});
};
