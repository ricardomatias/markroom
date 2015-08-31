'use strict';

var inherits = require('inherits');

var Selection = require('./selections'),
    Snippets = require('./snippets'),
    Styling = require('./stylings'),
    Wrappers = require('./wrappers');

var KeyActions = require('./keyActions');

var EventBus = require('../services/eventBus').eventBus;


function Keyboard(writeView) {
  EventBus.call(this);

  this.writeView = writeView;

  this.features = {
    selections: new Selection(),
    snippets: new Snippets(),
    stylings: new Styling(),
    wrappers: new Wrappers()
  };

  this.keyActions = new KeyActions([ 'selections', 'snippets', 'stylings', 'wrappers' ]);

  console.log(this.keyActions);

  window.addEventListener('keydown', this.callAction.bind(this));

  // Cancel action with 'Esc'
  window.addEventListener('keydown', this.cancelEsc.bind(this));
}

inherits(Keyboard, EventBus);


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

  if (!(actionType = this.keyActions.which(evt))) {
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
