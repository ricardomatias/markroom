'use strict';

var raf = require('raf');

var delegator = require('dom-delegator');

var App = require('./lib/app');

var domReady = require('domready');

var eventBus = require('./lib/services/eventBus');

delegator();

/*
    Markdown
    Views (Fullscreen):
        * Text input
        * Parsed

    Button to switch between views.

    Components (Widgets):
        * Write
        * Read

    Icon lights up when the text changed.
 */

domReady(function() {
  var app = new App('body');

  global.app = app;

  eventBus.on('changed', function(component) {
    raf(function() {
      component.update();
    });
  });

  app.run();
});
