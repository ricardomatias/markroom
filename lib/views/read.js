'use strict';

var inherits = require('inherits');

var h = require('virtual-dom/h');

var View = require('../components/view');

var marked = require('marked');

var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var htmlToVdom = require('html-to-vdom');

var convertHTML = htmlToVdom({
    VNode: VNode,
    VText: VText
});

function ReadView(app) {
    View.call(this, 'Read', app);

    function getText(text) {
        this.text = text;
    }

    app.on('text.update', getText.bind(this));
}

inherits(ReadView, View);

module.exports = ReadView;

ReadView.prototype.toMarkdown = function toMarkdown() {
    var markdown = '';

    if (this.text) {
        markdown = marked(this.text);
    }

    return convertHTML('<div class="read">' + markdown + '</div>');
};

ReadView.prototype.toNode = function() {
    return this.renderView([
        this.toMarkdown()
    ]);
};
