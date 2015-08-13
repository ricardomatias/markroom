'use strict';

var eventBus = require('../services/eventBus');

var count = 0;

function Base() {
  this.key = 'c' + count++;

  this.eventBus = eventBus;
}

module.exports = Base;


Base.prototype.render = function() {

  if (typeof this.toNode === 'function') {
    return this.toNode();
  }

  throw new Error('sublcass responsibility');
};


Base.prototype.changed = function(child) {

  var component = child || this;

  if (component === this) {
    this.dirty = true;
  }

  // this.emit('changed', component);

  this.eventBus.emit('changed', component);

  if (this.parent) {
    this.parent.changed(component);
  }
};
