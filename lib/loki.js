require('mootools');

var Server = require('./classes/server');

exports.start = function (options) {
  new Server(options);
}