describe('Exec', function () {
	
	var deviceType= {
		name: 'Sensor',
		protocol: 'Kaku',
		service: 'rflink',
		identifier: '00004d.1',
		type:'binary'
	};

	var state = {
	  	value: 1
	};
	
	
  it('should emit radio signal', function (done) {
        var exec = require('../lib/exec.js');
        exec({deviceType,state})
        .then(() => done())
  });
});