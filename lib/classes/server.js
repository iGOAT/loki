var Player = require('./player');

var Server = new Class({
  
  Implements: [Events, Options],
  
  options: {
    port: 4200,
    frequency: 100 // ms - how often to update the game and replicate to all clients
  },
  
  io: null,
  players: {},
  
  initialize: function (options) {
    this.io = require('socket.io').listen(this.options.port);
    this.addListeners();

    // start game loop
    setInterval(this.update.bind(this), this.options.frequency);
  },
  
  addListeners: function () {
    this.io.sockets.on('connection', function (socket) {
      socket.emit('log in prompt', { message: 'Welcome to the Loki server! Please log in.' });

      socket.on('log in', function (data) {
        this.connectPlayer(socket, data);
      }.bind(this));
      
      socket.on('move up', function (data) {
        var player = this.getPlayer(socket.id);
        if (player) player.addAction('move up');
      }.bind(this));
      
      socket.on('move down', function (data) {
        var player = this.getPlayer(socket.id);
        if (player) player.addAction('move down');
      }.bind(this));
      
      socket.on('move left', function (data) {
        var player = this.getPlayer(socket.id);
        if (player) player.addAction('move left');
      }.bind(this));
      
      socket.on('move right', function (data) {
        var player = this.getPlayer(socket.id);
        if (player) player.addAction('move right');
      }.bind(this));
      
      socket.on('idle', function (data) {
        var player = this.getPlayer(socket.id);
        if (player) player.idle();
      }.bind(this));
      
      socket.on('disconnect', function () {
        this.disconnectPlayer(socket.id);
      }.bind(this));
    }.bind(this));
  },
  
  // updates the world
  update: function () {
    // update players
    Object.each(this.players, function (player, socketId) {
      player.executeActions();
    });
    
    this.replicate();
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
      this.fireEvent('player disconnected', player);
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