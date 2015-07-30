'use strict';

exports.getBoundary = function(text, selStart, selEnd, patt) {
  var forward = true,
      backward = true,
      i = 0;

  if (!patt) {
    patt = /\s/;
  }

  if (selStart === selEnd) {
    // Forward till no-word char
    while (backward) {
      if (patt.test(text[selEnd + i])) {
        selEnd = selEnd + i;
        backward = false;
      }
      i += 1;
    }

    // reset incrementor
    i = 0;

    // Backwards till no-word char
    while (forward) {
      if (patt.test(text[selStart + i])) {
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
