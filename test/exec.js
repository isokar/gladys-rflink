describe('Exec', function () {
	
	var param = {
		deviceType: {
			name: 'Sensor',
			protocol: 'Kaku',
			service: 'rflink',
			identifier: '00004d.1',
		}
	};

	var state = {
	  	value: 1
	};
	
	
  it('should emit radio signal', function (done) {
        var exec = require('../lib/exec.js');
        exec({param,state})
        .then(() => done())
  });
});