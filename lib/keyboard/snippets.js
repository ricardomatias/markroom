'use strict';

function Snippets() {

  this.snippets = {
    link: '[](link)',
    image: '![](link)'
  };
}

Snippets.prototype.cannotInsert = function(text, selStart, selEnd) {
  return (selStart === selEnd && /\w/.test(text[selStart])) || selStart === text.length;
};

Snippets.prototype.execute = function(text, selStart, selEnd, action) {
  var snippet = this.snippets[action],
      firstHalf;

  firstHalf = text.substr(0, selStart) + snippet;

  return {
    selStart: selStart,
    selEnd: firstHalf.length,
    val: firstHalf + text.substr(selEnd, text.length),
    type: action
  };
};

Snippets.prototype.update = function(activeView, textarea, ctx) {

  activeView.text.set(ctx.val);

  textarea.value = ctx.val;

  activeView.changed();

  switch (ctx.type) {
    case 'link':
      textarea.setSelectionRange(ctx.selStart + 1, ctx.selStart + 1);
      break;
    case 'image':
      textarea.setSelectionRange(ctx.selStart + 2, ctx.selStart + 2);
      break;
    default:
      return textarea.setSelectionRange(ctx.selStart, ctx.selStart);
  }
};

module.exports = Snippets;
