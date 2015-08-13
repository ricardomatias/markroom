'use strict';

const raf = require('raf');

const delegator = require('dom-delegator');

const App = require('./lib/app');

const domReady = require('domReady');

const eventBus = require('./lib/services/eventBus');

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
