'use strict';

var ipc = require('ipc');

var forEach = require('lodash/collection/forEach');

var getBoundary = require('../utils/textUtil').getBoundary;

function Stylings(app) {

  this.app = app;

  this.stylings = {
    bold: function(word) {
      if (/^\*/g.test(word)) {
        return word.replace(/^\*{2}|\*{2}$/g, '');
      }

      return '**' + word + '**';
    },
    italic: function(word) {
      if (/^\*/g.test(word)) {
        return word.replace(/^\*{1}|\*{1}$/g, '');
      }

      return '*' + word + '*';
    },
    'code.inline': function(word) {
      if (/^\`/g.test(word)) {
        return word.replace(/^\`{1}|\`{1}$/g, '');
      }

      return '`' + word + '`';
    },
    'code.block': function(sel) {
      var lines = '';

      var selArr = sel.split('\n');

      selArr.forEach(function(line, idx) {
        if (line[0] === '\t') {
          if (idx === selArr.length - 1) {
            lines += line.substr(1, line.length);
            return;
          }

          lines += line.substr(1, line.length) + '\n';
          return;
        }

        if (idx === selArr.length - 1) {
          lines += '\t' + line;
          return;
        }

        lines += '\t' + line + '\n';
      });
      return lines;
    }
  };

  forEach(this.stylings, function(val, key) {

    ipc.on('style'.concat('.', key), function(style) {
      var activeView = this.app.activeView;

      if (activeView.name !== 'Write') {
        return;
      }

      var textarea = activeView.$el.firstChild,
          text = activeView.text.get(),
          selStart = textarea.selectionStart,
          selEnd = textarea.selectionEnd;

      if (this.cannotStyle(text, selStart, selEnd)) {
        return;
      }

      var selBoundary = getBoundary(text, selStart, selEnd);

      var word = this.parseWord(text, selBoundary.start, selBoundary.end);

      var styledWord = this.wordStyling(word, style);

      var newText = this.insertStyle(text, styledWord, selBoundary.start, selBoundary.end);

      this.update(newText, selStart, selEnd, style);

    }.bind(this));
  }, this);
}


Stylings.prototype.insertStyle = function(text, word, selStart, selEnd) {
  return text.substr(0, selStart) + word + text.substr(selEnd, text.length);
};

Stylings.prototype.parseWord = function(text, selStart, selEnd) {
  return text.substr(selStart, selEnd - selStart);
};

Stylings.prototype.wordStyling = function(word, style) {
  return this.stylings[style](word);
};

Stylings.prototype.cannotStyle = function(text, selStart, selEnd) {
  return (selStart === selEnd && /\s/.test(text[selStart])) || selStart === text.length;
};

Stylings.prototype.update = function(text, selStart, selEnd, style) {
  var activeView = this.app.activeView,
      textarea = activeView.$el.firstChild;

  activeView.text.set(text);

  textarea.value = text;

  activeView.changed();

  setTimeout(function() {
    if (selStart !== selEnd) {
      switch (style) {
        case 'bold':
          textarea.setSelectionRange(selStart, selEnd + 4);
          break;
        case 'code.block':
          textarea.setSelectionRange(selStart, selEnd);
          break;
        default:
          return textarea.setSelectionRange(selStart, selEnd + 2);
      }
    } else {
      textarea.setSelectionRange(selStart, selEnd);
    }
  }, 0);
};

module.exports = Stylings;
