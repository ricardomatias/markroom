'use strict';

var fs = require('fs');
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

  this.selected = '';

  this.text.set(fs.readFileSync(__dirname + '/gulp.md', { encoding: 'utf8' }));

  // function broadcastText(view) {
  //   if (view === this) {
  //     this.eventBus.emit('text.update', this.text.get());
  //   }
  // }
  //
  // this.eventBus.on('detach', broadcastText.bind(this));

  function activate(view) {
    if (this === view) {
      this.scrollUp();
    }
  }

  // app.on('view.activate', activate.bind(this));
  this.eventBus.on('view.activate', activate.bind(this));

  function updateTextarea(text) {
    var textarea = this.$el.firstChild;

    textarea.value = text;

    this.changed();
  }

  // Update text on undo/redo
  this.eventBus.on('text.update', updateTextarea.bind(this));

  // Insert Tab character
  window.addEventListener('keydown', function(evt) {
    if (this.activeView !== 'Write') {
      return;
    }

    if (evt.keyCode === 9 && !evt.altKey) {
      evt.preventDefault();


      this.insertTab(evt.srcElement);

      // prevent the focus lose
      return false;
    }

  }.bind(this));

  window.addEventListener('input', debounce(setText.bind(this), 250));

  function setText(evt) {
    var target = evt.target;

    if (target.className === 'markdown-textarea') {
      this.text.set(target.value);
    }
  }
}

inherits(WriteView, View);

module.exports = WriteView;


WriteView.prototype.persistText = function(evt) {
  var textarea = evt.target,
      text = textarea.value,
      selStart = textarea.selectionStart,
      selEnd = textarea.selectionEnd,
      newText;

  newText = this.parser.replaceUrls(text);

  if (newText) {
    evt.preventDefault();

    textarea.value = text = newText;
    textarea.setSelectionRange(selStart, selEnd);
  }

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
    var ta = this.$el.querySelector('.markdown-textarea');

    ta.scrollTop = 0;
  }

  setTimeout(delayedScroll.bind(this), 50);
};

WriteView.prototype.toNode = function() {
  return this.renderView([
    h('textarea.markdown-textarea', {
      spellcheck: false,
      autofocus: true,
      autocomplete: true,
      autocapitalize: 'none',
      'ev-input': this.persistText.bind(this)
    }, this.text.get())
    ]);
};
