'use strict';

var h = require('virtual-dom/h');


var inherits = require('inherits');
var ipc = require('ipc');

var Root = require('./components/root');

var Leftbar = require('./views/leftbar');
var Rightbar = require('./views/rightbar');

var WriteView = require('./views/write');
var ReadView = require('./views/read');

var TextService = require('./services/text');

var KeyActions = require('./keyboard/keyActions');


function App($parent) {
  Root.call(this, $parent);

  // Bootstrap Services
  this.text = new TextService(this);

  // Bootstrap Views
  this.leftbar = new Leftbar(this);
  this.writeView = new WriteView(this);
  this.readView = new ReadView(this);
  this.rightbar = new Rightbar(this);

  this.keyActions = new KeyActions([ 'main' ]);

  this.on('view.changed', this.toggleView.bind(this));

  ipc.on('view.toggle', this.toggleView.bind(this));

  window.addEventListener('keydown', function(evt) {
    var action = this.keyActions.which(evt) || {};

    switch (action.val) {
      case 'view':
        evt.preventDefault();
        this.toggleView();
        break;
      case 'color':
        evt.preventDefault();
        this.toggleColorMode();
        break;
      default:
        console.log('main..');
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
    this.leftbar.render(),
    this.activeView.render(),
    this.rightbar.render()
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

  return classList[0];
};
