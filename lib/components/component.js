'use strict';

var eventBus = require('../services/eventBus');

function Component() {
  this.eventBus = eventBus;
}

module.exports = Component;

