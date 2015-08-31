'use strict';

var inherits = require('inherits');

var h = require('virtual-dom/h');

var Child = require('../components/child');

var wordCount = require('../utils/textUtil').wordCount;

function Rightbar(app) {
  Child.call(this);

  this.app = app;

  this.text = app.text;

  this.letterCount = this.text.length();
  this.wordCount = wordCount(this.text.get());

  window.addEventListener('input', function(evt) {
    var view = this.app.activeView.name;

    if (view !== 'Write') {
      return;
    }

    var text = evt.target.value;

    this.updateCount(text);

  }.bind(this));

  // Update count on undo/redo
  this.on('text.update', function(text) {
    this.updateCount(text);
  }, this);
}

inherits(Rightbar, Child);

module.exports = Rightbar;

Rightbar.prototype.updateCount = function (text) {
  this.letterCount = text.length;
  this.wordCount = wordCount(text);

  if (this.$el.firstChild) {
    this.$el.firstChild.innerText = this.countsToString();
    this.changed();
  }
};

Rightbar.prototype.countsToString = function() {
  return this.wordCount + ' Words - ' + this.letterCount + ' Characters';
};


Rightbar.prototype.toNode = function() {
  return h('.rightbar', [
    h('.counts', {}, this.countsToString())
  ]);
};
