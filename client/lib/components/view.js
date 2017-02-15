'use strict';

var Child = require('./child');

var inherits = require('inherits');

var h = require('virtual-dom/h');


function View(name, app) {

  Child.call(this);

  this.app = app;
  this.name = name;

  app.activeView = null;

  this.on('view.activate', this.activateView.bind(this));
}

inherits(View, Child);

module.exports = View;

View.prototype.activateView = function(view) {
  this.active = view === this;

  if (this.active) {
      this.attachTo(this.app);

      this.focus();
  } else {
      this.detach();
  }
};

View.prototype.renderView = function renderView(opts, children) {
  var viewSelector = '.view.' + this.name.toLowerCase() + '-view';

  if (this.active) {
      viewSelector += '.active';
  }

  return h(viewSelector, opts, children);
};
