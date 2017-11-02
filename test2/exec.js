describe('Exec', function () {
	
	var param = '20;36;Alecto V1;ID=ec02;TEMP=00d1;HUM=14;';

	
	
  it('should emit radio signal', function (done) {
        var exec = require('../lib/createStateRadio.js');
        exec(param)
        .then(() => done())
  });
});