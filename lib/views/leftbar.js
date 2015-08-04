'use strict';

var inherits = require('inherits');

var h = require('virtual-dom/h');

var Child = require('../components/child');

function Leftbar(app) {
  Child.call(this);

  this.app = app;

  window.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 9 && evt.altKey) {
      evt.preventDefault();

      this.toggleView();
    }

  }.bind(this));
}

inherits(Leftbar, Child);

module.exports = Leftbar;


Leftbar.prototype.toggleColorMode = function() {
  this.app.toggleColorMode();

  this.changed();
};

Leftbar.prototype.toggleView = function() {
  this.app.toggleView();

  this.changed();
};

Leftbar.prototype.toNode = function() {
  var viewName = this.app.activeView.name;

  return h('.leftbar', [
    h('.buttons', [
      h('.color-mode.' + viewName.toLowerCase() + '-header', {
        'ev-click': this.toggleColorMode.bind(this) }, 'Light/Dark'),
      h('h2.' + viewName.toLowerCase() + '-header', {
        'ev-click': this.toggleView.bind(this)
      }, viewName)
    ]),
    h('.items')
  ]);
};
