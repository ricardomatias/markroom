'use strict';

var inherits = require('inherits');

var eventBus = require('../services/eventBus').eventBus;

var count = 0;

function Base() {
  eventBus.call(this);

  this.key = 'c' + count++;
}

inherits(Base, eventBus);

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

  this.emit('changed', component);

  if (this.parent) {
    this.parent.changed(component);
  }
};
