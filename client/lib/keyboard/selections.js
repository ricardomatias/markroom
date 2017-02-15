'use strict';

var getBoundary = require('../utils/boundary');


function Selection() {

  this.selection = {
    word: /\W/,
    line: /\n/,
    all: /./
  };

}

Selection.prototype.cannotInsert = function(text, selStart, selEnd) {
  return false;
};

Selection.prototype.execute = function(text, selStart, selEnd, action) {
  if (action === 'all') {
    return {
      start: 0,
      end: text.length
    };
  }
  return getBoundary(text, selStart, selEnd, selStart === selEnd, this.selection[action]);
};

Selection.prototype.update = function(activeView, textarea, ctx) {
  var selStart = ctx.start,
      selEnd = ctx.end;

  textarea.setSelectionRange(selStart, selEnd);
};

module.exports = Selection;
