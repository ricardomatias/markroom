'use strict';

var Stylings = require('./stylings');

var inherits = require('inherits');


function Wrappers() {
  this.stylings = {
    'brackets.curly': function(selectedText) {
      return '{' + selectedText + '}';
    },
    'brackets.square': function(selectedText) {
      return '[' + selectedText + ']';
    },
    'brackets.round': function(selectedText) {
      return '(' + selectedText + ')';
    }
  };
}

inherits(Wrappers, Stylings);

Wrappers.prototype.cannotInsert = function(text, selStart, selEnd) {
  return selStart === selEnd;
};

module.exports = Wrappers;
