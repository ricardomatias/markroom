'use strict';

var inherits = require('inherits');

var h = require('virtual-dom/h');

var Child = require('../components/child');

var map = require('lodash/collection/map');

var createElement = require('virtual-dom/create-element');


function Leftbar(app) {
  Child.call(this);

  this.app = app;

  this.images = [];

  window.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 9 && evt.altKey) {
      evt.preventDefault();

      this.toggleView();
    }

  }.bind(this));

  this.eventBus.on('parser.image', function(url) {
    var list = this.$el.lastElementChild;

    this.images.push(url);

    list.appendChild(this.toImg(url));

    this.changed();
  }.bind(this));

  this.eventBus.on('parser.remove', function(url) {
    var list = this.$el.lastElementChild,
        idx = this.images.indexOf(url);

    if (idx === -1) {
      return;
    }

    var child = list.children[idx];

    list.removeChild(child);

    this.changed();
  }.bind(this));
}

inherits(Leftbar, Child);

module.exports = Leftbar;

Leftbar.prototype.toImg = function(url) {
  return h('img.', {
    src: url
  });
};

Leftbar.prototype.toggleColorMode = function() {
  this.app.toggleColorMode();

  this.changed();
};

Leftbar.prototype.toggleView = function() {
  this.app.toggleView();

  this.changed();
};

Leftbar.prototype.renderImages = function() {
  return map(this.images, function(url) {
    return h('img.image', {
      src: url
    });
  });
};

Leftbar.prototype.toImg = function(url) {
  return createElement(h('img.image', {
    src: url
  }));
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
    h('.images', this.renderImages)
  ]);
};
