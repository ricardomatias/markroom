'use strict';

var inherits = require('inherits');

var Selection = require('./selections'),
    Snippets = require('./snippets'),
    Styling = require('./stylings'),
    Wrappers = require('./wrappers');

var EventBus = require('../services/eventBus').eventBus;

var ipc = require_electron('ipc');


function Keyboard(writeView) {
  EventBus.call(this);

  this.writeView = writeView;

  this.features = {
    selections: new Selection(),
    snippets: new Snippets(),
    stylings: new Styling(),
    wrappers: new Wrappers()
  };

  ipc.on('editor.actions', function(data) {
    var action = data.action;

    this.callAction({
      type: action.split('.').shift(),
      val: action.split('.').splice(1, action.length).join('.')
    });
  }.bind(this));
}

inherits(Keyboard, EventBus);


Keyboard.prototype.callAction = function(action) {
  var writeView = this.writeView,
      textarea = writeView.$el.children[0],
      text = writeView.text.get(),
      selStart = textarea.selectionStart,
      selEnd = textarea.selectionEnd,
      feature,
      ctx;

  if (!writeView.active) {
    return;
  }

  feature = this.features[action.type];

  if (feature.cannotInsert(text, selStart, selEnd)) {
    return;
  }

  ctx = feature.execute(text, selStart, selEnd, action.val);

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
