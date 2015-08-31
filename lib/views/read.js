'use strict';

var inherits = require('inherits');

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

function ReadView(app) {
  View.call(this, 'Read', app);

  this.text = app.text;

  this.on('text.update', function (text) {
    this.toMarkdown();

    this.changed();
  }.bind(this));
}

inherits(ReadView, View);

module.exports = ReadView;

ReadView.prototype.toMarkdown = function toMarkdown() {
  var md = '',
      text;

  if ((text = this.text.get())) {
    md = marked(text);
  }

  return convertHTML('<div class="read">' + md + '</div>');
};

ReadView.prototype.toNode = function() {
  return this.renderView([
    this.toMarkdown()
  ]);
};
