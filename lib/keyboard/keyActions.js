'use strict';

var assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach');


function KeyActions(actions) {
  this.actions = actions || [];
  this.shortcuts = {};

  this.selections = {
    'Cmd+D': 'selections.word',
    'Cmd+L': 'selections.line',
    'Cmd+A': 'selections.all'
  };

  this.snippets = {
    'Cmd+K': 'snippets.link',
    'Cmd+Shift+K': 'snippets.image'
  };

  this.stylings = {
    'Cmd+B': 'stylings.bold',
    'Cmd+I': 'stylings.italic',
    'Cmd+U': 'stylings.code.inline',
    'Cmd+Shift+U': 'stylings.code.block'
  };

  this.wrappers = {
    'Alt+Shift+Û': 'wrappers.brackets.curly',
    'Alt+Û': 'wrappers.brackets.square',
    'Shift+8': 'wrappers.brackets.round'
  };

  this.main = {
    'Alt+\t': 'main.view',
    'Alt+Shift+\t': 'main.color'
  };

  forEach(this.actions, function(action) {
    return assign(this.shortcuts, this[action]);
  }, this);
}


KeyActions.prototype.which = function(evt) {
  var action = this._actionType(evt);

  var feature = this.shortcuts[action];

  if (!feature) {
    return null;
  }

  return {
    type: feature.split('.').shift(),
    val: feature.split('.').splice(1, feature.length).join('.')
  };
};

KeyActions.prototype._actionType = function(evt) {
  var action = [];

  if (evt.metaKey) {
    action.push('Cmd');
  }

  if (evt.altKey) {
    action.push('Alt');
  }

  if (evt.shiftKey) {
    action.push('Shift');
  }

  action.push(String.fromCharCode(evt.keyCode));

  return action.join('+');
};

module.exports = KeyActions;
