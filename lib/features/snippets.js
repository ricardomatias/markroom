'use strict';

var ipc = require('ipc');

var forEach = require('lodash/collection/forEach');

function Snippets(app) {

  this.app = app;

  this.snippets = {
    link: '[](link)',
    image: '![](link)'
  };

  forEach(this.snippets, function(val, key) {

    ipc.on('snippets'.concat('.', key), function(type) {
      var activeView = this.app.activeView;

      if (activeView.name !== 'Write') {
        return;
      }

      var textarea = activeView.$el.firstChild,
          text = activeView.text.get(),
          selStart = textarea.selectionStart,
          selEnd = textarea.selectionEnd;

      if (this.cannotInsert(text, selStart, selEnd)) {
        return;
      }

      var snippet = this.snippets[type];

      var newText = this.insertSnippets(text, snippet, selStart, selEnd);

      this.update(newText, selStart, selEnd, type);

    }.bind(this));
  }, this);
}


Snippets.prototype.insertSnippets = function(text, word, selStart, selEnd) {
  return text.substr(0, selStart) + word + text.substr(selEnd, text.length);
};

Snippets.prototype.cannotInsert = function(text, selStart, selEnd) {
  return (selStart === selEnd && /\w/.test(text[selStart])) || selStart === text.length;
};

Snippets.prototype.update = function(text, selStart, selEnd, type) {
  var activeView = this.app.activeView,
      textarea = activeView.$el.firstChild;

  activeView.text.set(text);

  textarea.value = text;

  activeView.changed();

  setTimeout(function() {
    switch (type) {
      case 'link':
        textarea.setSelectionRange(selStart + 1, selEnd + 1);
        break;
      case 'image':
        textarea.setSelectionRange(selStart + 2, selEnd + 2);
        break;
      default:
        return textarea.setSelectionRange(selStart, selEnd);
    }
  }, 0);
};

module.exports = Snippets;
