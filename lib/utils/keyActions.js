'use strict';

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
  'Alt+Shift+Û': 'wrappers.curly.braces'
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
  console.log(action);
  var feature = selections[action] || snippets[action] || stylings[action] || wrappers[action];

  if (!feature) {
    return null;
  }

  return {
    type: feature.split('.').shift(),
    val: feature.split('.').splice(1, feature.length).join('.')
  };
};
