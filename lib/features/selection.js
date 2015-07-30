'use strict';

var ipc = require('ipc');

var forEach = require('lodash/collection/forEach');

var getBoundary = require('../utils/textUtil').getBoundary;

function Selection(app) {

  this.app = app;

  this.selection = {
    word: /\W/,
    line: /\n/
  };

  forEach(this.selection, function(patt, type) {

    ipc.on('selection'.concat('.', type), function(style) {
      var activeView = this.app.activeView;

      if (activeView.name !== 'Write') {
        return;
      }

      var textarea = activeView.$el.firstChild,
          text = activeView.text.get(),
          selStart = textarea.selectionStart,
          selEnd = textarea.selectionEnd;

      var selBoundary = getBoundary(text, selStart, selEnd, patt);

      this.update(selBoundary.start, selBoundary.end);

    }.bind(this));
  }, this);
}

Selection.prototype.update = function(selStart, selEnd) {
  var activeView = this.app.activeView,
      textarea = activeView.$el.firstChild;

  textarea.setSelectionRange(selStart, selEnd);
};

module.exports = Selection;
