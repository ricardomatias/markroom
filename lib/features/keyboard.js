'use strict';

var Selection = require('./selections');

var Snippets = require('./snippets');

var Styling = require('./stylings');

var Wrappers = require('./wrappers');


var whichAction = require('../utils/keyActions');


function Keyboard(app) {

  this.app = app;

  this.features = {
    selections: new Selection(),
    snippets: new Snippets(),
    stylings: new Styling(),
    wrappers: new Wrappers()
  };

  window.addEventListener('keydown', function(evt) {
    var activeView = this.app.activeView,
        textarea = evt.target,
        text = activeView.text.get(),
        selStart = textarea.selectionStart,
        selEnd = textarea.selectionEnd,
        actionType,
        feature,
        ctx;

    if (activeView.name !== 'Write') {
      return;
    }

    if (!(actionType = whichAction(evt))) {
      return;
    }

    feature = this.features[actionType.type];
    console.log(actionType);

    if (feature.cannotInsert(text, selStart, selEnd)) {
      return;
    }

    evt.preventDefault();
    evt.stopPropagation();

    ctx = feature.execute(text, selStart, selEnd, actionType.val);
    feature.update(activeView, textarea, ctx);

  }.bind(this));
}

module.exports = Keyboard;
