'use strict';

var fs = require('fs');
var inherits = require('inherits');

var h = require('virtual-dom/h');

var View = require('../components/view');

var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var htmlToVdom = require('html-to-vdom');

var convertHTML = htmlToVdom({
  VNode: VNode,
  VText: VText
});

var marked = require('marked');

var hljs = require('highlight.js');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return hljs.highlightAuto(code, ['js']).value;
  }
});

var renderer = new marked.Renderer();

// renderer.heading = function(text, level, raw) {
//   return '<h'
//     + level
//     + ' id="'
//     + this.options.headerPrefix
//     + raw.toLowerCase().replace(/[^\w]+/g, '-')
//     + '">'
//     + '##' + text
//     + '</h'
//     + level
//     + '>\n';
// };

function WriteView(app) {
  View.call(this, 'Write', app);

  this.parser = app.parser;

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

  window.addEventListener('click', function(evt) {
    evt.target.contentEditable = 'true';

    var textLen = evt.target.innerText.length;

    evt.target.focus();

    this.changed();
  }.bind(this));
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
    textarea.value = text = newText;

    textarea.setSelectionRange(selStart, selEnd);
  }

  this.text.set(text);

  this.app.emit('caret.move', evt);

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


WriteView.prototype.toMarkdown = function toMarkdown() {
  var md = '',
      text;

  if ((text = this.text.get())) {
    md = marked(text, { renderer: renderer });
  }

  return h('.markdown-textarea', {
    contenteditable: true,
    'ev-input': this.persistText.bind(this)
  },[
    convertHTML(md)
  ]);
};

WriteView.prototype.toNode = function() {
  return this.renderView([
    this.toMarkdown()
  ]);
};

