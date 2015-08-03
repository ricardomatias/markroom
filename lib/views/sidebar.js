'use strict';

var inherits = require('inherits');

var h = require('virtual-dom/h');

var Child = require('../components/child');

function Sidebar(app) {
  Child.call(this);

  this.app = app;

}

inherits(Sidebar, Child);

module.exports = Sidebar;


Sidebar.prototype.toggleColorMode = function() {
  this.app.toggleColorMode();

  this.changed();
};

Sidebar.prototype.toggleView = function() {
  this.app.toggleView();

  this.changed();
};

Sidebar.prototype.toNode = function() {
  var viewName = this.app.activeView.name;

  return h('.sidebar', [
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
