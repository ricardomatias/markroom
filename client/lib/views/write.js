'use strict';

var inherits = require('inherits');

var h = require('virtual-dom/h');

var debounce = require('lodash/function/debounce');

var View = require('../components/view');

var Keyboard = require('../keyboard'),
    Parser = require('../features/parser');


function WriteView(app) {
  View.call(this, 'Write', app);

  // Boostrap Components
  this.parser = new Parser(this);
  this.keyboard = new Keyboard(this);

  this.text = app.text;

  function activate(view) {
    if (this === view) {
      this.scrollUp();
    }
  }

  this.on('view.activate', activate, this);

  function updateTextarea(text) {
    var textarea = this.$el.firstChild;

    this.parseText(textarea, text);
  }

  // Update text on undo/redo
  this.on('text.update', updateTextarea, this);

  // Insert Tab character
  function insertTab(evt) {
    if (this.activeView !== 'Write') {
      return;
    }

    if (evt.keyCode === 9 && !evt.altKey) {
      evt.preventDefault();

      this.insertTab(evt.srcElement);

      // prevent the focus lose
      return false;
    }
  }

  window.addEventListener('keydown', insertTab.bind(this));
}

inherits(WriteView, View);

module.exports = WriteView;

WriteView.prototype.input = function (evt) {
  var textarea = evt.target,
      text = textarea.value;

  this.parseText(textarea, text);
};

WriteView.prototype.parseText = function(textarea, text) {
  var selStart = textarea.selectionStart,
      selEnd = textarea.selectionEnd,
      newText;

  newText = this.parser.replaceUrls(text);

  textarea.value = newText;
  textarea.setSelectionRange(selStart, selEnd);

  this.text.set(newText);

  this.changed();
};

WriteView.prototype.insertTab = function($el) {
  // get caret position/selection
  var val = $el.value,
      start = $el.selectionStart,
      end = $el.selectionEnd;

  // set textarea value to: text before caret + tab + text after caret
  $el.value = val.substring(0, start) + '\t' + val.substring(end);

  // put caret at right position again
  $el.selectionStart = $el.selectionEnd = start + 1;
};

WriteView.prototype.scrollUp = function() {
  if (!this.text.get()) {
    return;
  }

  function delayedScroll() {
    var ta = this.$el.querySelector('.editor');

    ta.scrollTop = 0;
  }

  setTimeout(delayedScroll.bind(this), 50);
};

WriteView.prototype.toNode = function() {
  return this.renderView([
    h('textarea.editor', {
      spellcheck: false,
      autofocus: true,
      autocomplete: true,
      autocapitalize: 'none',
      'ev-input': debounce(this.input.bind(this), 250)
    }, this.text.get())
    ]);
};
