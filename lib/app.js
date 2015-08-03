'use strict';

var h = require('virtual-dom/h');

var Root = require('./components/root');

var Sidebar = require('./views/sidebar');

var WriteView = require('./views/write');
var ReadView = require('./views/read');

var inherits = require('inherits');

var TextService = require('./services/text');

var Keyboard = require('./features/keyboard');

var Parser = require('./features/parser');

function App($parent) {
  Root.call(this, $parent);

  // Bootstrap Features
  this.keyboard = new Keyboard(this);
  this.parser = new Parser(this);

  // Bootstrap Services
  this.text = new TextService(this);

  // Bootstrap Views
  this.sidebar = new Sidebar(this);
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
  return h('.virtualmark', { 'ev-click': this.activeView.focus.bind(this) }, [
    this.sidebar.render(),
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
