'use strict';

var domReady = require('domReady');
var raf = require('raf');

var delegator = require('dom-delegator');

var AppConstructor = require('./app');

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

domReady(function () {
    'use strict';

    var app = new AppConstructor('body');

    global.app = app;

    app.on('changed', function (component) {
        raf(function () {
            component.update();
        });
    });

    app.run();
});