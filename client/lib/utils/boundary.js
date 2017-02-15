'use strict';

module.exports = function(text, selStart, selEnd, condition, patt) {
  var forward = true,
      backward = true,
      i = 0;

  if (!patt) {
    patt = /\s/;
  }

  if (condition) {
    // Forward till no-word char
    while (backward) {
      if (patt.test(text[selEnd + i]) || selEnd + i === text.length) {
        selEnd = selEnd + i;
        backward = false;
      }
      i += 1;
    }

    // reset incrementor
    i = 0;

    // Backwards till no-word char
    while (forward) {
      if (patt.test(text[selStart + i]) || selStart + i === 0) {
        selStart = selStart + i + 1;
        forward = false;
      }
      i -= 1;
    }
  }

  return {
    start: selStart,
    end: selEnd
  };
};
