'use strict';

var getBoundary = require('../utils/boundary');


function Wrappers() {

  this.wrappers = {
    'curly.braces': function(selectedText) {
      return '{' + selectedText + '}';
    }
  };
}


Wrappers.prototype.cannotInsert = function(text, selStart, selEnd) {
  return selStart === selEnd;
};

Wrappers.prototype.execute = function(text, selStart, selEnd, action) {
  var selBoundary = getBoundary(text, selStart, selEnd, selStart === selEnd, /[^\w\*\`]/);

  var word = this.parseSelection(text, selBoundary.start, selBoundary.end);

  var styledWord = this.wrapSelectedText(word, action);

  var firstHalf = text.substr(0, selBoundary.start) + styledWord;

  return {
    selStart: selBoundary.start,
    selEnd: firstHalf.length,
    val: firstHalf + text.substr(selBoundary.end, text.length)
  };
};

Wrappers.prototype.parseSelection = function(text, selStart, selEnd) {
  return text.substr(selStart, selEnd - selStart);
};

Wrappers.prototype.wrapSelectedText = function(word, style) {
  return this.wrappers[style](word);
};

Wrappers.prototype.update = function(activeView, textarea, ctx) {
  activeView.text.set(ctx.val);

  textarea.value = ctx.val;

  activeView.changed();

  textarea.setSelectionRange(ctx.selEnd, ctx.selEnd);
};

module.exports = Wrappers;
