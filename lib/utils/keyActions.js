'use strict';

var assign = require('lodash/object/assign');

var selections = {
  'Command+D': 'selections.word',
  'Command+L': 'selections.line',
  'Command+A': 'selections.all'
};

var snippets = {
  'Command+K': 'snippets.link',
  'Command+Shift+K': 'snippets.image'
};

var stylings = {
  'Command+B': 'stylings.bold',
  'Command+I': 'stylings.italic',
  'Command+U': 'stylings.code.inline',
  'Command+Shift+U': 'stylings.code.block'
};

var wrappers = {
  'Alt+Shift+Û': 'wrappers.brackets.curly',
  'Alt+Û': 'wrappers.brackets.square',
  'Shift+8': 'wrappers.brackets.round'
};

function actionType(evt) {
  var action = [];

  if (evt.metaKey) {
    action.push('Command');
  }

  if (evt.altKey) {
    action.push('Alt');
  }

  if (evt.shiftKey) {
    action.push('Shift');
  }

  action.push(String.fromCharCode(evt.keyCode));

  return action.join('+');
}

module.exports = function(evt) {
  var action = actionType(evt);
  var shortcuts = assign(selections, snippets, stylings, wrappers);

  var feature = shortcuts[action];

  if (!feature) {
    return null;
  }

  return {
    type: feature.split('.').shift(),
    val: feature.split('.').splice(1, feature.length).join('.')
  };
};
