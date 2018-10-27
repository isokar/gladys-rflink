var shared = require('./shared.js');

module.exports = function(code) {

  // geting the first arduino finded on usb
  var ports = shared.getPorts();
  var port = ports[0];
  //port.write(code)
  // write the code to the arduino

  // Ajoute le message reçu au buffer "msgs"
  shared.addMsg(code);
  var msg='';
  var i=0;

  send(msg);
  

  function send(outMsg) {
    console.log('1 outmsg', outMsg)
    console.log('2 i', i)
    // si il y a des messages dans le buffer
    if ((shared.getMsgs()).length > 0) {
      console.log('3 getMsg.lenght',(shared.getMsgs()).length)
      // si une transmission n'est pas en cours, passe au message suivant du buffer
      console.log('4 Transmitting ?',shared.getTransmitting() )
      if (shared.getTransmitting() === false) {
        outMsg = shared.shiftMsgs();
        console.log('5 outMsg',outMsg)
        // Passage en mode transmission
        shared.setTransmitting(true);
      }
      // envoi du message tant que l'accusé n'a pas été réceptionné, toutes les 100 ms 
      console.log('6 outMsg', outMsg)
      setTimeout(function(){
        //envoi du message 
        console.log('7 outMsg', outMsg)
        port.write(outMsg);
        i++
        console.log('8 i',i)
        // si on n'a reçu l'accusé de réception, ou si plus de 9 essais, on arrête.
        console.log('9 Transmitting', shared.getTransmitting())
        if ((shared.getTransmitting() === false) || i>9) {
          i=0
          return
        } else {
          console.log('10 outMsg', outMsg)
          //sinon, on rappelle la fonction avec le meme message
          send(outMsg)
        }
      },200)
    }

  }
}