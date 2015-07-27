'use strict';

var ipc = require('ipc');

function Text(app) {
  // Open
  ipc.on('file.open', function(txt) {
    var activeView = app.activeView;

    this.set(txt);

    activeView.changed();
  }.bind(this));

  // Save
  ipc.on('file.save', function() {
    this.save();

  }.bind(this));
}

Text.prototype.set = function set(text) {
  this.text = text;
};

Text.prototype.get = function get() {
  return this.text;
};

Text.prototype.save = function save() {
  ipc.send('text.save', this.text);
};

module.exports = Text;
