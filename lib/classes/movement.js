var Movement = new Class({
  
  speed: 10,
  actions: ['idle'], // current actions being taken
  x: null,
  y: null,
  
  addAction: function (action) {
    // remove idle from actions
    if (this.actions.contains('idle')) this.actions = [];
    
    if (!this.actions.contains(action)) this.actions.push(action);
  },
  
  executeActions: function () {
    this.actions.each(function (action) {
      var words = action.split(' ');
      if (words[0] == 'move') this.move(words[1]);
    }.bind(this));
  },
  
  move: function (direction, value) {
    value = value || this.speed;
    
    switch(direction.toLowerCase()) {
      case 'left':
        this.x = this.x - value;
        break;
      case 'right':
        this.x = this.x + value;
        break;
      case 'up':
        this.y = this.y - value;
        break;
      case 'down':
        this.y = this.y + value;
        break;
    }
  },
  
  position: function (x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
  },
  
  idle: function () {
    this.actions = ['idle'];
  }
});

exports = module.exports = Movement;