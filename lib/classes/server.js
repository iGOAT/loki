var Player = require('./player');

var Server = new Class({
  
  Implements: [Events, Options],
  
  options: {
    port: 4200
  },
  
  io: null,
  players: {},
  
  initialize: function (options) {
    this.io = require('socket.io').listen(this.options.port);
    this.addListeners();
  },
  
  addListeners: function () {
    this.io.sockets.on('connection', function (socket) {
      socket.emit('log in prompt', { message: 'Welcome to the Loki server! Please log in.' });

      socket.on('log in', function (data) {
        this.connectPlayer(socket, data);
      }.bind(this));
      
      socket.on('move', function (data) {
        var player = this.getPlayer(socket.id);
        player.move(data.direction, data.value);
        this.fireEvent('player moved', player);
      }.bind(this));
      
      socket.on('move to', function (data) {
        var player = this.getPlayer(socket.id);
        player.moveTo(data.x, data.y);
        this.fireEvent('player moved', player);
      }.bind(this));
      
      socket.on('disconnect', function () {
        this.disconnectPlayer(socket.id);
      }.bind(this));
    }.bind(this));
    
    this.addEvent('player connected', this.replicate.bind(this));
    this.addEvent('player disconnected', this.replicate.bind(this));
    this.addEvent('player moved', this.replicate.bind(this));
  },
  
  // sends current game state to all clients
  replicate: function () {
    this.io.sockets.emit('game state', this.getGameState());
  },
  
  connectPlayer: function (socket, data) {
    this.players[socket.id] = new Player(socket, data.name);
    this.fireEvent('player connected', this.players[socket.id]);
    console.log(data.name + ' has connected');
  },
  
  disconnectPlayer: function (socketId) {
    var player = this.getPlayer(socketId);
    if (player) {
      delete this.players[socketId];
      this.fireEvent('player connected', player);
      console.log(player.get('name') + ' has disconnected.');
    }
  },
  
  getPlayer: function (socketId) {
    return this.players[socketId];
  },
  
  // gets current position of all players (for now...)
  getGameState: function () {
    var state = {
      players: {}
    };
    
    Object.each(this.players, function (player, socketId) {
      state.players[player.get('name')] = player.getState();
    });
    
    return state;
  }
});

exports = module.exports = Server;