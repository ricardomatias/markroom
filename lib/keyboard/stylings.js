'use strict';

var getBoundary = require('../utils/boundary');


function Stylings() {

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
}


Stylings.prototype.cannotInsert = function(text, selStart, selEnd) {
  // return (selStart === selEnd && /\s/.test(text[selStart])) || selStart === text.length;
  return selStart === text.length;
};

Stylings.prototype.execute = function(text, selStart, selEnd, action) {
  var selBoundary = getBoundary(text, selStart, selEnd, selStart === selEnd, /[^\w\*\`]/);

  var word = this.parseWord(text, selBoundary.start, selBoundary.end);

  var styledWord = this.wordStyling(word, action);

  var firstHalf = text.substr(0, selBoundary.start) + styledWord;

  return {
    selStart: selBoundary.start,
    selEnd: firstHalf.length,
    val: firstHalf + text.substr(selBoundary.end, text.length)
  };
};

Stylings.prototype.parseWord = function(text, selStart, selEnd) {
  return text.substr(selStart, selEnd - selStart);
};

Stylings.prototype.wordStyling = function(word, style) {
  return this.stylings[style](word);
};

Stylings.prototype.update = function(activeView, textarea, ctx) {
  activeView.text.set(ctx.val);

  textarea.value = ctx.val;

  activeView.changed();

  textarea.setSelectionRange(ctx.selEnd, ctx.selEnd);
};

module.exports = Stylings;
