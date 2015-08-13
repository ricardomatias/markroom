'use strict';

var inherits = require('inherits');

var Selection = require('./selections'),
    Snippets = require('./snippets'),
    Styling = require('./stylings'),
    Wrappers = require('./wrappers');

var whichAction = require('../utils/keyActions');

var Component = require('../components/component');


function Keyboard(writeView) {
  Component.call(this);

  this.writeView = writeView;

  this.features = {
    selections: new Selection(),
    snippets: new Snippets(),
    stylings: new Styling(),
    wrappers: new Wrappers()
  };

  window.addEventListener('keydown', this.callAction.bind(this));

  // Cancel action with 'Esc'
  window.addEventListener('keydown', this.cancelEsc.bind(this));
}

inherits(Keyboard, Component);


Keyboard.prototype.callAction = function(evt) {
  var writeView = this.writeView,
      textarea = evt.target,
      text = writeView.text.get(),
      selStart = textarea.selectionStart,
      selEnd = textarea.selectionEnd,
      actionType,
      feature,
      ctx;

  if (!writeView.active) {
    return;
  }

  if (!(actionType = whichAction(evt))) {
    return;
  }

  feature = this.features[actionType.type];

  if (feature.cannotInsert(text, selStart, selEnd)) {
    return;
  }

  evt.preventDefault();
  evt.stopPropagation();

  ctx = feature.execute(text, selStart, selEnd, actionType.val);

  feature.update(writeView, textarea, ctx);
};

Keyboard.prototype.cancelEsc = function(evt) {
  var textarea = evt.target,
      selStart;

  if (!this.writeView.active) {
    return;
  }

  if (evt.keyCode === 27) {
    selStart = textarea.selectionStart;

    textarea.setSelectionRange(selStart, selStart);
  }
};

module.exports = Keyboard;
