var Movement = require('./movement');

var Player = new Class({
  
  Implements: [Options, Movement],
  
  options: {
  },
  
  socket: null,
  name: 'Guest',
  x: 50,
  y: 50,
  
  initialize: function (socket, name, options) {
    this.setOptions(options);
    this.socket = socket;
    this.name = name;

    this.moveTo(this.x, this.y);
  },
  
  get: function (attribute) {
    switch(attribute) {
      case 'name':
        return this.name;
        break;
    }
  },
  
  getState: function () {
    var state = {};
    
    state.name = this.name;
    
    state.x = this.x;
    state.y = this.y;
    
    return state;
  }
});

exports = module.exports = Player;