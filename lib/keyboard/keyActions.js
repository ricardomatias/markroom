'use strict';

var fs = require('fs');

var assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach');

var keybindingsFile = fs.readFileSync('./keybindingOptions.json', { encoding: 'uft8' }),
    keybindings;

if (process.platform === 'darwin') {
  keybindings = keybindingsFile.darwin;
}

if (process.platform === 'linux') {
  keybindings = keybindingsFile.linux;
}

function KeyActions(actions) {
  this.actions = actions || [];
  this.shortcuts = {};

  forEach(this.actions, function(action) {
    return assign(this.shortcuts, keybindings[action]);
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
