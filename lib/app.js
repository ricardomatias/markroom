'use strict';

var h = require('virtual-dom/h');

var Root = require('./components/root');

var WriteView = require('./views/write');
var ReadView = require('./views/read');

var inherits = require('inherits');

var Text = require('./services/text');

var Stylings = require('./features/stylings.js');

var Selection = require('./features/selection.js');

var Snippets = require('./features/snippets.js');

function App($parent) {
  Root.call(this, $parent);

  // Bootstrap Services
  this.text = new Text(this);

  // Bootstrap Features
  this.snippets = new Snippets(this);
  this.stylings = new Stylings(this);
  this.selection = new Selection(this);

  // Bootstrap Views
  this.writeView = new WriteView(this);
  this.readView = new ReadView(this);

  this.on('view.changed', this.toggleView.bind(this));

  window.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 9 && evt.altKey) {
      evt.preventDefault();

      this.toggleView();
    }

  }.bind(this));
}

inherits(App, Root);

module.exports = App;

App.prototype.run = function run() {
  this.activateView(this.writeView);
};

App.prototype.isViewActive = function(view) {
  return this.activeView === this[view + 'View'];
};

App.prototype.render = function() {
  var viewName = this.activeView.name;

  return h('.virtualmark', { 'ev-click': this.activeView.focus.bind(this) }, [
    h('h2.' + viewName.toLowerCase() + '-header', { 'ev-click': this.toggleView.bind(this) }, viewName),
    h('button', { 'ev-click': this.toggleColorMode.bind(this) }, 'Light/Dark'),
    this.activeView.render()
    ]);
};

App.prototype.toggleView = function() {
  if (this.isViewActive('write')) {
    this.activateView(this.readView);
  } else {
    this.activateView(this.writeView);
  }
};

App.prototype.activateView = function(view) {
  this.activeView = view;

  this.emit('view.activate', view);

  this.changed();
};

App.prototype.toggleColorMode = function() {
  var parent = this.$el.parentElement,
      classList = parent.classList;

  classList.toggle('light');
  classList.toggle('dark');
};
