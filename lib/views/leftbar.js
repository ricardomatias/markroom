'use strict';

var inherits = require('inherits');
var map = require('lodash/collection/map');

var Child = require('../components/child');
var toTitle = require('../utils/textUtil').toTitle;

var h = require('virtual-dom/h');
var createElement = require('virtual-dom/create-element');


function Leftbar(app) {
  Child.call(this);

  this.app = app;

  this.images = [];

  this.colorMode = 'Dark';

  this.on('parser.image.add', function(url) {
    var list = this.$el.lastElementChild;

    this.images.push(url);

    this.changed();
  }, this);

  this.on('parser.image.remove', function(url) {
    var list = this.$el.lastElementChild,
        idx = this.images.indexOf(url);

    if (idx === -1) {
      return;
    }

    this.images.splice(idx, 1);

    var child = list.children[idx];

    list.removeChild(child);

    this.changed();
  }, this);
}

inherits(Leftbar, Child);

module.exports = Leftbar;


Leftbar.prototype.toggleColorMode = function() {
  var colorMode = this.app.toggleColorMode();

  this.colorMode = toTitle(colorMode);

  this.changed();
};

Leftbar.prototype.renderImages = function() {
  return map(this.images, function(url) {
    return h('.image', [
      h('img', {
        src: url
      })
    ]);
  });
};

Leftbar.prototype.getLabel = function(viewName) {
  var labels = {
    write: 'Editor',
    read: 'Read'
  };

  return labels[viewName.toLowerCase()];
};

Leftbar.prototype.toNode = function() {
  var viewName = this.app.activeView.name;

  return h('.leftbar', [
    // h('.buttons', [
    //   h('.color-mode.' + viewName.toLowerCase() + '-header', {
    //     'ev-click': this.toggleColorMode.bind(this)
    //   }, this.colorMode)
    // ]),
    h('.images', this.renderImages())
  ]);
};
