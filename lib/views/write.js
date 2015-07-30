'use strict';

var fs = require('fs');
var inherits = require('inherits');

var h = require('virtual-dom/h');

var View = require('../components/view');

function WriteView(app) {
  View.call(this, 'Write', app);

  this.text = app.text;

  this.selected = '';

  this.text.set(fs.readFileSync(__dirname + '/gulp.md', { encoding: 'utf8' }));

  function broadcastText() {
    app.emit('text.update', this.text.get());
  }

  this.on('detach', broadcastText.bind(this));

  function activate(view) {
    if (this === view) {
      this.scrollUp();
    }
  }

  app.on('view.activate', activate.bind(this));


  // Insert Tab character
  window.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 9 && !evt.altKey) {
      evt.preventDefault();

      this.insertTab(evt.srcElement);

      // prevent the focus lose
      return false;
    }

  }.bind(this));
}

inherits(WriteView, View);

module.exports = WriteView;


WriteView.prototype.persistText = function(evt) {
  var text = evt.target.value;

  this.text.set(text);
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
