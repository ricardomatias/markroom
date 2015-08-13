'use strict';

var Emitter = require('events');

var inherits = require('inherits');

function EventBus() {}

inherits(EventBus, Emitter);

module.exports = new EventBus();
