'use strict';

var getBoundary = require('../utils/boundary');


function Selection() {

  this.selection = {
    word: /\W/,
    line: /\n/
  };

}

Selection.prototype.cannotInsert = function(text, selStart, selEnd) {
  return selStart === text.length;
};

Selection.prototype.execute = function(text, selStart, selEnd, action) {
  return getBoundary(text, selStart, selEnd, selStart === selEnd, this.selection[action]);
};

Selection.prototype.update = function(activeView, textarea, ctx) {
  var selStart = ctx.start,
      selEnd = ctx.end;

  textarea.setSelectionRange(selStart, selEnd);
};

module.exports = Selection;
