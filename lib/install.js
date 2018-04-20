// Create parameters
module.exports = function(){
	
	var param = {
		name: 'RFLink_tty',
		value: '/dev/ttyACM0'
	};
	return gladys.param.getValue(param.name)
	    .then((result) => {
		// if it exists, we return it
		return result;
	    })
	    .catch(() => {
		// if it does not exist, we create it
		return gladys.param.setValue(param);
	    });
};
