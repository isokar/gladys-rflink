var ports = [];
var conf_enabled = false;
//buffering messages
var transmitting = false;
var msgs = [];

var connect = require('./connect.js');
var Promise = require('bluebird');

module.exports = {

  addPort: function(newPort)  {
    ports.push(newPort);
  },

  getPorts: function() {
    return ports;
  },
  
  getConfEn: function() {
    return conf_enabled;
  },
  setConfEn: function(Status) {
    conf_enabled = Status;
  },

  
  reset: function(){
      
      // we close all connections
      return Promise.map(ports, function(port){
          return closeConnection(port);
      })
      .then(function(){

          // then we reset ports variable
          ports = [];
          msgs = [];
          transmitting = false;
      })
  },

  getTransmitting: function() {
    return transmitting;
  },

  setTransmitting: function(status) {
    transmitting = status;
  },

  addMsg: function(msg) {
    msgs.push(msg);
  },

  getMsgs: function() {
    return msgs;
  },

  shiftMsgs: function() {
    return msg = msgs.shift();
  }

};

function closeConnection(port){
  return new Promise(function(resolve, reject){
      port.close(function(){
          resolve();
      });
  });  
}