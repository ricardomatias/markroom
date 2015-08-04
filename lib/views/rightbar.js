'use strict';

var inherits = require('inherits');

var h = require('virtual-dom/h');

var Child = require('../components/child');

function Rightbar(app) {
  Child.call(this);

  this.app = app;

  this.text = app.text;

  this.letterCount = this.text.length();
  this.wordCount = this.text.wordCount();

  app.writeView.on('changed', function() {
    this.letterCount = this.text.length();
    this.wordCount = this.text.wordCount();

    if (this.$el.firstChild) {
      this.$el.firstChild.innerText = this.count();
      this.changed();
    }
  }.bind(this));
}

inherits(Rightbar, Child);

module.exports = Rightbar;


Rightbar.prototype.count = function() {
  return this.wordCount + ' Words - ' +this.letterCount + ' Characters';
};

Rightbar.prototype.toNode = function() {
  return h('.rightbar', [
    h('.counts', {}, this.count())
  ]);
};
