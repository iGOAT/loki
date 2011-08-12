var Movement = new Class({
  
  x: null,
  y: null,
  
  move: function (direction, value) {
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
  
  moveTo: function (x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
  }
});

exports = module.exports = Movement;